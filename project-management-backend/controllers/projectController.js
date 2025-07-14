import Project from "../models/Project.js";

export const createProject = async (req, res) => {
  const { title, description, status } = req.body;
  const userId = req.user.id;

  try {
    const project = await Project.create({
      title,
      description,
      status,
      user: userId,
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Failed to create project" });
  }
};

export const getUserProjects = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // default page 1
  const limit = parseInt(req.query.limit) || 6; // default 6 per page
  const skip = (page - 1) * limit;

  try {
    const totalProjects = await Project.countDocuments({ user: req.user.id });

    const projects = await Project.find({ user: req.user.id })
      .sort({ createdAt: -1 }) // optional: sort latest first
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalProjects / limit);

    res.json({
      projects,
      currentPage: page,
      totalPages,
      totalProjects,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

export const updateProject = async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  try {
    const updated = await Project.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { title, description, status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Project not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update project" });
  }
};

export const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Project.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });
    if (!deleted) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete project" });
  }
};
