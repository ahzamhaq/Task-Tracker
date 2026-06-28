import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArchive,
  FiCalendar,
  FiCheckCircle,
  FiGrid,
  FiSettings,
  FiSun,
  FiX,
} from "react-icons/fi";
import Logo from "./Logo.jsx";
import ProductivityWidget from "./ProductivityWidget.jsx";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/today", label: "Today", icon: FiSun },
  { to: "/upcoming", label: "Upcoming", icon: FiCalendar },
  { to: "/completed", label: "Completed", icon: FiCheckCircle },
  { to: "/archived", label: "Archived", icon: FiArchive },
];

function NavItem({ to, icon: Icon, label, onNavigate }) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      end
      className={({ isActive }) =>
        `group relative flex items-center gap-3 rounded-btn px-3 py-2 text-[13.5px] font-medium transition ${
          isActive
            ? "text-brand"
            : "text-muted hover:text-[color:var(--c-ink)]"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="sidebar-active"
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="absolute inset-0 -z-0 rounded-btn bg-brand/10 ring-1 ring-inset ring-brand/20"
            />
          )}
          <Icon className="relative z-10 h-[15px] w-[15px]" />
          <span className="relative z-10">{label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar({ open, onClose, onOpenSettings }) {
  const handleNavigate = () => onClose?.();

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-14 shrink-0 items-center justify-between px-5">
        <Logo />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close sidebar"
          className="rounded-md p-1.5 text-muted transition hover:bg-[color:var(--c-border)] hover:text-[color:var(--c-ink)] lg:hidden"
        >
          <FiX className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-6">
        <div className="space-y-0.5">
          {NAV.map((item) => (
            <NavItem key={item.to} {...item} onNavigate={handleNavigate} />
          ))}
        </div>
      </nav>

      <div className="px-4 pb-3">
        <ProductivityWidget />

        <button
          type="button"
          onClick={() => {
            onOpenSettings?.();
            onClose?.();
          }}
          className="mt-2 flex w-full items-center gap-3 rounded-btn px-3 py-2 text-[13.5px] font-medium text-muted transition hover:bg-[color:var(--c-border)] hover:text-[color:var(--c-ink)]"
        >
          <FiSettings className="h-[15px] w-[15px]" />
          Settings
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-sidebar lg:flex-col lg:border-r lg:border-app glass">
        {content}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="absolute inset-y-0 left-0 flex w-[280px] flex-col border-r border-app glass-strong"
          >
            {content}
          </motion.aside>
        </div>
      )}
    </>
  );
}
