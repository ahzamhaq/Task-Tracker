import { NavLink } from "react-router-dom";
import { FiCalendar, FiCheckCircle, FiGrid, FiPlus, FiSun } from "react-icons/fi";

const ITEMS = [
  { to: "/dashboard", label: "Home", icon: FiGrid },
  { to: "/today", label: "Today", icon: FiSun },
  { to: "/upcoming", label: "Plan", icon: FiCalendar },
  { to: "/completed", label: "Done", icon: FiCheckCircle },
];

export default function MobileTabBar({ onCompose }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-app glass lg:hidden">
      <div className="relative mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {ITEMS.slice(0, 2).map((i) => (
          <Tab key={i.to} {...i} />
        ))}

        <button
          type="button"
          onClick={onCompose}
          aria-label="New task"
          className="-mt-7 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white shadow-glass-hover transition active:scale-95"
        >
          <FiPlus className="h-5 w-5" />
        </button>

        {ITEMS.slice(2).map((i) => (
          <Tab key={i.to} {...i} />
        ))}
      </div>
    </nav>
  );
}

function Tab({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex min-w-[56px] flex-col items-center gap-0.5 rounded-md px-2 py-1 text-[10.5px] font-medium transition ${
          isActive ? "text-brand" : "text-muted"
        }`
      }
    >
      <Icon className="h-4 w-4" />
      {label}
    </NavLink>
  );
}
