import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { EditIcon, TrashIcon } from "lucide-react";

const Members = () => {
  const { departmentId } = useParams();
  const [members, setMembers] = useState([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [recentMember, setRecentMember] = useState(null);
  const [editMemberId, setEditMemberId] = useState(null);

  const fetchMembers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/departments/${departmentId}/members`
      );
      const data = response.data;

      setMembers(data);
      setTotalMembers(data.length);
      setRecentMember(data.length > 0 ? data[data.length - 1] : null);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [departmentId]);

  const handleMemberSubmit = async (username, password) => {
    try {
      if (editMemberId) {
        await axios.put(`http://localhost:5000/users/${editMemberId}`, {
          username,
          password,
          role: "member",
          access_id: departmentId,
        });
      } else {
        await axios.post(`http://localhost:5000/users`, {
          username,
          password,
          role: "member",
          access_id: departmentId,
        });
      }
      setEditMemberId(null);
      fetchMembers();
    } catch (error) {
      console.error("Error adding/updating member:", error);
    }
  };

  const handleEditMember = (member) => {
    setEditMemberId(member.id);
  };

  const handleDeleteMember = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/users/${id}`);
      fetchMembers();
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="bg-white p-6 rounded-md shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Members Overview</h2>
        {/* Member Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Total Members
            </h3>
            <p className="text-4xl font-bold text-blue-600">{totalMembers}</p>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Recently Added
            </h3>
            {recentMember ? (
              <p className="text-lg font-bold text-green-600">
                {recentMember.username}
              </p>
            ) : (
              <p className="text-sm text-gray-500">No recent members added</p>
            )}
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Members</h2>
        {/* Member Form */}
        <div className="mb-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const username = e.target.elements.username.value;
              const password = e.target.elements.password.value;
              handleMemberSubmit(username, password);
            }}
          >
            <input
              type="text"
              name="username"
              placeholder="Enter Member Username"
              className="border border-gray-300 p-2 rounded-md"
              defaultValue={
                editMemberId
                  ? members.find((m) => m.id === editMemberId)?.username
                  : ""
              }
            />
            <input
              type="password"
              name="password"
              placeholder="Enter Member Password"
              className="border border-gray-300 p-2 rounded-md ml-2"
            />
            <button
              type="submit"
              className="ml-2 bg-blue-500 text-white p-2 rounded-md"
            >
              {editMemberId ? "Update Member" : "Add Member"}
            </button>
          </form>
        </div>

        {/* Members List */}
        <div className="space-y-6">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-gray-100 p-4 rounded-md shadow-md flex justify-between items-center"
            >
              <span>{member.username}</span>
              <div className="space-x-2">
                <button
                  onClick={() => handleEditMember(member)}
                  className="bg-yellow-500 text-white p-2 rounded-md"
                >
                  <EditIcon className="inline-block mr-2" /> Edit
                </button>
                <button
                  onClick={() => handleDeleteMember(member.id)}
                  className="bg-red-500 text-white p-2 rounded-md"
                >
                  <TrashIcon className="inline-block mr-2" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Members;
