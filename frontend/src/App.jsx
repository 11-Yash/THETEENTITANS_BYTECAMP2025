import { Routes, Route } from "react-router-dom";
// import Home from "./components/Home";
// import Donate from "./components/Donate";
// import NGOs from "./components/NGOs";
import Login from "./components/Login";
import Register from "./components/Register";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      {/* <Route path="/donate" element={<Donate />} /> */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default App;
