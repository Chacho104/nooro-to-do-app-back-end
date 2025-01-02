// Handler layer: handles validation of requests, parsing of inputs, formatting of respones, and handling of errors
import { NextFunction, Request, Response } from "express";
import { HttpError } from "../models/http-error";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get All Tasks
export const getAllTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Access query parameters for pagination
  const page = Number(req.query.page) || 1; // Default to page 1
  const pageSize = Number(req.query.pageSize) || 5; // Default to 5 items per page

  // Get count of all tasks
  let totalCount;
  try {
    totalCount = await prisma.task.count();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later.",
      500
    );
    return next(error);
  }

  // Get count of completed tasks
  let completedCount;
  try {
    completedCount = await prisma.task.count({
      where: { completed: true },
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later.",
      500
    );
    return next(error);
  }

  // Get tasks based on pagination params passed in
  let tasks;
  try {
    tasks = await prisma.task.findMany({
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later.",
      500
    );
    return next(error);
  }

  if (!tasks) {
    const error = new HttpError("Could not fetch tasks!", 400);
    return next(error);
  }

  res
    .status(200)
    .json({ tasks: tasks, total: totalCount, completed: completedCount });
};

// Get single task by taskId
export const getTaskById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const taskId = req.params.taskId;

  let task;
  try {
    task = await prisma.task.findUnique({
      where: { id: taskId },
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find the task!",
      500
    );
    return next(error);
  }

  res.status(200).json({ data: task });
};

// Create a task
export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Extract and validate data coming in through the request body
  const { title, color } = req.body;

  // Can perform better validation than this...express-validator
  if (!title || typeof title !== "string") {
    const error = new HttpError("Title is required and must be a string.", 400);
    return next(error);
  }

  if (!color || typeof color !== "string") {
    const error = new HttpError("Color is required and must be a string.", 400);
    return next(error);
  }

  let newTask;

  try {
    newTask = await prisma.task.create({ data: { title, color } });
  } catch (err) {
    const error = new HttpError(
      "Could not create the task, please try again!",
      500
    );
    return next(error);
  }

  res.status(201).json({ data: newTask });
};

// Update a task
export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const taskId = req.params.taskId;

  // Extract and validate data coming in through the request body
  const { title, color, completed } = req.body;

  if (!title || typeof title !== "string") {
    const error = new HttpError("Title is required and must be a string.", 400);
    return next(error);
  }

  if (!color || typeof color !== "string") {
    const error = new HttpError("Color is required and must be a string.", 400);
    return next(error);
  }

  try {
    await prisma.task.update({
      where: { id: taskId },
      data: { title, color, completed },
    });
  } catch (err) {
    const error = new HttpError(
      "Could not update the task, please try again!",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "Task successfully updated!" });
};

// Delete a task
export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const taskId = req.params.taskId;

  try {
    await prisma.task.delete({ where: { id: taskId } });
  } catch (err) {
    const error = new HttpError(
      "Could not delete the task, please try again!",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "Task successfully deleted!" });
};
