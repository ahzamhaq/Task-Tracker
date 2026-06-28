import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiArchive,
  FiCalendar,
  FiCheckCircle,
  FiGrid,
  FiImage,
  FiMoon,
  FiPlus,
  FiSearch,
  FiSettings,
  FiSun,
} from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useSearch } from "../../hooks/useSearch.js";

export default function CommandPalette({
  open,
  onClose,
  onCompose,
  onOpenSettings,
  onOpenBackground,
}) {
  const navigate = useNavigate();
  const { theme, toggle: toggleTheme } = useTheme();
  const { setSearch } = useSearch();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const commands = useMemo(
    () => [
      {
        id: "new-task",
        label: "New Task",
        hint: "Create a task",
        icon: FiPlus,
        keywords: "create add",
        action: () => onCompose?.(),
      },
      {
        id: "search",
        label: "Search Tasks",
        hint: "Focus the global search",
        icon: FiSearch,
        keywords: "find",
        action: () => {
          setSearch("");
          navigate("/dashboard");
          setTimeout(() => {
            const el = document.querySelector('header input[type="text"]');
            el?.focus();
          }, 30);
        },
      },
      {
        id: "go-dashboard",
        label: "Go to Dashboard",
        hint: "All active tasks",
        icon: FiGrid,
        keywords: "home",
        action: () => navigate("/dashboard"),
      },
      {
        id: "go-today",
        label: "Go to Today",
        hint: "Tasks due today",
        icon: FiCalendar,
        keywords: "due",
        action: () => navigate("/today"),
      },
      {
        id: "go-upcoming",
        label: "Go to Upcoming",
        hint: "Tasks due after today",
        icon: FiCalendar,
        keywords: "future plan",
        action: () => navigate("/upcoming"),
      },
      {
        id: "go-completed",
        label: "Go to Completed",
        hint: "Finished tasks",
        icon: FiCheckCircle,
        keywords: "done",
        action: () => navigate("/completed"),
      },
      {
        id: "go-archived",
        label: "Go to Archived",
        hint: "View archive",
        icon: FiArchive,
        keywords: "trash",
        action: () => navigate("/archived"),
      },
      {
        id: "toggle-theme",
        label: theme === "dark" ? "Switch to Light theme" : "Switch to Dark theme",
        hint: "Toggle appearance",
        icon: theme === "dark" ? FiSun : FiMoon,
        keywords: "theme dark light",
        action: () => toggleTheme(),
      },
      {
        id: "background",
        label: "Customize Background",
        hint: "Wallpaper, blur, overlay",
        icon: FiImage,
        keywords: "wallpaper image",
        action: () => onOpenBackground?.(),
      },
      {
        id: "settings",
        label: "Open Settings",
        hint: "Preferences and data",
        icon: FiSettings,
        keywords: "prefs config",
        action: () => onOpenSettings?.(),
      },
    ],
    [navigate, theme, toggleTheme, onCompose, onOpenSettings, onOpenBackground, setSearch]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) =>
      `${c.label} ${c.hint} ${c.keywords || ""}`.toLowerCase().includes(q)
    );
  }, [commands, query]);

  useEffect(() => {
    setIndex(0);
  }, [query, open]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    const id = setTimeout(() => inputRef.current?.focus(), 30);
    return () => clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose?.();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setIndex((i) => Math.min(filtered.length - 1, i + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setIndex((i) => Math.max(0, i - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const cmd = filtered[index];
        if (cmd) {
          onClose?.();
          // run after closing so navigation doesn't fight a re-render
          requestAnimationFrame(() => cmd.action());
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, filtered, index, onClose]);

  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector(`[data-index="${index}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [index]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[12vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 4 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            role="dialog"
            aria-label="Command palette"
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-card border border-app-strong glass-strong shadow-glass-hover"
          >
            <div className="flex items-center gap-2 border-b border-app px-4 py-3">
              <FiSearch className="h-4 w-4 text-muted" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search…"
                className="h-7 flex-1 bg-transparent text-[13.5px] outline-none placeholder:text-muted-2"
              />
              <span className="kbd">esc</span>
            </div>

            <ul
              ref={listRef}
              className="max-h-[360px] overflow-y-auto py-1"
              role="listbox"
            >
              {filtered.length === 0 ? (
                <li className="px-4 py-8 text-center text-[12.5px] text-muted">
                  No commands match "{query}"
                </li>
              ) : (
                filtered.map((cmd, i) => {
                  const Icon = cmd.icon;
                  const active = i === index;
                  return (
                    <li
                      key={cmd.id}
                      data-index={i}
                      role="option"
                      aria-selected={active}
                    >
                      <button
                        type="button"
                        onMouseEnter={() => setIndex(i)}
                        onClick={() => {
                          onClose?.();
                          requestAnimationFrame(() => cmd.action());
                        }}
                        className={`flex w-full items-center gap-3 px-3 py-2 text-left text-[13px] transition ${
                          active
                            ? "bg-[color:var(--c-border)] text-[color:var(--c-ink)]"
                            : "text-muted hover:text-[color:var(--c-ink)]"
                        }`}
                      >
                        <span
                          className={`inline-flex h-7 w-7 items-center justify-center rounded-md ${
                            active
                              ? "bg-brand/15 text-brand"
                              : "bg-[color:var(--c-border)] text-muted"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="flex-1 truncate font-medium">
                          {cmd.label}
                        </span>
                        <span className="text-[11px] text-muted-2">
                          {cmd.hint}
                        </span>
                      </button>
                    </li>
                  );
                })
              )}
            </ul>

            <footer className="flex items-center justify-between border-t border-app px-4 py-2 text-[11px] text-muted-2">
              <span className="inline-flex items-center gap-1.5">
                <span className="kbd">↑</span>
                <span className="kbd">↓</span>
                Navigate
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="kbd">↵</span>
                Select
              </span>
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
