import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import avatar from '../../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { passwordValidate } from '../../helper/validate';
import useFetch from '../../hooks/fetch.hook';
import { useAuthStore } from '../../store/store';
import { verifyPassword } from '../../helper/helper';
import styles from '../../styles/Username.module.css';
import trekkingTalesLogo from '../../assets/logo.png'; // Import your Trekking Tales logo

const backgroundImage = require('../../assets/bg-1.jpg'); // Import your background image

export default function Password() {
  const navigate = useNavigate();
  const { username } = useAuthStore((state) => state.auth);
  const [{ isLoading, apiData, serverError }] = useFetch(`user/${username}`);

  const formik = useFormik({
    initialValues: {
      password: '',
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      let loginPromise = verifyPassword({ username, password: values.password });
      toast.promise(loginPromise, {
        loading: 'Checking...',
        success: <b>Login Successfully...!</b>,
        error: <b>Password Not Match!</b>,
      });

      loginPromise.then((res) => {
        let { token, userId, email } = res.data;

        // Store user information in localStorage as an object
        localStorage.setItem('user', JSON.stringify({ username, userId, email }));

        localStorage.setItem('token', token);
        navigate('/home');
      });
    },
  });

  if (isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
  if (serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>;

  return (
    <div
    className="container min-w-full"
    style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    <div className='container mx-auto'>
      <Toaster position='top-center' reverseOrder={false}></Toaster>

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

      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass}>
          <div className='title flex flex-col items-center'>
            <h4 className='text-5xl font-bold'>Hello {apiData?.firstName || apiData?.username}</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>Explore More by connecting with us.</span>
          </div>

          <form className='py-1' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-4'>
              <img src={apiData?.profile || avatar} className={styles.profile_img} alt='avatar' />
            </div>

            <div className='textbox flex flex-col items-center gap-6'>
              <input
                {...formik.getFieldProps('password')}
                className={styles.textbox}
                type='password'
                placeholder='Password'
              />
              <button className={styles.btn} type='submit'>
                Sign In
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  /</div>
  );
}
