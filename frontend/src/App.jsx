import { Routes, Route } from "react-router-dom";
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
import CampaignDetails from './components/CampaignDetails';


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/donate" element={<Donate />} /> */}
      <Route path="/donorregister" element={<DonorRegistration />} />
      <Route path="/donorlogin" element={<DonorLogin />} />
      <Route path="/ngo/register" element={<NGORegistration />} />
      <Route path="/ngo/login" element={<NGOLogin />} />
      <Route path="/ngo/verify" element={<NGOVerification />} />
      <Route path="/verification-pending" element={<VerificationPending />} />
      <Route path="/ngo/ngo-dashboard" element={<NGODashboard />} />
      <Route path="/ngo/campaign-details" element={<CampaignDetails />} />
    </Routes>
  );
};

export default App;
