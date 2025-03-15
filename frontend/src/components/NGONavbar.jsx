import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NGONavbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/ngo/dashboard" className="text-white font-bold text-xl">
              NGO Dashboard
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link 
                to="/ngo/dashboard/campaigns/new" 
                className={`${
                  location.pathname === '/ngo/dashboard/campaigns/new' 
                    ? 'bg-blue-600' 
                    : 'text-white hover:bg-blue-600'
                } px-3 py-2 rounded-md text-sm font-medium transition-colors`}
              >
                Start a Campaign
              </Link>
              <Link 
                to="/ngo/dashboard/campaigns" 
                className={`${
                  location.pathname === '/ngo/dashboard/campaigns' 
                    ? 'bg-blue-600' 
                    : 'text-white hover:bg-blue-600'
                } px-3 py-2 rounded-md text-sm font-medium transition-colors`}
              >
                Campaigns
              </Link>
              <Link 
                to="/ngo/dashboard/statistics" 
                className={`${
                  location.pathname === '/ngo/dashboard/statistics' 
                    ? 'bg-blue-600' 
                    : 'text-white hover:bg-blue-600'
                } px-3 py-2 rounded-md text-sm font-medium transition-colors`}
              >
                Statistics
              </Link>
              <Link 
                to="/ngo/dashboard/transactions" 
                className={`${
                  location.pathname === '/ngo/dashboard/transactions' 
                    ? 'bg-blue-600' 
                    : 'text-white hover:bg-blue-600'
                } px-3 py-2 rounded-md text-sm font-medium transition-colors`}
              >
                Transactions
              </Link>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/ngo/login';
                }}
                className="text-white hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
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

export default NGONavbar; 