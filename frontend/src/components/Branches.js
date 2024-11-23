import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { EditIcon, TrashIcon, EyeIcon } from "lucide-react";

const Branches = () => {
  const { organizationId } = useParams();
  const [branches, setBranches] = useState([]);
  const [totalBranches, setTotalBranches] = useState(0);
  const [recentBranch, setRecentBranch] = useState(null);
  const [editBranchId, setEditBranchId] = useState(null);
  const [branchAdmins, setBranchAdmins] = useState({});
  const [editingAdmin, setEditingAdmin] = useState(null);
  const navigate = useNavigate();

  const fetchBranches = async () => {
    const response = await axios.get(
      `http://localhost:5000/organizations/${organizationId}/branches`
    );
    const data = response.data;

    // Update state with branch stats
    setBranches(data);
    setTotalBranches(data.length);
    setRecentBranch(data.length > 0 ? data[data.length - 1] : null);

    return data;
  };

  const fetchAdmins = async (branchId) => {
    const response = await axios.get(`http://localhost:5000/branches/${branchId}/members`);
    return response.data;
  };

  const fetchAllAdmins = async (branches) => {
    const allAdmins = {};
    await Promise.all(
      branches.map(async (branch) => {
        const admins = await fetchAdmins(branch.id);
        allAdmins[branch.id] = admins;
      })
    );
    setBranchAdmins(allAdmins);
  };

  useEffect(() => {
    const loadBranchesAndAdmins = async () => {
      const branchData = await fetchBranches();
      await fetchAllAdmins(branchData);
    };
    loadBranchesAndAdmins();
  }, [organizationId]);

  const handleBranchSubmit = async (name) => {
    if (editBranchId) {
      await axios.put(`http://localhost:5000/branches/${editBranchId}`, { name });
    } else {
      await axios.post(`http://localhost:5000/organizations/${organizationId}/branches`, { name });
    }
    setEditBranchId(null);
    fetchBranches(); // Update branches and stats
  };

  const handleEditBranch = (branch) => {
    setEditBranchId(branch.id);
  };

  const handleDeleteBranch = async (id) => {
    await axios.delete(`http://localhost:5000/branches/${id}`);
    fetchBranches(); // Update branches and stats
  };

  const handleAdminSubmit = async (branchId, adminName, adminPassword) => {
    if (editingAdmin) {
      await axios.put(`http://localhost:5000/users/${editingAdmin.id}`, {
        username: adminName,
        password: adminPassword,
        role: "branchadmin",
        access_id: branchId,
      });
      setEditingAdmin(null);
    } else {
      await axios.post(`http://localhost:5000/users`, {
        username: adminName,
        password: adminPassword,
        role: "branchadmin",
        access_id: branchId,
      });
    }
    fetchAllAdmins(branches);
  };

  const handleEditAdmin = (branchId, admin) => {
    setEditingAdmin(admin);
  };

  const handleDeleteAdmin = async (branchId, adminId) => {
    await axios.delete(`http://localhost:5000/users/${adminId}`);
    fetchAllAdmins(branches);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="bg-white p-6 rounded-md shadow-lg">

        <h2 className="text-2xl font-semibold mb-4">Branch Overview</h2>
        {/* Branch Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Total Branches</h3>
            <p className="text-4xl font-bold text-blue-600">{totalBranches}</p>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Recently Added</h3>
            {recentBranch ? (
              <p className="text-lg font-bold text-green-600">{recentBranch.name}</p>
            ) : (
              <p className="text-sm text-gray-500">No recent branches added</p>
            )}
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Branches</h2>
        {/* Branch Form */}
        <div className="mb-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const name = e.target.elements.name.value;
              handleBranchSubmit(name);
            }}
          >
            <input
              type="text"
              name="name"
              placeholder="Enter Branch Name"
              className="border border-gray-300 p-2 rounded-md"
              defaultValue={editBranchId ? branches.find((b) => b.id === editBranchId)?.name : ""}
            />
            <button type="submit" className="ml-2 bg-blue-500 text-white p-2 rounded-md">
              {editBranchId ? "Update Branch" : "Create Branch"}
            </button>
          </form>
        </div>

        {/* Branches List */}
        <div className="space-y-6">
          {branches.map((branch) => (
            <div key={branch.id} className="bg-gray-100 p-4 rounded-md shadow-md">
              <div className="flex justify-between items-center">
                <span className="text-xl">{branch.name}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEditBranch(branch)}
                    className="bg-yellow-500 text-white p-2 rounded-md"
                  >
                    <EditIcon className="inline-block mr-2" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBranch(branch.id)}
                    className="bg-red-500 text-white p-2 rounded-md"
                  >
                    <TrashIcon className="inline-block mr-2" /> Delete
                  </button>
                  <button
                    onClick={() => navigate(`/departments/${branch.id}`)}
                    className="bg-green-500 text-white p-2 rounded-md"
                  >
                    <EyeIcon className="inline-block mr-2" /> View Departments
                  </button>
                </div>
              </div>

              <h4 className="font-semibold mt-4">Admins for {branch.name}</h4>
              {/* Admin Form */}
              <div className="mb-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const adminName = e.target.elements.adminName.value;
                    const adminPassword = e.target.elements.adminPassword.value;
                    handleAdminSubmit(branch.id, adminName, adminPassword);
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
                {(branchAdmins[branch.id] || []).map((admin) => (
                  <div
                    key={admin.id}
                    className="flex justify-between items-center bg-gray-200 p-2 rounded-md"
                  >
                    <span>{admin.username}</span>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEditAdmin(branch.id, admin)}
                        className="bg-yellow-500 text-white p-2 rounded-md"
                      >
                        <EditIcon className="inline-block mr-2" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAdmin(branch.id, admin.id)}
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

export default Branches;
