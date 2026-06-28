const tones = {
  muted:
    "bg-border/40 text-muted [html:not(.dark)_&]:bg-border-light/70 [html:not(.dark)_&]:text-ink-light-muted",
  brand: "bg-brand/15 text-brand",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
  purple: "bg-purple-500/15 text-purple-300 [html:not(.dark)_&]:text-purple-600",
  blue: "bg-blue-500/15 text-blue-300 [html:not(.dark)_&]:text-blue-600",
  orange:
    "bg-orange-500/15 text-orange-300 [html:not(.dark)_&]:text-orange-600",
  gray:
    "bg-slate-500/15 text-slate-300 [html:not(.dark)_&]:text-slate-600",
};

export const priorityTone = (p) =>
  p === "High" ? "danger" : p === "Low" ? "blue" : "orange";

export const statusTone = (s) =>
  s === "Completed" ? "success" : s === "In Progress" ? "purple" : "gray";

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
