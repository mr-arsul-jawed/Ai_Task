import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/login.css"; // Make sure the path is correct

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigation = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  const handleLogin = async () => {
    setErrorMsg("");
    try {
      const res = await axios.post(`${API}/api/users/login`, {
        email,
        password,
      },{withCredentials: true});

      localStorage.setItem("token", res.data.token);
      alert("Login Successful");
      navigation("/dashboard");
    } catch (err) {
      // alert("Login Failed");
      let message = "An error occurred. Please try again.";
      if (err.response?.data?.message) {
        message = err.response.data.message;
        alert(message);
      } else if (!err.response) {
        message = "Server not responding.";
        alert(message);
      }
      setErrorMsg(message);
      console.error("Login error:", err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p>Please enter your details to login.</p>
        
        <div className="input-group">
          <input 
            className="login-input"
            placeholder="Email" 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            className="login-input"
            placeholder="Password" 
            type="password" 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>

        <button className="btn-login-submit" onClick={handleLogin}>
          Login
        </button>

        <p>
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;