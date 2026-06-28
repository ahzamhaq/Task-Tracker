import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiAlertTriangle,
  FiArchive,
  FiBell,
  FiCheck,
  FiClock,
} from "react-icons/fi";
import { useNotifications } from "../../hooks/useNotifications.js";
import { relativeTime } from "../../utils/format.js";

const META = {
  overdue: { icon: FiAlertTriangle, tone: "text-danger" },
  today: { icon: FiClock, tone: "text-warning" },
  completed: { icon: FiCheck, tone: "text-success" },
  archived: {
    icon: FiArchive,
    tone: "text-muted",
  },
};

export default function NotificationCenter() {
  const { notifications, unreadCount, read, markAllRead, markRead, clearAll } =
    useNotifications();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-btn text-muted transition hover:bg-[color:var(--c-border)] hover:text-[color:var(--c-ink)]"
      >
        <FiBell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[9.5px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            className="absolute right-0 top-full z-40 mt-2 flex w-[340px] max-w-[92vw] flex-col overflow-hidden rounded-card border border-app-strong glass-strong shadow-glass-hover"
            role="dialog"
            aria-label="Notifications"
          >
            <header className="flex items-center justify-between border-b border-app px-4 py-3">
              <div>
                <h3 className="text-[13.5px] font-semibold">Notifications</h3>
                <p className="text-[11px] text-muted-2">
                  {unreadCount > 0
                    ? `${unreadCount} unread`
                    : "You're all caught up"}
                </p>
              </div>
              <button
                type="button"
                onClick={markAllRead}
                disabled={unreadCount === 0}
                className="rounded-md px-2 py-1 text-[11.5px] font-medium text-brand transition hover:bg-brand/10 disabled:cursor-not-allowed disabled:text-muted-2 disabled:hover:bg-transparent"
              >
                Mark all read
              </button>
            </header>

            <ul className="max-h-[360px] overflow-y-auto py-1">
              {notifications.length === 0 ? (
                <li className="px-4 py-10 text-center text-[12.5px] text-muted">
                  No notifications yet.
                </li>
              ) : (
                notifications.map((n) => {
                  const meta = META[n.kind] || META.completed;
                  const Icon = meta.icon;
                  const isRead = read.has(n.id);
                  return (
                    <li key={n.id}>
                      <button
                        type="button"
                        onClick={() => markRead(n.id)}
                        className={`flex w-full items-start gap-3 px-4 py-2.5 text-left transition hover:bg-[color:var(--c-border)] ${
                          isRead ? "" : "bg-brand/[0.04]"
                        }`}
                      >
                        <span
                          className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--c-border)] ${meta.tone}`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="text-[12.5px] font-medium">
                              {n.title}
                            </span>
                            <span className="shrink-0 text-[10.5px] text-muted-2">
                              {relativeTime(n.timestamp)}
                            </span>
                          </div>
                          <p className="mt-0.5 truncate text-[12px] text-muted">
                            {n.body}
                          </p>
                        </div>
                        {!isRead && (
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                        )}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>

            {notifications.length > 0 && (
              <footer className="border-t border-app px-4 py-2">
                <button
                  type="button"
                  onClick={clearAll}
                  className="w-full rounded-md py-1 text-[12px] font-medium text-muted transition hover:text-[color:var(--c-ink)]"
                >
                  Clear all
                </button>
              </footer>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
