import { useEffect, useRef } from "react";
import { FiBell, FiImage, FiMenu, FiMoon, FiSearch, FiSun } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext.jsx";

export default function Topbar({
  search,
  onSearch,
  onOpenBackground,
  onOpenSidebar,
}) {
  const { theme, toggle } = useTheme();
  const inputRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-app glass">
      <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open menu"
          className="-ml-1 inline-flex h-9 w-9 items-center justify-center rounded-btn text-muted transition hover:bg-[color:var(--c-border)] hover:text-[color:var(--c-ink)] lg:hidden"
        >
          <FiMenu className="h-4 w-4" />
        </button>

        <div className="relative w-full max-w-[520px]">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search tasks…"
            className="h-9 w-full rounded-btn border border-app bg-[color:var(--c-surface)] py-0 pl-9 pr-14 text-[13.5px] placeholder:text-muted focus:border-brand/60"
          />
          <div className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-1 sm:flex">
            <span className="kbd">⌘</span>
            <span className="kbd">K</span>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenBackground}
            className="hidden h-9 items-center gap-2 rounded-btn border border-app px-3 text-[13px] font-medium text-muted transition hover:border-app-strong hover:text-[color:var(--c-ink)] sm:inline-flex"
          >
            <FiImage className="h-3.5 w-3.5" />
            Background
          </button>
          <button
            type="button"
            onClick={onOpenBackground}
            aria-label="Background"
            className="inline-flex h-9 w-9 items-center justify-center rounded-btn text-muted transition hover:bg-[color:var(--c-border)] hover:text-[color:var(--c-ink)] sm:hidden"
          >
            <FiImage className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={toggle}
            aria-label="Toggle theme"
            className="inline-flex h-9 w-9 items-center justify-center rounded-btn text-muted transition hover:bg-[color:var(--c-border)] hover:text-[color:var(--c-ink)]"
          >
            {theme === "dark" ? (
              <FiSun className="h-4 w-4" />
            ) : (
              <FiMoon className="h-4 w-4" />
            )}
          </button>

          <button
            type="button"
            aria-label="Notifications"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-btn text-muted transition hover:bg-[color:var(--c-border)] hover:text-[color:var(--c-ink)]"
          >
            <FiBell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-brand" />
          </button>

          <div className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-hover text-[12px] font-semibold text-white ring-2 ring-[color:var(--c-bg)]">
            BM
          </div>
        </div>
      </div>
    </header>
  );
}
