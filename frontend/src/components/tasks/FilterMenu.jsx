import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiCheck, FiChevronRight, FiFilter, FiX } from "react-icons/fi";

const STATUSES = ["Pending", "In Progress", "Completed"];
const PRIORITIES = ["Low", "Medium", "High"];
const DATES = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "due", label: "Due date" },
  { value: "title", label: "Alphabetical" },
];

export default function FilterMenu({
  filters,
  onFilters,
  sort,
  onSort,
}) {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (!wrapRef.current?.contains(e.target)) {
        setOpen(false);
        setSection(null);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setSection(null);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const activeCount =
    (filters.status ? 1 : 0) +
    (filters.priority ? 1 : 0) +
    (sort !== "newest" ? 1 : 0);

  const clearAll = () => {
    onFilters({ ...filters, status: null, priority: null });
    onSort("newest");
  };

  return (
    <div className="relative ml-auto" ref={wrapRef}>
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          setSection(null);
        }}
        className="inline-flex h-9 items-center gap-2 rounded-btn border border-app bg-[color:var(--c-surface)] px-3 text-[13px] font-medium text-muted transition hover:border-app-strong hover:text-[color:var(--c-ink)]"
      >
        <FiFilter className="h-3.5 w-3.5" />
        Filter
        {activeCount > 0 && (
          <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white">
            {activeCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            className="absolute right-0 top-full z-30 mt-2 flex w-[220px] overflow-hidden rounded-card border border-app-strong glass-strong shadow-glass-hover"
            role="menu"
          >
            <ul className="w-full py-1">
              <ParentRow
                label="Status"
                value={filters.status}
                onEnter={() => setSection("status")}
                active={section === "status"}
              />
              <ParentRow
                label="Priority"
                value={filters.priority}
                onEnter={() => setSection("priority")}
                active={section === "priority"}
              />
              <ParentRow
                label="Date"
                value={
                  DATES.find((d) => d.value === sort)?.label || "Newest"
                }
                onEnter={() => setSection("date")}
                active={section === "date"}
              />

              {activeCount > 0 && (
                <>
                  <li className="my-1 divider" />
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        clearAll();
                        setSection(null);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12.5px] font-medium text-muted transition hover:bg-[color:var(--c-border)] hover:text-[color:var(--c-ink)]"
                    >
                      <FiX className="h-3.5 w-3.5" />
                      Clear all
                    </button>
                  </li>
                </>
              )}
            </ul>

            <AnimatePresence>
              {section && (
                <motion.div
                  key={section}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.12 }}
                  className="absolute left-full top-0 ml-2 w-[180px] overflow-hidden rounded-card border border-app-strong glass-strong shadow-glass-hover"
                >
                  <ul className="py-1" role="menu">
                    {section === "status" && (
                      <>
                        <Option
                          label="All statuses"
                          selected={!filters.status}
                          onClick={() =>
                            onFilters({ ...filters, status: null })
                          }
                        />
                        {STATUSES.map((s) => (
                          <Option
                            key={s}
                            label={s}
                            selected={filters.status === s}
                            onClick={() =>
                              onFilters({ ...filters, status: s })
                            }
                          />
                        ))}
                      </>
                    )}
                    {section === "priority" && (
                      <>
                        <Option
                          label="All priorities"
                          selected={!filters.priority}
                          onClick={() =>
                            onFilters({ ...filters, priority: null })
                          }
                        />
                        {PRIORITIES.map((p) => (
                          <Option
                            key={p}
                            label={p}
                            selected={filters.priority === p}
                            onClick={() =>
                              onFilters({ ...filters, priority: p })
                            }
                          />
                        ))}
                      </>
                    )}
                    {section === "date" &&
                      DATES.map((d) => (
                        <Option
                          key={d.value}
                          label={d.label}
                          selected={sort === d.value}
                          onClick={() => onSort(d.value)}
                        />
                      ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ParentRow({ label, value, onEnter, active }) {
  return (
    <li>
      <button
        type="button"
        onMouseEnter={onEnter}
        onFocus={onEnter}
        onClick={onEnter}
        className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-[12.5px] transition hover:bg-[color:var(--c-border)] ${
          active ? "bg-[color:var(--c-border)]" : ""
        }`}
      >
        <span className="font-medium">{label}</span>
        <span className="flex items-center gap-1 text-muted-2">
          {value && (
            <span className="max-w-[80px] truncate text-[11.5px] text-brand">
              {value}
            </span>
          )}
          <FiChevronRight className="h-3 w-3" />
        </span>
      </button>
    </li>
  );
}

function Option({ label, selected, onClick }) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-[12.5px] transition hover:bg-[color:var(--c-border)] ${
          selected ? "text-brand" : ""
        }`}
      >
        {label}
        {selected && <FiCheck className="h-3 w-3" />}
      </button>
    </li>
  );
}
