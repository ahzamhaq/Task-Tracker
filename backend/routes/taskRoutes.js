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
import { requireOwner } from "../middleware/owner.js";

const router = Router();

router.use(requireOwner);

router.route("/").get(listTasks).post(createTask);
router.route("/:id").get(getTask).put(updateTask).delete(deleteTask);
router.post("/:id/archive", archiveTask);
router.post("/:id/restore", restoreTask);

export default router;
