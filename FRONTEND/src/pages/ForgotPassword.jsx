import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");

    const API = import.meta.env.VITE_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${API}/api/forgot-password`,{
                email
            });

            alert(res.data.message);

        } catch (err) {
            alert(err.response.data.message);
        }
    };

    return (
        <div>
            <h2>Forgot Password</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter email"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <button type="submit">Send Reset Link</button>
            </form>
        </div>
    );
}