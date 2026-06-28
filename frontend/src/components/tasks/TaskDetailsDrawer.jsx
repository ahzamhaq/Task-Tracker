import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiArchive,
  FiCalendar,
  FiCheck,
  FiClock,
  FiEdit2,
  FiFileText,
  FiFolder,
  FiFlag,
  FiPlus,
  FiRefreshCw,
  FiRotateCcw,
  FiTag,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import Badge, { categoryTone, priorityTone, statusTone } from "../ui/Badge.jsx";
import Button from "../ui/Button.jsx";
import { Textarea } from "../ui/Field.jsx";
import { formatDate, relativeTime } from "../../utils/format.js";

const ACTION_META = {
  created: { icon: FiPlus, label: "Created", tone: "brand" },
  updated: { icon: FiEdit2, label: "Updated", tone: "muted" },
  completed: { icon: FiCheck, label: "Marked complete", tone: "success" },
  reopened: { icon: FiRefreshCw, label: "Reopened", tone: "warning" },
  status_changed: { icon: FiRefreshCw, label: "Status changed", tone: "purple" },
  priority_changed: { icon: FiFlag, label: "Priority changed", tone: "warning" },
  category_changed: { icon: FiFolder, label: "Category changed", tone: "brand" },
  archived: { icon: FiArchive, label: "Archived", tone: "muted" },
  restored: { icon: FiRotateCcw, label: "Restored", tone: "success" },
  notes_updated: { icon: FiFileText, label: "Notes updated", tone: "brand" },
  deleted: { icon: FiTrash2, label: "Deleted", tone: "danger" },
};

const describe = (entry) => {
  if (entry.action === "priority_changed")
    return `${entry.previousValue || "—"} → ${entry.newValue || "—"}`;
  if (entry.action === "category_changed")
    return `${entry.previousValue || "—"} → ${entry.newValue || "—"}`;
  if (entry.action === "status_changed")
    return `${entry.previousValue || "—"} → ${entry.newValue || "—"}`;
  if (entry.action === "updated" && entry.field)
    return `Updated ${entry.field}`;
  return null;
};

