import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createTask);
router.get("/:projectId", getTasksByProject);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
