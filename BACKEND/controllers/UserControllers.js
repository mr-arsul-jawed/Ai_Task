import User from "../model/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";



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