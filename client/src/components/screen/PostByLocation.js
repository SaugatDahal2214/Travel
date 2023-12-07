// PostByLocation.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { IoMdThumbsUp, IoMdThumbsDown } from "react-icons/io";
import Modal from 'react-modal';
import Navbar from "./NavBar";
import UserProfile from "./UserProfile"
const backgroundImage = require('../../assets/bg-2.jpg');

const PostByLocation = () => {
  const { location } = useParams();
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [selectedUsername, setSelectedUsername] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchPostsByLocation = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/postsByLocation/${encodeURIComponent(location)}`, {
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
        setPosts(data);
        setError(null);
      } catch (error) {
        setError('Error retrieving posts by location');
        console.error('Error retrieving posts by location:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostsByLocation();
  }, [location]);

  const likePost = async (id) => {
    try {
      const response = await fetch("http://localhost:8080/api/like", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          postId: id,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
  
      // Update like count in the component state
      const updatedPosts = posts.map((post) =>
        post._id === result._id ? { ...post, likes: result.likes } : post
      );
      setPosts(updatedPosts);
  
      console.log(result);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };
  
  const unlikePost = async (id) => {
    try {
      const response = await fetch("http://localhost:8080/api/unlike", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          postId: id,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
  
      // Update like count in the component state
      const updatedPosts = posts.map((post) =>
        post._id === result._id ? { ...post, likes: result.likes } : post
      );
      setPosts(updatedPosts);
  
      console.log(result);
    } catch (error) {
      console.error("Error unliking post:", error);
    }
  };
  
  const makeComment = async (text, id) => {
    try {
      const response = await fetch("http://localhost:8080/api/comment", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          postId: id,
          text: text,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
  
      // Update comments in the component state
      const updatedPosts = posts.map((post) =>
        post._id === result._id ? { ...post, comments: result.comments } : post
      );
      setPosts(updatedPosts);
  
      console.log(result);
      setComment("");
    } catch (error) {
      console.error("Error commenting on post:", error);
    }
  };
  

  // Use useEffect to watch for changes in the data state
  useEffect(() => {
    // You can perform any additional actions here
    // when the data state changes
  }, [data]);

  const renderStarRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <span key={i} className="text-yellow-500 text-2xl">
            ★
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-300 text-2xl">
            ☆
          </span>
        );
      }
    }
    return stars;
  };

  return (
    <>
    <div
      className="container min-w-full"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
    <Navbar/>
    <div className="container mx-auto mt-8  p-4 flex-row justify-center items-center max-w-3xl">
      <div>
        <h2 className="text-3xl font-bold mb-8 text-gray-600 text-center">{`Posts for ${location}`}</h2>

        {loading && <p>Loading...</p>}

        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && posts.length === 0 && (
          <p>No posts available for this location.</p>
        )}

        {!loading && !error && posts.length > 0 && (
          <div >
            {posts
        .filter((post) => post.location === location)
        .map((filteredPost) => (
          <div key={filteredPost._id} className="post-container mb-6 p-6 shadow-lg rounded-lg" style={{backgroundColor: '#F6FCFF'}}>
            <div className="user-info mb-4 flex items-center">
            <img
                      src={filteredPost.postedBy.profile}
                      alt="User Profile"
                      className="h-8 w-8 rounded-full"
                    />
              <p className="text-gray-600 text-sm font-semibold ml-2">
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setSelectedUsername(filteredPost.postedBy.username);
                    setShowUserProfile(true);
                  }}
                >
                  {filteredPost.postedBy.username}
                </span>
                
              </p>
            </div>

                  {filteredPost.imageUrl && (
                    <img src={`http://localhost:8080/${filteredPost.imageUrl}`} alt="Post" className="w-full mb-4 rounded-md" />
                  )}

                  {filteredPost.altitudes.length > 0 && (
                    <div className="mt-6">
                      <h2 className="text-xl font-semibold mb-2 text-center">Altitude Line Chart</h2>
                      <LineChart width={700} height={300} data={filteredPost.altitudes.map((altitude, index) => ({
                        name: index === 0 ? 'Starting' : (index === 1 ? 'Peak' : 'Ending'),
                        altitude: parseFloat(altitude),
                      }))}>
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="altitude" stroke="indigo" />
                      </LineChart>
                    </div>
                  )}

                  <h3 className="text-xl font-semibold mb-2">{filteredPost.location}</h3>
                  <p className="text-base">{filteredPost.description}</p>

                  <div className="text-gray-800 text-base">
                    {renderStarRating(filteredPost.rating)}
                  </div>

                  <p className="text-base">{`${filteredPost.likes.length} Likes`}</p>

                  <div className="flex justify-between items-center px-4 py-2">
                    <div className="flex space-x-4">
                      {filteredPost.likes.includes(
                        JSON.parse(localStorage.getItem("user")).userId
                      ) ? (
                        <button
                          onClick={() => {
                            unlikePost(filteredPost._id);
                          }}
                        >
                          <IoMdThumbsDown size={32} className="text-black" />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            likePost(filteredPost._id);
                          }}
                        >
                          <IoMdThumbsUp size={32} />
                        </button>
                      )}
                    </div>
                  </div>

                  {filteredPost.comments.map((comment) => (
                    <div key={comment._id} className="comm  p-2 my-2 rounded-md" style={{backgroundColor: '#DEF1F9'}}>
                      <p className="text-gray-600 text-sm font-semibold px-3">
                        {comment.postedBy ? comment.postedBy.username : ""}
                      </p>
                      <span className="commentText">{comment.comment}</span>
                    </div>
                  ))}

                  <div className="add-comment flex justify-between items-center gap-x-10 px-2 py-2">
                    <input
                      type="text"
                      placeholder="Add a comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="p-2 border rounded-md w-full"
                    />
                    <button
                      className="comment bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md"
                      onClick={() => makeComment(comment, filteredPost._id)}
                    >
                      Post
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
    </div>
    <Modal
  isOpen={showUserProfile}
  onRequestClose={() => {
    setShowUserProfile(false);
    setSelectedUsername(null);
  }}
  contentLabel="User Details Modal"
  style={{
    overlay: {
      backgroundColor: 'rgba(1, 1, 1, 0.8)', // Adjust the overlay background color and opacity
    },
    content: {
      backgroundImage:`url(${backgroundImage})`,
      borderRadius: '10px',
      maxWidth: '700px', // Set your desired width
      margin: 'auto', // Center horizontally
      marginTop: '50px', // Add space from the top
      padding: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Adjust the box shadow
    },
  }}
>
  {selectedUsername && <UserProfile username={selectedUsername} />}
</Modal>

    </>
  );
};


export default PostByLocation;
