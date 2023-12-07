import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

/** import all components */
import Username from "./components/screen/Username";
import Password from "./components/screen/Password";
import Register from "./components/screen/Register";
import Profile from "./components/screen/Profile";
import Recovery from "./components/screen/Recovery";
import Reset from "./components/screen/Reset";
import Home from "./components/screen/Home";
import Post from "./components/screen/CreatePost";
import Map from "./components/screen/Map2";
import Itinerary from "./components/screen/Itinerary.js";
import Recommendation from "./components/screen/recommendation.js";
import PostByLocation from "./components/screen/PostByLocation.js";
import OTPVerification from "./components/screen/OTPVerification.js";
// import UserProfile from './components/screen/UserProfile';
import PageNotFound from "./components/screen/PageNotFound";
import Navbar from "./components/screen/NavBar";

/** auth middleware */
import { AuthorizeUser, ProtectRoute } from "./middleware/auth";
// import Dashboard from './components/dashboard';

/** root routes */
const router = createBrowserRouter([
  {
    path: "/",
    element: <Username></Username>,
  },
  {
    path: "/register",
    element: <Register></Register>,
  },
  {
    path: "/password",
    element: (
      <ProtectRoute>
        <Password />
      </ProtectRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <AuthorizeUser>
        <Profile />
      </AuthorizeUser>
    ),
  },
  {
    path: "/recovery",
    element: <Recovery></Recovery>,
  },
  {
    path: "/home",
    element: <Home></Home>,
  },
  {
    path: "/posts/:location",
    element: <PostByLocation></PostByLocation>,
  },

  {
    path: "/verifyEmail/:userId",
    element: <OTPVerification></OTPVerification>,
  },

  {
    path: "/post",
    element: (
      <AuthorizeUser>
        <Post />
      </AuthorizeUser>
    ),
  },

  {
    path: "/map",
    element: <Map />,
  },

  {
    path: "/recommendation",
    element: <Recommendation />,
  },
  {
    path: "/Itinerary",
    element: <Itinerary />,
  },
  {
    path: "/reset",
    element: <Reset></Reset>,
  },
  {
    path: "*",
    element: <PageNotFound></PageNotFound>,
  },
]);

export default function App() {
  return (
    <main>
      <RouterProvider router={router}></RouterProvider>
    </main>
  );
}
