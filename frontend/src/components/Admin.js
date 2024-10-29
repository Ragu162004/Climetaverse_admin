import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [organizations, setOrganizations] = useState([]);
  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null);
  const [orgAdmins, setOrgAdmins] = useState({}); // State to manage organization admins
  const [adminData, setAdminData] = useState({}); // State for input values of admins
  const [editingAdmin, setEditingAdmin] = useState(null); // State to track which admin is being edited
  const navigate = useNavigate();

  // Function to fetch organizations
  const fetchOrganizations = async () => {
    const response = await axios.get('http://localhost:5000/organizations');
    setOrganizations(response.data);
    return response.data; // Return organizations
  };

  // Function to fetch admins for a specific organization
  const fetchAdmins = async (orgId) => {
    const response = await axios.get(`http://localhost:5000/organizations/${orgId}/members`);
    return response.data; // Return admins for the organization
  };

  // Function to fetch all admins for all organizations
  const fetchAllAdmins = async (organizations) => {
    const allAdmins = {};
    await Promise.all(organizations.map(async (org) => {
      const admins = await fetchAdmins(org.id);
      allAdmins[org.id] = admins; // Store admins in the allAdmins object
    }));
    setOrgAdmins(allAdmins); // Set all admins in state
  };

  useEffect(() => {
    const loadOrganizationsAndAdmins = async () => {
      const orgs = await fetchOrganizations(); // Fetch organizations
      setOrganizations(orgs); // Set organizations state
      await fetchAllAdmins(orgs); // Fetch all admins after organizations are set
    };
    loadOrganizationsAndAdmins(); // Call the function
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
    fetchOrganizations(); // Refresh organizations
    fetchAllAdmins(organizations); // Refresh admins
  };

  const handleEdit = (org) => {
    setName(org.name);
    setEditId(org.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/organizations/${id}`);
    fetchOrganizations(); // Refresh organizations
    fetchAllAdmins(organizations); // Refresh admins
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
    fetchAllAdmins(organizations); // Refresh the list of admins
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
    fetchAllAdmins(organizations); // Refresh the list of admins
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
    <div>
      <h2>Organizations</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Organization Name"
          required
        />
        <button type="submit">{editId ? 'Update' : 'Add'} Organization</button>
      </form>
      <ul>
        {organizations.map((org) => (
          <li key={org.id}>
            {org.name}
            <button onClick={() => handleEdit(org)}>Edit</button>
            <button onClick={() => handleDelete(org.id)}>Delete</button>
            <button onClick={() => navigate(`/branches/${org.id}`)}>View Branches</button>

            <div>
              <h4>Admins for {org.name}</h4>
              <form onSubmit={(e) => handleAddAdmin(e, org.id)}>
                <input
                  type="text"
                  value={adminData[org.id]?.adminName || ''}
                  onChange={(e) => handleAdminInputChange(org.id, 'adminName', e.target.value)}
                  placeholder="Admin Name"
                  required
                />
                <input
                  type="password"
                  value={adminData[org.id]?.adminPassword || ''}
                  onChange={(e) => handleAdminInputChange(org.id, 'adminPassword', e.target.value)}
                  placeholder="Admin Password"
                  required
                />
                <button type="submit">{editingAdmin ? 'Update Admin' : 'Add Admin'}</button>
              </form>

              <ul>
                {(orgAdmins[org.id] || []).map((admin) => (
                  <li key={admin.id}>
                    {admin.username}
                    <button onClick={() => handleEditAdmin(org.id, admin)}>Edit</button>
                    <button onClick={() => handleDeleteAdmin(org.id, admin.id)}>Delete</button>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>

    </div>
  );
};

export default Admin;
