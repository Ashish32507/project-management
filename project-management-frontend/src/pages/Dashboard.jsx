import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "active",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editProjectId, setEditProjectId] = useState(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, [navigate, page]);

  const fetchProjects = async () => {
    try {
      const res = await API.get(`/projects?page=${page}&limit=${limit}`);
      setProjects(res.data.projects);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      } else {
        alert("Failed to load projects");
      }
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const res = await API.put(`/projects/${editProjectId}`, form);
        setProjects(
          projects.map((p) => (p._id === editProjectId ? res.data : p))
        );
        setIsEditing(false);
        setEditProjectId(null);
      } else {
        const res = await API.post("/projects", form);
        fetchProjects(); // refresh list
      }

      setForm({ title: "", description: "", status: "active" });
    } catch (err) {
      alert("Project creation/update failed");
    }
  };

  const handleEdit = (project) => {
    setForm({
      title: project.title,
      description: project.description,
      status: project.status,
    });
    setIsEditing(true);
    setEditProjectId(project._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    try {
      await API.delete(`/projects/${id}`);
      fetchProjects();
    } catch {
      alert("Failed to delete project");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Create / Update Project */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? "Update Project" : "Create New Project"}
        </h2>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            className="w-full md:w-1/3 p-2 border rounded"
            value={form.title}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            className="w-full md:w-1/3 p-2 border rounded"
            value={form.description}
            onChange={handleChange}
          />
          <select
            name="status"
            className="w-full md:w-1/3 p-2 border rounded"
            value={form.status}
            onChange={handleChange}
          >
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            {isEditing ? "Update" : "Create"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditProjectId(null);
                setForm({ title: "", description: "", status: "active" });
              }}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Project List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project._id}
            className="bg-white p-4 rounded shadow relative hover:shadow-lg transition"
          >
            <h3
              onClick={() => navigate(`/projects/${project._id}`)}
              className="text-lg font-semibold cursor-pointer"
            >
              {project.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">{project.description}</p>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded ${
                project.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {project.status}
            </span>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleEdit(project)}
                className="text-blue-600 text-sm"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(project._id)}
                className="text-red-500 text-sm"
              >
                ❌ Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-10 gap-2">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
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
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
