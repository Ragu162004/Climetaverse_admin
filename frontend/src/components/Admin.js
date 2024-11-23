import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { EditIcon, TrashIcon, EyeIcon } from "lucide-react";

const Admin = () => {
  const [organizations, setOrganizations] = useState([]);
  const [totalOrganizations, setTotalOrganizations] = useState(0);
  const [recentOrganization, setRecentOrganization] = useState(null);
  const [editId, setEditId] = useState(null);
  const [orgAdmins, setOrgAdmins] = useState({});
  const [editingAdmin, setEditingAdmin] = useState(null);
  const navigate = useNavigate();

  const fetchOrganizations = async () => {
    const response = await axios.get("http://localhost:5000/organizations");
    const data = response.data;

    // Update state with organization stats
    setOrganizations(data);
    setTotalOrganizations(data.length);
    setRecentOrganization(data.length > 0 ? data[data.length - 1] : null);

    return data;
  };

  const fetchAdmins = async (orgId) => {
    const response = await axios.get(`http://localhost:5000/organizations/${orgId}/members`);
    return response.data;
  };

  const fetchAllAdmins = async (organizations) => {
    const allAdmins = {};
    await Promise.all(
      organizations.map(async (org) => {
        const admins = await fetchAdmins(org.id);
        allAdmins[org.id] = admins;
      })
    );
    setOrgAdmins(allAdmins);
  };

  useEffect(() => {
    const loadOrganizationsAndAdmins = async () => {
      const orgs = await fetchOrganizations();
      await fetchAllAdmins(orgs);
    };
    loadOrganizationsAndAdmins();
  }, []);

  const handleOrganizationSubmit = async (name) => {
    if (editId) {
      await axios.put(`http://localhost:5000/organizations/${editId}`, { name });
    } else {
      await axios.post("http://localhost:5000/organizations", { name });
    }
    setEditId(null);
    fetchOrganizations(); // Update organizations and stats
  };

  const handleEdit = (org) => {
    setEditId(org.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/organizations/${id}`);
    fetchOrganizations(); // Update organizations and stats
  };

  const handleAdminSubmit = async (orgId, adminName, adminPassword) => {
    if (editingAdmin) {
      await axios.put(`http://localhost:5000/users/${editingAdmin.id}`, {
        username: adminName,
        password: adminPassword,
        role: "orgadmin",
        access_id: orgId,
      });
      setEditingAdmin(null);
    } else {
      await axios.post(`http://localhost:5000/users`, {
        username: adminName,
        password: adminPassword,
        role: "orgadmin",
        access_id: orgId,
      });
    }
    fetchAllAdmins(organizations);
  };

  const handleEditAdmin = (orgId, admin) => {
    setEditingAdmin(admin);
  };

  const handleDeleteAdmin = async (orgId, adminId) => {
    await axios.delete(`http://localhost:5000/users/${adminId}`);
    fetchAllAdmins(organizations);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="bg-white p-6 rounded-md shadow-lg">

      <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        {/* Organization Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
  {/* Card for Total Organizations */}
  <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold text-gray-700 mb-2">Total Organizations</h3>
    <p className="text-4xl font-bold text-blue-600">{totalOrganizations}</p>
  </div>

  {/* Card for Recently Added Organization */}
  <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold text-gray-700 mb-2">Recently Added</h3>
    {recentOrganization ? (
      <p className="text-lg font-bold text-green-600">{recentOrganization.name}</p>
    ) : (
      <p className="text-sm text-gray-500">No recent organizations added</p>
    )}
  </div>
</div>


        <h2 className="text-2xl font-semibold mb-4">Organizations</h2>
        {/* Organization Form */}
        <div className="mb-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const name = e.target.elements.name.value;
              handleOrganizationSubmit(name);
            }}
          >
            <input
              type="text"
              name="name"
              placeholder="Enter Organization Name"
              className="border border-gray-300 p-2 rounded-md"
              defaultValue={editId ? organizations.find((org) => org.id === editId)?.name : ""}
            />
            <button type="submit" className="ml-2 bg-blue-500 text-white p-2 rounded-md">
              {editId ? "Update Organization" : "Create Organization"}
            </button>
          </form>
        </div>

        {/* Organizations List */}
        <div className="space-y-6">
          {organizations.map((org) => (
            <div key={org.id} className="bg-gray-100 p-4 rounded-md shadow-md">
              <div className="flex justify-between items-center">
                <span className="text-xl">{org.name}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(org)}
                    className="bg-yellow-500 text-white p-2 rounded-md"
                  >
                    <EditIcon className="inline-block mr-2" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(org.id)}
                    className="bg-red-500 text-white p-2 rounded-md"
                  >
                    <TrashIcon className="inline-block mr-2" /> Delete
                  </button>
                  <button
                    onClick={() => navigate(`/branches/${org.id}`)}
                    className="bg-green-500 text-white p-2 rounded-md"
                  >
                    <EyeIcon className="inline-block mr-2" /> View Branches
                  </button>
                </div>
              </div>

              <h4 className="font-semibold mt-4">Admins for {org.name}</h4>
              {/* Admin Form */}
              <div className="mb-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const adminName = e.target.elements.adminName.value;
                    const adminPassword = e.target.elements.adminPassword.value;
                    handleAdminSubmit(org.id, adminName, adminPassword);
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
                {(orgAdmins[org.id] || []).map((admin) => (
                  <div
                    key={admin.id}
                    className="flex justify-between items-center bg-gray-200 p-2 rounded-md"
                  >
                    <span>{admin.username}</span>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEditAdmin(org.id, admin)}
                        className="bg-yellow-500 text-white p-2 rounded-md"
                      >
                        <EditIcon className="inline-block mr-2" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAdmin(org.id, admin.id)}
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

export default Admin;
