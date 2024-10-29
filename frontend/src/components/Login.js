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

      const { role } = response.data;
      const { access_id } = response.data;

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
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
