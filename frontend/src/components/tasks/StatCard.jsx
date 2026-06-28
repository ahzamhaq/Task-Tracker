const toneStyles = {
  brand: "text-brand bg-brand/10",
  warning: "text-warning bg-warning/10",
  purple:
    "text-purple-400 bg-purple-500/10 [html:not(.dark)_&]:text-purple-600",
  success: "text-success bg-success/10",
};

export default function StatCard({ icon: Icon, label, value, subtitle, tone = "brand", delta }) {
  return (
    <div className="card-surface p-5 transition hover:border-border/80 [html:not(.dark)_&]:hover:border-border-light">
      <div className="flex items-center justify-between">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${toneStyles[tone]}`}
        >
          <Icon className="h-4 w-4" />
        </div>
        {delta != null && (
          <span className="text-[11px] font-medium text-muted">{delta}</span>
        )}
      </div>
      <div className="mt-4">
        <div className="text-2xl font-semibold tracking-tight tabular-nums">
          {value}
        </div>
        <div className="mt-1 text-[13px] text-muted">
          <span className="font-medium text-ink">{label}</span>
          {subtitle && <span className="ml-1.5">· {subtitle}</span>}
        </div>
      </div>
    </div>
  );
}
