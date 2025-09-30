import clsx from "clsx";

const baseStyles = "rounded-2xl border shadow-xl backdrop-blur-sm transition-all focus-within:ring-1 card-surface";

const variants = {
  default: "border-white/5 bg-slate-900/70 shadow-slate-900/40",
  glass: "border-white/10 bg-white/5 shadow-black/20 backdrop-blur-md",
  solid: "border-slate-800 bg-slate-900 shadow-slate-950/30",
};

const paddings = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  className,
  children,
  variant = "default",
  padding = "md",
  header,
  footer,
  ...props
}) {
  return (
    <div className={clsx(baseStyles, variants[variant], paddings[padding], className)} style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }} {...props}>
      {header && (
        <div className="mb-4 border-b border-white/10 pb-3">{header}</div>
      )}
      {children}
      {footer && (
        <div className="mt-4 border-t border-white/10 pt-3">{footer}</div>
      )}
    </div>
  );
}


