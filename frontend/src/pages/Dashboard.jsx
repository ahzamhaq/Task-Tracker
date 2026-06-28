import { useMemo, useState } from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiLayers,
  FiLoader,
  FiPlus,
} from "react-icons/fi";
import Button from "../components/ui/Button.jsx";
import Modal from "../components/ui/Modal.jsx";
import { SkeletonCard, SkeletonStat } from "../components/ui/Skeleton.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import StatCard from "../components/tasks/StatCard.jsx";
import Toolbar from "../components/tasks/Toolbar.jsx";
import TaskCard from "../components/tasks/TaskCard.jsx";
import TaskForm from "../components/tasks/TaskForm.jsx";
import ConfirmDialog from "../components/tasks/ConfirmDialog.jsx";
import { useTasks } from "../context/TaskContext.jsx";
import { useTaskStats } from "../hooks/useTaskStats.js";
import { useSearch } from "../hooks/useSearch.js";
import { greeting } from "../utils/format.js";

const priorityRank = { High: 3, Medium: 2, Low: 1 };

export default function Dashboard() {
  const { tasks, loading, error, refresh, createTask, updateTask, toggleComplete, removeTask } =
    useTasks();
  const { search: globalSearch, setSearch: setGlobalSearch } = useSearch();

  const [localSearch, setLocalSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [filters, setFilters] = useState({ status: null, priority: null });
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const effectiveSearch = (globalSearch || localSearch).trim().toLowerCase();

  const visible = useMemo(() => {
    const filtered = tasks.filter((t) => {
      if (filters.status && t.status !== filters.status) return false;
      if (filters.priority && t.priority !== filters.priority) return false;
      if (effectiveSearch) {
        const hay = `${t.title} ${t.description} ${t.category}`.toLowerCase();
        if (!hay.includes(effectiveSearch)) return false;
      }
      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
      switch (sort) {
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "due":
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        case "priority":
          return (priorityRank[b.priority] || 0) - (priorityRank[a.priority] || 0);
        case "title":
          return a.title.localeCompare(b.title);
        case "newest":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return sorted;
  }, [tasks, filters, effectiveSearch, sort]);

  const stats = useTaskStats(tasks);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (task) => {
    setEditing(task);
    setFormOpen(true);
  };
  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleSubmit = async (payload) => {
    if (editing) {
      await updateTask(editing._id, payload);
    } else {
      await createTask(payload);
    }
    closeForm();
  };

  const handleDelete = async () => {
    if (!confirm) return;
    setDeleting(true);
    try {
      await removeTask(confirm._id);
      setConfirm(null);
    } finally {
      setDeleting(false);
    }
  };

  const hasAnyTasks = tasks.length > 0;
  const isFilteredEmpty = hasAnyTasks && visible.length === 0;

  return (
    <div>
      <section className="mb-8 flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-[28px]">
          {greeting()}, Balmukund.
        </h1>
        <p className="text-sm text-muted">
          Stay focused and finish what matters today.
        </p>
      </section>

      <section className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {loading ? (
          <>
            <SkeletonStat />
            <SkeletonStat />
            <SkeletonStat />
            <SkeletonStat />
          </>
        ) : (
          <>
            <StatCard
              icon={FiLayers}
              tone="brand"
              label="Total Tasks"
              value={stats.total}
              subtitle="all time"
            />
            <StatCard
              icon={FiClock}
              tone="warning"
              label="Pending"
              value={stats.pending}
              subtitle="not started"
            />
            <StatCard
              icon={FiLoader}
              tone="purple"
              label="In Progress"
              value={stats.inProgress}
              subtitle="active"
            />
            <StatCard
              icon={FiCheckCircle}
              tone="success"
              label="Completed"
              value={stats.completed}
              subtitle={`${stats.completion}% done`}
            />
          </>
        )}
      </section>

      <Toolbar
        search={localSearch || globalSearch}
        onSearch={(v) => {
          setLocalSearch(v);
          if (globalSearch) setGlobalSearch("");
        }}
        sort={sort}
        onSort={setSort}
        filters={filters}
        onFilters={setFilters}
        onCreate={openCreate}
      />

      {error && !loading && (
        <div className="card-surface mb-4 flex items-start gap-3 border-danger/40 p-4">
          <FiAlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
          <div className="flex-1">
            <div className="text-sm font-medium">Couldn't load your tasks</div>
            <p className="mt-0.5 text-[13px] text-muted">{error}</p>
          </div>
          <Button variant="secondary" size="sm" onClick={refresh}>
            Retry
          </Button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : !hasAnyTasks ? (
        <EmptyState action="Create Task" onAction={openCreate} />
      ) : isFilteredEmpty ? (
        <EmptyState
          title="No matching tasks."
          subtitle="Try adjusting your search or filters."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={openEdit}
              onDelete={(t) => setConfirm(t)}
              onToggle={toggleComplete}
            />
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={openCreate}
        aria-label="Add task"
        className="fixed bottom-6 right-6 z-20 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white shadow-card-hover transition hover:bg-brand-hover sm:hidden"
      >
        <FiPlus className="h-5 w-5" />
      </button>

      <Modal
        open={formOpen}
        onClose={closeForm}
        title={editing ? "Edit task" : "New task"}
        description={
          editing
            ? "Update the details below and save your changes."
            : "Capture what's on your mind. You can refine it later."
        }
      >
        <TaskForm
          initial={editing}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        title="Delete this task?"
        description={
          confirm
            ? `"${confirm.title}" will be permanently removed.`
            : undefined
        }
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => !deleting && setConfirm(null)}
      />
    </div>
  );
}
