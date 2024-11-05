import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faEye } from '@fortawesome/free-solid-svg-icons';

const Admin = () => {
  const [organizations, setOrganizations] = useState([]);
  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null);
  const [orgAdmins, setOrgAdmins] = useState({});
  const [adminData, setAdminData] = useState({});
  const [editingAdmin, setEditingAdmin] = useState(null);
  const navigate = useNavigate();

  const fetchOrganizations = async () => {
    const response = await axios.get('http://localhost:5000/organizations');
    setOrganizations(response.data);
    return response.data;
  };

  const fetchAdmins = async (orgId) => {
    const response = await axios.get(`http://localhost:5000/organizations/${orgId}/members`);
    return response.data;
  };

  const fetchAllAdmins = async (organizations) => {
    const allAdmins = {};
    await Promise.all(organizations.map(async (org) => {
      const admins = await fetchAdmins(org.id);
      allAdmins[org.id] = admins;
    }));
    setOrgAdmins(allAdmins);
  };

  useEffect(() => {
    const loadOrganizationsAndAdmins = async () => {
      const orgs = await fetchOrganizations();
      setOrganizations(orgs);
      await fetchAllAdmins(orgs);
    };
    loadOrganizationsAndAdmins();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`http://localhost:5000/organizations/${editId}`, { name });
    } else {
      await axios.post('http://localhost:5000/organizations', { name });
    }
    setName('');
    setEditId(null);
    fetchOrganizations();
    fetchAllAdmins(organizations);
  };

  const handleEdit = (org) => {
    setName(org.name);
    setEditId(org.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/organizations/${id}`);
    fetchOrganizations();
    fetchAllAdmins(organizations);
  };

  const handleAddAdmin = async (e, orgId) => {
    e.preventDefault();
    const { adminName, adminPassword } = adminData[orgId] || {};

    if (editingAdmin) {
      await axios.put(`http://localhost:5000/users/${editingAdmin.id}`, {
        username: adminName,
        password: adminPassword,
        role: 'orgadmin',
        access_id: orgId,
      });
      setEditingAdmin(null);
    } else {
      await axios.post(`http://localhost:5000/users`, {
        username: adminName,
        password: adminPassword,
        role: 'orgadmin',
        access_id: orgId,
      });
    }

    setAdminData((prev) => ({
      ...prev,
      [orgId]: { adminName: '', adminPassword: '' },
    }));
    fetchAllAdmins(organizations);
  };

  const handleEditAdmin = (orgId, admin) => {
    setAdminData((prev) => ({
      ...prev,
      [orgId]: { adminName: admin.username, adminPassword: '' },
    }));
    setEditingAdmin(admin);
  };

  const handleDeleteAdmin = async (orgId, adminId) => {
    await axios.delete(`http://localhost:5000/users/${adminId}`);
    fetchAllAdmins(organizations);
  };

  const handleAdminInputChange = (orgId, field, value) => {
    setAdminData((prev) => ({
      ...prev,
      [orgId]: {
        ...prev[orgId],
        [field]: value,
      },
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Organizations</h2>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Organization Name"
              required
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition duration-300 shadow-lg flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPlus} />
              {editId ? 'Update Organization' : 'Add Organization'}
            </button>
          </div>
        </form>

        <ul className="space-y-4">
          {organizations.map((org) => (
            <li key={org.id} className="bg-gray-50 p-4 rounded-md shadow-md border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold text-indigo-800">{org.name}</span>
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(org)} 
                    className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 shadow-lg flex items-center gap-1">
                    <FontAwesomeIcon icon={faEdit} />
                    Edit
                  </button>
                  <button onClick={() => handleDelete(org.id)} 
                    className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 shadow-lg flex items-center gap-1">
                    <FontAwesomeIcon icon={faTrash} />
                    Delete
                  </button>
                  <button onClick={() => navigate(`/branches/${org.id}`)} 
                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 shadow-lg flex items-center gap-1">
                    <FontAwesomeIcon icon={faEye} />
                    View Branches
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Admins for {org.name}</h4>
                <form onSubmit={(e) => handleAddAdmin(e, org.id)} className="flex space-x-2 mb-4">
                  <input
                    type="text"
                    value={adminData[org.id]?.adminName || ''}
                    onChange={(e) => handleAdminInputChange(org.id, 'adminName', e.target.value)}
                    placeholder="Admin Name"
                    required
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="password"
                    value={adminData[org.id]?.adminPassword || ''}
                    onChange={(e) => handleAdminInputChange(org.id, 'adminPassword', e.target.value)}
                    placeholder="Admin Password"
                    required
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition duration-300 shadow-lg flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={editingAdmin ? faEdit : faPlus} />
                    {editingAdmin ? 'Update Admin' : 'Add Admin'}
                  </button>
                </form>

                <ul>
                  {(orgAdmins[org.id] || []).map((admin) => (
                    <li key={admin.id} className="flex justify-between items-center bg-gray-100 p-2 rounded-md mb-2">
                      <span>{admin.username}</span>
                      <div className="flex space-x-2">
                        <button onClick={() => handleEditAdmin(org.id, admin)} 
                          className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 shadow-lg flex items-center gap-1">
                          <FontAwesomeIcon icon={faEdit} />
                          Edit
                        </button>
                        <button onClick={() => handleDeleteAdmin(org.id, admin.id)} 
                          className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 shadow-lg flex items-center gap-1">
                          <FontAwesomeIcon icon={faTrash} />
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Admin;
