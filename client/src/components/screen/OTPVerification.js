// Example EmailVerification.js
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import trekkingTalesLogo from '../../assets/logo.png'; // Import your Trekking Tales logo

const backgroundImage = require('../../assets/bg-1.jpg'); // Import your background image

const EmailVerification = () => {
  const { userId } = useParams();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`/api/verifyEmail/${userId}`);

        if (response.status === 200) {
          // Redirect the user to the login page
          window.location.href = '/login';
        } else {
          console.error('Email verification failed.');
        }
      } catch (error) {
        console.error('Error verifying email:', error);
      }
    };

    // Call the verification function
    verifyEmail();
  }, [userId]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="flex justify-center items-center">
        <div className="flex items-center">
          <img
            src={trekkingTalesLogo}
            className="image w-24 h-25 mr-2 rounded-full"
            alt="Trekking Tales Logo"
          />
          <h1 className="title text-3xl font-bold text-gray-800 ">Trekking Tales</h1>
        </div>
        {/* You can add additional elements or links on the right side if needed */}
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg text-center mt-16">
        <p className="text-3xl font-semibold mb-4 text-gray-800">Email Verified!</p>
        <a
          href="http://localhost:3000/"
          className="inline-block bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Start Exploring
        </a>
      </div>
    </div>
  );
};

export default EmailVerification;
