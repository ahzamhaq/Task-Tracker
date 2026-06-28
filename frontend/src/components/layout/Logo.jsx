export default function Logo({ className = "" }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand">
        <span className="h-2.5 w-2.5 rounded-full bg-white/95" />
      </span>
      <span className="text-[15px] font-semibold tracking-tight">
        TaskFlow
      </span>
    </div>
  );
}
