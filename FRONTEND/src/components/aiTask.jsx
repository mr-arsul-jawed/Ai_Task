import { useEffect, useState } from "react";
import axios from "axios";
import "../css/aiTask.css"; // Ensure path is correct

function AiTask() {
  const [user, setUser] = useState("");
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  

  const API = import.meta.env.VITE_API_URL;
  const BASE = `${API}/api/tasks`;
  const cfg = { withCredentials: true }; // ← one config, used everywhere
  
  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${BASE}/alltasks`, cfg);
      setTasks(Array.isArray(res.data.tasks) ? res.data.tasks : []);
      setUser(res.data.user?.name || res.data.user || "User");
    } catch (err) {
      if (err.response?.status === 401) window.location.href = "/login";
      setTasks([]);
    }
  };
 useEffect(() => { fetchTasks(); }, []);

  const createTask = async () => {
    if (!title) return alert("Title required");
    await axios.post(`${BASE}/createtask`, { title, description }, cfg);
    setTitle(""); setDescription(""); fetchTasks();
  };


  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${BASE}/updatetask/${id}`, { status }, cfg);
      fetchTasks();
    } catch { alert("Update failed"); }
  };

  const deleteTask = async (id) => {
    await axios.delete(`${BASE}/deletetask/${id}`, cfg);
    fetchTasks();
  };

  const logout = async () => {
    await axios.post(`${API}/api/auth/logout`, {}, cfg);
    window.location.href = "/login";
  };
  
  return (
    <div className="dashboard-container">
      <nav className="dash-nav">
        <h2><span>Welcome, {user} </span></h2>
        {/* <button className="btn-logout" onClick={logout}>Logout</button> */}
      </nav>

      <div className="dash-content">
        {/* CREATE TASK */}
        <div className="create-task-card">
          <input
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button className="btn-add" onClick={createTask}>Add Task</button>
        </div>

        {/* TASK LIST */}
        <div className="tasks-grid">
          {tasks.map((task) => (
            <div key={task._id} className="task-card">
              <div className="task-info">
                <h4>
                  {task.title} 
                  <span className={`status-tag status-${task.status}`}>
                    {task.status}
                  </span>
                </h4>
                <p>{task.description}</p>
              </div>

              <div className="task-actions">
                <button className="btn-action" onClick={() => updateStatus(task._id, "pending")}>Pending</button>
                <button className="btn-action" onClick={() => updateStatus(task._id, "running")}>Running</button>
                <button className="btn-action" onClick={() => updateStatus(task._id, "completed")}>Done</button>
                <button className="btn-action btn-delete" onClick={() => deleteTask(task._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AiTask;