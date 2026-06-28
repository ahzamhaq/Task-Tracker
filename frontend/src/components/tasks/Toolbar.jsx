import { FiFilter, FiPlus, FiSearch, FiX } from "react-icons/fi";
import Button from "../ui/Button.jsx";
import { Select } from "../ui/Field.jsx";
import { useState } from "react";

const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "due", label: "Due date" },
  { value: "priority", label: "Priority" },
  { value: "title", label: "Title" },
];

const STATUSES = ["Pending", "In Progress", "Completed"];
const PRIORITIES = ["Low", "Medium", "High"];

export default function Toolbar({
  search,
  onSearch,
  sort,
  onSort,
  filters,
  onFilters,
  onCreate,
}) {
  const [filterOpen, setFilterOpen] = useState(false);
  const activeFilters =
    (filters.status ? 1 : 0) + (filters.priority ? 1 : 0);

  return (
    <div className="mb-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-sm">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search tasks…"
            className="w-full rounded-btn border border-border bg-surface/60 py-2 pl-9 pr-9 text-sm text-ink placeholder:text-muted focus:border-brand [html:not(.dark)_&]:bg-surface-light [html:not(.dark)_&]:border-border-light [html:not(.dark)_&]:text-ink-light"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearch("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:text-ink"
            >
              <FiX className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
          <Button
            variant="secondary"
            size="md"
            onClick={() => setFilterOpen((v) => !v)}
            leftIcon={<FiFilter className="h-3.5 w-3.5" />}
          >
            Filter
            {activeFilters > 0 && (
              <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white">
                {activeFilters}
              </span>
            )}
          </Button>

          <Select
            value={sort}
            onChange={(e) => onSort(e.target.value)}
            className="h-9 w-auto py-0 pr-8"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                Sort: {s.label}
              </option>
            ))}
          </Select>

          <Button
            onClick={onCreate}
            leftIcon={<FiPlus className="h-4 w-4" />}
            className="hidden sm:inline-flex"
          >
            Add Task
          </Button>
        </div>
      </div>

      {filterOpen && (
        <div className="card-surface mt-3 flex flex-wrap items-end gap-3 p-4 animate-fade-in">
          <div className="min-w-[160px] flex-1">
            <div className="mb-1.5 text-[12px] font-medium text-muted">
              Status
            </div>
            <Select
              value={filters.status || ""}
              onChange={(e) =>
                onFilters({ ...filters, status: e.target.value || null })
              }
            >
              <option value="">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </div>
          <div className="min-w-[160px] flex-1">
            <div className="mb-1.5 text-[12px] font-medium text-muted">
              Priority
            </div>
            <Select
              value={filters.priority || ""}
              onChange={(e) =>
                onFilters({ ...filters, priority: e.target.value || null })
              }
            >
              <option value="">All priorities</option>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Select>
          </div>
          {activeFilters > 0 && (
            <Button
              variant="ghost"
              size="md"
              onClick={() => onFilters({ status: null, priority: null })}
            >
              Clear
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