export default function TaskDetailsDrawer({
  task,
  open,
  onClose,
  onEdit,
  onArchive,
  onRestore,
  onDelete,
  onSaveNotes,
}) {
  const [notes, setNotes] = useState(task?.notes || "");
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    setNotes(task?.notes || "");
  }, [task?._id, task?.notes]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const dirty = (task?.notes || "") !== notes;

  const saveNotes = async () => {
    if (!dirty) return;
    setSavingNotes(true);
    try {
      await onSaveNotes?.(notes);
    } finally {
      setSavingNotes(false);
    }
  };

  const activity = [...(task?.activity || [])].reverse();

  return (
    <AnimatePresence>
      {open && task && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: 480, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 480, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed right-3 top-3 z-50 flex h-[calc(100vh-24px)] w-[440px] max-w-[calc(100vw-24px)] flex-col rounded-card border border-app-strong glass-strong shadow-glass-hover"
            role="dialog"
            aria-label="Task details"
          >
            <header className="flex items-start justify-between gap-3 border-b border-app px-5 py-4">
              <div className="min-w-0">
                <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                  <Badge tone={statusTone(task.status)} dot>
                    {task.status}
                  </Badge>
                  <Badge tone={priorityTone(task.priority)}>{task.priority}</Badge>
                  {task.category && (
                    <Badge tone={categoryTone(task.category)}>
                      {task.category}
                    </Badge>
                  )}
                </div>
                <h2 className="truncate text-[16px] font-semibold tracking-tight">
                  {task.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-md p-1.5 text-muted transition hover:bg-[color:var(--c-border)] hover:text-[color:var(--c-ink)]"
              >
                <FiX className="h-4 w-4" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              {task.description && (
                <p className="mb-5 text-[13.5px] leading-relaxed text-muted">
                  {task.description}
                </p>
              )}

              <dl className="mb-6 grid grid-cols-2 gap-x-4 gap-y-3 text-[12.5px]">
                <Meta icon={FiTag} label="Status" value={task.status} />
                <Meta icon={FiFlag} label="Priority" value={task.priority} />
                <Meta icon={FiFolder} label="Category" value={task.category} />
                <Meta
                  icon={FiCalendar}
                  label="Due"
                  value={formatDate(task.dueDate) || "—"}
                />
                <Meta
                  icon={FiClock}
                  label="Created"
                  value={relativeTime(task.createdAt)}
                />
                <Meta
                  icon={FiClock}
                  label="Updated"
                  value={relativeTime(task.updatedAt)}
                />
              </dl>

              <Section title="Notes">
                <Textarea
                  rows={5}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add personal notes, links, or context…"
                  maxLength={4000}
                />
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[11px] text-muted-2">
                    {notes.length}/4000
                  </span>
                  <div className="flex items-center gap-2">
                    {dirty && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setNotes(task.notes || "")}
                        disabled={savingNotes}
                      >
                        Discard
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={saveNotes}
                      disabled={!dirty}
                      loading={savingNotes}
                    >
                      Save notes
                    </Button>
                  </div>
                </div>
              </Section>

              <Section title="Activity">
                {activity.length === 0 ? (
                  <p className="text-[12.5px] text-muted-2">
                    No activity yet.
                  </p>
                ) : (
                  <ol className="relative space-y-3 border-l border-app pl-4">
                    {activity.map((entry) => {
                      const meta =
                        ACTION_META[entry.action] || ACTION_META.updated;
                      const Icon = meta.icon;
                      const detail = describe(entry);
                      return (
                        <li key={entry._id || entry.timestamp} className="relative">
                          <span
                            className={`absolute -left-[22px] top-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[color:var(--c-surface-solid)] ring-1 ring-[color:var(--c-border-strong)] text-[10px] ${
                              meta.tone === "success"
                                ? "text-success"
                                : meta.tone === "warning"
                                ? "text-warning"
                                : meta.tone === "danger"
                                ? "text-danger"
                                : meta.tone === "purple"
                                ? "text-purple-500 dark:text-purple-300"
                                : meta.tone === "brand"
                                ? "text-brand"
                                : "text-muted"
                            }`}
                          >
                            <Icon className="h-2.5 w-2.5" />
                          </span>
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="text-[12.5px] font-medium">
                              {meta.label}
                            </span>
                            <span className="text-[11px] text-muted-2">
                              {relativeTime(entry.timestamp)}
                            </span>
                          </div>
                          {detail && (
                            <p className="mt-0.5 text-[11.5px] text-muted">
                              {detail}
                            </p>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                )}
              </Section>
            </div>

            <footer className="flex items-center justify-between gap-2 border-t border-app px-5 py-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete?.(task)}
                leftIcon={<FiTrash2 className="h-3.5 w-3.5" />}
                className="text-danger hover:text-danger"
              >
                Delete
              </Button>
              <div className="flex items-center gap-2">
                {task.isArchived ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onRestore?.(task)}
                    leftIcon={<FiRotateCcw className="h-3.5 w-3.5" />}
                  >
                    Restore
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onArchive?.(task)}
                    leftIcon={<FiArchive className="h-3.5 w-3.5" />}
                  >
                    Archive
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={() => onEdit?.(task)}
                  leftIcon={<FiEdit2 className="h-3.5 w-3.5" />}
                >
                  Edit
                </Button>
              </div>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Meta({ icon: Icon, label, value }) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-2">
        <Icon className="h-3 w-3" /> {label}
      </dt>
      <dd className="mt-0.5 text-[13px] font-medium">{value}</dd>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mb-6 last:mb-0">
      <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-2">
        {title}
      </h3>
      {children}
    </section>
  );
}
