import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../css/signup.css"; // You can rename login.css to auth.css to use for both

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigation = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  const handleSignup = async () => {
    try {
      setErrorMsg("");
      await axios.post(`${API}/api/users/signup`, {
        name,
        email,
        password,
      },{withCredentials: true});

      alert("Signup Successful");
      // console.log("Signup Successful");
      navigation("/login");
    } catch (err) {
    let message = "An error occurred. Please try again.";

    if (err.response?.data?.message) {
      message = err.response.data.message;
    } else if (!err.response) {
      message = "Server not responding.";
    }

    setErrorMsg(message);
    console.error("Signup Error:", err);
  }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p>Join us and manage your tasks smarter.</p>
        
        <div className="input-group">
          <input 
            className="auth-input"
            placeholder="Full Name" 
            onChange={(e) => setName(e.target.value)} 
          />
          <input 
            className="auth-input"
            placeholder="Email" 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            className="auth-input"
            placeholder="Password" 
            type="password" 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>

        <button className="btn-auth-submit" onClick={handleSignup}>
          Sign Up
        </button>

        {errorMsg && <p style={{ color: "red", marginTop: "10px" }}>{errorMsg}</p>}

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;