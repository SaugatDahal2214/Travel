import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import avatar from '../../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import convertToBase64 from '../../helper/convert';
import axios from 'axios';

import styles from '../../styles/Username.module.css';

import trekkingTalesLogo from '../../assets/logo.png'; // Import your Trekking Tales logo

const backgroundImage = require('../../assets/bg-1.jpg');

const Register = () => {
  const [file, setFile] = useState('');

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: '',
    },
    onSubmit: async (values) => {
      try {
        const response = await axios.post('/api/register', values);

        if (response.status === 201) {
          // Registration successful
          toast.success('Please check your email for verification.');
        } else {
          console.error('Registration failed.');
        }
      } catch (error) {
        console.error('Registration failed. Please try again.', error);
      }
    },
  });

  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  return (
    <div
    className="container min-w-full min-h-screen"
    style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
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

    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center mt-10">
        <div className={`${styles.glass} ${styles.formContainer}`}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Register</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">Happy to join you!</span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img src={file || avatar} className={styles.profile_img} alt="avatar" />
              </label>
              <input onChange={onUpload} type="file" id="profile" name="profile" style={{ display: 'none' }} />
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <input {...formik.getFieldProps('email')} className={styles.textbox} type="text" placeholder="Email*" />
              <input {...formik.getFieldProps('username')} className={styles.textbox} type="text" placeholder="Username*" />
              <input {...formik.getFieldProps('password')} className={styles.textbox} type="password" placeholder="Password*" />
              <button className={styles.btn} type="submit">
                Register
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Already Registered?{' '}
                <Link className="text-blue-500" to="/">
                  Login Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Register;
