import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import Axios for HTTP requests
import toast, { Toaster } from 'react-hot-toast';
import styles from '../../styles/Username.module.css';
import { useNavigate } from 'react-router-dom';

export default function Recovery() {
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize username if needed
    setUsername(''); // Uncomment this line and set the username if needed
  }, []);

  async function generateOTP() {
    try {
      const response = await axios.post('/api/generateOTP', { username });
      return response.data; // Assume the OTP is returned from the server
    } catch (error) {
      throw error;
    }
  }

  async function verifyOTP() {
    try {
      const response = await axios.post('/api/verifyOTP', { username, code: otp });
      return response.status; // Assume the status code is returned upon verification
    } catch (error) {
      throw error;
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const status = await verifyOTP();
      if (status === 201) {
        toast.success('Verified Successfully!');
        navigate('/reset');
      }
    } catch (error) {
      toast.error('Wrong OTP! Check email again!');
    }
  }

  async function resendOTP() {
    try {
      await generateOTP();
      toast.success('OTP has been sent to your email!');
    } catch (error) {
      toast.error('Could not send OTP!');
    }
  }

  return (
    <div className="container mx-auto">
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Recovery</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Enter OTP to recover the password.
            </span>
          </div>
          <form className='pt-20' onSubmit={onSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              <div className="input text-center">
                <span className='py-4 text-sm text-left text-gray-500'>
                  Enter the 6-digit OTP sent to your email address.
                </span>
                <input
                  onChange={(e) => setOtp(e.target.value)}
                  className={styles.textbox}
                  type="text"
                  placeholder='OTP'
                  value={otp}
                />
              </div>
              <button className={styles.btn} type='submit'>Recover</button>
            </div>
          </form>
          <div className="text-center py-4">
            <span className='text-gray-500'>
              Can't get OTP?{' '}
              <button onClick={resendOTP} className='text-red-500'>
                Resend
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
