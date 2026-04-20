import express from "express";
import { signup, login, logout, forgotPassword, resetPassword } from "../controllers/UserControllers.js";


const router = express.Router();

// SIGNUP
router.post("/signup", signup);

// LOGIN
router.post("/login", login);


// LOGOUT
router.post("/logout", logout);

// FORGOT PASSWORD & RESET PASSWORD
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);











//---------------------------------------------------------------------------------------------------------------
// Is this route necessary? We can handle missing token case in frontend by checking if cookie exists before making logout request. 
// If we want to keep it, we should also handle the case where token is provided but invalid/expired. 
// For now, I will comment it out and we can revisit later if needed.

// // ❗ Catch missing token
// router.post("/logout", (req, res) => {
//     return res.status(400).json({
//         success: false,
//         message: "Token is required in URL. Use /logout/:token"
//     });
// });

export default router;