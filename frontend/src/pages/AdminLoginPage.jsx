import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin, useSession } from "../queries/auth";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Spinner } from "../components/ui/Spinner";
import {
  Eye,
  EyeOff,
  User,
  Lock,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { data: session, isLoading } = useSession();
  const loginMutation = useLogin();

  const [form, setForm] = useState({
    username: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [touched, setTouched] = useState({ username: false, password: false });

  const userRef = useRef(null);
  const passRef = useRef(null);

  // redirect jika sudah login
  useEffect(() => {
    if (session?.authenticated) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [session, navigate]);

  // title halaman
  useEffect(() => {
    document.title = "Masuk Admin • SIGAP";
  }, []);

  // validasi ringan
  const errors = useMemo(() => {
    const e = {};
    if (!form.username.trim()) e.username = "Username wajib diisi.";
    if (!form.password) e.password = "Password wajib diisi.";
    return e;
  }, [form]);

  const firstErrorKey = useMemo(() => Object.keys(errors)[0], [errors]);

  // fokus ke field pertama yg error saat gagal login
  useEffect(() => {
    if (loginMutation.isError && firstErrorKey) {
      if (firstErrorKey === "username") userRef.current?.focus();
      if (firstErrorKey === "password") passRef.current?.focus();
    }
  }, [loginMutation.isError, firstErrorKey]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched({ username: true, password: true });

    if (Object.keys(errors).length) {
      if (firstErrorKey === "username") userRef.current?.focus();
      if (firstErrorKey === "password") passRef.current?.focus();
      return;
    }

    loginMutation.mutate(
      {
        username: form.username.trim(),
        password: form.password,
        remember: form.remember,
      },
      { onSuccess: () => navigate("/admin/dashboard", { replace: true }) }
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div
      className="relative flex min-h-screen items-start justify-start px-4 py-10 overflow-hidden bg-slate-950 text-slate-100 sm:items-center sm:justify-center sm:px-0 sm:py-0"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_40%_at_20%_10%,rgba(56,189,248,0.15),transparent_60%),radial-gradient(50%_50%_at_80%_20%,rgba(99,102,241,0.18),transparent_55%),radial-gradient(40%_60%_at_50%_90%,rgba(14,165,233,0.12),transparent_60%)]" />
      <div className="absolute inset-x-0 top-[-10%] h-[400px] bg-gradient-to-b from-sky-500/10 via-primary-500/5 to-transparent blur-3xl" />

      {/* Card */}
      <div className="relative z-10 mx-auto w-full max-w-[460px]">
        {/* Gradient border glow */}
        <div className="relative rounded-2xl p-[1px] before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-primary-400/60 before:via-sky-400/40 before:to-transparent before:blur-[6px]">
          <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/70 to-slate-800/70 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            {/* Header */}
            <div className="mb-4 flex flex-col items-start gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" /> Kembali
              </Link>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold tracking-wide text-slate-200">
                <ShieldCheck className="h-3.5 w-3.5" /> SIGAP ADMIN
              </span>
            </div>

            {/* Title */}
            <div className="mb-4 text-center sm:mb-7">
              <div className="inline-flex items-center gap-3">
                <img src="/logo.png" alt="SIGAP" className="h-9 w-9 rounded" />
                <span className="text-xl font-bold tracking-tight text-slate-900 [.theme-dark_&]:text-white sm:text-2xl">
                  SIGAP 6502
                </span>
              </div>
            </div>

            {/* Form */}
            <form
              className="space-y-4 sm:space-y-5"
              onSubmit={handleSubmit}
              noValidate
              aria-busy={loginMutation.isLoading}
            >
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-300">
                  Username
                </Label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                    <User className="h-4 w-4 text-slate-400" />
                  </span>
                  <Input
                    id="username"
                    ref={userRef}
                    autoComplete="username"
                    value={form.username}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, username: e.target.value }))
                    }
                    onBlur={() => setTouched((t) => ({ ...t, username: true }))}
                    required
                    aria-invalid={Boolean(touched.username && errors.username)}
                    aria-describedby={
                      touched.username && errors.username
                        ? "username-error"
                        : undefined
                    }
                    className={[
                      "rounded-lg border-slate-700 bg-slate-900/60 pl-10 focus:border-primary-500 focus:ring focus:ring-primary-500/30",
                      touched.username && errors.username
                        ? "border-rose-500/60 focus:border-rose-400 focus:ring-rose-400/30"
                        : touched.username && !errors.username
                        ? "border-emerald-600/50 focus:border-emerald-500 focus:ring-emerald-500/25"
                        : "",
                    ].join(" ")}
                  />
                </div>
                {touched.username && errors.username ? (
                  <p
                    id="username-error"
                    role="alert"
                    className="flex items-center gap-1.5 text-xs text-rose-300"
                  >
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.username}
                  </p>
                ) : null}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-300">
                    Password
                  </Label>
                  <div className="flex items-center gap-3">
                    {capsLockOn && (
                      <span
                        className="inline-flex items-center gap-1.5 rounded-md border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-xs text-amber-200"
                        aria-live="polite"
                      >
                        <Lock className="h-3.5 w-3.5" />
                        Caps Lock aktif
                      </span>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </span>
                  <Input
                    id="password"
                    ref={passRef}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={form.password}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, password: e.target.value }))
                    }
                    onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                    onKeyUp={(e) =>
                      setCapsLockOn(e.getModifierState?.("CapsLock"))
                    }
                    required
                    aria-invalid={Boolean(touched.password && errors.password)}
                    aria-describedby={
                      touched.password && errors.password
                        ? "password-error"
                        : undefined
                    }
                    className={[
                      "rounded-lg border-slate-700 bg-slate-900/60 pl-10 pr-12 focus:border-primary-500 focus:ring focus:ring-primary-500/30",
                      touched.password && errors.password
                        ? "border-rose-500/60 focus:border-rose-400 focus:ring-rose-400/30"
                        : touched.password && !errors.password
                        ? "border-emerald-600/50 focus:border-emerald-500 focus:ring-emerald-500/25"
                        : "",
                    ].join(" ")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword
                        ? "Sembunyikan password"
                        : "Tampilkan password"
                    }
                    aria-pressed={showPassword}
                    className="absolute inset-y-0 right-2 my-1.5 inline-flex items-center rounded-md px-2 text-slate-300 transition hover:bg-white/5 active:scale-95"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {touched.password && errors.password ? (
                  <p
                    id="password-error"
                    role="alert"
                    className="flex items-center gap-1.5 text-xs text-rose-300"
                  >
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.password}
                  </p>
                ) : null}
              </div>

              {/* Remember me */}
              <div className="flex items-center justify-between pt-1">
                <label
                  htmlFor="remember"
                  className="inline-flex select-none items-center gap-2 text-sm text-slate-300 cursor-pointer"
                >
                  <input
                    id="remember"
                    type="checkbox"
                    checked={form.remember}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        remember: e.target.checked,
                      }))
                    }
                    className="
        h-4 w-4 rounded-[4px]
        border border-slate-500/60 bg-slate-900/40
        accent-primary-500
        outline-none
        focus-visible:ring-2 focus-visible:ring-primary-300/60
        focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
      "
                  />
                  Ingat saya
                </label>
              </div>

              {/* Server error */}
              {loginMutation.error && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="flex items-start gap-2 rounded-md border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-none" />
                  <span>
                    {loginMutation.error.message || "Gagal masuk. Coba lagi."}
                  </span>
                </div>
              )}

              {/* Submit */}
              <div className="relative">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loginMutation.isLoading}
                  className="
      group w-full rounded-xl py-3 font-semibold tracking-wide
      text-[var(--btn-text)]
      bg-[linear-gradient(180deg,var(--btn-from),var(--btn-to))]
      border border-[var(--btn-border)]
      ring-1 ring-inset ring-white/10
      shadow-[0_12px_28px_var(--btn-shadow)]
      transition-all duration-200

      hover:translate-y-0.5 hover:shadow-[0_16px_36px_var(--btn-shadow)]
      active:scale-[0.99]

      focus:outline-none
      focus-visible:ring-2 focus-visible:ring-primary-300/60
      focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]
      disabled:opacity-60
    "
                >
                  {loginMutation.isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <Spinner size="sm" /> Memverifikasi...
                    </span>
                  ) : (
                    "Masuk"
                  )}
                </Button>

                {loginMutation.isLoading && (
                  <div className="absolute inset-0 grid place-items-center rounded-xl bg-slate-900/40 backdrop-blur-[1px]">
                    <Spinner size="sm" />
                  </div>
                )}
              </div>
            </form>

            {/* Footer kecil di card */}
            <div className="mt-6 text-center text-xs text-slate-400">
              &copy; 2025 Badan Pusat Statistik Kabupaten Bulungan
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
