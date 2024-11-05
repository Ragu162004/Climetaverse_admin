import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faEye } from '@fortawesome/free-solid-svg-icons';

const Departments = () => {
  const { branchId } = useParams();
  const [branchName, setBranchName] = useState('');
  const [departments, setDepartments] = useState([]);
  const [departmentName, setDepartmentName] = useState('');
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [departmentAdmins, setDepartmentAdmins] = useState({});
  const [adminData, setAdminData] = useState({});
  const [editingAdmin, setEditingAdmin] = useState(null);
  const navigate = useNavigate();

  const fetchDepartments = async () => {
    const response = await axios.get(`http://localhost:5000/branches/${branchId}/departments`);
    setDepartments(response.data);
    await fetchAllAdmins(response.data);
    const branchResponse = await axios.get(`http://localhost:5000/branches/${branchId}`);
    setBranchName(branchResponse.data.name);
  };

  const fetchAdmins = async (departmentId) => {
    const response = await axios.get(`http://localhost:5000/departments/${departmentId}/admins`);
    return response.data;
  };

  const fetchAllAdmins = async (departments) => {
    const allAdmins = {};
    await Promise.all(
      departments.map(async (dept) => {
        const admins = await fetchAdmins(dept.id);
        allAdmins[dept.id] = admins;
      })
    );
    setDepartmentAdmins(allAdmins);
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
    fetchAllAdmins(departments);
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
    fetchAllAdmins(departments);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Departments for {branchName}
        </h2>
  
        <form onSubmit={handleAddDepartment} className="space-y-4 mb-6">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              placeholder="Department Name"
              required
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition duration-300 shadow-lg flex items-center gap-2"
            >
              <FontAwesomeIcon icon={editingDepartment ? faEdit : faPlus} />
              {editingDepartment ? 'Update Department' : 'Add Department'}
            </button>
          </div>
        </form>
  
        <ul className="space-y-4">
          {departments.map((dept) => (
            <li key={dept.id} className="bg-gray-50 p-4 rounded-md shadow-md border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold text-indigo-800">{dept.name}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditDepartment(dept)}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 shadow-lg flex items-center gap-1"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteDepartment(dept.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 shadow-lg flex items-center gap-1"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    Delete
                  </button>
                  <button
                    onClick={() => handleViewMembers(dept.id)}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 shadow-lg flex items-center gap-1"
                  >
                    <FontAwesomeIcon icon={faEye} />
                    View Members
                  </button>
                </div>
              </div>
  
              <div>
                <h4 className="font-semibold mb-2">Admins for {dept.name}</h4>
                <form onSubmit={(e) => handleAddAdmin(e, dept.id)} className="flex space-x-2 mb-4">
                  <input
                    type="text"
                    value={adminData[dept.id]?.adminName || ''}
                    onChange={(e) => handleAdminInputChange(dept.id, 'adminName', e.target.value)}
                    placeholder="Admin Name"
                    required
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="password"
                    value={adminData[dept.id]?.adminPassword || ''}
                    onChange={(e) => handleAdminInputChange(dept.id, 'adminPassword', e.target.value)}
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
                  {(departmentAdmins[dept.id] || []).map((admin) => (
                    <li key={admin.id} className="flex justify-between items-center bg-gray-100 p-2 rounded-md mb-2">
                      <span>{admin.username}</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditAdmin(dept.id, admin)}
                          className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 shadow-lg flex items-center gap-1"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAdmin(dept.id, admin.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 shadow-lg flex items-center gap-1"
                        >
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

export default Departments;