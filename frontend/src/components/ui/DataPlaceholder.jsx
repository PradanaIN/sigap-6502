import clsx from "clsx";

const baseStyles =
  "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed text-center";

const variants = {
  default: "border-white/10 bg-slate-900/60 text-slate-300",
  info: "border-sky-400/30 bg-sky-500/5 text-sky-200",
  warning: "border-amber-400/30 bg-amber-500/5 text-amber-200",
  danger: "border-rose-400/30 bg-rose-500/5 text-rose-200",
};

const sizes = {
  sm: "min-h-[140px] p-6",
  md: "min-h-[180px] p-8",
  lg: "min-h-[220px] p-10",
};

export function DataPlaceholder({
  icon,
  title,
  description,
  action,
  variant = "default",
  size = "md",
  className,
  ...props
}) {
  return (
    <div
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {icon ? <div className="text-4xl text-primary-300">{icon}</div> : null}

      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {description && <p className="text-sm text-slate-400">{description}</p>}
      </div>

      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
