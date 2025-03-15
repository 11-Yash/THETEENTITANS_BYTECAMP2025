import React from 'react';
import { Link,useNavigate  } from 'react-router-dom';
// Import the background image directly
import backgroundImage from '../assets/helping-hands.jpg';

const Home = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Full page background image - using imported image and inline styles for background */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ 
          backgroundImage: `url(${backgroundImage})`, 
          filter: "brightness(0.6)" 
        }}
      />

      {/* Alternative approach for background if import doesn't work */}
      {/* Uncomment this and comment the div above if needed */}
      {/* <img 
        src={backgroundImage} 
        alt="Background" 
        className="absolute inset-0 w-full h-full object-cover object-center brightness-50 z-0"
      /> */}

      {/* Content overlay */}
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
              to="/donorlogin" 
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
                to="/donorregister" 
                className="border-2 border-green-400 hover:border-green-500 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
              >
                Register as NGO
              </Link>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8">
          <div className="flex gap-8">
            <Link to="/about" className="text-white hover:text-gray-300 transition">About Us</Link>
            <Link to="/how-it-works" className="text-white hover:text-gray-300 transition">How It Works</Link>
            <Link to="/contact" className="text-white hover:text-gray-300 transition">Contact</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;