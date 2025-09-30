import clsx from "clsx";
import { Skeleton } from "./Skeleton"; // ⬅️ sesuaikan path kalau beda

function toneToKey(tone) {
  if (tone === "emerald") return "success";
  if (tone === "amber") return "warning";
  if (tone === "sky") return "info";
  if (tone === "rose") return "danger";
  return "neutral";
}

/**
 * @param {Object} props
 * @param {string} props.label
 * @param {React.ReactNode} props.value
 * @param {string=} props.helper
 * @param {"slate" | "emerald" | "amber" | "sky" | "rose"} [props.tone]
 * @param {boolean=} props.loading
 * @param {"onDark" | "onLight"} [props.loadingTone]
 */
export function MetricCard({
  label,
  value,
  helper,
  tone = "slate",
  loading = false,
  loadingTone = "onDark", // ⬅️ default aman untuk Ringkasan Harian (card gelap)
}) {
  const key = toneToKey(tone);

  if (loading) {
    const toneProp = loadingTone === "onLight" ? "onLight" : "onDark";
    return (
      <div
        className={clsx(
          "rounded-2xl border px-5 py-4 shadow-lg backdrop-blur-sm",
          // sedikit kontras agar skeleton tidak “menyatu” di light mode
          "border-white/10 bg-slate-950/60"
        )}
      >
        <Skeleton
          tone={toneProp}
          effect="shimmer"
          className="h-3 w-24 mb-3 rounded-full"
        />
        <Skeleton
          tone={toneProp}
          effect="shimmer"
          className="h-6 w-28 mb-2 rounded-full"
        />
        <Skeleton
          tone={toneProp}
          effect="shimmer"
          className="h-3 w-40 rounded-full"
        />
      </div>
    );
  }

  const style = {
    backgroundColor: `var(--tone-${key}-bg)`,
    color: `var(--tone-${key}-text)`,
    borderColor: `var(--tone-${key}-border)`,
  };

  return (
    <div
      style={style}
      className={clsx(
        "rounded-2xl border px-5 py-4 shadow-lg backdrop-blur-sm transition",
        "hover:-translate-y-0.5 hover:shadow-xl"
      )}
    >
      <p
        className="text-xs font-semibold uppercase tracking-wide"
        style={{ color: "var(--tone-neutral-text, currentColor)" }}
      >
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      {helper ? (
        <p className="mt-2 text-xs" style={{ color: "var(--text-2)" }}>
          {helper}
        </p>
      ) : null}
    </div>
  );
}
