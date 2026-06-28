const tones = {
  muted: "bg-[color:var(--c-border)] text-muted",
  brand: "bg-brand/12 text-brand",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
  purple: "bg-purple-500/15 text-purple-400 dark:text-purple-300",
  blue: "bg-sky-500/15 text-sky-500 dark:text-sky-300",
  orange: "bg-orange-500/15 text-orange-500 dark:text-orange-300",
  pink: "bg-pink-500/15 text-pink-500 dark:text-pink-300",
  emerald: "bg-emerald-500/15 text-emerald-500 dark:text-emerald-300",
  gray: "bg-slate-500/15 text-slate-500 dark:text-slate-300",
};

export const priorityTone = (p) =>
  p === "High" ? "danger" : p === "Low" ? "blue" : "orange";

export const statusTone = (s) =>
  s === "Completed" ? "success" : s === "In Progress" ? "purple" : "gray";

const CATEGORY_TONES = ["brand", "purple", "blue", "emerald", "orange", "pink"];
export const categoryTone = (label = "") => {
  let h = 0;
  for (let i = 0; i < label.length; i++) h = (h * 31 + label.charCodeAt(i)) >>> 0;
  return CATEGORY_TONES[h % CATEGORY_TONES.length];
};

export default function Badge({
  children,
  tone = "muted",
  dot = false,
  className = "",
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide ${tones[tone]} ${className}`}
    >
      {dot && (
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-90" />
      )}
      {children}
    </span>
  );
}
