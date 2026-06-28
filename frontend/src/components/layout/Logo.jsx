export default function Logo({ className = "" }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-hover shadow-soft">
        <span className="h-2 w-2 rounded-full bg-white/95" />
        <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/15" />
      </span>
      <span className="text-[15px] font-semibold tracking-tight">TaskFlow</span>
    </div>
  );
}
