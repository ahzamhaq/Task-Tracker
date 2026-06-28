import Task from "../models/Task.js";
import { ApiError, asyncHandler } from "../utils/ApiError.js";

const buildQuery = (req) => {
  const { status, priority, category, search } = req.query;
  const query = {};
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (category) query.category = category;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }
  return query;
};

const sortMap = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  due: { dueDate: 1 },
  priority: { priority: -1 },
  title: { title: 1 },
};

export const listTasks = asyncHandler(async (req, res) => {
  const query = buildQuery(req);
  const sort = sortMap[req.query.sort] || sortMap.newest;
  const tasks = await Task.find(query).sort(sort);
  res.json(tasks);
});

export const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new ApiError(404, "Task not found");
  res.json(task);
});

export const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json(task);
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!task) throw new ApiError(404, "Task not found");
  res.json(task);
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) throw new ApiError(404, "Task not found");
  res.json({ message: "Task removed", id: req.params.id });
});
