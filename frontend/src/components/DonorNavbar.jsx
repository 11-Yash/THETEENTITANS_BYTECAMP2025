import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const DonorNavbar = () => {
  const location = useLocation();
  const donorName = localStorage.getItem('donorName') || 'Donor';

  const handleLogout = () => {
    localStorage.removeItem('donorToken');
    localStorage.removeItem('donorName');
    window.location.href = '/donorlogin';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/donor/dashboard" className="text-white font-bold text-xl">
              Donor Dashboard
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link 
                to="/donor/dashboard/discover" 
                className={`${
                  location.pathname === '/donor/dashboard/discover' 
                    ? 'bg-blue-600' 
                    : 'text-white hover:bg-blue-600'
                } px-3 py-2 rounded-md text-sm font-medium transition-colors`}
              >
                Discover NGOs
              </Link>
              <Link 
                to="/donor/dashboard/history" 
                className={`${
                  location.pathname === '/donor/dashboard/history' 
                    ? 'bg-blue-600' 
                    : 'text-white hover:bg-blue-600'
                } px-3 py-2 rounded-md text-sm font-medium transition-colors`}
              >
                Donation History
              </Link>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-4">
              <span className="text-white">Welcome, {donorName}</span>
              <button
                onClick={handleLogout}
                className="text-white hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DonorNavbar; 