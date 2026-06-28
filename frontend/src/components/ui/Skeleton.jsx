export function SkeletonCard() {
  return (
    <div className="card-surface p-5">
      <div className="skeleton h-4 w-3/4" />
      <div className="mt-3 space-y-2">
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-5/6" />
      </div>
      <div className="mt-5 flex gap-2">
        <div className="skeleton h-5 w-16 rounded-full" />
        <div className="skeleton h-5 w-14 rounded-full" />
        <div className="skeleton h-5 w-20 rounded-full" />
      </div>
      <div className="mt-5 border-t border-border pt-4 [html:not(.dark)_&]:border-border-light">
        <div className="flex justify-between">
          <div className="skeleton h-3 w-24" />
          <div className="skeleton h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonStat() {
  return (
    <div className="card-surface p-5">
      <div className="flex items-center justify-between">
        <div className="skeleton h-9 w-9 rounded-lg" />
        <div className="skeleton h-3 w-10" />
      </div>
      <div className="skeleton mt-4 h-7 w-16" />
      <div className="skeleton mt-2 h-3 w-24" />
    </div>
  );
}
