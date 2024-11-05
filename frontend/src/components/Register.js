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
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url(https://source.unsplash.com/random/1600x900)' }}>
      <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-lg max-w-md w-full p-8 md:p-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Register Your Account</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200"
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="orgadmin">Org Admin</option>
              <option value="branchadmin">Branch Admin</option>
              <option value="dprtadmin">Department Admin</option>
              <option value="member">Member</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Access ID</label>
            <input
              type="text"
              value={accessId}
              onChange={(e) => setAccessId(e.target.value)}
              placeholder="Enter your Access ID"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition duration-300 shadow-lg"
          >
            Register
          </button>
        </form>
        <div className="mt-6 text-center text-gray-600">
          <p>Already have an account? <a href="/login" className="text-indigo-500 hover:text-indigo-600 font-medium">Login here</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
