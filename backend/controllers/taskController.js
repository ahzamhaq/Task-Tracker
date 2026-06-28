import Task from "../models/Task.js";
import { ApiError, asyncHandler } from "../utils/ApiError.js";

const TRACKED_FIELDS = [
  "title",
  "description",
  "category",
  "priority",
  "status",
  "dueDate",
];

const buildQuery = (req) => {
  const { status, priority, category, search, archived } = req.query;
  const query = {};
  query.isArchived = archived === "true";
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (category) query.category = category;
  if (search) {
    const safe = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    query.$or = [
      { title: { $regex: safe, $options: "i" } },
      { description: { $regex: safe, $options: "i" } },
      { category: { $regex: safe, $options: "i" } },
    ];
  }
  return query;
};

const sortMap = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  due: { dueDate: 1, createdAt: -1 },
  priority: { priority: -1, createdAt: -1 },
  title: { title: 1 },
};

const buildDiffActivity = (existing, payload) => {
  const entries = [];
  for (const field of TRACKED_FIELDS) {
    if (!(field in payload)) continue;
    const prev = existing[field];
    const next = payload[field];
    const a = prev instanceof Date ? prev?.toISOString() : prev;
    const b = next instanceof Date ? new Date(next).toISOString() : next;
    if (a === b) continue;
    let action = "updated";
    if (field === "status") {
      action =
        next === "Completed"
          ? "completed"
          : prev === "Completed"
          ? "reopened"
          : "status_changed";
    } else if (field === "priority") action = "priority_changed";
    else if (field === "category") action = "category_changed";
    entries.push({
      action,
      field,
      previousValue: prev ?? null,
      newValue: next ?? null,
    });
  }
  return entries;
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
  const body = { ...req.body };
  delete body.activity;
  delete body.isArchived;
  const task = await Task.create({
    ...body,
    activity: [{ action: "created", newValue: body.title }],
  });
  res.status(201).json(task);
});

export const updateTask = asyncHandler(async (req, res) => {
  const existing = await Task.findById(req.params.id);
  if (!existing) throw new ApiError(404, "Task not found");

  const body = { ...req.body };
  delete body.activity;
  delete body.isArchived;

  const entries = buildDiffActivity(existing, body);
  if ("notes" in body && body.notes !== existing.notes) {
    entries.push({ action: "notes_updated" });
  }

  Object.assign(existing, body);
  if (entries.length) existing.activity.push(...entries);
  await existing.save();
  res.json(existing);
});

export const archiveTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new ApiError(404, "Task not found");
  if (!task.isArchived) {
    task.isArchived = true;
    task.activity.push({ action: "archived" });
    await task.save();
  }
  res.json(task);
});

export const restoreTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new ApiError(404, "Task not found");
  if (task.isArchived) {
    task.isArchived = false;
    task.activity.push({ action: "restored" });
    await task.save();
  }
  res.json(task);
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) throw new ApiError(404, "Task not found");
  res.json({ message: "Task removed", id: req.params.id });
});
