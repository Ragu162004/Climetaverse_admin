import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Admin from './components/Admin';
import Branches from './components/Branches';
import Departments from './components/Departments';
import Members from './components/Members';
// import OrgAdmin from './Ignore/OrgAdmin';
// import BranchAdmin from './Ignore/BranchAdmin';
// import DprtAdmin from './Ignore/DprtAdmin';
import Member from './components/Member';
import './index.css'


const App = () => {
  return (
    <Router>
      <div>
        {/* <h1>Management System</h1> */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/branches/:organizationId" element={<Branches />} />
          <Route path="/departments/:branchId" element={<Departments />} />
          <Route path="/members/:departmentId" element={<Members />} />
          {/* <Route path="/orgadmin" element={<OrgAdmin />} />
          <Route path="/branchadmin" element={<BranchAdmin />} />
          <Route path="/dprtadmin" element={<DprtAdmin />} /> */}
          <Route path="/member/:departmentId" element={<Member />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
