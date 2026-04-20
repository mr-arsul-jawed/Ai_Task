import { useState } from "react";
import axios from "axios";
import "../css/forgotPass.css"

export default function ForgotPassword() {
    const [email, setEmail] = useState("");

    const API = import.meta.env.VITE_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${API}/api/users/forgot-password`,{
                email
            });

            alert(res.data.message);

        } catch (err) {
            alert(err.response.data.message);
        }
    };

    return (
        <div className="forgot-password-container"> {/* Unique wrapper */}
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit} className="forgot-password-form">
            <input
                type="email"
                placeholder="Enter email"
                required // Added for basic validation
                onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">Send Reset Link</button>
        </form>
    </div>
    );
}