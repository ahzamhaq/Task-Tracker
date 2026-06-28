import { forwardRef } from "react";
import { motion } from "framer-motion";

const variants = {
  primary:
    "bg-brand text-white hover:bg-brand-hover disabled:bg-brand/50 shadow-soft",
  secondary:
    "bg-[color:var(--c-surface)] text-[color:var(--c-ink)] border border-app hover:border-app-strong",
  ghost:
    "text-muted hover:text-[color:var(--c-ink)] hover:bg-[color:var(--c-border)]",
  danger: "text-danger hover:bg-danger/10",
  "danger-solid": "bg-danger text-white hover:bg-red-600 disabled:bg-danger/50",
};

const sizes = {
  sm: "h-8 px-3 text-[12.5px]",
  md: "h-9 px-3.5 text-[13px]",
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
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      whileTap={disabled || loading ? undefined : { scale: 0.97 }}
      whileHover={disabled || loading ? undefined : { scale: 1.015 }}
      transition={{ type: "spring", stiffness: 380, damping: 24 }}
      className={`inline-flex items-center justify-center gap-1.5 rounded-btn font-medium tracking-tight transition-colors disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {loading ? (
        <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-r-transparent" />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </motion.button>
  );
});

export default Button;
