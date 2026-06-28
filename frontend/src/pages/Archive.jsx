import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiArchive, FiCalendar, FiRotateCcw, FiTrash2 } from "react-icons/fi";
import Badge, { categoryTone, priorityTone } from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import { SkeletonRow } from "../components/ui/Skeleton.jsx";
import ConfirmDialog from "../components/tasks/ConfirmDialog.jsx";
import TaskDetailsDrawer from "../components/tasks/TaskDetailsDrawer.jsx";
import { useTasks } from "../context/TaskContext.jsx";
import { useSearch } from "../hooks/useSearch.js";
import { useDebounce } from "../hooks/useDebounce.js";
import { dueState } from "../utils/format.js";

export default function Archive() {
  const {
    archived,
    loadingArchived,
    refreshArchived,
    restoreTask,
    removeTask,
    updateTask,
  } = useTasks();
  const { search } = useSearch();
  const debounced = useDebounce(search, 300);
  const [confirm, setConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    refreshArchived();
  }, [refreshArchived]);

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    if (!q) return archived;
    return archived.filter((t) =>
      `${t.title} ${t.description} ${t.category}`.toLowerCase().includes(q)
    );
  }, [archived, debounced]);

  const openTask = (t) => setSelected(t);

  const handleDelete = async () => {
    if (!confirm) return;
    setDeleting(true);
    try {
      await removeTask(confirm._id);
      setConfirm(null);
      if (selected?._id === confirm._id) setSelected(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <section className="mb-7">
        <h1 className="flex items-center gap-2 text-[24px] font-semibold tracking-tight sm:text-[28px]">
          <FiArchive className="h-5 w-5 text-muted" /> Archived
        </h1>
        <p className="mt-1 text-[13.5px] text-muted">
          Tasks you've put aside. Restore them anytime or delete permanently.
        </p>
      </section>

      {loadingArchived ? (
        <div className="space-y-2.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          illustration={debounced ? "search" : "archive"}
          title={debounced ? "No matches" : "Archive is empty"}
          subtitle={
            debounced
              ? "No archived tasks match your search."
              : "When you archive a task, it'll show up here."
          }
        />
      ) : (
        <div className="space-y-2.5">
          <AnimatePresence initial={false}>
            {filtered.map((task) => {
              const due = dueState(task.dueDate);
              return (
                <motion.article
                  key={task._id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  onClick={(e) => {
                    if (e.target.closest("button")) return;
                    openTask(task);
                  }}
                  className="group relative cursor-pointer overflow-hidden rounded-card border border-app glass shadow-glass transition-shadow hover:shadow-glass-hover"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 w-[3px] bg-[color:var(--c-border-strong)]"
                  />
                  <div className="flex items-center gap-3 px-4 py-3 pl-5 sm:gap-4 sm:px-5">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-[14px] font-semibold tracking-tight text-muted">
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="mt-0.5 line-clamp-1 text-[12.5px] text-muted-2">
                          {task.description}
                        </p>
                      )}
                    </div>

                    <div className="hidden items-center gap-1.5 md:flex">
                      {task.category && (
                        <Badge tone={categoryTone(task.category)}>
                          {task.category}
                        </Badge>
                      )}
                      <Badge tone={priorityTone(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>

                    <div className="hidden items-center gap-1.5 text-[12px] text-muted sm:flex">
                      <FiCalendar className="h-3.5 w-3.5" />
                      {due ? <span>{due.label}</span> : <span>—</span>}
                    </div>

                    <div className="ml-1 flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => restoreTask(task)}
                        leftIcon={<FiRotateCcw className="h-3.5 w-3.5" />}
                      >
                        Restore
                      </Button>
                      <button
                        type="button"
                        onClick={() => setConfirm(task)}
                        aria-label="Delete permanently"
                        className="rounded-md p-1.5 text-muted opacity-0 transition group-hover:opacity-100 hover:bg-danger/10 hover:text-danger focus-visible:opacity-100"
                      >
                        <FiTrash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <ConfirmDialog
        open={!!confirm}
        title="Delete permanently?"
        description={
          confirm
            ? `"${confirm.title}" will be removed forever. This cannot be undone.`
            : undefined
        }
        loading={deleting}
        confirmLabel="Delete forever"
        onConfirm={handleDelete}
        onClose={() => !deleting && setConfirm(null)}
      />

      <TaskDetailsDrawer
        task={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        onRestore={(t) => {
          restoreTask(t);
          setSelected(null);
        }}
        onDelete={(t) => setConfirm(t)}
        onSaveNotes={async (notes) => {
          if (!selected) return;
          await updateTask(selected._id, { notes }, { silent: true });
        }}
      />
    </div>
  );
}
