import { forwardRef } from "react";

const baseInput =
  "w-full rounded-btn border border-border bg-surface/60 px-3 py-2 text-sm text-ink placeholder:text-muted transition focus:border-brand disabled:opacity-50 [html:not(.dark)_&]:bg-surface-light [html:not(.dark)_&]:border-border-light [html:not(.dark)_&]:text-ink-light";

export function FieldShell({ label, hint, error, required, children }) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-[13px] font-medium text-ink">
          {label}
          {required && <span className="ml-0.5 text-danger">*</span>}
        </span>
        {hint && !error && (
          <span className="text-[11px] text-muted">{hint}</span>
        )}
      </div>
      {children}
      {error && (
        <p className="mt-1.5 text-[12px] text-danger">{error}</p>
      )}
    </label>
  );
}

export const Input = forwardRef(function Input(
  { className = "", ...props },
  ref
) {
  return <input ref={ref} className={`${baseInput} ${className}`} {...props} />;
});

export const Textarea = forwardRef(function Textarea(
  { className = "", rows = 3, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={`${baseInput} resize-none ${className}`}
      {...props}
    />
  );
});

export const Select = forwardRef(function Select(
  { className = "", children, ...props },
  ref
) {
  return (
    <select
      ref={ref}
      className={`${baseInput} cursor-pointer pr-8 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
});
