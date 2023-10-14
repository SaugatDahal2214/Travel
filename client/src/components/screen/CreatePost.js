import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from "react-hot-toast";

function ServicesAdmin() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [description, setDesc] = useState('');
  const [altitude1, setAltitude1] = useState('');
  const [altitude2, setAltitude2] = useState('');
  const [altitude3, setAltitude3] = useState('');
  const [rating, setRating] = useState('');
  const [image, setImage] = useState(null);
  const [altitudeData, setAltitudeData] = useState([]);
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/username');
    }
  }, []);

  const handleChange = (e) => {
    setLocation(e.target.value);
  };
  const handleChangeDesc = (e) => {
    setDesc(e.target.value);
  };
  const handleAltitude1 = (e) => {
    setAltitude1(e.target.value);
  };
  const handleAltitude2 = (e) => {
    setAltitude2(e.target.value);
  };
  const handleAltitude3 = (e) => {
    setAltitude3(e.target.value);
  };
  const handleRating = (e) => {
    setRating(e.target.value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleCreatePost = () => {
    setIsCreatingPost(true);
    toast.success("Post created.")
    setTimeout(() => {
      navigate('/home'); // Reload the page
    }, 1500);
    const formData = new FormData();
    formData.append('location', location);
    formData.append('description', description);
    formData.append('altitude1', altitude1);
    formData.append('altitude2', altitude2);
    formData.append('altitude3', altitude3);
    formData.append('rating', rating);
    formData.append('image', image);

    axios
      .post('http://localhost:8080/api/post', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        if (res.data.code === 403 && res.data.message === 'Token Expired') {
          localStorage.setItem('token', null);
          navigate('/username');
          
        } else {
          const altitudeData = [
            { name: 'Point 1', altitude: parseFloat(altitude1) },
            { name: 'Point 2', altitude: parseFloat(altitude2) },
            { name: 'Point 3', altitude: parseFloat(altitude3) },
          ];
          setAltitudeData(altitudeData);
        }
        setIsCreatingPost(false);
      })
      .catch((err) => {
        console.error(err);
        setIsCreatingPost(false);
      });
  };

  return (
    <div className="container mx-auto max-w-screen-xl p-6">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-semibold mb-4">Create a Post</h1>
        <div className="space-y-4">
          <input
            value={location}
            name="location"
            onChange={handleChange}
            placeholder="Location"
            className="border border-gray-300 rounded-md w-full py-2 px-3"
          />
          <input
            value={description}
            name="description"
            onChange={handleChangeDesc}
            placeholder="Description"
            className="border border-gray-300 rounded-md w-full py-2 px-3"
          />
          <input
            value={altitude1}
            name="altitude1"
            onChange={handleAltitude1}
            placeholder="Altitude 1"
            type="number"
            className="border border-gray-300 rounded-md w-full py-2 px-3"
          />
          <input
            value={altitude2}
            name="altitude2"
            onChange={handleAltitude2}
            placeholder="Altitude 2"
            type="number"
            className="border border-gray-300 rounded-md w-full py-2 px-3"
          />
          <input
            value={altitude3}
            name="altitude3"
            onChange={handleAltitude3}
            placeholder="Altitude 3"
            type="number"
            className="border border-gray-300 rounded-md w-full py-2 px-3"
          />
          <input
            value={rating}
            name="rating"
            onChange={handleRating}
            placeholder="Rating"
            type="number"
            className="border border-gray-300 rounded-md w-full py-2 px-3"
          />
          <input
            type="file"
            name="imageUrl"
            onChange={handleImageChange}
            className="border border-gray-300 rounded-md w-full py-2 px-3"
          />

          <div className="flex justify-end">
            <button
              onClick={handleCreatePost}
              className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md ${
                isCreatingPost ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isCreatingPost}
            >
              {isCreatingPost ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServicesAdmin;
