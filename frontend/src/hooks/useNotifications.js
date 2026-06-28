import { useCallback, useEffect, useMemo, useState } from "react";
import { useTasks } from "../context/TaskContext.jsx";

const READ_KEY = "taskflow-notifs-read";
const CLEAR_KEY = "taskflow-notifs-cleared-at";

const loadRead = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(READ_KEY) || "[]"));
  } catch {
    return new Set();
  }
};

const loadClearedAt = () => Number(localStorage.getItem(CLEAR_KEY) || 0);

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

const RECENT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24h

export function useNotifications() {
  const { tasks, archived } = useTasks();
  const [read, setRead] = useState(loadRead);
  const [clearedAt, setClearedAt] = useState(loadClearedAt);

  useEffect(() => {
    localStorage.setItem(READ_KEY, JSON.stringify([...read]));
  }, [read]);

  useEffect(() => {
    localStorage.setItem(CLEAR_KEY, String(clearedAt));
  }, [clearedAt]);

  const notifications = useMemo(() => {
    const list = [];
    const all = [...tasks, ...archived];

    for (const t of tasks) {
      if (t.status === "Completed") continue;
      if (isOverdue(t.dueDate)) {
        list.push({
          id: `overdue:${t._id}`,
          kind: "overdue",
          title: "Overdue task",
          body: t.title,
          timestamp: new Date(t.dueDate).toISOString(),
          taskId: t._id,
        });
      } else if (isToday(t.dueDate)) {
        list.push({
          id: `today:${t._id}`,
          kind: "today",
          title: "Due today",
          body: t.title,
          timestamp: new Date(t.dueDate).toISOString(),
          taskId: t._id,
        });
      }
    }

    for (const t of all) {
      const activity = t.activity || [];
      for (const entry of activity) {
        const ts = new Date(entry.timestamp).getTime();
        if (Number.isNaN(ts)) continue;
        if (Date.now() - ts > RECENT_WINDOW_MS) continue;
        if (entry.action === "completed") {
          list.push({
            id: `completed:${t._id}:${ts}`,
            kind: "completed",
            title: "Task completed",
            body: t.title,
            timestamp: entry.timestamp,
            taskId: t._id,
          });
        } else if (entry.action === "archived") {
          list.push({
            id: `archived:${t._id}:${ts}`,
            kind: "archived",
            title: "Task archived",
            body: t.title,
            timestamp: entry.timestamp,
            taskId: t._id,
          });
        }
      }
    }

    return list
      .filter((n) => new Date(n.timestamp).getTime() > clearedAt)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 30);
  }, [tasks, archived, clearedAt]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !read.has(n.id)).length,
    [notifications, read]
  );

  const markAllRead = useCallback(() => {
    setRead((prev) => {
      const next = new Set(prev);
      notifications.forEach((n) => next.add(n.id));
      return next;
    });
  }, [notifications]);

  const markRead = useCallback((id) => {
    setRead((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setClearedAt(Date.now());
  }, []);

  return { notifications, unreadCount, read, markAllRead, markRead, clearAll };
}
