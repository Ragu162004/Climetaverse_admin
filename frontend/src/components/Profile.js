import React, { useState } from "react";

const Profile = ({ username, role }) => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Trigger Button */}
      <button
        onClick={togglePopup}
        className="text-white bg-black px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
      >
        Profile
      </button>

      {/* Popup Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-80 p-6">
            {/* Close Button */}
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-lg font-bold">Profile</h2>
              <button
                onClick={togglePopup}
                className="text-gray-600 hover:text-black transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Profile Info */}
            <div className="mt-4">
              <div className="flex flex-col space-y-2">
                <div className="text-gray-700">
                  <span className="font-bold">Username:</span> {username}
                </div>
                <div className="text-gray-700">
                  <span className="font-bold">Role:</span> {role}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <button
                onClick={togglePopup}
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
