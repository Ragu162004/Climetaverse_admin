import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

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

  // Fetch organization name, branches, and admins on component load
  useEffect(() => {
    const fetchOrganizationAndBranches = async () => {
      // Fetch organization details (including name)
      const orgResponse = await axios.get(`http://localhost:5000/organizations/${organizationId}`);
      setOrganizationName(orgResponse.data.name);

      // Fetch branches
      const branchesResponse = await axios.get(`http://localhost:5000/organizations/${organizationId}/branches`);
      setBranches(branchesResponse.data);

      // Fetch admins for each branch
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

  const fetchBranches = async () => {
    const response = await axios.get(`http://localhost:5000/organizations/${organizationId}/branches`);
    setBranches(response.data);
  };
  
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
    <div>
      <h3>Branches for Organization: {organizationName}</h3>
      <form onSubmit={handleAddBranch}>
        <input
          type="text"
          value={branchName}
          onChange={(e) => setBranchName(e.target.value)}
          placeholder="Branch Name"
          required
        />
        <button type="submit">{editingBranch ? 'Update Branch' : 'Add Branch'}</button>
      </form>

      <ul>
        {branches.map((branch) => (
          <li key={branch.id}>
            {branch.name}
            <button onClick={() => handleEditBranch(branch)}>Edit</button>
            <button onClick={() => handleDeleteBranch(branch.id)}>Delete</button>
            <button onClick={() => handleViewDepartments(branch.id)}>View Departments</button>

            <div>
              <h4>Admins for {branch.name}</h4>
              <form onSubmit={(e) => handleAddAdmin(e, branch.id)}>
                <input
                  type="text"
                  value={adminData[branch.id]?.adminName || ''}
                  onChange={(e) => handleAdminInputChange(branch.id, 'adminName', e.target.value)}
                  placeholder="Admin Name"
                  required
                />
                <input
                  type="password"
                  value={adminData[branch.id]?.adminPassword || ''}
                  onChange={(e) => handleAdminInputChange(branch.id, 'adminPassword', e.target.value)}
                  placeholder="Admin Password"
                  required
                />
                <button type="submit">{editingAdmin ? 'Update Admin' : 'Add Admin'}</button>
              </form>

              <ul>
                {(branchAdmins[branch.id] || []).map((member) => (
                  <li key={member.id}>
                    {member.username}
                    <button onClick={() => handleEditAdmin(branch.id, member)}>Edit</button>
                    <button onClick={() => handleDeleteAdmin(branch.id, member.id)}>Delete</button>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>

      <button onClick={() => navigate('/admin')}>Back to Organizations</button>
    </div>
  );
};

export default Branches;
