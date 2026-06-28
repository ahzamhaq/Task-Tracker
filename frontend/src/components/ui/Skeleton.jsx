export function SkeletonRow() {
  return (
    <div className="glass-card flex items-center gap-3 p-4">
      <div className="skeleton h-4 w-4 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-3.5 w-1/2" />
        <div className="skeleton h-3 w-2/3" />
      </div>
      <div className="hidden gap-2 sm:flex">
        <div className="skeleton h-5 w-14 rounded-full" />
        <div className="skeleton h-5 w-12 rounded-full" />
      </div>
      <div className="skeleton h-5 w-16 rounded-full" />
      <div className="skeleton h-5 w-20 rounded-full" />
    </div>
  );
}

export function SkeletonStat() {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between">
        <div className="skeleton h-8 w-8 rounded-lg" />
        <div className="skeleton h-3 w-10" />
      </div>
      <div className="skeleton mt-4 h-7 w-14" />
      <div className="skeleton mt-2 h-3 w-24" />
    </div>
  );
}
