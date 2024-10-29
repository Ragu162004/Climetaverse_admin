import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrgAdmin = () => {
  const [branches, setBranches] = useState([]);
  const [name, setName] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [editId, setEditId] = useState(null);
  const [organizations, setOrganizations] = useState([]);

  const fetchBranches = async () => {
    const response = await axios.get('http://localhost:5000/branches');
    setBranches(response.data);
  };

  const fetchOrganizations = async () => {
    const response = await axios.get('http://localhost:5000/organizations');
    setOrganizations(response.data);
  };

  useEffect(() => {
    fetchBranches();
    fetchOrganizations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`http://localhost:5000/branches/${editId}`, { name, organization_id: organizationId });
    } else {
      await axios.post('http://localhost:5000/branches', { name, organization_id: organizationId });
    }
    setName('');
    setOrganizationId('');
    setEditId(null);
    fetchBranches();
  };

  const handleEdit = (branch) => {
    setName(branch.name);
    setOrganizationId(branch.organization_id);
    setEditId(branch.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/branches/${id}`);
    fetchBranches();
  };

  return (
    <div>
      <h2>Branches</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Branch Name"
          required
        />
        <select value={organizationId} onChange={(e) => setOrganizationId(e.target.value)} required>
          <option value="">Select Organization</option>
          {organizations.map(org => (
            <option key={org.id} value={org.id}>{org.name}</option>
          ))}
        </select>
        <button type="submit">{editId ? 'Update' : 'Add'} Branch</button>
      </form>
      <ul>
        {branches.map((branch) => (
          <li key={branch.id}>
            {branch.name} (Org ID: {branch.organization_id})
            <button onClick={() => handleEdit(branch)}>Edit</button>
            <button onClick={() => handleDelete(branch.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrgAdmin;
