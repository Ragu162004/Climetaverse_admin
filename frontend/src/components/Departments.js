import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Departments = () => {
  const { branchId } = useParams();
  const [branchName, setBranchName] = useState('');
  const [departments, setDepartments] = useState([]);
  const [departmentName, setDepartmentName] = useState('');
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [departmentAdmins, setDepartmentAdmins] = useState({}); // State to manage department admins
  const [adminData, setAdminData] = useState({}); // State for input values of admins
  const [editingAdmin, setEditingAdmin] = useState(null); // State to track which admin is being edited
  const navigate = useNavigate();

  const fetchDepartments = async () => {
    const response = await axios.get(`http://localhost:5000/branches/${branchId}/departments`);
    setDepartments(response.data);
    await fetchAllAdmins(response.data); // Fetch admins after fetching departments

    
    const branchResponse = await axios.get(`http://localhost:5000/branches/${branchId}`);
    setBranchName(branchResponse.data.name);
  };

  const fetchAdmins = async (departmentId) => {
    const response = await axios.get(`http://localhost:5000/departments/${departmentId}/admins`);
    return response.data;
  };


  
  const fetchAllAdmins = async (departments) => {
    const allAdmins = {};
    await Promise.all(departments.map(async (dept) => {
      const admins = await fetchAdmins(dept.id);
      allAdmins[dept.id] = admins; // Store admins in the allAdmins object
    }));
    setDepartmentAdmins(allAdmins); // Set all admins in state
  };

  useEffect(() => {
    fetchDepartments();
  }, [branchId]);

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (editingDepartment) {
      await axios.put(`http://localhost:5000/departments/${editingDepartment.id}`, { name: departmentName });
      setEditingDepartment(null);
    } else {
      await axios.post(`http://localhost:5000/branches/${branchId}/departments`, { name: departmentName });
    }
    setDepartmentName('');
    fetchDepartments();
  };

  const handleEditDepartment = (department) => {
    setDepartmentName(department.name);
    setEditingDepartment(department);
  };

  const handleDeleteDepartment = async (id) => {
    await axios.delete(`http://localhost:5000/departments/${id}`);
    fetchDepartments();
  };

  const handleViewMembers = (departmentId) => {
    navigate(`/members/${departmentId}`);
  };

  const handleAddAdmin = async (e, departmentId) => {
    e.preventDefault();
    const { adminName, adminPassword } = adminData[departmentId] || {};

    if (editingAdmin) {
      await axios.put(`http://localhost:5000/users/${editingAdmin.id}`, {
        username: adminName,
        password: adminPassword,
        role: 'dprtadmin',
        access_id: departmentId,
      });
      setEditingAdmin(null);
    } else {
      await axios.post(`http://localhost:5000/users`, {
        username: adminName,
        password: adminPassword,
        role: 'dprtadmin',
        access_id: departmentId,
      });
    }

    setAdminData((prev) => ({
      ...prev,
      [departmentId]: { adminName: '', adminPassword: '' },
    }));
    fetchAllAdmins(departments); // Refresh the list of admins
  };

  const handleEditAdmin = (departmentId, admin) => {
    setAdminData((prev) => ({
      ...prev,
      [departmentId]: { adminName: admin.username, adminPassword: '' },
    }));
    setEditingAdmin(admin);
  };

  const handleDeleteAdmin = async (departmentId, adminId) => {
    await axios.delete(`http://localhost:5000/users/${adminId}`);
    fetchAllAdmins(departments); // Refresh the list of admins
  };

  const handleAdminInputChange = (departmentId, field, value) => {
    setAdminData((prev) => ({
      ...prev,
      [departmentId]: {
        ...prev[departmentId],
        [field]: value,
      },
    }));
  };

  return (
    <div>
      <h3>Departments for Branch: {branchName}</h3>
      <form onSubmit={handleAddDepartment}>
        <input
          type="text"
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
          placeholder="Department Name"
          required
        />
        <button type="submit">{editingDepartment ? 'Update Department' : 'Add Department'}</button>
      </form>
      <ul>
        {departments.map((department) => (
          <li key={department.id}>
            {department.name}
            <button onClick={() => handleEditDepartment(department)}>Edit</button>
            <button onClick={() => handleDeleteDepartment(department.id)}>Delete</button>
            <button onClick={() => handleViewMembers(department.id)}>View Members</button>

            <div>
              <h4>Admins for {department.name}</h4>
              <form onSubmit={(e) => handleAddAdmin(e, department.id)}>
                <input
                  type="text"
                  value={adminData[department.id]?.adminName || ''}
                  onChange={(e) => handleAdminInputChange(department.id, 'adminName', e.target.value)}
                  placeholder="Admin Name"
                  required
                />
                <input
                  type="password"
                  value={adminData[department.id]?.adminPassword || ''}
                  onChange={(e) => handleAdminInputChange(department.id, 'adminPassword', e.target.value)}
                  placeholder="Admin Password"
                  required
                />
                <button type="submit">{editingAdmin ? 'Update Admin' : 'Add Admin'}</button>
              </form>

              <ul>
                {(departmentAdmins[department.id] || []).map((admin) => (
                  <li key={admin.id}>
                    {admin.username}
                    <button onClick={() => handleEditAdmin(department.id, admin)}>Edit</button>
                    <button onClick={() => handleDeleteAdmin(department.id, admin.id)}>Delete</button>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate(`/branches/${branchId}`)}>Back to Branches</button>
    </div>
  );
};

export default Departments;
