import { useMemo } from "react";

export function useTaskStats(tasks) {
  return useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter((t) => t.status === "Pending").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    const completed = tasks.filter((t) => t.status === "Completed").length;
    const completion = total ? Math.round((completed / total) * 100) : 0;
    return { total, pending, inProgress, completed, completion };
  }, [tasks]);
}
