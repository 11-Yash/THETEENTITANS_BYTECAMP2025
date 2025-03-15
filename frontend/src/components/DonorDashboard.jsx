import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DonorNavbar from './DonorNavbar';
import DiscoverNGOs from './DiscoverNGOs';
import DonationHistory from './DonationHistory';
import NGODetails from './NGODetails';

const DonorDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <DonorNavbar />
      
      <div className="pt-16 pb-8">
        <Routes>
          {/* Default route redirects to discover NGOs */}
          <Route path="/" element={<Navigate to="/donor/dashboard/discover" replace />} />
          <Route path="/discover" element={<DiscoverNGOs />} />
          <Route path="/history" element={<DonationHistory />} />
          <Route path="/ngo/:ngoId" element={<NGODetails />} />
          <Route path="*" element={<Navigate to="/donor/dashboard/discover" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default DonorDashboard; 