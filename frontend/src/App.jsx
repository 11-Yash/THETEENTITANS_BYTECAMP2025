import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
// import Donate from "./components/Donate";
// import NGOs from "./components/NGOs";
import DonorLogin from "./components/DonorLogin";
import DonorRegistration from "./components/DonorRegistration";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/donate" element={<Donate />} /> */}
      <Route path="/donorregister" element={<DonorRegistration />} />
      <Route path="/donorlogin" element={<DonorLogin />} />
    </Routes>
  );
};

export default App;
