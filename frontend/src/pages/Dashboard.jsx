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
import TaskDetailsDrawer from "../components/tasks/TaskDetailsDrawer.jsx";
import { useTasks } from "../context/TaskContext.jsx";
import { useTaskStats } from "../hooks/useTaskStats.js";
import { useSearch } from "../hooks/useSearch.js";
import { useDebounce } from "../hooks/useDebounce.js";

const priorityRank = { High: 3, Medium: 2, Low: 1 };
const statusRank = { Pending: 0, "In Progress": 1, Completed: 2 };

const sortTasks = (tasks, sort) => {
  const arr = [...tasks];
  switch (sort) {
    case "oldest":
      return arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case "due":
      return arr.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    case "priority":
      return arr.sort(
        (a, b) => (priorityRank[b.priority] || 0) - (priorityRank[a.priority] || 0)
      );
    case "title":
      return arr.sort((a, b) => a.title.localeCompare(b.title));
    case "completed-first":
      return arr.sort(
        (a, b) =>
          (statusRank[b.status] ?? 0) - (statusRank[a.status] ?? 0) ||
          new Date(b.createdAt) - new Date(a.createdAt)
      );
    case "pending-first":
      return arr.sort(
        (a, b) =>
          (statusRank[a.status] ?? 0) - (statusRank[b.status] ?? 0) ||
          new Date(b.createdAt) - new Date(a.createdAt)
      );
    case "newest":
    default:
      return arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
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
    archiveTask,
    removeTask,
  } = useTasks();
  const { search: globalSearch, setSearch: setGlobalSearch } = useSearch();
  const debouncedSearch = useDebounce(globalSearch, 300);

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
  const [selected, setSelected] = useState(null);

  const effectiveSearch = debouncedSearch.trim().toLowerCase();

  useEffect(() => {
    const handler = () => {
      setEditing(null);
      setFormOpen(true);
    };
    window.addEventListener("taskflow:compose", handler);
    return () => window.removeEventListener("taskflow:compose", handler);
  }, []);

  // Keep selected task in sync with latest task list state (so drawer reflects edits)
  useEffect(() => {
    if (!selected) return;
    const latest = tasks.find((t) => t._id === selected._id);
    if (latest && latest !== selected) setSelected(latest);
  }, [tasks, selected]);

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
    return sortTasks(filtered, sort);
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

  const handleStatus = async (task, status) => {
    await updateTask(task._id, { status }, { silent: true });
  };

  const handleArchive = async (task) => {
    if (selected?._id === task._id) setSelected(null);
    await archiveTask(task);
  };

  const handleDelete = async () => {
    if (!confirm) return;
    setDeleting(true);
    try {
      await removeTask(confirm._id);
      if (selected?._id === confirm._id) setSelected(null);
      setConfirm(null);
    } finally {
      setDeleting(false);
    }
  };

  const hasAnyTasks = tasks.length > 0;
  const isFilteredEmpty = hasAnyTasks && visible.length === 0;
  const isSearching = !!effectiveSearch;

  return (
    <div>
      <DashboardHeader stats={stats} dueToday={stats.dueToday} />

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
              subtitle={stats.overdue ? `${stats.overdue} overdue` : "all time"}
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
          illustration={isSearching ? "search" : "tasks"}
          title={isSearching ? "No results found" : "No matching tasks"}
          subtitle={
            isSearching
              ? "Try a different keyword or clear your filters."
              : "Try adjusting your filters."
          }
        />
      ) : (
        <div className="space-y-2.5">
          <AnimatePresence initial={false}>
            {visible.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onOpen={setSelected}
                onEdit={openEdit}
                onDelete={(t) => handleArchive(t)}
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

      <TaskDetailsDrawer
        task={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        onEdit={(t) => {
          setSelected(null);
          openEdit(t);
        }}
        onArchive={(t) => handleArchive(t)}
        onDelete={(t) => setConfirm(t)}
        onSaveNotes={async (notes) => {
          if (!selected) return;
          await updateTask(selected._id, { notes }, { silent: true });
        }}
      />
    </div>
  );
}
