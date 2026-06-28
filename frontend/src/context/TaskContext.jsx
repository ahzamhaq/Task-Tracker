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
  loading: true,
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
    case "add":
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case "update":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t._id === action.payload._id ? action.payload : t
        ),
      };
    case "remove":
      return {
        ...state,
        tasks: state.tasks.filter((t) => t._id !== action.payload),
      };
    default:
      return state;
  }
}

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

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = useCallback(async (payload) => {
    const created = await taskService.create(payload);
    dispatch({ type: "add", payload: created });
    toast.success("Task created");
    return created;
  }, []);

  const updateTask = useCallback(async (id, payload) => {
    const updated = await taskService.update(id, payload);
    dispatch({ type: "update", payload: updated });
    toast.success("Task updated");
    return updated;
  }, []);

  const toggleComplete = useCallback(async (task) => {
    const next = task.status === "Completed" ? "Pending" : "Completed";
    const updated = await taskService.update(task._id, { status: next });
    dispatch({ type: "update", payload: updated });
    toast.success(next === "Completed" ? "Marked complete" : "Reopened");
  }, []);

  const removeTask = useCallback(async (id) => {
    await taskService.remove(id);
    dispatch({ type: "remove", payload: id });
    toast.success("Task deleted");
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      refresh: fetchTasks,
      createTask,
      updateTask,
      toggleComplete,
      removeTask,
    }),
    [state, fetchTasks, createTask, updateTask, toggleComplete, removeTask]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used within TaskProvider");
  return ctx;
};
