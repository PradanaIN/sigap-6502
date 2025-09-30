import clsx from "clsx";

const variants = {
  default: "bg-slate-200/80 [.theme-dark_&]:bg-slate-800/70",
  light: "bg-slate-100/80 [.theme-dark_&]:bg-slate-700/60",
  dark: "bg-slate-300/80 [.theme-dark_&]:bg-slate-900/70",
};

const shapes = {
  rounded: "rounded-xl",
  circle: "rounded-full",
  square: "rounded-none",
};

export function Skeleton({
  className,
  variant = "default",
  shape = "rounded",
  animated = true,
  effect = "shimmer", // "shimmer" | "pulse" | "none"
  ...props
}) {
  const isShimmer = animated && effect === "shimmer";
  const isPulse = animated && effect === "pulse";

  return (
    <div
      className={clsx(
        "relative overflow-hidden select-none",
        // ring tipis agar tidak menyatu di light/dark
        "ring-1 ring-slate-300/60 [.theme-dark_&]:ring-white/15",
        variants[variant],
        shapes[shape],
        isPulse && "animate-pulse",
        className
      )}
      aria-busy="true"
      aria-live="polite"
      {...props}
    >
      {isShimmer && (
        <>
          <span
            aria-hidden
            className={clsx(
              "pointer-events-none absolute inset-y-0 left-0 -translate-x-full",
              "w-2/3 blur-[2px] animate-shimmer-soft",
              "bg-[linear-gradient(110deg,transparent,rgba(0,0,0,0.06),rgba(255,255,255,0.60),rgba(0,0,0,0.06),transparent)]",
              "opacity-65 mix-blend-overlay",
              "[.theme-dark_&]:hidden"
            )}
          />

          <span
            aria-hidden
            className={clsx(
              "hidden [.theme-dark_&]:block",
              "pointer-events-none absolute inset-y-0 left-0 -translate-x-full",
              "w-2/3 blur-[2px] animate-shimmer-soft",
              "bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.60),transparent)]",
              "opacity-70 mix-blend-screen"
            )}
          />
        </>
      )}
    </div>
  );
}
