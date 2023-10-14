import React from "react";
import logo from "../assets/logo.png";

function Navbar() {
  return (
    <nav className="bg-white-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-semibold mx-10">
          <img
            src={logo}
            alt="Logo"
            className="logo h-20 border-1 rounded-full"
          ></img>
        </div>
        <ul className="flex space-x-10">
          <li>
            <a href="/home" className="text-black hover:text-blue-200">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="text-black hover:text-blue-200">
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
