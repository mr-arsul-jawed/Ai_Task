import { useNavigate } from "react-router-dom";
import "../css/home.css";

const Home = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleAiTaskClick = () => {
        if (token) {
            navigate("/dashboard");
        } else {
            navigate("/login");
        }
    };

    return (
        <div className="home-page">
            {/* Background decorative circles */}
            <div className="bg-circle circle-1"></div>
            <div className="bg-circle circle-2"></div>

            <div className="home-container">
                <div className="text-section">
                    <h1>My Applications</h1>
                    <p>Select an app to get started 🚀</p>
                </div>

                <div className="button-group">
                    {/* CARD 1 */}
                    <div className="app-card active-card" onClick={handleAiTaskClick}>
                        <div className="icon">🤖</div>
                        <h3>AI Task Manager</h3>
                        <p>Manage tasks with AI intelligence</p>
                        <span className="btn-label">Open App</span>
                    </div>

                    {/* CARD 2 */}
                    <div className="app-card disabled-card" onClick={() => alert("Coming Soon 🚧")}>
                        <div className="icon">⏳</div>
                        <h3>Coming Soon</h3>
                        <p>We are building something awesome</p>
                        <span className="btn-label">Locked</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;