import express from "express";
import authMiddleware from "../middleware/authmiddleware.js";
import { createTask,getAllTasks,updateTask,deleteTask } from "../controllers/TaskControllers.js";

const router = express.Router();

// router.use(authMiddleware);

// CREATE TASK
router.post("/createtask", authMiddleware, createTask);


// GET ALL TASKS (only user tasks)
router.get("/alltasks", authMiddleware, getAllTasks);


// UPDATE TASK
router.put("/updatetask/:id", authMiddleware, updateTask);


// DELETE TASK
router.delete("/deletetask/:id", authMiddleware, deleteTask);





export default router;