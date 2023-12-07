import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './NavBar';
const backgroundImage = require('../../assets/bg-2.jpg');

const StarRating = ({ rating }) => {
  const stars = [];

  // Calculate the number of full stars
  const fullStars = Math.floor(rating);

  // Add full gold stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(<span key={i} className="text-yellow-500 text-2xl">★</span>);
  }

  // Check if there is a half star
  if (rating % 1 >= 0.5) {
    stars.push(<span key="half" className="text-yellow-500 text-2xl">★</span>);
  } else if (rating % 1 >= 0.25) {
    stars.push(<span key="half" className="text-yellow-500 text-2xl">☆</span>);
  }

  // Add empty gold stars to fill up to 5
  const remainingStars = 5 - stars.length;
  for (let i = 0; i < remainingStars; i++) {
    stars.push(<span key={`empty-${i}`} className="text-yellow-300 text-2xl">☆</span>);
  }

  return <div className="flex">{stars}</div>;
};

const AverageRatingComponent = () => {
  const [location, setLocation] = useState('');
  const [averageRating, setAverageRating] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAverageRatingSubmit = async () => {
    try {
      setLoading(true);
      // Replace the API endpoint with your actual endpoint
      const response = await fetch(`http://localhost:8080/api/averageRating/${location}`, {
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
      setAverageRating(data.averageRating);
      setError(null);
    } catch (error) {
      setError('Error retrieving average rating');
      console.error('Error retrieving average rating:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 rounded-md shadow-md mb-8 w-2/4 mx-auto my-14" style={{backgroundColor: '#F6FCFF'}}>
      <h2 className="text-3xl mb-4 text-center font-semibold">Find Your Desired Place</h2>
      <div className="mb-4 text-center">
        <label className="text-gray-600 mr-4">Location:</label>
        <input
          className="border border-gray-300 p-2 rounded"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <div className="mb-4 text-center">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleAverageRatingSubmit}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Get Average Rating'}
        </button>
      </div>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {averageRating !== null && (
        <div>
          <p className="text-gray-600 mb-2">Average Rating for {location}:</p>
          <StarRating rating={averageRating} />
          <p className="text-2xl font-bold">{averageRating.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

const AllAverageRatingsComponent = () => {
  const [allAverageRatings, setAllAverageRatings] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllAverageRatings = async () => {
      try {
        // Replace the API endpoint with your actual endpoint
        const response = await fetch('http://localhost:8080/api/averageRatings', {
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
        setAllAverageRatings(data);
        setError(null);
      } catch (error) {
        setError('Error retrieving average ratings');
        console.error('Error retrieving average ratings:', error);
      }
    };

    fetchAllAverageRatings();
  }, []);

  const handleShowPosts = (location) => {
    console.log(location);

    // Navigate to the PostByLocation component with the selected location
    navigate(`/posts/${encodeURIComponent(location)}`);
  };

  return (
    <div className=" p-8 rounded-md shadow-md mx-auto w-2/5" style={{backgroundColor: '#F6FCFF'}}>
      <h2 className="text-3xl mb-4 text-center font-semibold">Top Rated:</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {allAverageRatings.map((avgRating) => (
        <div key={avgRating.location} className="mb-4">
          
          <p className="text-gray-600 text-xl font-bold">{avgRating.location}</p>
          <StarRating rating={avgRating.averageRating} />
    
          <div className="flex gap-x-96">
            <p className="text-2xl font-bold">{avgRating.averageRating.toFixed(2)}</p>
            <button
              className="button bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => handleShowPosts(avgRating.location)}
            >
              Show Post
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const CombinedComponent = () => {
  return (
    <>
      <div
      className="container  min-h-screen min-w-full"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Navbar/>
    <div className="flex flex-col items-center">
      
      <AverageRatingComponent />
      <AllAverageRatingsComponent />
    </div>
    </div>
    </>
  );
};

export default CombinedComponent;
