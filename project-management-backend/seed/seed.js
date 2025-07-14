import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import User from "../models/User.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Task.deleteMany();
    await Project.deleteMany();
    await User.deleteMany();

    // Create User
    const hashedPassword = await bcrypt.hash("Test@123", 10);
    const user = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: hashedPassword,
    });

    // Create Projects
    const project1 = await Project.create({
      title: "Project Alpha",
      description: "First test project",
      status: "active",
      user: user._id,
    });

    const project2 = await Project.create({
      title: "Project Beta",
      description: "Second test project",
      status: "completed",
      user: user._id,
    });

    const createTasks = async (projectId) => {
      await Task.create([
        {
          title: "Task 1",
          description: "First task",
          status: "todo",
          dueDate: new Date(),
          project: projectId,
        },
        {
          title: "Task 2",
          description: "Second task",
          status: "in-progress",
          dueDate: new Date(),
          project: projectId,
        },
        {
          title: "Task 3",
          description: "Third task",
          status: "done",
          dueDate: new Date(),
          project: projectId,
        },
      ]);
    };

    await createTasks(project1._id);
    await createTasks(project2._id);

    console.log("Seeding completed ✅");
    process.exit();
  } catch (err) {
    console.error("Seeding error ❌:", err);
    process.exit(1);
  }
};

seed();
