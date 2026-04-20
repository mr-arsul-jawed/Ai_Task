import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../css/resetPass.css"

export default function ResetPassword() {
    const { token } = useParams();
    const [password, setPassword] = useState("");

    const API = import.meta.env.VITE_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.put(
                `${API}/api/users/reset-password/${token}`,
                { password }
            );

            alert(res.data.message);

        } catch (err) {
            alert(err.response.data.message);
        }
    };

    return (
        <div className="reset-password-container"> {/* Unique wrapper */}
        <h2>Reset Password</h2>

        <form onSubmit={handleSubmit} className="reset-password-form">
            <input
                type="password"
                placeholder="New Password"
                required
                onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">Reset Password</button>
        </form>
    </div>
    );
}