// Example Username.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import avatar from '../../assets/profile.png';
import { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { usernameValidate } from '../../helper/validate';
import { useAuthStore } from '../../store/store';
import Navbar from './NavBar';

import styles from '../../styles/Username.module.css';
import trekkingTalesLogo from '../../assets/logo.png'; // Import your Trekking Tales logo

const backgroundImage = require('../../assets/bg-1.jpg'); // Import your background image

export default function Username() {
  const navigate = useNavigate();
  const setUsername = useAuthStore((state) => state.setUsername);

  const formik = useFormik({
    initialValues: {
      username: '',
    },
    validate: usernameValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      setUsername(values.username);
      navigate('/password');
    },
  });

  return (
    <div
      className="container min-w-full"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      {/* Logo and Name Section */}
      <div className="flex justify-center items-center px-6 ">
        <div className="flex items-center mt-16">
          <img
            src={trekkingTalesLogo}
            className="image w-24 h-25 mr-2 rounded-full"
            alt="Trekking Tales Logo"
          />
          <h1 className="title text-3xl font-bold text-gray-800 ">Trekking Tales</h1>
        </div>
        {/* You can add additional elements or links on the right side if needed */}
      </div>

      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Hello Again!</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Explore More by connecting with us.
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <img src={avatar} className={styles.profile_img} alt="avatar" />
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <input
                {...formik.getFieldProps('username')}
                className={styles.textbox}
                type="text"
                placeholder="Username"
              />
              <button className={styles.btn} type="submit">
                Let's Go
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Not a Member?{' '}
                <Link className="text-blue-500" to="/register">
                  Register Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
