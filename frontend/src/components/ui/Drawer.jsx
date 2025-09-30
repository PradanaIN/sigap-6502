import { useEffect, useRef } from "react";
import clsx from "clsx";

export function Drawer({
  open,
  onClose,
  title,
  side = "right",
  children,
  size = "sm",
  panelClassName = "",
  backdropClassName = "",
  closeOnBackdrop = true,
  closeOnEsc = true,
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open || !closeOnEsc) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeOnEsc, onClose]);

  useEffect(() => {
    if (open) {
      const el = panelRef.current?.querySelector("[data-drawer-focus]");
      el?.focus();
    }
  }, [open]);

  const widthClass = size === "lg" ? "w-80" : size === "md" ? "w-72" : "w-64";
  const sidePos = side === "right" ? "right-0" : "left-0";
  const sideClosed =
    side === "right" ? "translate-x-full" : "-translate-x-full";
  const sideBorder =
    side === "right"
      ? "border-l border-slate-200/60 [.theme-dark_&]:border-white/10"
      : "border-r border-slate-200/60 [.theme-dark_&]:border-white/10";

  return (
    <div
      aria-hidden={!open}
      className={clsx(
        "fixed inset-0 z-[60] transition",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
    >
      <div
        className={clsx(
          "absolute inset-0 bg-black/40 backdrop-blur-[1px] transition-opacity",
          open ? "opacity-100" : "opacity-0",
          backdropClassName
        )}
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title || "Panel"}
        className={clsx(
          "absolute h-full",
          sidePos,
          widthClass,
          "max-w-[85vw] sm:max-w-[80vw]",
          "bg-white text-slate-900 [.theme-dark_&]:bg-slate-950 [.theme-dark_&]:text-slate-100",
          sideBorder,
          "shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : sideClosed,
          panelClassName
        )}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/60 [.theme-dark_&]:border-white/10">
          <h3 className="text-sm font-semibold" tabIndex={-1} data-drawer-focus>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400
                     [.theme-dark_&]:text-slate-200 [.theme-dark_&]:hover:bg-white/10"
          >
            Tutup
          </button>
        </div>
        <div className="h-[calc(100%-48px)] overflow-auto p-4">
          {children}
          <div className="h-[env(safe-area-inset-bottom,0)]" />
        </div>
      </div>
    </div>
  );
}
