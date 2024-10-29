import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DprtAdmin = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [accessId, setAccessId] = useState('');
  const [editId, setEditId] = useState(null);

  const fetchUsers = async () => {
    const response = await axios.get('http://localhost:5000/users');
    setUsers(response.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`http://localhost:5000/users/${editId}`, { username, password, role, access_id: accessId });
    } else {
      await axios.post('http://localhost:5000/users', { username, password, role, access_id: accessId });
    }
    setUsername('');
    setPassword('');
    setRole('');
    setAccessId('');
    setEditId(null);
    fetchUsers();
  };

  const handleEdit = (user) => {
    setUsername(user.username);
    setPassword(user.password);
    setRole(user.role);
    setAccessId(user.access_id);
    setEditId(user.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/users/${id}`);
    fetchUsers();
  };

  return (
    <div>
      <h2>Users</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="orgadmin">Org Admin</option>
          <option value="branchadmin">Branch Admin</option>
          <option value="dprtadmin">Department Admin</option>
          <option value="member">Member</option>
        </select>
        <input
          type="number"
          value={accessId}
          onChange={(e) => setAccessId(e.target.value)}
          placeholder="Access ID"
          required
        />
        <button type="submit">{editId ? 'Update' : 'Add'} User</button>
      </form>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} (Role: {user.role}, Access ID: {user.access_id})
            <button onClick={() => handleEdit(user)}>Edit</button>
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DprtAdmin;
