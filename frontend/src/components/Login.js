import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState('');
  const [accessId, setAccessId] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });

      const { role, access_id } = response.data;
      setRole(role);
      setAccessId(access_id);

      // Store user data in localStorage
      localStorage.setItem('userRole', role);
      localStorage.setItem('accessId', access_id);

      // Redirect based on role
      if (role === 'admin') {
        window.location.href = '/admin';
      } else if (role === 'orgadmin') {
        window.location.href = `/branches/${access_id}`;
      } else if (role === 'branchadmin') {
        window.location.href = `/departments/${access_id}`;
      } else if (role === 'dprtadmin') {
        window.location.href = `/members/${access_id}`;
      } else if (role === 'member') {
        window.location.href = `/member/${access_id}`;
      } else {
        setError('Unknown role');
      }
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url(https://source.unsplash.com/random/1600x900)' }}>
      <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-lg max-w-md w-full p-8 md:p-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Login to Your Account</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-gray-700 font-semibold mb-2">Username</label>
            <input
              id="username" 
              name="username"  
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              autoComplete="username" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              id="password" 
              name="password" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"  
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition duration-300 shadow-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
