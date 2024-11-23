import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { EditIcon, TrashIcon, EyeIcon } from "lucide-react";

const Departments = () => {
  const { branchId } = useParams();
  const [departments, setDepartments] = useState([]);
  const [totalDepartments, setTotalDepartments] = useState(0);
  const [recentDepartment, setRecentDepartment] = useState(null);
  const [editDepartmentId, setEditDepartmentId] = useState(null);
  const [departmentAdmins, setDepartmentAdmins] = useState({});
  const [editingAdmin, setEditingAdmin] = useState(null);
  const navigate = useNavigate();

  const fetchDepartments = async () => {
    const response = await axios.get(
      `http://localhost:5000/branches/${branchId}/departments`
    );
    const data = response.data;

    // Update state with department stats
    setDepartments(data);
    setTotalDepartments(data.length);
    setRecentDepartment(data.length > 0 ? data[data.length - 1] : null);

    return data;
  };

  const fetchAdmins = async (departmentId) => {
    const response = await axios.get(
      `http://localhost:5000/departments/${departmentId}/members`
    );
    return response.data;
  };

  const fetchAllAdmins = async (departments) => {
    const allAdmins = {};
    await Promise.all(
      departments.map(async (department) => {
        const admins = await fetchAdmins(department.id);
        allAdmins[department.id] = admins;
      })
    );
    setDepartmentAdmins(allAdmins);
  };

  useEffect(() => {
    const loadDepartmentsAndAdmins = async () => {
      const departmentData = await fetchDepartments();
      await fetchAllAdmins(departmentData);
    };
    loadDepartmentsAndAdmins();
  }, [branchId]);

  const handleDepartmentSubmit = async (name) => {
    if (editDepartmentId) {
      await axios.put(
        `http://localhost:5000/departments/${editDepartmentId}`,
        { name }
      );
    } else {
      await axios.post(
        `http://localhost:5000/branches/${branchId}/departments`,
        { name }
      );
    }
    setEditDepartmentId(null);
    fetchDepartments(); // Update departments and stats
  };

  const handleEditDepartment = (department) => {
    setEditDepartmentId(department.id);
  };

  const handleDeleteDepartment = async (id) => {
    await axios.delete(`http://localhost:5000/departments/${id}`);
    fetchDepartments(); // Update departments and stats
  };

  const handleAdminSubmit = async (departmentId, adminName, adminPassword) => {
    if (editingAdmin) {
      await axios.put(`http://localhost:5000/users/${editingAdmin.id}`, {
        username: adminName,
        password: adminPassword,
        role: "dprtadmin",
        access_id: departmentId,
      });
      setEditingAdmin(null);
    } else {
      await axios.post(`http://localhost:5000/users`, {
        username: adminName,
        password: adminPassword,
        role: "dprtadmin",
        access_id: departmentId,
      });
    }
    fetchAllAdmins(departments);
  };

  const handleEditAdmin = (departmentId, admin) => {
    setEditingAdmin(admin);
  };

  const handleDeleteAdmin = async (departmentId, adminId) => {
    await axios.delete(`http://localhost:5000/users/${adminId}`);
    fetchAllAdmins(departments);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="bg-white p-6 rounded-md shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Department Overview</h2>
        {/* Department Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Total Departments</h3>
            <p className="text-4xl font-bold text-blue-600">{totalDepartments}</p>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Recently Added</h3>
            {recentDepartment ? (
              <p className="text-lg font-bold text-green-600">{recentDepartment.name}</p>
            ) : (
              <p className="text-sm text-gray-500">No recent departments added</p>
            )}
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Departments</h2>
        {/* Department Form */}
        <div className="mb-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const name = e.target.elements.name.value;
              handleDepartmentSubmit(name);
            }}
          >
            <input
              type="text"
              name="name"
              placeholder="Enter Department Name"
              className="border border-gray-300 p-2 rounded-md"
              defaultValue={
                editDepartmentId
                  ? departments.find((d) => d.id === editDepartmentId)?.name
                  : ""
              }
            />
            <button type="submit" className="ml-2 bg-blue-500 text-white p-2 rounded-md">
              {editDepartmentId ? "Update Department" : "Create Department"}
            </button>
          </form>
        </div>

        {/* Departments List */}
        <div className="space-y-6">
          {departments.map((department) => (
            <div key={department.id} className="bg-gray-100 p-4 rounded-md shadow-md">
              <div className="flex justify-between items-center">
                <span className="text-xl">{department.name}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEditDepartment(department)}
                    className="bg-yellow-500 text-white p-2 rounded-md"
                  >
                    <EditIcon className="inline-block mr-2" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteDepartment(department.id)}
                    className="bg-red-500 text-white p-2 rounded-md"
                  >
                    <TrashIcon className="inline-block mr-2" /> Delete
                  </button>
                  <button
                    onClick={() => navigate(`/members/${department.id}`)}
                    className="bg-green-500 text-white p-2 rounded-md"
                  >
                    <EyeIcon className="inline-block mr-2" /> View Members
                  </button>
                </div>
              </div>

              <h4 className="font-semibold mt-4">Admins for {department.name}</h4>
              {/* Admin Form */}
              <div className="mb-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const adminName = e.target.elements.adminName.value;
                    const adminPassword = e.target.elements.adminPassword.value;
                    handleAdminSubmit(department.id, adminName, adminPassword);
                  }}
                >
                  <input
                    type="text"
                    name="adminName"
                    placeholder="Admin Username"
                    className="border border-gray-300 p-2 rounded-md"
                    defaultValue={editingAdmin?.username || ""}
                  />
                  <input
                    type="password"
                    name="adminPassword"
                    placeholder="Admin Password"
                    className="border border-gray-300 p-2 rounded-md ml-2"
                  />
                  <button
                    type="submit"
                    className="ml-2 bg-blue-500 text-white p-2 rounded-md"
                  >
                    {editingAdmin ? "Update Admin" : "Add Admin"}
                  </button>
                </form>
              </div>

              {/* Admin List */}
              <div className="space-y-2">
                {(departmentAdmins[department.id] || []).map((admin) => (
                  <div
                    key={admin.id}
                    className="flex justify-between items-center bg-gray-200 p-2 rounded-md"
                  >
                    <span>{admin.username}</span>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEditAdmin(department.id, admin)}
                        className="bg-yellow-500 text-white p-2 rounded-md"
                      >
                        <EditIcon className="inline-block mr-2" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAdmin(department.id, admin.id)}
                        className="bg-red-500 text-white p-2 rounded-md"
                      >
                        <TrashIcon className="inline-block mr-2" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Departments;
