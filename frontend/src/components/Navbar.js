import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ handleLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState({ role: '' });

  // Toggle Profile popup
  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem('userRole');

    if (storedUserData) {
      setUserData({
        role: storedUserData.role,
      });
    } else {
      console.error('No user data found in localStorage');
    }
  }, []);

  return (
    <nav className="bg-black p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Dashboard Link */}
        <div className="text-white text-xl font-bold">
          <Link to="/">Dashboard</Link>
        </div>

        <div className="space-x-6 flex items-center">
          {/* Profile Button */}
          <button
            onClick={toggleProfile}
            className="text-white hover:text-gray-400"
          >
            Profile
          </button>

          {/* Profile Popup */}
          {isProfileOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-lg shadow-lg w-80 p-6">
                {/* Header Section */}
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                  <h2 className="text-lg font-bold">Profile</h2>
                  <button
                    onClick={toggleProfile}
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* User Info Section */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="font-bold w-20 text-gray-700">Role:</span>
                    <span className="text-gray-800">{userData.role}</span>
                  </div>
                </div>

                {/* Close Button */}
                <div className="mt-6 text-center">
                  <button
                    onClick={toggleProfile}
                    className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="text-white hover:text-gray-400"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
