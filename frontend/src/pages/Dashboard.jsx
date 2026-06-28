import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
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
import FilterMenu from "../components/tasks/FilterMenu.jsx";
import DashboardHeader from "../components/tasks/DashboardHeader.jsx";
import TaskDetailsDrawer from "../components/tasks/TaskDetailsDrawer.jsx";
import { useTasks } from "../context/TaskContext.jsx";
import { useTaskStats } from "../hooks/useTaskStats.js";
import { useSearch } from "../hooks/useSearch.js";
import { useDebounce } from "../hooks/useDebounce.js";

const priorityRank = { High: 3, Medium: 2, Low: 1 };
const statusRank = { Pending: 0, "In Progress": 1, Completed: 2 };

const SCOPES = {
  "/today": {
    title: "Today",
    subtitle: "Tasks due today.",
    predicate: (t) => isToday(t.dueDate) && t.status !== "Completed",
  },
  "/upcoming": {
    title: "Upcoming",
    subtitle: "Tasks due after today.",
    predicate: (t) => isFuture(t.dueDate) && t.status !== "Completed",
  },
  "/completed": {
    title: "Completed",
    subtitle: "Tasks you've finished.",
    predicate: (t) => t.status === "Completed",
  },
};

function isToday(value) {
  if (!value) return false;
  const d = new Date(value);
  const n = new Date();
  return (
    d.getFullYear() === n.getFullYear() &&
    d.getMonth() === n.getMonth() &&
    d.getDate() === n.getDate()
  );
}

function isFuture(value) {
  if (!value) return false;
  const d = new Date(value);
  const n = new Date();
  n.setHours(0, 0, 0, 0);
  n.setDate(n.getDate() + 1);
  return d.getTime() >= n.getTime();
}

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
  const location = useLocation();
  const scope = SCOPES[location.pathname] || null;

  const [sort, setSort] = useState("newest");
  const [filters, setFilters] = useState({
    status: null,
    priority: null,
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

  const visible = useMemo(() => {
    const filtered = tasks.filter((t) => {
      if (scope && !scope.predicate(t)) return false;
      if (filters.status && t.status !== filters.status) return false;
      if (filters.priority && t.priority !== filters.priority) return false;
      if (effectiveSearch) {
        const hay = `${t.title} ${t.description}`.toLowerCase();
        if (!hay.includes(effectiveSearch)) return false;
      }
      return true;
    });
    return sortTasks(filtered, sort);
  }, [tasks, scope, filters, effectiveSearch, sort]);

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

  const scopedTasks = useMemo(
    () => (scope ? tasks.filter(scope.predicate) : tasks),
    [tasks, scope]
  );
  const hasAnyTasks = scopedTasks.length > 0;
  const isFilteredEmpty = hasAnyTasks && visible.length === 0;
  const isSearching = !!effectiveSearch;

  return (
    <div>
      {scope ? (
        <section className="mb-7">
          <h1 className="text-[24px] font-semibold tracking-tight sm:text-[28px]">
            {scope.title}
          </h1>
          <p className="mt-1 text-[13.5px] text-muted">{scope.subtitle}</p>
        </section>
      ) : (
        <DashboardHeader stats={stats} dueToday={stats.dueToday} />
      )}

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

      {scope ? (
        <div className="mb-5 flex items-center justify-end">
          <FilterMenu
            filters={filters}
            onFilters={setFilters}
            sort={sort}
            onSort={setSort}
          />
        </div>
      ) : (
        <Toolbar
          search={globalSearch}
          onSearch={setGlobalSearch}
          sort={sort}
          onSort={setSort}
          filters={filters}
          onFilters={setFilters}
          onCreate={openCreate}
        />
      )}

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
        scope ? (
          <EmptyState
            illustration={scope === SCOPES["/completed"] ? "archive" : "tasks"}
            title={
              scope === SCOPES["/today"]
                ? "Nothing due today"
                : scope === SCOPES["/upcoming"]
                ? "No upcoming tasks"
                : scope === SCOPES["/completed"]
                ? "No completed tasks yet"
                : "No tasks yet"
            }
            subtitle={
              scope === SCOPES["/completed"]
                ? "Mark a task as complete and it'll appear here."
                : "Enjoy the calm, or add something new."
            }
            action={scope !== SCOPES["/completed"] ? "Create Task" : undefined}
            onAction={openCreate}
          />
        ) : (
          <EmptyState action="Create Task" onAction={openCreate} />
        )
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
