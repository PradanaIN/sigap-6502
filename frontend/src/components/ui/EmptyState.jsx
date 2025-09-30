import clsx from "clsx";
import { Button } from "./Button";

const baseStyles =
  "flex flex-col items-center justify-center rounded-2xl border border-dashed text-center transition-all";

const variants = {
  default: "border-white/10 bg-slate-900/40 text-slate-300",
  info: "border-sky-400/30 bg-sky-500/5 text-sky-200",
  warning: "border-amber-400/30 bg-amber-500/5 text-amber-200",
  danger: "border-rose-400/30 bg-rose-500/5 text-rose-200",
};

const sizes = {
  sm: "p-6 text-sm",
  md: "p-10 text-base",
  lg: "p-12 text-lg",
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  variant = "default",
  size = "md",
  className,
  actionVariant = "secondary",
}) {
  return (
    <div
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
    >
      {icon && <div className="mb-3 text-4xl text-primary-300">{icon}</div>}
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-sm text-slate-400">{description}</p>
      )}
      {actionLabel && (
        <Button
          className="mt-4"
          onClick={onAction}
          variant={actionVariant}
          size={size === "lg" ? "lg" : "md"}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
