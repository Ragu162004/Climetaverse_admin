import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';

const Members = () => {
  const { departmentId } = useParams();
  const [dprtName, setDprtName] = useState('');
  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState('');
  const [memberPassword, setMemberPassword] = useState('');
  const [editingMember, setEditingMember] = useState(null);
  const navigate = useNavigate();

  const fetchMembers = async () => {
    try {
      const [membersResponse, departmentResponse] = await Promise.all([
        axios.get(`http://localhost:5000/departments/${departmentId}/members`),
        axios.get(`http://localhost:5000/departments/${departmentId}`),
      ]);
      setMembers(membersResponse.data);
      setDprtName(departmentResponse.data.name);
    } catch (error) {
      console.error('Error fetching members or department:', error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [departmentId]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      if (editingMember) {
        await axios.put(`http://localhost:5000/users/${editingMember.id}`, { 
          username: memberName, 
          password: memberPassword, 
          role: 'member', 
          access_id: departmentId 
        });
        setEditingMember(null);
      } else {
        await axios.post(`http://localhost:5000/users`, {
          username: memberName, 
          password: memberPassword,
          role: 'member', 
          access_id: departmentId 
        });
      }
      setMemberName('');
      setMemberPassword('');
      fetchMembers();
    } catch (error) {
      console.error('Error adding/updating member:', error);
    }
  };

  const handleEditMember = (member) => {
    setMemberName(member.username);
    setMemberPassword(''); // Clear password field for security
    setEditingMember(member);
  };

  const handleDeleteMember = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/users/${id}`);
      fetchMembers();
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Members for {dprtName}
        </h2>

        {/* Add/Edit Member Form */}
        <form onSubmit={handleAddMember} className="space-y-4 mb-6">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              placeholder="Member Username"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
              required
            />
            <input
              type="password"
              value={memberPassword}
              onChange={(e) => setMemberPassword(e.target.value)}
              placeholder="Member Password"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition duration-300 shadow-lg flex items-center gap-2"
            >
              <FontAwesomeIcon icon={editingMember ? faEdit : faPlus} />
              {editingMember ? 'Update Member' : 'Add Member'}
            </button>
          </div>
        </form>

        {/* Member List */}
        <ul className="space-y-4">
          {members.map((member) => (
            <li key={member.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-md shadow-md border border-gray-200">
              <span className="text-lg font-semibold text-gray-700">{member.username}</span>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleEditMember(member)} 
                  className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 shadow-lg flex items-center gap-1"
                >
                  <FontAwesomeIcon icon={faEdit} />
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteMember(member.id)} 
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
    </div>
  );
};

export default Members;
