import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
// import Donate from "./components/Donate";
// import NGOs from "./components/NGOs";
import DonorLogin from "./components/DonorLogin";
import DonorRegistration from "./components/DonorRegistration";
import NGORegistration from "./components/NGORegistration";
import NGOLogin from "./components/NGOLogin";
import NGOVerification from "./components/NGOVerification";
import VerificationPending from "./components/VerificationPending";
import NGODashboard from './components/NGODashboard';
import NGOCampaigns from './components/NGOCampaigns';
import NGONewCampaign from './components/NGONewCampaign';
import NGOAddExpense from './components/NGOAddExpense';
import NGOStatistics from './components/NGOStatistics';
import NGOTransactions from './components/NGOTransactions';
import CampaignDetails from './components/CampaignDetails';
import DonorDashboard from './components/DonorDashboard';
import DiscoverNGOs from './components/DiscoverNGOs';
import NGODetails from './components/NGODetails';

// Protected Route Component
const ProtectedRoute = ({ children, userType }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const currentUserType = localStorage.getItem('userType');

  if (!isLoggedIn || currentUserType !== userType) {
    // Redirect to appropriate login page
    return <Navigate to={userType === 'donor' ? '/donorlogin' : '/ngo/login'} />;
  }

  return children;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/donate" element={<Donate />} /> */}
      <Route path="/donorregister" element={<DonorRegistration />} />
      <Route path="/donorlogin" element={<DonorLogin />} />
      <Route path="/ngo/register" element={<NGORegistration />} />
      <Route path="/ngo/login" element={<NGOLogin />} />
      
      {/* Protected NGO Routes */}
      <Route path="/ngo/verify" element={
        <ProtectedRoute userType="ngo">
          <NGOVerification />
        </ProtectedRoute>
      } />
      <Route path="/verification-pending" element={
        <ProtectedRoute userType="ngo">
          <VerificationPending />
        </ProtectedRoute>
      } />

      {/* NGO Dashboard and its nested routes */}
      <Route path="/ngo/ngo-dashboard/*" element={
        <ProtectedRoute userType="ngo">
          <Routes>
            <Route path="/" element={<NGODashboard />} />
            <Route path="campaigns" element={<NGOCampaigns />} />
            <Route path="campaigns/new" element={<NGONewCampaign />} />
            <Route path="campaigns/:id" element={<CampaignDetails />} />
            <Route path="expenses/add" element={<NGOAddExpense />} />
            <Route path="statistics" element={<NGOStatistics />} />
            <Route path="transactions" element={<NGOTransactions />} />
          </Routes>
        </ProtectedRoute>
      } />

      {/* Protected Donor Routes */}
      <Route path="/donor/dashboard/*" element={
        <ProtectedRoute userType="donor">
          <DonorDashboard />
        </ProtectedRoute>
      } />

      <Route path="/discover-ngos" element={<DiscoverNGOs />} />
      <Route path="/donor/dashboard/ngo/:id" element={<NGODetails />} />
    </Routes>
  );
};

export default App;
