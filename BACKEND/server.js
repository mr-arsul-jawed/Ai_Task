import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./router/UserRoute.js";
import taskRoutes from "./router/TaskRoute.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// Middleware
// app.use(cors());
app.use(cors({
  origin: "*"
}));
app.use(express.json());
app.use(cookieParser());

// Test Route
app.get("/", (req, res) => {
    res.send("API is running 🚀");
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));




// Routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);



// here only for testing, in production we should handle this in frontend
// app.use((req, res) => {
//     res.status(404).json({
//         success: false,
//         message: "Route not found"
//     });
// });

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});