import { useMemo } from "react";

const isToday = (value) => {
  if (!value) return false;
  const d = new Date(value);
  const n = new Date();
  return (
    d.getFullYear() === n.getFullYear() &&
    d.getMonth() === n.getMonth() &&
    d.getDate() === n.getDate()
  );
};

const isPast = (value) => {
  if (!value) return false;
  return new Date(value).getTime() < Date.now() && !isToday(value);
};

export function useTaskStats(tasks) {
  return useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter((t) => t.status === "Pending").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    const completed = tasks.filter((t) => t.status === "Completed").length;
    const overdue = tasks.filter(
      (t) => t.status !== "Completed" && isPast(t.dueDate)
    ).length;
    const dueToday = tasks.filter(
      (t) => t.status !== "Completed" && isToday(t.dueDate)
    ).length;
    const completion = total ? Math.round((completed / total) * 100) : 0;
    return { total, pending, inProgress, completed, overdue, dueToday, completion };
  }, [tasks]);
}
