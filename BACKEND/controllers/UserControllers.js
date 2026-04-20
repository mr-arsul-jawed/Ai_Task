import User from "../model/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import crypto from "crypto";
import nodemailer from "nodemailer";



// SIGNUP
export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;


        // 🔹 Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // 🔹 Email validation
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
            }

        // 🔹 Password validation
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
            }


        // Check user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400)
            .json({
                 message: "User already exists" 
                });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });


       

        res.cookie("token", jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET, 
            { expiresIn: "1d" }
        ), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        res.status(201)
        .json({ 
            message: "User registered",
            user:{
                id: user._id,
                name: user.name,
                email: user.email
            }
         });

    } catch (error) {
        res.status(500)
        .json({ 
            error: error.message 
        });
    }
};


// LOGIN
export const login =  async (req, res) => {
    try {
        const { email, password } = req.body;

         // 🔹 Basic validation
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // 🔹 Email format validation
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        // Check user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400)
            .json({ 
                message: "Invalid credentials"
             });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400)
            .json({ 
                message: "Invalid credentials" 
            });
        }

        // Create token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });
        res.json({ 
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
         });

    } catch (error) {
        res.status(500)
        .json({ 
            error: error.message 
        });
    }
};

export const logout = async (req, res) => {
        try {
        // 🔹 Clear cookie
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        // 🔹 Response
        res.status(200).json({
            message: "Logout successful"
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // 1. Create reset token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // 2. Hash token and store in DB
        user.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min

        await user.save();

        // 3. Reset URL (frontend link)
        // const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;


        // In production, we should use the actual frontend URL from environment variables

        const FRONTEND_URL =
        process.env.NODE_ENV === "production"
            ? process.env.WEB_CLIENT_URL
            : "http://localhost:3000";

        const resetUrl = `${FRONTEND_URL}/reset-password/${resetToken}`;

        // 4. Send email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            to: user.email,
            subject: "Password Reset Request",
            html: `
                <div style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:20px 0;">
                    <tr>
                    <td align="center">

                        <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; padding:30px; box-shadow:0 4px 10px rgba(0,0,0,0.08);">

                        <!-- HEADER -->
                        <tr>
                            <td align="center">
                            <h2 style="margin:0; color:#222;">AI Task App</h2>
                            <p style="margin:5px 0 20px; color:#888; font-size:13px;">
                                Secure Account Services
                            </p>
                            </td>
                        </tr>

                        <!-- TITLE -->
                        <tr>
                            <td>
                            <h3 style="color:#333; text-align:center; margin-bottom:10px;">
                                Reset Your Password
                            </h3>
                            </td>
                        </tr>

                        <!-- MESSAGE -->
                        <tr>
                            <td>
                            <p style="color:#555; font-size:14px;">
                                Hi ${user.name || "User"},
                            </p>

                            <p style="color:#555; font-size:14px;">
                                We received a request to reset your password for your AI Task App account.
                            </p>

                            <p style="color:#555; font-size:14px;">
                                Click the button below to set a new password. This link is valid for <strong>15 minutes</strong>.
                            </p>
                            </td>
                        </tr>

                        <!-- BUTTON -->
                        <tr>
                            <td align="center" style="padding:25px 0;">
                            <a href="${resetUrl}"
                                style="
                                background-color:#4CAF50;
                                color:#ffffff;
                                padding:12px 24px;
                                text-decoration:none;
                                border-radius:6px;
                                font-size:16px;
                                font-weight:bold;
                                display:inline-block;
                                ">
                                Reset Password
                            </a>
                            </td>
                        </tr>

                        <!-- FALLBACK LINK -->
                        <tr>
                            <td>
                            <p style="font-size:12px; color:#666; word-break:break-all;">
                                If the button doesn’t work, copy and paste this link into your browser:
                                <br/>
                                <a href="${resetUrl}" style="color:#4CAF50;">${resetUrl}</a>
                            </p>
                            </td>
                        </tr>

                        <!-- SECURITY NOTE -->
                        <tr>
                            <td>
                            <p style="color:#999; font-size:12px;">
                                ⚠️ If you did not request a password reset, please ignore this email. Your account remains secure.
                            </p>
                            </td>
                        </tr>

                        <!-- SUPPORT -->
                        <tr>
                            <td>
                            <p style="color:#999; font-size:12px;">
                                Need help? Contact our support team:
                                <a href="arsh49760@gmail.com" style="color:#4CAF50;">
                                support@aitaskapp.com
                                </a>
                            </p>
                            </td>
                        </tr>

                        <!-- FOOTER -->
                        <tr>
                            <td>
                            <hr style="margin:20px 0; border:none; border-top:1px solid #eee;" />
                            <p style="color:#aaa; font-size:11px; text-align:center;">
                                © ${new Date().getFullYear()} AI Task App. All rights reserved.
                            </p>
                            </td>
                        </tr>

                        </table>

                    </td>
                    </tr>
                </table>
                </div>
                `
        });

        res.json({
            message: "Reset link sent to email"
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired token"
            });
        }

        // update password
        user.password = await bcrypt.hash(password, 10);

        // clear reset fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.json({
            message: "Password reset successful"
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};




    
         




// LOGOUT - We will handle token invalidation on the frontend by clearing the cookie. 
// The backend will just clear the cookie and return a success message. In production,
//  we should also consider implementing token blacklisting for better security.

// export const logout = (req, res) => {
//     try {
//         const token = req.params.token;

//         // ❌ Case 1: No token provided
//         if (!token) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Token is required"
//             });
//         }

//         // ❌ Case 2: Invalid token
//         let decoded;
//         try {
//             decoded = jwt.verify(token, process.env.JWT_SECRET);
//         } catch (err) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Invalid or expired token"
//             });
//         }

//         // ✅ Success case
//         res.clearCookie("token");

//         return res.status(200).json({
//             success: true,
//             message: "Logout successful",
//             user: decoded
//         });

//     } catch (error) {
//         // ❌ Unexpected error
//         return res.status(500).json({
//             success: false,
//             message: "Internal server error",
//             error: error.message
//         });
//     }
// };