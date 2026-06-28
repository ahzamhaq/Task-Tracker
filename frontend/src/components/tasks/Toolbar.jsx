import { FiPlus, FiSearch, FiX } from "react-icons/fi";
import Button from "../ui/Button.jsx";
import { Select } from "../ui/Field.jsx";

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
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
  categories = [],
  onCreate,
}) {
  return (
    <div className="sticky top-14 z-10 -mx-4 mb-5 border-b border-app glass px-4 py-3 sm:-mx-7 sm:px-7">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[180px] flex-1 sm:flex-none sm:w-72">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search tasks…"
            className="h-9 w-full rounded-btn border border-app bg-[color:var(--c-surface)] pl-8 pr-8 text-[13px] placeholder:text-muted-2 focus:border-brand/60"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearch("")}
              aria-label="Clear"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:text-[color:var(--c-ink)]"
            >
              <FiX className="h-3 w-3" />
            </button>
          )}
        </div>

        <Compact
          value={filters.status || ""}
          onChange={(v) => onFilters({ ...filters, status: v || null })}
          options={[{ value: "", label: "Status" }, ...STATUSES.map((s) => ({ value: s, label: s }))]}
        />
        <Compact
          value={filters.priority || ""}
          onChange={(v) => onFilters({ ...filters, priority: v || null })}
          options={[{ value: "", label: "Priority" }, ...PRIORITIES.map((p) => ({ value: p, label: p }))]}
        />
        <Compact
          value={filters.category || ""}
          onChange={(v) => onFilters({ ...filters, category: v || null })}
          options={[
            { value: "", label: "Category" },
            ...categories.map((c) => ({ value: c, label: c })),
          ]}
        />
        <Compact
          value={sort}
          onChange={onSort}
          prefix="Sort:"
          options={SORTS}
        />

        <div className="ml-auto">
          <Button
            onClick={onCreate}
            leftIcon={<FiPlus className="h-3.5 w-3.5" />}
            className="hidden sm:inline-flex"
          >
            New Task
          </Button>
        </div>
      </div>
    </div>
  );
}

function Compact({ value, onChange, options, prefix }) {
  return (
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 w-auto min-w-[110px] py-0 pr-7 text-[12.5px]"
    >
      {options.map((o) => (
        <option key={o.value || o.label} value={o.value}>
          {prefix ? `${prefix} ${o.label}` : o.label}
        </option>
      ))}
    </Select>
  );
}
