import express from "express";
import {
  createProject,
  getUserProjects,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createProject);
router.get("/", getUserProjects);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
