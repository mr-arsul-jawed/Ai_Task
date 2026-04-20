import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./router/UserRoute.js";
import taskRoutes from "./router/TaskRoute.js";
import cookieParser from "cookie-parser";

dotenv.config({

});

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.WEB_CLIENT_URL
].map(origin => origin?.replace(/\/$/, "")); // 🔥 remove trailing slash

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.replace(/\/$/, "");

    if (allowedOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin); // 🔍 debug
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// app.use(cors({
//   origin: allowedOrigins,
//   credentials: true
// }));

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