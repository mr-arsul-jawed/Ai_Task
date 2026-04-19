import { useState, useEffect } from "react";
import axios from "axios";
import AiTaskApp from "../components/aiTask.jsx";
import "../css/dashboard.css"; // Ensure path is correct

function Dashboard() {
  const [user, setUser] = useState("");
  const [activeApp, setActiveApp] = useState(null);

  const token = localStorage.getItem("token");
  // console.log("Dashboard token:", token);

  const API = import.meta.env.VITE_API_URL;


  useEffect(() => {
     if (!token) return;
        axios.get(`${API}/api/tasks/alltasks`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUser(res.data.user))
      .catch(err => console.log(err));

    }, [API, token]);


    const openApp = (app) => {
      setActiveApp(app);
      localStorage.setItem("activeApp", app);
    };


  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-container">
      
      <div className="header-section">
        <h2 className="welcome-text">THE WORKSPACE</h2>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>

      <hr className="divider" />


      {/* APP SELECTOR */}
      {!activeApp && (
        <div className="app-grid">
          <button className="app-card" onClick={() => setActiveApp("ai-task")}>
            AI Task Manager
          </button>

          {/* <button className="app-card" onClick={() => openApp("ai-task")}>
            AI Task Manager
          </button> */}

          <button className="app-card" disabled>
            Chat App (Coming Soon)
          </button>
        </div>
      )}

      {/* ACTIVE APP */}
      {activeApp === "ai-task" && (
        <div className="app-content-wrapper">

          {/* <button className="back-btn" onClick={() => setActiveApp(null)}>
            ⬅ Back to Dashboard
          </button> */}

          <button
            className="back-btn"
            onClick={() => {
              setActiveApp(null);
              localStorage.removeItem("activeApp");
            }}
          >
            ⬅ Back to Dashboard
          </button>

          <AiTaskApp token={token} user={user || "Loading..."} />
        </div>
      )}
    </div>
  );
}

export default Dashboard;