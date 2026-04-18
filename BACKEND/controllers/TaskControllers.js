import Task from "../model/TaskModel.js";
import User from "../model/UserModel.js";



// CREATE TASK
export const createTask = async (req, res) => {
    try {
        const { title, description } = req.body;

        const task = await Task.create({
            title,
            description,
            user: req.user
        });
        
        // await task.save();
        res.status(201)
        .json({
           "message": "Task created",
            task,
         });
    } catch (error) {
        res.status(500)
        .json({ 
            error: error.message 
        });
    }
};


// GET ALL TASKS (only user tasks)
export const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user });
        const user = await User.findById(req.user);
        res.json({
            message: "Tasks retrieved",
            tasks,
            user: user.name
        });

  
    } catch (error) {
        res.status(500)
        .json({ 
            error: error.message 
        });
    }
};


// UPDATE TASK
export const updateTask = async (req, res) => {
    try {
        let { status } = req.body;

        // ❌ Check required
        if (!status) {
            return res.status(400)
            .json({
                success: false,
                message: "Status is required"
            });
        }

        // ✅ Normalize input
        status = status.toLowerCase().trim();

        // ✅ Get enum values from model (no hardcode)
        const validStatus = Task.schema.path("status").enumValues;

        if (!validStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Allowed: ${validStatus.join(", ")}`
            });
        }

        // ✅ Secure update (only user's task)
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user },
            { status },
            { new: true, runValidators: true }
        );

        // ❌ Not found
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found or not authorized"
            });
        }

   
        // ✅ Success
        res.json({
            success: true,
            message: "Task status updated",
            task
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// DELETE TASK
export const deleteTask = async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);

        if (!deletedTask) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        res.json({
            success: true,
            message: "Task deleted successfully",
            deletedTask: deletedTask
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
