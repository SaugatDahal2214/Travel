import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import avatar from '../../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { registerValidation } from '../../helper/validate';
import convertToBase64 from '../../helper/convert';
import axios from 'axios'; // Import axios

import styles from '../../styles/Username.module.css';

export default function Register() {
  const navigate = useNavigate();
  const [file, setFile] = useState('');

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: '',
    },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        // Make the Axios request
        const response = await axios.post('/api/register', values);

        // Check the response status code
        if (response.status === 201) {
          // Registration successful, handle accordingly
          toast.success('Registration successful.');
          navigate('/'); // Redirect to the desired page
        } else {
          // Handle other response status codes if needed
          toast.error('Registration failed.');
        }
      } catch (error) {
        // Axios request failed, handle the error
        if (error.response) {
          // The request was made, but the server responded with a non-2xx status code
          toast.error(`Request failed with status code ${error.response.status}`);
        } else if (error.request) {
          // The request was made, but no response was received
          toast.error('No response received from the server.');
        } else {
          // Something else went wrong
          toast.error('An error occurred while making the request.');
        }
      }
    },
  });

  /** formik doesn't support file upload, so we need to create this handler */
  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
        <div className={`${styles.glass} ${styles.formContainer}`}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Register</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Happy to join you!
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img src={file || avatar} className={styles.profile_img} alt="avatar" />
              </label>
              <input onChange={onUpload} type="file" id="profile" name="profile" style={{display: 'none'}}/>
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
                Already Registered? <Link className="text-blue-500" to="/">
                  Login Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
