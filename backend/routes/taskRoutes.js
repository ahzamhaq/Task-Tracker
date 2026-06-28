import { Router } from "express";
import {
  archiveTask,
  createTask,
  deleteTask,
  getTask,
  listTasks,
  restoreTask,
  updateTask,
} from "../controllers/taskController.js";

const router = Router();

router.route("/").get(listTasks).post(createTask);
router.route("/:id").get(getTask).put(updateTask).delete(deleteTask);
router.post("/:id/archive", archiveTask);
router.post("/:id/restore", restoreTask);

export default router;
