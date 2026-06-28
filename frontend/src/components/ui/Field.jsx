import { forwardRef } from "react";

const baseInput =
  "w-full rounded-btn border border-app bg-[color:var(--c-surface)] px-3 py-2 text-[13.5px] text-[color:var(--c-ink)] placeholder:text-muted-2 transition focus:border-brand/60 disabled:opacity-50";

export function FieldShell({ label, hint, error, required, children }) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-[12.5px] font-medium">
          {label}
          {required && <span className="ml-0.5 text-danger">*</span>}
        </span>
        {hint && !error && (
          <span className="text-[11px] text-muted-2">{hint}</span>
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
