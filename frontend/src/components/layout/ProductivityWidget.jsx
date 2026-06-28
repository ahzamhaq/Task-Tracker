import { useMemo } from "react";
import { FiZap } from "react-icons/fi";
import { useTasks } from "../../context/TaskContext.jsx";
import AnimatedNumber from "../ui/AnimatedNumber.jsx";

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

const isOverdue = (value) => {
  if (!value) return false;
  return new Date(value).getTime() < Date.now() && !isToday(value);
};

const startOfWeek = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d.getTime();
};

const computeInsights = (tasks, archived) => {
  const all = [...tasks, ...archived];
  const completed = all.filter((t) => t.status === "Completed").length;
  const total = all.length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  const weekStart = startOfWeek();
  let completedThisWeek = 0;
  for (const t of all) {
    if (t.status !== "Completed") continue;
    const last = (t.activity || [])
      .filter((a) => a.action === "completed")
      .reduce(
        (acc, a) => Math.max(acc, new Date(a.timestamp).getTime() || 0),
        0
      );
    const reference = last || new Date(t.updatedAt).getTime();
    if (reference >= weekStart) completedThisWeek += 1;
  }

  const dueToday = tasks.filter(
    (t) => t.status !== "Completed" && isToday(t.dueDate)
  ).length;
  const overdue = tasks.filter(
    (t) => t.status !== "Completed" && isOverdue(t.dueDate)
  ).length;
  const highRemaining = tasks.filter(
    (t) => t.status !== "Completed" && t.priority === "High"
  ).length;

  return {
    completedThisWeek,
    dueToday,
    overdue,
    percent,
    highRemaining,
  };
};

export default function ProductivityWidget() {
  const { tasks, archived } = useTasks();
  const insights = useMemo(
    () => computeInsights(tasks, archived),
    [tasks, archived]
  );

  return (
    <div className="glass rounded-card p-3.5">
      <div className="mb-2 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium">
          <FiZap className="h-3.5 w-3.5 text-brand" />
          Insights
        </span>
        <span className="text-[11px] tabular-nums text-muted">
          <AnimatedNumber value={insights.percent} />% done
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[color:var(--c-border)]">
        <div
          className="h-full rounded-full bg-brand transition-[width] duration-500"
          style={{ width: `${insights.percent}%` }}
        />
      </div>

      <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11.5px]">
        <Row label="This week" value={insights.completedThisWeek} />
        <Row label="Due today" value={insights.dueToday} accent={insights.dueToday > 0 ? "warning" : null} />
        <Row label="Overdue" value={insights.overdue} accent={insights.overdue > 0 ? "danger" : null} />
        <Row label="High priority" value={insights.highRemaining} />
      </ul>
    </div>
  );
}

function Row({ label, value, accent }) {
  const tone =
    accent === "danger"
      ? "text-danger"
      : accent === "warning"
      ? "text-warning"
      : "";
  return (
    <li className="flex items-center justify-between">
      <span className="text-muted">{label}</span>
      <span className={`font-semibold tabular-nums ${tone}`}>
        <AnimatedNumber value={value} />
      </span>
    </li>
  );
}
