import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/login.css"; // Make sure the path is correct

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API}/api/users/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      // alert("Login Successful");
      navigation("/dashboard");
    } catch (err) {
      // alert("Login Failed");
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