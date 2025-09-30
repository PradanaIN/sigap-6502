import { Link } from "react-router-dom";
import { ThemeToggle } from "../ThemeToggle";
import { useCallback } from "react";

export function PublicLayout({ children }) {
  // Smooth scroll ke section dengan offset tinggi header (56/64px)
  const scrollToId = useCallback(
    (id) => (e) => {
      e.preventDefault();
      const el = document.getElementById(id);
      if (!el) return;
      const isMd =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(min-width: 768px)").matches;
      const headerH = isMd ? 64 : 56; // h-16 / h-14
      const y = el.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top: y, behavior: "smooth" });
    },
    []
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 [.theme-dark_&]:bg-slate-950 [.theme-dark_&]:text-slate-100">
      {/* Skip to content */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-lg focus:px-3 focus:py-1.5 focus:bg-slate-900 focus:text-white [.theme-dark_&]:focus:bg-white [.theme-dark_&]:focus:text-slate-900"
      >
        Loncat ke konten
      </a>

      {/* Background layers (netral) */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_20%_10%,rgba(100,116,139,0.18),transparent_60%)] [.theme-dark_&]:bg-[radial-gradient(60%_50%_at_20%_10%,rgba(255,255,255,0.15),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-[-20%] -z-10 w-[60%] rounded-full bg-slate-400/15 blur-3xl [.theme-dark_&]:bg-white/10" />

      {/* Header: fixed & bebas dari gaya prose */}
      <header className="fixed inset-x-0 top-0 z-50 h-14 md:h-16 not-prose border-b border-slate-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md shadow-sm shadow-slate-900/5 [.theme-dark_&]:border-white/10 [.theme-dark_&]:bg-slate-950/80 [.theme-dark_&]:shadow-slate-900/20">
        <nav className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 not-prose">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-bold tracking-tight !text-slate-900 hover:opacity-90 visited:!text-slate-900 [.theme-dark_&]:!text-white [.theme-dark_&]:visited:!text-white"
          >
            <img src="/logo.png" alt="SIGAP" className="h-7 w-7 rounded" />
            <span>SIGAP 6502</span>
          </Link>

          {/* Menu kanan */}
          <div className="flex items-center gap-3 md:gap-4 text-xs font-semibold uppercase tracking-wide text-slate-700 [.theme-dark_&]:text-slate-300">
            <div className="hidden items-center gap-3 md:flex md:gap-4">
              <ThemeToggle className="h-9" />

            {/* Link nav: pakai ! untuk mengalahkan gaya global/prose */}
              <a
                href="#public-activity"
                onClick={scrollToId("public-activity")}
                className="rounded-md px-1.5 py-1 !no-underline !text-slate-900 visited:!text-slate-900 hover:!text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white [.theme-dark_&]:!text-slate-100 [.theme-dark_&]:visited:!text-slate-100 [.theme-dark_&]:hover:!text-white [.theme-dark_&]:focus-visible:ring-offset-slate-900"
              >
                Aktivitas
              </a>

              <a
                href="#public-stats"
                onClick={scrollToId("public-stats")}
                className="rounded-md px-1.5 py-1 !no-underline !text-slate-900 visited:!text-slate-900 hover:!text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white [.theme-dark_&]:!text-slate-100 [.theme-dark_&]:visited:!text-slate-100 [.theme-dark_&]:hover:!text-white [.theme-dark_&]:focus-visible:ring-offset-slate-900"
              >
                Statistik
              </a>

              <a
                href="#schedule"
                onClick={scrollToId("schedule")}
                className="rounded-md px-1.5 py-1 !no-underline !text-slate-900 visited:!text-slate-900 hover:!text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white [.theme-dark_&]:!text-slate-100 [.theme-dark_&]:visited:!text-slate-100 [.theme-dark_&]:hover:!text-white [.theme-dark_&]:focus-visible:ring-offset-slate-900"
              >
                Jadwal
              </a>
            </div>

            {/* Tombol Admin */}
            <div className="flex items-center">
              <Link
                to="/admin/login"
                data-accent="cta"
                className="
                inline-flex items-center justify-center gap-1.5
                rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide
                !bg-slate-900 !text-white no-underline visited:!text-white
                shadow-md shadow-slate-900/20 ring-1 ring-black/10
                hover:!bg-slate-800 active:!bg-slate-900
                focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white
                [.theme-dark_&]:!bg-white [.theme-dark_&]:!text-slate-900 [.theme-dark_&]:ring-white/20
                [.theme-dark_&]:hover:!bg-slate-200 [.theme-dark_&]:hover:!text-slate-900
                [.theme-dark_&]:focus-visible:ring-offset-slate-950
              "
              >
                Admin
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content (ditambah padding-top sesuai tinggi header) */}
      <main
        id="main"
        className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-14 md:pt-16 pb-12 md:pb-16 scroll-mt-24"
      >
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 bg-white/70 pb-6 pt-10 text-sm text-slate-500 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md [.theme-dark_&]:border-white/10 [.theme-dark_&]:bg-slate-950/80 [.theme-dark_&]:text-slate-400">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p>&copy; 2025 Badan Pusat Statistik Kabupaten Bulungan</p>
        </div>
      </footer>
    </div>
  );
}
