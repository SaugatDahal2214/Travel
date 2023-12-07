// UserProfile.js
import React, { useState, useEffect } from 'react';
const backgroundImage = require('../../assets/bg-2.jpg');

const UserProfile = ({ username }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/profile/${encodeURIComponent(username)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUserDetails(data);
        setError(null);
      } catch (error) {
        setError('Error retrieving user details');
        console.error('Error retrieving user details:', error);
      }
    };

    if (username) {
      fetchUserDetails();
    }
  }, [username]);

  return (  
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded-md text-center">
      {userDetails ? (
        <div>
          <h2 className='mb-2 text-3xl'>Contact Details:</h2>
          <p className="mb-2 text-2xl text-gray-600">
            <span className="whitespace-no-wrap">Email: {userDetails.email}</span>
          </p>
          <p className="mb-2 text-2xl text-gray-600">Contact: {userDetails.mobile}</p>
          {/* Display other user details as needed */}
        </div>
      ) : (
        <p>{error || 'Loading user details...'}</p>
      )}
    </div>
  );
  
};

export default UserProfile;
