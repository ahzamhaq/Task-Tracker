import { forwardRef } from "react";

const variants = {
  primary:
    "bg-brand text-white hover:bg-brand-hover active:bg-brand-hover disabled:bg-brand/50",
  secondary:
    "bg-surface text-ink border border-border hover:border-brand/60 hover:text-ink disabled:opacity-50 [html:not(.dark)_&]:bg-surface-light [html:not(.dark)_&]:border-border-light [html:not(.dark)_&]:text-ink-light",
  ghost:
    "text-muted hover:text-ink hover:bg-surface disabled:opacity-50 [html:not(.dark)_&]:hover:bg-surface-light [html:not(.dark)_&]:hover:text-ink-light",
  danger:
    "bg-transparent text-danger border border-transparent hover:bg-danger/10 disabled:opacity-50",
  "danger-solid":
    "bg-danger text-white hover:bg-red-600 disabled:bg-danger/50",
};

const sizes = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-9 px-4 text-sm",
  lg: "h-10 px-5 text-sm",
  icon: "h-9 w-9",
};

const Button = forwardRef(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    children,
    className = "",
    type = "button",
    ...rest
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-btn font-medium transition disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {loading ? (
        <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-r-transparent" />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  );
});

export default Button;
