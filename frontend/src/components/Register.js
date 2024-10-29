import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [accessId, setAccessId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/users', {
        username,
        password,
        role,
        access_id: accessId,
      });
      setSuccess('User registered successfully!');
      setUsername('');
      setPassword('');
      setRole('');
      setAccessId('');
      setError('');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleRegister}>
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
          type="text"
          value={accessId}
          onChange={(e) => setAccessId(e.target.value)}
          placeholder="Access ID"
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
