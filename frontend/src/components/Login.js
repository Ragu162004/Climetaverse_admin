import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });

      const { role, access_id } = response.data;

      // Navigate based on role
      switch (role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'orgadmin':
          navigate(`/branches/${access_id}`);
          break;
        case 'branchadmin':
          navigate(`/departments/${access_id}`);
          break;
        case 'dprtadmin':
          navigate(`/members/${access_id}`);
          break;
        case 'member':
          navigate(`/member/${access_id}`);
          break;
        default:
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
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition duration-300 shadow-lg"
          >
            Login
          </button>
        </form>
        {/* <div className="mt-6 text-center text-gray-600">
          <p>New User? <a href="/register" className="text-indigo-500 hover:text-indigo-600 font-medium">Register</a></p>
        </div> */}
      </div>
    </div>
  );
};

export default Login;