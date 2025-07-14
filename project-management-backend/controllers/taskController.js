import Task from "../models/Task.js";
import Project from "../models/Project.js";

export const createTask = async (req, res) => {
  const { title, description, status, dueDate, projectId } = req.body;

  try {
    const project = await Project.findOne({
      _id: projectId,
      user: req.user.id,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });

    const task = await Task.create({
      title,
      description,
      status,
      dueDate,
      project: projectId,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Create Task Error:", error);
    res
      .status(500)
      .json({ message: "Failed to create task", error: error.message });
  }
};

export const getTasksByProject = async (req, res) => {
  const { projectId } = req.params;
  const { status, page = 1, limit = 6 } = req.query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  try {
    const project = await Project.findOne({
      _id: projectId,
      user: req.user.id,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });

    const filter = { project: projectId };
    if (status) filter.status = status;

    const totalTasks = await Task.countDocuments(filter);

    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(totalTasks / limitNum);

    res.json({
      tasks,
      currentPage: pageNum,
      totalPages,
      totalTasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, dueDate } = req.body;

  try {
    const task = await Task.findById(id).populate("project");
    if (!task || task.project.user.toString() !== req.user.id) {
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized" });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.dueDate = dueDate || task.dueDate;

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to update task" });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id).populate("project");
    if (!task || task.project.user.toString() !== req.user.id) {
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized" });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task" });
  }
};
