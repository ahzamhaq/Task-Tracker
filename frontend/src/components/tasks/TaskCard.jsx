import { motion } from "framer-motion";
import { FiCalendar, FiCheck, FiEdit2, FiMoreHorizontal, FiTrash2 } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import Badge, { priorityTone } from "../ui/Badge.jsx";
import { dueState } from "../../utils/format.js";

const PRIORITY_BORDER = {
  High: "#EF4444",
  Medium: "#F59E0B",
  Low: "#3B82F6",
};

const STATUSES = ["Pending", "In Progress", "Completed"];

const STATUS_PILL = {
  Pending:
    "text-muted bg-[color:var(--c-border)] hover:bg-[color:var(--c-border-strong)]",
  "In Progress":
    "text-purple-500 bg-purple-500/15 hover:bg-purple-500/25 dark:text-purple-300",
  Completed: "text-success bg-success/15 hover:bg-success/25",
};

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onToggle,
  onStatus,
  onOpen,
}) {
  const due = dueState(task.dueDate);
  const done = task.status === "Completed";

  const handleRowClick = (e) => {
    // ignore clicks on interactive children
    if (e.target.closest("button, a, [role='menu'], input, select, textarea"))
      return;
    onOpen?.(task);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      onClick={handleRowClick}
      className="group relative cursor-pointer overflow-hidden rounded-card border border-app glass shadow-glass transition-shadow hover:shadow-glass-hover"
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{ background: PRIORITY_BORDER[task.priority] || "#6366F1" }}
      />

      <div className="flex items-center gap-3 px-4 py-3 pl-5 sm:gap-4 sm:px-5">
        <button
          type="button"
          onClick={() => onToggle?.(task)}
          aria-label={done ? "Mark as pending" : "Mark complete"}
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
            done
              ? "border-success bg-success text-white"
              : "border-app-strong text-transparent hover:border-brand hover:text-brand"
          }`}
        >
          <FiCheck className="h-3 w-3" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <h3
              className={`truncate text-[14px] font-semibold tracking-tight ${
                done ? "text-muted line-through" : ""
              }`}
            >
              {task.title}
            </h3>
          </div>
          {task.description && (
            <p className="mt-0.5 line-clamp-1 text-[12.5px] text-muted">
              {task.description}
            </p>
          )}
        </div>

        <div className="hidden items-center gap-1.5 md:flex">
          <Badge tone={priorityTone(task.priority)}>{task.priority}</Badge>
        </div>

        <div className="hidden items-center gap-1.5 text-[12px] text-muted sm:flex">
          <FiCalendar className="h-3.5 w-3.5" />
          {due ? (
            <span
              className={
                due.tone === "danger"
                  ? "text-danger"
                  : due.tone === "warning"
                  ? "text-warning"
                  : ""
              }
            >
              {due.label}
            </span>
          ) : (
            <span>—</span>
          )}
        </div>

        <StatusPicker
          value={task.status}
          onChange={(next) => onStatus?.(task, next)}
        />

        <div className="ml-1 flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => onEdit?.(task)}
            title="Edit"
            className="rounded-md p-1.5 text-muted opacity-0 transition group-hover:opacity-100 hover:bg-brand/10 hover:text-brand focus-visible:opacity-100"
          >
            <FiEdit2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(task)}
            title="Archive"
            aria-label="Archive task"
            className="rounded-md p-1.5 text-muted opacity-0 transition group-hover:opacity-100 hover:bg-danger/10 hover:text-danger focus-visible:opacity-100"
          >
            <FiTrash2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="More"
            className="hidden rounded-md p-1.5 text-muted opacity-0 transition group-hover:opacity-100 hover:bg-[color:var(--c-border)] hover:text-[color:var(--c-ink)] focus-visible:opacity-100 sm:inline-flex"
          >
            <FiMoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 px-5 pb-3 md:hidden">
        <Badge tone={priorityTone(task.priority)}>{task.priority}</Badge>
        {due && (
          <span
            className={`inline-flex items-center gap-1 text-[11.5px] ${
              due.tone === "danger"
                ? "text-danger"
                : due.tone === "warning"
                ? "text-warning"
                : "text-muted"
            }`}
          >
            <FiCalendar className="h-3 w-3" /> {due.label}
          </span>
        )}
      </div>
    </motion.article>
  );
}

function StatusPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex h-7 items-center gap-1 rounded-md px-2 text-[11.5px] font-medium transition ${STATUS_PILL[value]}`}
      >
        {value}
        <svg
          width="9"
          height="9"
          viewBox="0 0 10 10"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2 4l3 3 3-3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <motion.ul
          initial={{ opacity: 0, y: -4, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.12 }}
          className="absolute right-0 top-full z-20 mt-1 w-36 overflow-hidden rounded-lg border border-app-strong glass-strong shadow-glass-hover"
        >
          {STATUSES.map((s) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  if (s !== value) onChange?.(s);
                }}
                className={`flex w-full items-center justify-between px-3 py-1.5 text-left text-[12.5px] transition hover:bg-[color:var(--c-border)] ${
                  s === value ? "text-brand" : ""
                }`}
              >
                {s}
                {s === value && <FiCheck className="h-3 w-3" />}
              </button>
            </li>
          ))}
        </motion.ul>
      )}
    </div>
  );
}
