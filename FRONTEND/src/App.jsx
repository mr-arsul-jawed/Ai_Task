import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Home from "./pages/Home.jsx";

function App() {
  return (
    // <Routes>
    //   <Route path="/" element={<Home />} />
    //   <Route path="/login" element={<Login />} />
    //   <Route path="/signup" element={<Signup />} />
    //   <Route path="/dashboard" element={<Dashboard />} />
    // </Routes>
    <Routes>
    <Route path="/" element={<Home />} />

    {/* GLOBAL AUTH */}
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />

    {/* APPS */}
    <Route path="/dashboard" element={<Dashboard />} />

  </Routes>
  );
}

export default App;