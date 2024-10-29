import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Member = () => {
  const { departmentId } = useParams();
  const [department, setDepartment] = useState({}); // Initialize as an empty object
  const [error, setError] = useState(null); // State to handle errors

  const fetchDepartment = async () => {
    try {
      console.log(departmentId);
      const response = await axios.get(`http://localhost:5000/departments/${departmentId}`);
      
      setDepartment(response.data); // Set department state with fetched data
    } catch (err) {
      setError(err.response ? err.response.data.message : "Error fetching department");
    }
  };

  useEffect(() => {
    fetchDepartment();
  }, [departmentId]); // Dependency array includes dprtId

  return (
    <div>
      <h2>Department Name</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error if exists */}
      <p>{department.name}</p> {/* Ensure department is not undefined */}
    </div>
  );
};

export default Member;
