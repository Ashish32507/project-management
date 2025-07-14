import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

const ProjectDetails = () => {
  const { id } = useParams(); // project ID
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "todo",
  });

  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTasks = async () => {
    try {
      const res = await API.get(`/tasks/${id}`, {
        params: {
          status: statusFilter || undefined,
          page,
          limit,
        },
      });
      setTasks(res.data.tasks);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      alert("Failed to fetch tasks");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [id, statusFilter, page]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await API.post("/tasks", {
        ...form,
        projectId: id,
      });
      setForm({ title: "", description: "", dueDate: "", status: "todo" });
      fetchTasks();
    } catch (err) {
      alert("Failed to create task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await API.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch {
      alert("Failed to delete task");
    }
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await API.put(`/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch {
      alert("Failed to update task");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Project Tasks</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-blue-500"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Filter */}
      <div className="mb-4">
        <select
          value={statusFilter}
          onChange={(e) => {
            setPage(1); // reset to first page when filter changes
            setStatusFilter(e.target.value);
          }}
          className="p-2 border rounded"
        >
          <option value="">All</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      {/* Task Creation Form */}
      <form
        onSubmit={handleCreateTask}
        className="bg-white p-4 rounded shadow mb-6"
      >
        <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <button className="bg-blue-600 text-white py-2 px-4 rounded">
          Add Task
        </button>
      </form>

      {/* Task List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div key={task._id} className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold text-lg">{task.title}</h3>
            <p className="text-sm text-gray-600">{task.description}</p>
            <p className="text-sm text-gray-500">
              Due: {task.dueDate?.split("T")[0]}
            </p>

            <div className="flex justify-between items-center mt-4">
              <select
                value={task.status}
                onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                className="p-1 border rounded text-sm"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <button
                onClick={() => handleDeleteTask(task._id)}
                className="text-red-500 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-10 gap-2">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProjectDetails;
