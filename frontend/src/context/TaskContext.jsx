import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import toast from "react-hot-toast";
import { taskService } from "../services/taskService.js";

const TaskContext = createContext(null);

const initialState = {
  tasks: [],
  archived: [],
  loading: true,
  loadingArchived: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, loading: true, error: null };
    case "loaded":
      return { ...state, loading: false, tasks: action.payload, error: null };
    case "error":
      return { ...state, loading: false, error: action.payload };
    case "loading-archived":
      return { ...state, loadingArchived: true };
    case "loaded-archived":
      return { ...state, loadingArchived: false, archived: action.payload };

    case "add":
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case "replace": {
      const swap = (list) =>
        list.map((t) => (t._id === action.tempId ? action.payload : t));
      return { ...state, tasks: swap(state.tasks) };
    }
    case "update": {
      const upd = (list) =>
        list.map((t) => (t._id === action.payload._id ? action.payload : t));
      return { ...state, tasks: upd(state.tasks), archived: upd(state.archived) };
    }
    case "remove": {
      const rm = (list) => list.filter((t) => t._id !== action.payload);
      return { ...state, tasks: rm(state.tasks), archived: rm(state.archived) };
    }
    case "set-tasks":
      return { ...state, tasks: action.payload };
    case "set-archived":
      return { ...state, archived: action.payload };
    case "archive-move": {
      // optimistically move from active -> archived
      return {
        ...state,
        tasks: state.tasks.filter((t) => t._id !== action.payload._id),
        archived: [action.payload, ...state.archived],
      };
    }
    case "restore-move": {
      return {
        ...state,
        archived: state.archived.filter((t) => t._id !== action.payload._id),
        tasks: [action.payload, ...state.tasks],
      };
    }
    default:
      return state;
  }
}

const tempId = () => `temp-${Math.random().toString(36).slice(2, 10)}`;

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchTasks = useCallback(async () => {
    dispatch({ type: "loading" });
    try {
      const data = await taskService.list();
      dispatch({ type: "loaded", payload: data });
    } catch (err) {
      dispatch({ type: "error", payload: err.message });
    }
  }, []);

  const fetchArchived = useCallback(async () => {
    dispatch({ type: "loading-archived" });
    try {
      const data = await taskService.list({ archived: "true" });
      dispatch({ type: "loaded-archived", payload: data });
    } catch (err) {
      toast.error(err.message);
      dispatch({ type: "loaded-archived", payload: [] });
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = useCallback(async (payload) => {
    const id = tempId();
    const optimistic = {
      _id: id,
      title: payload.title,
      description: payload.description || "",
      category: payload.category || "General",
      priority: payload.priority || "Medium",
      status: payload.status || "Pending",
      dueDate: payload.dueDate || null,
      notes: "",
      isArchived: false,
      activity: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      _optimistic: true,
    };
    dispatch({ type: "add", payload: optimistic });
    try {
      const created = await taskService.create(payload);
      dispatch({ type: "replace", tempId: id, payload: created });
      toast.success("Task created");
      return created;
    } catch (err) {
      dispatch({ type: "remove", payload: id });
      toast.error(err.message || "Could not create task");
      throw err;
    }
  }, []);

  const updateTask = useCallback(
    async (id, payload, { silent = false } = {}) => {
      const list = [...state.tasks, ...state.archived];
      const prev = list.find((t) => t._id === id);
      if (prev) {
        dispatch({ type: "update", payload: { ...prev, ...payload } });
      }
      try {
        const updated = await taskService.update(id, payload);
        dispatch({ type: "update", payload: updated });
        if (!silent) toast.success("Task updated");
        return updated;
      } catch (err) {
        if (prev) dispatch({ type: "update", payload: prev });
        toast.error(err.message || "Could not update task");
        throw err;
      }
    },
    [state.tasks, state.archived]
  );

  const toggleComplete = useCallback(
    async (task) => {
      const next = task.status === "Completed" ? "Pending" : "Completed";
      const optimistic = { ...task, status: next };
      dispatch({ type: "update", payload: optimistic });
      try {
        const updated = await taskService.update(task._id, { status: next });
        dispatch({ type: "update", payload: updated });
        toast.success(next === "Completed" ? "Task completed" : "Task reopened");
      } catch (err) {
        dispatch({ type: "update", payload: task });
        toast.error(err.message || "Could not update task");
      }
    },
    []
  );

  const archiveTask = useCallback(async (task) => {
    const optimistic = { ...task, isArchived: true };
    dispatch({ type: "archive-move", payload: optimistic });
    try {
      const updated = await taskService.archive(task._id);
      dispatch({ type: "update", payload: updated });
      toast.success("Task archived");
    } catch (err) {
      dispatch({ type: "restore-move", payload: task });
      toast.error(err.message || "Could not archive task");
      throw err;
    }
  }, []);

  const restoreTask = useCallback(async (task) => {
    const optimistic = { ...task, isArchived: false };
    dispatch({ type: "restore-move", payload: optimistic });
    try {
      const updated = await taskService.restore(task._id);
      dispatch({ type: "update", payload: updated });
      toast.success("Task restored");
    } catch (err) {
      dispatch({ type: "archive-move", payload: task });
      toast.error(err.message || "Could not restore task");
      throw err;
    }
  }, []);

  const removeTask = useCallback(
    async (id) => {
      const list = [...state.tasks, ...state.archived];
      const prev = list.find((t) => t._id === id);
      const fromArchive = prev?.isArchived;
      dispatch({ type: "remove", payload: id });
      try {
        await taskService.remove(id);
        toast.success("Task deleted");
      } catch (err) {
        if (prev) {
          dispatch({
            type: fromArchive ? "set-archived" : "set-tasks",
            payload: fromArchive
              ? [prev, ...state.archived]
              : [prev, ...state.tasks],
          });
        }
        toast.error(err.message || "Could not delete task");
        throw err;
      }
    },
    [state.tasks, state.archived]
  );

  const value = useMemo(
    () => ({
      ...state,
      refresh: fetchTasks,
      refreshArchived: fetchArchived,
      createTask,
      updateTask,
      toggleComplete,
      archiveTask,
      restoreTask,
      removeTask,
    }),
    [
      state,
      fetchTasks,
      fetchArchived,
      createTask,
      updateTask,
      toggleComplete,
      archiveTask,
      restoreTask,
      removeTask,
    ]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used within TaskProvider");
  return ctx;
};
