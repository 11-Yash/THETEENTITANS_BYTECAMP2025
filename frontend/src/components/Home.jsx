import React from 'react';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/helping-hands.jpg';
import Navbar from './Navbar';
import Footer from './Footer';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <main className="flex-grow">
        <div className="relative h-screen w-full overflow-hidden">
          {/* Background image */}
          <div 
            className="absolute inset-0 bg-cover bg-center z-0" 
            style={{ 
              backgroundImage: `url(${backgroundImage})`, 
              filter: "brightness(0.6)" 
            }}
          />

          {/* Hero content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4 md:px-8">
            <div className="max-w-4xl text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Transparent Giving, Visible Impact</h1>
              
              <p className="text-xl md:text-2xl mb-8">
                Connect directly with NGOs and track how your donations make a difference.
                Our platform ensures full transparency in fund management.
              </p>
              
              <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
                <Link 
                  to="/donorlogin" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Login as Donor
                </Link>
                
                <Link 
                  to="/ngo/login" 
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Login as NGO
                </Link>
              </div>
              
              <div className="mt-8">
                <p className="mb-4">New to our platform?</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link 
                    to="/donorregister" 
                    className="border-2 border-blue-400 hover:border-blue-500 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
                  >
                    Register as Donor
                  </Link>
                  
                  <Link 
                    to="/ngo/register" 
                    className="border-2 border-green-400 hover:border-green-500 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
                  >
                    Register as NGO
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;