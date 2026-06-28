import { FiMoon, FiSun, FiSearch } from "react-icons/fi";
import Logo from "./Logo.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";

export default function Topbar({ search, onSearch }) {
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/80 backdrop-blur-md dark:bg-bg/80 [html:not(.dark)_&]:bg-bg-light/85 [html:not(.dark)_&]:border-border-light">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Logo />

        <div className="relative ml-2 hidden flex-1 max-w-md md:block">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search tasks…"
            className="w-full rounded-btn border border-border bg-surface/60 py-2 pl-9 pr-3 text-sm text-ink placeholder:text-muted transition hover:border-border focus:border-brand [html:not(.dark)_&]:bg-surface-light [html:not(.dark)_&]:border-border-light [html:not(.dark)_&]:text-ink-light"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            aria-label="Toggle theme"
            className="inline-flex h-9 w-9 items-center justify-center rounded-btn border border-border bg-surface/60 text-ink transition hover:border-brand/60 hover:text-brand [html:not(.dark)_&]:bg-surface-light [html:not(.dark)_&]:border-border-light [html:not(.dark)_&]:text-ink-light"
          >
            {theme === "dark" ? (
              <FiSun className="h-4 w-4" />
            ) : (
              <FiMoon className="h-4 w-4" />
            )}
          </button>

          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-hover text-sm font-semibold text-white"
            title="Account"
          >
            BM
          </div>
        </div>
      </div>

      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search tasks…"
            className="w-full rounded-btn border border-border bg-surface/60 py-2 pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:border-brand [html:not(.dark)_&]:bg-surface-light [html:not(.dark)_&]:border-border-light [html:not(.dark)_&]:text-ink-light"
          />
        </div>
      </div>
    </header>
  );
}
