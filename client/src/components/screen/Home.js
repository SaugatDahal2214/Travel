import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoMdThumbsUp, IoMdThumbsDown, IoMdHeartEmpty, IoMdRemoveCircle, IoMdTrash } from "react-icons/io";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { IoMdHeart } from "react-icons/io";
// import Post from "../../assets/Messi.jpg";
import axios from "axios";
import { Navigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const PostCard = ({ props }) => {
  const [data, setData] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      Navigate("/username")(); // Corrected navigation
    }

    axios
      .get("http://localhost:8080/api/allpost", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const result = response.data;
        console.log(result);
        setData(result);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  //like post
  const likePost = (id) => {
    fetch("http://localhost:8080/api/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id === result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
        console.log(result);
      });
  };

  //unlike post
  const unlikePost = (id) => {
    fetch("http://localhost:8080/api/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id === result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
        console.log(result);
      });
  };

  //comment post
  const makeComment = (text, id) => {
    fetch("http://localhost:8080/api/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        postId: id,
        text: text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id === result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
        console.log(result);
        setComment("");
      });
  };

  //delete post
  const removePost = (postId) => {
    console.log(postId);
    fetch("http://localhost:8080/api/deletepost/" + postId, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        toast.success("Post removed.");

        setTimeout(() => {
          window.location.reload(); // Reload the page
        }, 1500);
      });
  };

  // Function to render star rating
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
    <div className="home flex justify-center items-center flex-col space-y-4 ">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <Link to="/post">
        <button className="add-btn bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md">
          {" "}
          Create Post{" "}
        </button>
      </Link>
      {data.map((post, index) => {
        // const altitudeData=post.altitudes
        const altitudeData = [
          { name: 'Starting', altitude: parseFloat(post.altitudes[0]) },
          { name: 'Peak', altitude: parseFloat(post.altitudes[1]) },
          { name: 'Ending', altitude: parseFloat(post.altitudes[2]) },
        ];
        console.log(altitudeData);
        return (
          <div
            key={index}
            className="max-w-3xl  bg-white shadow-2xl border-r-2 rounded-lg overflow-hidden"
          >
            {/* Profile image and username*/}
            <div className="Profile flex py-4 px-5 space-x-96">
              <div className="flex space-x-2">
                <img
                  className="border-r-4 h-8 w-12"
                  src={post.postedBy.profile}
                  alt="Profile"
                />
                <div className="px-4 py-2">
                  <p className="text-gray-600 text-sm font-semibold">
                    {post.postedBy ? post.postedBy.username : "Unknown User"}
                  </p>
                </div>
              </div>
              <button className="pl-24" onClick={() => removePost(post._id)}>
                <IoMdTrash className="h-10 hover:text-red-500" size={22} style={{ cursor: "pointer" }} />
              </button>
            </div>
            {/* Username */}
            {/* Image */}
            <div>
              <img src={post.imageUrl} alt="Post" className="w-full" />
            
            {altitudeData.length > 0 && (
              <div className="mt-6 ">
                <h2 className="text-xl font-semibold mb-2 text-center">Altitude Line Chart</h2>
                <LineChart width={700} height={300} data={altitudeData}>
                  <CartesianGrid stroke="#ccc" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="altitude" stroke="indigo" />
                </LineChart>
              </div>
            
            )}</div>
            {/* Caption */}
            <div className="px-4 py-2">
              <p className="text-gray-800 text-xl font-bold">{post.location}</p>
              <p className="text-gray-800 text-base">{post.description}</p>
              <p className="text-gray-800 text-base">{post.likes.length} Likes</p>
              <div className="text-gray-800 text-base">
                {renderStarRating(post.rating)}
              </div>
            </div>
            {/* Like and Comment Icons */}
            <div className="flex justify-between items-center px-4 py-2">
              <div className="flex space-x-4">
                {post.likes.includes(
                  JSON.parse(localStorage.getItem("user")).userId
                ) ? (
                  <button
                    onClick={() => {
                      unlikePost(post._id);
                    }}
                  >
                    <IoMdThumbsDown size={32} className=" text-black" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      likePost(post._id);
                    }}
                  >
                    <IoMdThumbsUp size={32}  />
                  </button>
                )}
              </div>
            </div>
            {post.comments.map((comment) => {
              return (
                <div key={comment._id} className="comm">
                  <p className="text-gray-600 text-sm font-semibold px-3">
                    {comment.postedBy ? comment.postedBy.username : ""}
                  </p>
                  <span className="commentText px-3">{comment.comment}</span>
                </div>
              );
            })}
            <div className="add-comment flex justify-between items-center px-2 py-2">
              <input
                type="text"
                placeholder="Add a comment"
                value={comment}
                className="border border-gray-300 rounded-md py-1 px-1 w-4/5 mr-2 focus:outline-none"
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                className="comment bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md"
                onClick={() => {
                  makeComment(comment, post._id);
                }}
              >
                Post
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PostCard;
