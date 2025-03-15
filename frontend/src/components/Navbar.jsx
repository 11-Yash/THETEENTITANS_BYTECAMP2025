import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-white font-bold text-xl">
              NGO Platform
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link to="/" className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link to="/about" className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                About
              </Link>
              <Link to="/how-it-works" className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                How It Works
              </Link>
              <Link to="/contact" className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                Contact
              </Link>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-4">
              <Link to="/donorlogin" className="text-white hover:bg-blue-700 bg-blue-600 px-4 py-2 rounded-md text-sm font-medium">
                Login
              </Link>
              <Link to="/donorregister" className="text-white hover:bg-green-700 bg-green-600 px-4 py-2 rounded-md text-sm font-medium">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 