import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiLayers,
  FiLoader,
} from "react-icons/fi";
import Button from "../components/ui/Button.jsx";
import Modal from "../components/ui/Modal.jsx";
import { SkeletonRow, SkeletonStat } from "../components/ui/Skeleton.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import StatCard from "../components/tasks/StatCard.jsx";
import Toolbar from "../components/tasks/Toolbar.jsx";
import TaskCard from "../components/tasks/TaskCard.jsx";
import TaskForm from "../components/tasks/TaskForm.jsx";
import ConfirmDialog from "../components/tasks/ConfirmDialog.jsx";
import DashboardHeader from "../components/tasks/DashboardHeader.jsx";
import { useTasks } from "../context/TaskContext.jsx";
import { useTaskStats } from "../hooks/useTaskStats.js";
import { useSearch } from "../hooks/useSearch.js";

const priorityRank = { High: 3, Medium: 2, Low: 1 };

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

export default function Dashboard() {
  const {
    tasks,
    loading,
    error,
    refresh,
    createTask,
    updateTask,
    toggleComplete,
    removeTask,
  } = useTasks();
  const { search: globalSearch, setSearch: setGlobalSearch } = useSearch();

  const [sort, setSort] = useState("newest");
  const [filters, setFilters] = useState({
    status: null,
    priority: null,
    category: null,
  });
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const effectiveSearch = globalSearch.trim().toLowerCase();

  useEffect(() => {
    const handler = () => {
      setEditing(null);
      setFormOpen(true);
    };
    window.addEventListener("taskflow:compose", handler);
    return () => window.removeEventListener("taskflow:compose", handler);
  }, []);

  const categories = useMemo(() => {
    const set = new Set();
    tasks.forEach((t) => t.category && set.add(t.category));
    return [...set].sort();
  }, [tasks]);

  const visible = useMemo(() => {
    const filtered = tasks.filter((t) => {
      if (filters.status && t.status !== filters.status) return false;
      if (filters.priority && t.priority !== filters.priority) return false;
      if (filters.category && t.category !== filters.category) return false;
      if (effectiveSearch) {
        const hay = `${t.title} ${t.description} ${t.category}`.toLowerCase();
        if (!hay.includes(effectiveSearch)) return false;
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
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
  }, [tasks, filters, effectiveSearch, sort]);

  const stats = useTaskStats(tasks);
  const dueToday = useMemo(
    () => tasks.filter((t) => isToday(t.dueDate) && t.status !== "Completed").length,
    [tasks]
  );

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

  const handleStatus = async (task, status) => {
    await updateTask(task._id, { status });
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
      <DashboardHeader stats={stats} dueToday={dueToday} />

      <section className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonStat key={i} />)
        ) : (
          <>
            <StatCard
              icon={FiLayers}
              tone="brand"
              label="Total Tasks"
              value={stats.total}
              subtitle={`+${Math.min(stats.total, 6)} this week`}
            />
            <StatCard
              icon={FiClock}
              tone="warning"
              label="Pending"
              value={stats.pending}
              subtitle={stats.pending ? "Needs attention" : "All clear"}
            />
            <StatCard
              icon={FiLoader}
              tone="purple"
              label="In Progress"
              value={stats.inProgress}
              subtitle={stats.inProgress ? "Keep going" : "Nothing active"}
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
        search={globalSearch}
        onSearch={setGlobalSearch}
        sort={sort}
        onSort={setSort}
        filters={filters}
        onFilters={setFilters}
        categories={categories}
        onCreate={openCreate}
      />

      {error && !loading && (
        <div className="glass-card mb-4 flex items-start gap-3 border-danger/30 p-4">
          <FiAlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
          <div className="flex-1">
            <div className="text-[13.5px] font-medium">
              Couldn't load your tasks
            </div>
            <p className="mt-0.5 text-[12.5px] text-muted">{error}</p>
          </div>
          <Button variant="secondary" size="sm" onClick={refresh}>
            Retry
          </Button>
        </div>
      )}

      {loading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      ) : !hasAnyTasks ? (
        <EmptyState action="Create Task" onAction={openCreate} />
      ) : isFilteredEmpty ? (
        <EmptyState
          title="No matching tasks"
          subtitle="Try adjusting your search or filters."
        />
      ) : (
        <div className="space-y-2.5">
          <AnimatePresence initial={false}>
            {visible.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={openEdit}
                onDelete={(t) => setConfirm(t)}
                onToggle={toggleComplete}
                onStatus={handleStatus}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

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
          confirm ? `"${confirm.title}" will be permanently removed.` : undefined
        }
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => !deleting && setConfirm(null)}
      />
    </div>
  );
}
