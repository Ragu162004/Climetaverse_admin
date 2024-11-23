import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Admin from './components/Admin';
import Branches from './components/Branches';
import Departments from './components/Departments';
import Members from './components/Members';
import Member from './components/Member';
import Navbar from './components/Navbar';  // Import Navbar component
import './index.css';

const App = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('');
  const [accessId, setAccessId] = useState('');

  // Check if user is logged in based on localStorage data
  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    const storedAccessId = localStorage.getItem('accessId');

    if (storedRole && storedAccessId) {
      setUserRole(storedRole);
      setAccessId(storedAccessId);

      // Prevent re-triggering navigation by checking if already on the correct page
      if (window.location.pathname === '/') {
        switch (storedRole) {
          case 'admin':
            navigate('/admin');
            break;
          case 'orgadmin':
            navigate(`/branches/${storedAccessId}`);
            break;
          case 'branchadmin':
            navigate(`/departments/${storedAccessId}`);
            break;
          case 'dprtadmin':
            navigate(`/members/${storedAccessId}`);
            break;
          case 'member':
            navigate(`/member/${storedAccessId}`);
            break;
          default:
            break;
        }
      }
    } else {
      if (window.location.pathname !== '/') {
        navigate('/');  
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('accessId');
    setUserRole('');
    setAccessId('');
    navigate('/'); 
  };

  return (
      <div className="flex flex-col">
        {/* Render Navbar only if user is logged in */}
        {userRole && accessId && (
          <Navbar handleLogout={handleLogout} />
        )}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Login setUserRole={setUserRole} setAccessId={setAccessId} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/branches/:organizationId" element={<Branches />} />
            <Route path="/departments/:branchId" element={<Departments />} />
            <Route path="/members/:departmentId" element={<Members />} />
            <Route path="/member/:departmentId" element={<Member />} />
          </Routes>
        </div>
      </div>
  );
};

export default App;
