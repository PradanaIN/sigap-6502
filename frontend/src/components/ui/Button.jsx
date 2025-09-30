import clsx from "clsx";

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60";

// Variant styles (fill)
const ACCENT_VARIANTS = new Set(["primary", "danger", "success"]);

const variants = {
  // ⬇️ KEMBALI KE DEFINISI ASLI KAMU (tanpa text-white tambahan)
  primary:
    "bg-primary-600 shadow-lg shadow-primary-600/40 hover:bg-primary-500 focus-visible:ring-primary-600",
  secondary:
    "bg-slate-800 text-slate-100 shadow-inner shadow-slate-900/40 hover:bg-slate-700 focus-visible:ring-slate-500",
  ghost:
    "bg-transparent text-slate-100 hover:bg-slate-800/60 focus-visible:ring-slate-500",
  danger:
    "bg-rose-600 shadow-lg shadow-rose-600/40 hover:bg-rose-500 focus-visible:ring-rose-600",
  success:
    "bg-emerald-600 shadow-lg shadow-emerald-600/40 hover:bg-emerald-500 focus-visible:ring-emerald-600",
};

// Variant styles (outline)
const outlines = {
  primary:
    "border border-primary-600/50 text-primary-200 hover:bg-primary-600/10 focus-visible:ring-primary-600",
  secondary:
    "border border-slate-600 text-slate-200 hover:bg-slate-700/40 focus-visible:ring-slate-500",
  ghost:
    "border border-transparent text-slate-100 hover:bg-slate-800/60 focus-visible:ring-slate-500",
  danger:
    "border border-rose-600/50 text-rose-200 hover:bg-rose-600/10 focus-visible:ring-rose-600",
  success:
    "border border-emerald-600/50 text-emerald-200 hover:bg-emerald-600/10 focus-visible:ring-emerald-600",
};

// Sizes
const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  variant = "primary",
  outline = false,
  size = "md",
  iconOnly = false, // ⬅️ hanya tambah ini
  className,
  children,
  ...props
}) {
  const iconTint =
    outline && variant === "danger" && iconOnly
      ? "text-rose-600 hover:text-rose-700 [.theme-dark_&]:text-rose-300 [.theme-dark_&]:hover:text-rose-200"
      : "";

  return (
    <button
      data-accent={
        !outline && ACCENT_VARIANTS.has(variant) ? variant : undefined
      }
      className={clsx(
        baseClasses,
        iconOnly ? "h-9 w-9 p-0 gap-0 rounded-lg" : sizes[size], // ⬅️ ukuran khusus ikon-only
        outline ? outlines[variant] : variants[variant],
        iconTint,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
