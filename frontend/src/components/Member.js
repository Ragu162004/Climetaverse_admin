import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Member = () => {
  const { departmentId } = useParams();
  const [department, setDepartment] = useState({});
  const [error, setError] = useState(null);

  const fetchDepartment = async () => {
    try {
      console.log(departmentId);
      const response = await axios.get(`http://localhost:5000/departments/${departmentId}`);
      setDepartment(response.data);
    } catch (err) {
      setError(err.response ? err.response.data.message : "Error fetching department");
    }
  };

  useEffect(() => {
    fetchDepartment();
  }, [departmentId]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-center text-blue-600 mb-4">
          Department Details
        </h2>
        {error && (
          <p className="text-center text-red-500 font-semibold mb-4">
            {error}
          </p>
        )}
        <div className="text-center">
          <p className="text-lg font-medium text-gray-800">
            Department Name:
          </p>
          <p className="text-xl font-semibold text-gray-900">
            {department.name || "Loading..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Member;
