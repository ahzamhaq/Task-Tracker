import { FiCalendar, FiCheckCircle, FiEdit2, FiTrash2 } from "react-icons/fi";
import Badge, { priorityTone, statusTone } from "../ui/Badge.jsx";
import { dueState } from "../../utils/format.js";

export default function TaskCard({ task, onEdit, onDelete, onToggle }) {
  const due = dueState(task.dueDate);
  const isDone = task.status === "Completed";

  return (
    <article
      className={`group card-surface flex h-full flex-col p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover hover:border-brand/30 ${
        isDone ? "opacity-80" : ""
      }`}
    >
      <header className="flex items-start justify-between gap-3">
        <h3
          className={`text-[15px] font-semibold leading-snug tracking-tight ${
            isDone ? "line-through text-muted" : ""
          }`}
        >
          {task.title}
        </h3>
        <Badge tone={statusTone(task.status)} dot>
          {task.status}
        </Badge>
      </header>

      {task.description && (
        <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-muted">
          {task.description}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {task.category && <Badge tone="brand">{task.category}</Badge>}
        <Badge tone={priorityTone(task.priority)}>{task.priority}</Badge>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4 [html:not(.dark)_&]:border-border-light">
        <div className="flex items-center gap-1.5 text-[12px] text-muted">
          <FiCalendar className="h-3.5 w-3.5" />
          {due ? (
            <span className={due.tone === "danger" ? "text-danger" : due.tone === "warning" ? "text-warning" : ""}>
              {due.label}
            </span>
          ) : (
            <span>No due date</span>
          )}
        </div>

        <div className="flex items-center gap-0.5 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
          <button
            type="button"
            onClick={() => onToggle?.(task)}
            title={isDone ? "Reopen" : "Mark complete"}
            className="rounded-md p-1.5 text-muted transition hover:bg-success/10 hover:text-success"
          >
            <FiCheckCircle className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit?.(task)}
            title="Edit"
            className="rounded-md p-1.5 text-muted transition hover:bg-brand/10 hover:text-brand"
          >
            <FiEdit2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(task)}
            title="Delete"
            className="rounded-md p-1.5 text-muted transition hover:bg-danger/10 hover:text-danger"
          >
            <FiTrash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
