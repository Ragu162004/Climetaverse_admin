import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faEye } from '@fortawesome/free-solid-svg-icons';

const Branches = () => {
  const { organizationId } = useParams();
  const [organizationName, setOrganizationName] = useState('');
  const [branches, setBranches] = useState([]);
  const [branchName, setBranchName] = useState('');
  const [editingBranch, setEditingBranch] = useState(null);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [branchAdmins, setBranchAdmins] = useState({});
  const [adminData, setAdminData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrganizationAndBranches = async () => {
      const orgResponse = await axios.get(`http://localhost:5000/organizations/${organizationId}`);
      setOrganizationName(orgResponse.data.name);

      const branchesResponse = await axios.get(`http://localhost:5000/organizations/${organizationId}/branches`);
      setBranches(branchesResponse.data);

      const adminsPromises = branchesResponse.data.map(async (branch) => {
        const response = await axios.get(`http://localhost:5000/branches/${branch.id}/members`);
        return { branchId: branch.id, admins: response.data };
      });

      const adminsData = await Promise.all(adminsPromises);
      const adminsByBranch = adminsData.reduce((acc, { branchId, admins }) => {
        acc[branchId] = admins;
        return acc;
      }, {});
      setBranchAdmins(adminsByBranch);
    };

    fetchOrganizationAndBranches();
  }, [organizationId]);

  const handleAddBranch = async (e) => {
    e.preventDefault();
    if (editingBranch) {
      await axios.put(`http://localhost:5000/branches/${editingBranch.id}`, { name: branchName });
      setEditingBranch(null);
    } else {
      await axios.post(`http://localhost:5000/organizations/${organizationId}/branches`, { name: branchName });
    }
    setBranchName('');
    fetchBranches();
  };

  const fetchBranches = async () => {
    const response = await axios.get(`http://localhost:5000/organizations/${organizationId}/branches`);
    setBranches(response.data);
  };

  const handleEditBranch = (branch) => {
    setBranchName(branch.name);
    setEditingBranch(branch);
  };

  const handleDeleteBranch = async (id) => {
    await axios.delete(`http://localhost:5000/branches/${id}`);
    fetchBranches();
  };

  const handleViewDepartments = (branchId) => {
    navigate(`/departments/${branchId}`);
  };

  const handleAddAdmin = async (e, branchId) => {
    e.preventDefault();
    const { adminName, adminPassword } = adminData[branchId] || {};

    if (editingAdmin) {
      await axios.put(`http://localhost:5000/users/${editingAdmin.id}`, {
        username: adminName,
        password: adminPassword,
        role: 'branchadmin',
        access_id: branchId,
      });
      setEditingAdmin(null);
    } else {
      await axios.post(`http://localhost:5000/users`, {
        username: adminName,
        password: adminPassword,
        role: 'branchadmin',
        access_id: branchId,
      });
    }

    setAdminData((prev) => ({
      ...prev,
      [branchId]: { adminName: '', adminPassword: '' },
    }));
    fetchAdmins(branchId);
  };

  const fetchAdmins = async (branchId) => {
    const response = await axios.get(`http://localhost:5000/branches/${branchId}/members`);
    setBranchAdmins((prev) => ({ ...prev, [branchId]: response.data }));
  };

  const handleEditAdmin = (branchId, admin) => {
    setAdminData((prev) => ({
      ...prev,
      [branchId]: { adminName: admin.username, adminPassword: '' },
    }));
    setEditingAdmin(admin);
  };

  const handleDeleteAdmin = async (branchId, adminId) => {
    await axios.delete(`http://localhost:5000/users/${adminId}`);
    fetchAdmins(branchId);
  };

  const handleAdminInputChange = (branchId, field, value) => {
    setAdminData((prev) => ({
      ...prev,
      [branchId]: {
        ...prev[branchId],
        [field]: value,
      },
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Branches for {organizationName}</h2>

        <form onSubmit={handleAddBranch} className="space-y-4 mb-6">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              placeholder="Branch Name"
              required
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition duration-300 shadow-lg flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPlus} />
              {editingBranch ? 'Update Branch' : 'Add Branch'}
            </button>
          </div>
        </form>

        <ul className="space-y-4">
          {branches.map((branch) => (
            <li key={branch.id} className="bg-gray-50 p-4 rounded-md shadow-md border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold text-indigo-800">{branch.name}</span>
                <div className="flex space-x-2">
                  <button onClick={() => handleEditBranch(branch)}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 shadow-lg flex items-center gap-1">
                    <FontAwesomeIcon icon={faEdit} />
                    Edit
                  </button>
                  <button onClick={() => handleDeleteBranch(branch.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 shadow-lg flex items-center gap-1">
                    <FontAwesomeIcon icon={faTrash} />
                    Delete
                  </button>
                  <button onClick={() => handleViewDepartments(branch.id)}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 shadow-lg flex items-center gap-1">
                    <FontAwesomeIcon icon={faEye} />
                    View Departments
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Admins for {branch.name}</h4>
                <form onSubmit={(e) => handleAddAdmin(e, branch.id)} className="flex space-x-2 mb-4">
                  <input
                    type="text"
                    value={adminData[branch.id]?.adminName || ''}
                    onChange={(e) => handleAdminInputChange(branch.id, 'adminName', e.target.value)}
                    placeholder="Admin Name"
                    required
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="password"
                    value={adminData[branch.id]?.adminPassword || ''}
                    onChange={(e) => handleAdminInputChange(branch.id, 'adminPassword', e.target.value)}
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
                  {(branchAdmins[branch.id] || []).map((admin) => (
                    <li key={admin.id} className="flex justify-between items-center bg-gray-100 p-2 rounded-md mb-2">
                      <span>{admin.username}</span>
                      <div className="flex space-x-2">
                        <button onClick={() => handleEditAdmin(branch.id, admin)}
                          className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 shadow-lg flex items-center gap-1">
                          <FontAwesomeIcon icon={faEdit} />
                          Edit
                        </button>
                        <button onClick={() => handleDeleteAdmin(branch.id, admin.id)}
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

export default Branches;
