import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BranchAdmin = () => {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState('');
  const [branchId, setBranchId] = useState('');
  const [editId, setEditId] = useState(null);
  const [branches, setBranches] = useState([]);

  const fetchDepartments = async () => {
    const response = await axios.get('http://localhost:5000/departments');
    setDepartments(response.data);
  };

  const fetchBranches = async () => {
    const response = await axios.get('http://localhost:5000/branches');
    setBranches(response.data);
  };

  useEffect(() => {
    fetchDepartments();
    fetchBranches();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`http://localhost:5000/departments/${editId}`, { name, branch_id: branchId });
    } else {
      await axios.post('http://localhost:5000/departments', { name, branch_id: branchId });
    }
    setName('');
    setBranchId('');
    setEditId(null);
    fetchDepartments();
  };

  const handleEdit = (department) => {
    setName(department.name);
    setBranchId(department.branch_id);
    setEditId(department.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/departments/${id}`);
    fetchDepartments();
  };

  return (
    <div>
      <h2>Departments</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Department Name"
          required
        />
        <select value={branchId} onChange={(e) => setBranchId(e.target.value)} required>
          <option value="">Select Branch</option>
          {branches.map(branch => (
            <option key={branch.id} value={branch.id}>{branch.name}</option>
          ))}
        </select>
        <button type="submit">{editId ? 'Update' : 'Add'} Department</button>
      </form>
      <ul>
        {departments.map((department) => (
          <li key={department.id}>
            {department.name} (Branch ID: {department.branch_id})
            <button onClick={() => handleEdit(department)}>Edit</button>
            <button onClick={() => handleDelete(department.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BranchAdmin;
