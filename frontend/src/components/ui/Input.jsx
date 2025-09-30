import clsx from "clsx";

const baseStyles =
  "block w-full rounded-xl border bg-slate-900/60 text-slate-100 shadow-inner shadow-black/40 placeholder:text-slate-500 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 transition";

const variants = {
  default: "border-white/10 focus:border-primary-400 focus:ring-primary-500/40",
  error: "border-rose-500/40 focus:border-rose-400 focus:ring-rose-500/40",
  success:
    "border-emerald-500/30 focus:border-emerald-400 focus:ring-emerald-500/40",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-3 text-base",
};

export function Input({
  className,
  variant = "default",
  size = "md",
  prefix,
  suffix,
  ...props
}) {
  // Jika ada prefix/suffix kita bungkus dengan flex container
  if (prefix || suffix) {
    return (
      <div
        className={clsx(
          "flex items-center rounded-xl border bg-slate-900/60 shadow-inner shadow-black/40 focus-within:ring-2",
          variants[variant],
          sizes[size],
          className
        )}
      >
        {prefix && <span className="mr-2 text-slate-400">{prefix}</span>}
        <input
          className="flex-1 bg-transparent outline-none placeholder:text-slate-500 text-slate-100"
          {...props}
        />
        {suffix && <span className="ml-2 text-slate-400">{suffix}</span>}
      </div>
    );
  }

  // Tanpa prefix/suffix
  return (
    <input
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
