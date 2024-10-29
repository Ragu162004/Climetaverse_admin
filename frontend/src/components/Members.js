import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Members = () => {
  const { departmentId } = useParams();
  const [dprtName, setDprtName] = useState('');
  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState('');
  const [memberPassword, setMemberPassword] = useState('');
  const [editingMember, setEditingMember] = useState(null);
  const navigate = useNavigate();

  const fetchMembers = async () => {
    const response = await axios.get(`http://localhost:5000/departments/${departmentId}/members`);
    setMembers(response.data);

    
    const dprtResponse = await axios.get(`http://localhost:5000/departments/${departmentId}`);
    setDprtName(dprtResponse.data.name);
  };

  useEffect(() => {
    fetchMembers();
  }, [departmentId]);

  const handleAddMember = async (e) => {
    e.preventDefault();
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
  };

  const handleEditMember = (member) => {
    setMemberName(member.username);
    setEditingMember(member);
  };

  const handleDeleteMember = async (id) => {
    await axios.delete(`http://localhost:5000/users/${id}`);
    fetchMembers();
  };

  return (
    <div className="outerContainer">
      <h3>Members for Department: {dprtName}</h3>
      <form onSubmit={handleAddMember}>
        <input
          type="text"
          value={memberName}
          onChange={(e) => setMemberName(e.target.value)}
          placeholder="Member Username"
          required
        />
        {/* password field */}
        <input
          type="password"
          value={memberPassword}
          onChange={(e) => setMemberPassword(e.target.value)}
          placeholder="Member Password"
          required
        />
        <button type="submit">{editingMember ? 'Update Member' : 'Add Member'}</button>
      </form>
      <ul>
        {members.map((member) => (
          <li key={member.id}>
            {member.username}
            <button onClick={() => handleEditMember(member)}>Edit</button>
            <button onClick={() => handleDeleteMember(member.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate(`/departments/${departmentId}`)}>Back to Departments</button>
    </div>
  );
};

export default Members;
