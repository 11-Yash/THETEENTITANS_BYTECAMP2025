import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">About Us</h3>
            <p className="text-gray-400">
              Connecting donors with NGOs to create meaningful impact through transparent giving.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white">About Us</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-400 hover:text-white">How It Works</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">For NGOs</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/ngo-register" className="text-gray-400 hover:text-white">Register NGO</Link>
              </li>
              <li>
                <Link to="/ngo-login" className="text-gray-400 hover:text-white">NGO Login</Link>
              </li>
              <li>
                <Link to="/ngo-guidelines" className="text-gray-400 hover:text-white">Guidelines</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">For Donors</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/donor-register" className="text-gray-400 hover:text-white">Register</Link>
              </li>
              <li>
                <Link to="/donor-login" className="text-gray-400 hover:text-white">Login</Link>
              </li>
              <li>
                <Link to="/donation-guide" className="text-gray-400 hover:text-white">How to Donate</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-400">
            © {new Date().getFullYear()} NGO Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 