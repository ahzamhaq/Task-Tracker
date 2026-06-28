import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiLogOut, FiMoon, FiSettings, FiSun } from "react-icons/fi";
import { useAuth, userInitials } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";

export default function ProfileMenu({ onOpenSettings }) {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleLogout = () => {
    setOpen(false);
    logout();
    toast.success("Signed out");
    navigate("/", { replace: true });
  };

  const initials = userInitials(user?.userName);

  return (
    <div className="relative ml-1" ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Account"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-hover text-[12px] font-semibold text-white ring-2 ring-[color:var(--c-bg)] transition hover:ring-brand/40"
      >
        {initials}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            className="absolute right-0 top-full z-40 mt-2 w-[260px] overflow-hidden rounded-card border border-app-strong glass-strong shadow-glass-hover"
            role="menu"
          >
            <header className="border-b border-app px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-hover text-[12px] font-semibold text-white">
                  {initials}
                </span>
                <div className="min-w-0">
                  <div className="truncate text-[13.5px] font-semibold">
                    {user?.userName || "User"}
                  </div>
                  <div className="truncate text-[11.5px] text-muted">
                    {user?.userEmail || ""}
                  </div>
                </div>
              </div>
            </header>

            <ul className="py-1">
              <li>
                <button
                  type="button"
                  onClick={toggle}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-[13px] transition hover:bg-[color:var(--c-border)]"
                >
                  <span className="inline-flex items-center gap-2.5 text-muted">
                    {theme === "dark" ? (
                      <FiMoon className="h-3.5 w-3.5" />
                    ) : (
                      <FiSun className="h-3.5 w-3.5" />
                    )}
                    Theme
                  </span>
                  <span className="text-[11.5px] capitalize text-muted-2">
                    {theme}
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onOpenSettings?.();
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] text-muted transition hover:bg-[color:var(--c-border)] hover:text-[color:var(--c-ink)]"
                >
                  <FiSettings className="h-3.5 w-3.5" />
                  Settings
                </button>
              </li>
            </ul>

            <div className="divider" />
            <ul className="py-1">
              <li>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] text-danger transition hover:bg-danger/10"
                >
                  <FiLogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
