import { FiPlus } from "react-icons/fi";
import Button from "./Button.jsx";

function Illustration() {
  return (
    <svg
      width="120"
      height="100"
      viewBox="0 0 120 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="120" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" stopOpacity="0.18" />
          <stop offset="1" stopColor="#6366F1" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <rect x="10" y="14" width="76" height="60" rx="10" fill="url(#g1)" stroke="#6366F1" strokeOpacity="0.35" />
      <rect x="22" y="28" width="38" height="4" rx="2" fill="#6366F1" fillOpacity="0.55" />
      <rect x="22" y="38" width="52" height="3" rx="1.5" fill="currentColor" fillOpacity="0.25" />
      <rect x="22" y="46" width="42" height="3" rx="1.5" fill="currentColor" fillOpacity="0.2" />
      <rect x="22" y="58" width="14" height="6" rx="3" fill="#22C55E" fillOpacity="0.4" />
      <rect x="40" y="58" width="20" height="6" rx="3" fill="#F59E0B" fillOpacity="0.4" />
      <g transform="translate(70 50)">
        <rect width="40" height="40" rx="10" fill="#1E293B" stroke="#6366F1" strokeOpacity="0.4" />
        <path d="M14 20l4 4 8-8" stroke="#22C55E" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

export default function EmptyState({
  title = "Your workspace is ready",
  subtitle = "Create your first task and start organizing your work.",
  action,
  onAction,
}) {
  return (
    <div className="glass-card flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="text-[color:var(--c-ink)] opacity-90">
        <Illustration />
      </div>
      <h3 className="mt-5 text-[17px] font-semibold tracking-tight">{title}</h3>
      <p className="mt-1.5 max-w-sm text-[13.5px] text-muted">{subtitle}</p>
      {action && (
        <Button
          className="mt-6"
          size="lg"
          onClick={onAction}
          leftIcon={<FiPlus className="h-4 w-4" />}
        >
          {action}
        </Button>
      )}
    </div>
  );
}
