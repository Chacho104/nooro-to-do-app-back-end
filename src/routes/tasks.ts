import { Router } from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTask,
} from "../controllers/tasks";

const tasksRouter = Router();

// GET /tasks
tasksRouter.get("/tasks", getAllTasks);

// GET /tasks/:taskId
tasksRouter.get("/tasks/:taskId", getTaskById);

// POST /tasks
tasksRouter.post("/tasks", createTask);

// PUT /tasks/:taskId
tasksRouter.put("/tasks/:taskId", updateTask);

// DELETE /tasks/:taskId
tasksRouter.delete("/tasks/:taskId", deleteTask);

export default tasksRouter;
