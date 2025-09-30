import clsx from "clsx";

const baseStyles = "block font-semibold tracking-wide uppercase";

const variants = {
  default: "text-slate-300",
  error: "text-rose-400",
  success: "text-emerald-400",
  disabled: "text-slate-500 cursor-not-allowed",
};

const sizes = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

export function Label({
  className,
  children,
  variant = "default",
  size = "md",
  required = false,
  ...props
}) {
  return (
    <label
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
      {required && (
        <span className="ml-1 text-rose-400" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}
