import clsx from "clsx";
import { Link, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import { Button } from "../ui/Button";
import { ThemeToggle } from "../ThemeToggle";
import { Drawer } from "../ui/Drawer";
import {
  Home,
  Sliders,
  Users,
  Calendar as CalIcon,
  FileText,
  LogOut,
  Menu,
  MessageSquareText,
} from "../ui/icons";
import { useConfirm } from "../ui/ConfirmProvider.jsx";
import { Skeleton } from "../ui/Skeleton";
import { useDocumentTitle } from "../../utils/useDocumentTitle.js";

export function AdminLayout({
  username = "Admin",
  onLogout = () => {},
  isLoggingOut = false,
  loading = false,
  title,
  children,
}) {
  const { confirm } = useConfirm();
  const { pathname } = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useDocumentTitle(title, { defaultTitle: "SIGAP 6502 Admin" });

  const navItems = useMemo(
    () => [
      { to: "/admin/dashboard", label: "Dashboard", icon: Home },
      { to: "/admin/overrides", label: "Override", icon: Sliders },
      { to: "/admin/contacts", label: "Kontak", icon: Users },
      { to: "/admin/holidays", label: "Kalender", icon: CalIcon },
      { to: "/admin/templates", label: "Template", icon: FileText },
      { to: "/admin/quotes", label: "Quotes", icon: MessageSquareText },
    ],
    []
  );

  const initials = useMemo(() => {
    const s = String(username || "A").trim();
    const parts = s.split(/\s+/);
    return (parts[0]?.[0] || "A").toUpperCase();
  }, [username]);

  const NavList = ({ onNavigate, variant = "full" }) => {
    const compact = variant === "rail";
    return (
      <nav aria-label="Menu admin" className="not-prose">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const { to, label } = item;
            const IconComponent = item.icon;
            const active = pathname.startsWith(to);
            return (
              <li key={to}>
                <Link
                  to={to}
                  onClick={() => onNavigate?.()}
                  aria-current={active ? "page" : undefined}
                  aria-label={label}
                  title={label}
                  className={clsx(
                    "group relative flex items-center rounded-xl py-2 text-sm font-medium transition focus:outline-none !no-underline",
                    compact
                      ? "justify-center lg:justify-start gap-2 px-2 lg:px-3"
                      : "justify-start gap-3 px-3",
                    active
                      ? "bg-slate-900/5 !text-slate-900 ring-1 ring-slate-400/30 hover:bg-slate-900/10 visited:!text-slate-900"
                      : "!text-slate-800 hover:bg-slate-900/5 hover:!text-slate-950 visited:!text-slate-800",
                    "[.theme-dark_&]:data-[active=true]:bg-white/10 [.theme-dark_&]:data-[active=true]:!text-white [.theme-dark_&]:data-[active=true]:ring-1 [.theme-dark_&]:data-[active=true]:ring-white/20",
                    "[.theme-dark_&]:!text-slate-300 [.theme-dark_&]:hover:bg-white/5 [.theme-dark_&]:hover:!text-white [.theme-dark_&]:visited:!text-slate-300",
                    "focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 [.theme-dark_&]:focus-visible:ring-slate-500 [.theme-dark_&]:focus-visible:ring-offset-slate-900"
                  )}
                  data-active={active || undefined}
                >
                  {/* indikator aktif di kiri */}
                  <span
                    aria-hidden
                    className={clsx(
                      "absolute left-0 top-1/2 h-5 -translate-y-1/2 rounded-r-md transition-all",
                      active
                        ? "w-1.5 bg-slate-900 [.theme-dark_&]:bg-white"
                        : "w-0"
                    )}
                  />
                  <IconComponent
                    size={18}
                    className={clsx("opacity-90", active && "opacity-100")}
                  />
                  <span
                    className={clsx(compact ? "hidden lg:inline" : "inline")}
                  >
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 [.theme-dark_&]:bg-slate-950 [.theme-dark_&]:text-slate-100">
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-lg focus:px-3 focus:py-1.5
                   focus:bg-slate-900 focus:text-white
                   [.theme-dark_&]:focus:bg-white [.theme-dark_&]:focus:text-slate-900"
      >
        Loncat ke konten
      </a>

      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_20%_10%,rgba(100,116,139,0.18),transparent_60%)] [.theme-dark_&]:bg-[radial-gradient(60%_50%_at_20%_10%,rgba(255,255,255,0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-[12%] -z-10 h-72 bg-gradient-to-r from-slate-400/20 via-slate-500/15 to-slate-400/20 blur-3xl [.theme-dark_&]:from-white/15 [.theme-dark_&]:via-white/10 [.theme-dark_&]:to-white/15" />

      {/* Topbar: FIXED */}
      <header className="fixed inset-x-0 top-0 z-50 h-14 md:h-16 not-prose border-b border-slate-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md shadow-sm shadow-slate-900/5 [.theme-dark_&]:border-white/10 [.theme-dark_&]:bg-slate-950/80 [.theme-dark_&]:shadow-slate-900/20">
        <nav className="mx-auto flex h-full max-w-7xl items-center justify-between gap-3 px-4 not-prose">
          <div className="flex items-center gap-2">
            <button
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300/60 bg-white/60 text-slate-700 hover:bg-white/80 md:hidden [.theme-dark_&]:border-white/10 [.theme-dark_&]:bg-slate-900/60 [.theme-dark_&]:text-slate-200 [.theme-dark_&]:hover:bg-slate-900/80"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Buka menu"
            >
              <Menu size={18} />
            </button>
            <Link
              to="/"
              className="flex items-center text-lg font-semibold tracking-tight !text-slate-900 hover:opacity-90 no-underline visited:!text-slate-900 [.theme-dark_&]:!text-white [.theme-dark_&]:visited:!text-white"
            >
              <img
                src="/logo.png"
                alt="SIGAP"
                className="mr-2 h-6 w-6 rounded"
              />
              <span>SIGAP 6502</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {loading ? (
              <>
                <Skeleton
                  className="hidden h-9 w-28 rounded-xl sm:block"
                  effect="shimmer"
                />
                <Skeleton
                  className="h-9 w-24 rounded-xl sm:hidden"
                  effect="shimmer"
                />
              </>
            ) : (
              <span className="hidden items-center gap-2 rounded-full border border-slate-200/70 bg-white/60 px-2.5 py-1.5 text-sm text-slate-700 sm:inline-flex [.theme-dark_&]:border-white/10 [.theme-dark_&]:bg-white/5 [.theme-dark_&]:text-slate-200">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-slate-900 text-[11px] font-bold text-white [.theme-dark_&]:bg-white [.theme-dark_&]:text-slate-900">
                  {initials}
                </span>
                <span className="truncate max-w-[12ch]" title={username}>
                  {username}
                </span>
              </span>
            )}

            <ThemeToggle className="h-9" />

            {loading ? (
              <Skeleton className="h-9 w-24 rounded-xl" effect="shimmer" />
            ) : (
              <Button
                variant="danger"
                size="sm"
                onClick={async () => {
                  const ok = await confirm({
                    title: "Keluar akun?",
                    message: "Anda akan keluar dari dashboard admin.",
                    confirmText: "Keluar",
                    variant: "danger",
                  });
                  if (ok) onLogout();
                }}
                disabled={isLoggingOut}
                className="h-9"
              >
                {isLoggingOut ? "Keluar..." : "Keluar"}
                <LogOut size={16} />
              </Button>
            )}
          </div>
        </nav>
      </header>

      {/* Shell with sidebar (offset header) */}
      <div className="pt-14 md:pt-16">
        {/* lg: satu kolom + padding kiri 200px untuk ruang sidebar fixed */}
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 md:grid-cols-[64px_minmax(0,1fr)] lg:grid-cols-1 lg:pl-[200px]">
          {/* Sidebar: md=rail sticky, lg=fixed (selalu nempel) */}
          <aside
            className={clsx(
              // sembunyikan di <md>
              "hidden md:block not-prose",
              // lg: fixed 200px, penuh tinggi viewport minus header
              "lg:fixed lg:left-0 lg:top-16 lg:z-40 lg:h-[calc(100vh-64px)] lg:w-[200px]"
            )}
            aria-label="Sidebar admin"
          >
            {/* md: wrapper sticky di bawah header */}
            <div className="md:sticky md:top-16 lg:static">
              <div className="border-r border-slate-200/60 bg-white/50 px-2 py-4 lg:px-3 [.theme-dark_&]:border-white/10 [.theme-dark_&]:bg-slate-950/60 h-full">
                {/* md: scroll area berdasarkan viewport; lg: penuh & scrollable */}
                <div className="md:max-h-[calc(100vh-64px)] md:overflow-y-auto lg:h-full lg:max-h-none lg:overflow-y-auto pr-1">
                  <NavList variant="rail" />
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main id="main" className="relative z-10 px-4 py-8 sm:py-12 md:py-16">
            {children}
            <div className="h-[env(safe-area-inset-bottom,0)]" />
          </main>
        </div>
      </div>

      {/* Mobile Drawer Sidebar: ikon + label */}
      <Drawer
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        side="left"
        title="Menu Admin"
        size="sm"
      >
        <NavList
          variant="full"
          onNavigate={() => setMobileSidebarOpen(false)}
        />
      </Drawer>
    </div>
  );
}
