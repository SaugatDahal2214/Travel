import React from "react";
import trekkingTalesLogo from "../../assets/logo.png";

function Navbar() {
  return (
    <nav className="bg-white-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-semibold mx-10">
        <div className="flex justify-center items-center px-6 ">
        <div className="flex items-center mt-8">
          <img
            src={trekkingTalesLogo}
            className="image w-16 h-16 mr-2 rounded-full"
            alt="Trekking Tales Logo"
          />
          <h1 className="title-logo text-3xl font-bold text-gray-800 ">Trekking Tales</h1>
        </div>
        {/* You can add additional elements or links on the right side if needed */}
      </div>
        </div>
        <ul className="flex space-x-10">
          <li>
            <a href="/home" className="text-black hover:text-blue-200">
              Home
            </a>
          </li>
          <li>
            <a href="/recommendation" className="text-black hover:text-blue-200">
              Recommendation
            </a>
          </li>
          <li>
            <a
              href="/map"
              target="#"
              className="text-black hover:text-blue-200"
            >
              Map
            </a>
          </li>
          <li>
            <a href="/itinerary" className="text-black hover:text-blue-200">
              Itinerary
            </a>
          </li>
          <li>
            <a href="/profile" className="text-black hover:text-blue-200">
              Profile
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
