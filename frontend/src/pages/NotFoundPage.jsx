import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [copied, setCopied] = useState(false);

  const missingPath = `${location.pathname}${location.search || ""}`;
  const ts = new Date().toLocaleString("id-ID");

  useEffect(() => {
    document.title = "404 — Halaman Tidak Ditemukan";
  }, []);

  const copyDetails = async () => {
    try {
      const txt = `404 Not Found
Path: ${missingPath}
Waktu: ${ts}`;
      await navigator.clipboard?.writeText(txt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // no-op
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50 text-slate-900 [.theme-dark_&]:bg-slate-950 [.theme-dark_&]:text-slate-100">
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_20%_10%,rgba(56,189,248,0.18),transparent_60%),radial-gradient(50%_50%_at_85%_30%,rgba(99,102,241,0.16),transparent_55%)]" />
      <div className="pointer-events-none absolute -left-1/4 top-1/3 h-[420px] w-[55%] rounded-full bg-sky-500/15 blur-3xl [.theme-dark_&]:bg-primary-500/20" />
      <div className="pointer-events-none absolute -right-1/4 bottom-1/4 h-[300px] w-[40%] rounded-full bg-indigo-400/10 blur-3xl" />

      {/* Card */}
      <div className="relative z-10 mx-auto max-w-xl rounded-3xl border border-white/10 bg-gradient-to-br from-white/70 to-white/60 p-10 text-center shadow-xl backdrop-blur-md [.theme-dark_&]:from-slate-900/80 [.theme-dark_&]:to-slate-800/80">
        {/* Big 404 watermark */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-8 left-1/2 -z-10 -translate-x-1/2 select-none text-8xl font-black tracking-tighter text-slate-200/60 blur-[1px] [.theme-dark_&]:text-white/5"
        >
          404
        </div>

        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/40 px-3 py-1 text-[11px] font-semibold tracking-wide text-slate-600 [.theme-dark_&]:bg-white/5 [.theme-dark_&]:text-slate-200">
          404 • Not Found
        </span>

        <h1 className="mt-3 text-3xl font-bold text-slate-800 [.theme-dark_&]:text-white">
          Halaman Tidak Ditemukan
        </h1>

        <p className="mt-3 text-sm text-slate-500 [.theme-dark_&]:text-slate-400">
          Maaf, halaman yang Anda cari tidak tersedia atau alamatnya salah.
          Silakan kembali atau menuju beranda.
        </p>

        {/* Detail path */}
        <div className="mt-5 rounded-xl border border-white/10 bg-white/50 p-3 text-left text-xs text-slate-600 shadow-inner [.theme-dark_&]:bg-white/5 [.theme-dark_&]:text-slate-300">
          <div className="flex items-start justify-between gap-3">
            <div className="overflow-hidden">
              <div className="font-semibold">Path:</div>
              <div className="truncate">{missingPath || "/"}</div>
              <div className="mt-1 text-[11px] opacity-70">Waktu: {ts}</div>
            </div>
            <button
              type="button"
              onClick={copyDetails}
              className="shrink-0 rounded-md border border-white/10 bg-white/60 px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-white/80 [.theme-dark_&]:bg-white/10 [.theme-dark_&]:text-slate-200 [.theme-dark_&]:hover:bg-white/15"
              aria-label="Salin detail"
            >
              {copied ? "Tersalin" : "Salin"}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-full border border-white/10 px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-slate-700 transition hover:scale-105 hover:border-slate-300/60 hover:bg-white/60 [.theme-dark_&]:text-slate-100 [.theme-dark_&]:hover:border-white/30 [.theme-dark_&]:hover:bg-white/10"
          >
            Kembali
          </button>

          <Link
            to="/"
            data-accent="cta"
            className="rounded-full bg-sky-600 px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-on-accent shadow-lg shadow-sky-600/30 transition hover:scale-105 hover:bg-sky-500 hover:shadow-sky-500/40"
          >
            Ke Halaman Utama
          </Link>

          <Link
            to="/admin/login"
            className="rounded-full border border-white/10 px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-slate-700 transition hover:scale-105 hover:border-slate-300/60 hover:bg-white/60 [.theme-dark_&]:text-slate-100 [.theme-dark_&]:hover:border-white/30 [.theme-dark_&]:hover:bg-white/10"
          >
            Masuk Admin
          </Link>
        </div>

        {/* Hints */}
        <p className="mt-4 text-[11px] text-slate-500 [.theme-dark_&]:text-slate-400">
          Tip: Tekan{" "}
          <kbd className="rounded bg-white/60 px-1 py-0.5 text-[10px] [.theme-dark_&]:bg-white/10">
            Alt
          </kbd>{" "}
          +{" "}
          <kbd className="rounded bg-white/60 px-1 py-0.5 text-[10px] [.theme-dark_&]:bg-white/10">
            ←
          </kbd>{" "}
          untuk kembali cepat.
        </p>
      </div>
    </div>
  );
}
