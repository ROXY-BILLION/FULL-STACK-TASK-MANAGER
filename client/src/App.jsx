import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTasks,
} from "react-icons/fa";
const API_URL = import.meta.env.VITE_API_URL;
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
  });

  const [editingTaskId, setEditingTaskId] = useState(null);

  // READ
  useEffect(() => {
    const getTasks = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/tasks`);

        setTasks(response.data);
      } catch (error) {
        console.error("GET TASKS ERROR:", error);
      }
    };

    getTasks();
  }, []);

  // CREATE
  const createTask = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/api/tasks`, formData);

      setTasks((prevTasks) => [
        ...prevTasks,
        response.data,
      ]);

      setFormData({
        title: "",
        description: "",
        status: "pending",
      });
    } catch (error) {
      console.error("CREATE TASK ERROR:", error);
    }
  };

  // START EDITING
  const startEditing = (task) => {
    setEditingTaskId(task._id);

    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
    });
  };

  // UPDATE
  const updateTask = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
  `${API_URL}/api/tasks/${editingTaskId}`,
  formData
);

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === editingTaskId
            ? response.data
            : task
        )
      );

      setEditingTaskId(null);

      setFormData({
        title: "",
        description: "",
        status: "pending",
      });
    } catch (error) {
      console.error("UPDATE TASK ERROR:", error);
    }
  };

  // DELETE
  const deleteTask = async (id) => {
    try {
      await axios.delete(
  `${API_URL}/api/tasks/${id}`
);

      setTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== id)
      );
    } catch (error) {
      console.error("DELETE TASK ERROR:", error);
    }
  };

  return (
    <main className="app">
      <div className="container">

        {/* HEADER */}
        <header className="header">
          <div className="header-icon">
            <FaTasks />
          </div>

          <div>
            <h1>Task Manager</h1>
            <p>Organize your work and stay productive.</p>
          </div>
        </header>

        {/* FORM CARD */}
        <section className="form-card">
          <div className="section-heading">
            <h2>
              {editingTaskId
                ? "Edit Task"
                : "Create a New Task"}
            </h2>

            <p>
              {editingTaskId
                ? "Update your task details."
                : "Add something you need to accomplish."}
            </p>
          </div>

          <form
            onSubmit={
              editingTaskId
                ? updateTask
                : createTask
            }
            className="task-form"
          >
            <div className="input-group">
              <label>Task Title</label>

              <input
                type="text"
                placeholder="e.g. Build portfolio website"
                value={formData.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  })
                }
              />
            </div>

            <div className="input-group">
              <label>Description</label>

              <textarea
                placeholder="Describe what needs to be done..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="input-group">
              <label>Status</label>

              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value,
                  })
                }
              >
                <option value="pending">
                  Pending
                </option>

                <option value="in-progress">
                  In Progress
                </option>

                <option value="completed">
                  Completed
                </option>
              </select>
            </div>

            <button
              type="submit"
              className="submit-btn"
            >
              {editingTaskId ? (
                <>
                  <FaEdit />
                  Update Task
                </>
              ) : (
                <>
                  <FaPlus />
                  Add Task
                </>
              )}
            </button>
          </form>
        </section>

        {/* TASK SECTION */}
        <section className="tasks-section">
          <div className="tasks-header">
            <h2>Your Tasks</h2>

            <span className="task-count">
              {tasks.length}{" "}
              {tasks.length === 1
                ? "Task"
                : "Tasks"}
            </span>
          </div>

          {tasks.length === 0 ? (
            <div className="empty-state">
              <FaTasks />

              <h3>No tasks yet</h3>

              <p>
                Create your first task to get started.
              </p>
            </div>
          ) : (
            <div className="tasks-grid">
              {tasks.map((task) => (
                <article
                  className="task-card"
                  key={task._id}
                >
                  <div className="task-top">
                    <span
                      className={`status ${task.status}`}
                    >
                      {task.status}
                    </span>
                  </div>

                  <h3>{task.title}</h3>

                  <p className="task-description">
                    {task.description}
                  </p>

                  <div className="task-actions">
                    <button
                      className="edit-btn"
                      onClick={() =>
                        startEditing(task)
                      }
                    >
                      <FaEdit />
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteTask(task._id)
                      }
                    >
                      <FaTrash />
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}

export default App;