import { useEffect } from "react";
import clsx from "clsx";

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
  footer, // ⬅️ konten tombol aksi (Batal / Simpan)
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      aria-hidden={!open}
      className={clsx(
        "fixed inset-0 z-[70] flex items-center justify-center p-4 transition",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
    >
      {/* Backdrop */}
      <div
        className={clsx(
          "absolute inset-0 bg-black/50 transition-opacity",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className={clsx(
          "relative w-full rounded-2xl border bg-slate-950 text-slate-100 shadow-2xl",
          "card-surface",
          maxWidth,
          open ? "scale-100 opacity-100" : "scale-95 opacity-0",
          "transition-all"
        )}
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--card-border)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
          <h3 className="text-sm font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-xs text-slate-300 hover:bg-white/10"
          >
            Tutup
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-auto p-5">{children}</div>

        {/* Footer (aksi di kanan) */}
        {footer ? (
          <div className="flex items-center justify-end gap-2 border-t border-white/10 px-5 py-3">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
