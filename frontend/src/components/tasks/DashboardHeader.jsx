import ProgressRing from "../ui/ProgressRing.jsx";
import { greeting } from "../../utils/format.js";

export default function DashboardHeader({ stats, dueToday }) {
  const remaining = stats.pending + stats.inProgress;

  return (
    <section className="mb-7 flex flex-col gap-5 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="flex items-center gap-2 text-[24px] font-semibold tracking-tight sm:text-[28px]">
          {greeting()} <span className="text-[22px]">👋</span>
        </h1>
        <p className="mt-1 text-[13.5px] text-muted">
          Let's make today productive.
        </p>
      </div>

      <div className="glass-card flex items-center gap-5 px-4 py-3 sm:px-5">
        <ProgressRing value={stats.completion} label="Done" />
        <div className="hidden h-10 w-px bg-[color:var(--c-border)] sm:block" />
        <div className="flex items-center gap-5 sm:gap-6">
          <Metric label="Remaining" value={remaining} />
          <Metric label="Due today" value={dueToday} accent={dueToday > 0 ? "warning" : null} />
          <Metric label="Completed" value={stats.completed} accent="success" />
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value, accent }) {
  const color =
    accent === "warning"
      ? "text-warning"
      : accent === "success"
      ? "text-success"
      : "";
  return (
    <div className="text-center sm:text-left">
      <div className={`text-[18px] font-semibold tabular-nums ${color}`}>
        {value}
      </div>
      <div className="text-[10.5px] uppercase tracking-wider text-muted-2">
        {label}
      </div>
    </div>
  );
}
