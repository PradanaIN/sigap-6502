import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, useLogout } from "../queries/auth";
import {
  useAdminNextRun,
  useAdminSchedule,
  useUpdateSchedule,
} from "../queries/schedule";
import { BotControlPanel } from "../components/BotControlPanel";
import { LogsPanel } from "../components/LogsPanel";
import { NextRunCard as NextRunCard } from "../components/NextRunCard.jsx";
import { ScheduleGrid } from "../components/ScheduleGrid";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Spinner } from "../components/ui/Spinner";
import { AdminLayout } from "../components/layout/AdminLayout";
import { useToast } from "../components/ui/ToastProvider.jsx";
import { useConfirm } from "../components/ui/ConfirmProvider.jsx";
import { MetricCard } from "../components/ui/MetricCard";
import { Save, RotateCcw, Info } from "lucide-react";
import { useDocumentTitle } from "../utils/useDocumentTitle.js";

const DEFAULT_TIMES = {
  1: "16:00",
  2: "16:00",
  3: "16:00",
  4: "16:00",
  5: "16:30",
  6: "",
  7: "",
};

const DAY_NAMES = {
  1: "Senin",
  2: "Selasa",
  3: "Rabu",
  4: "Kamis",
  5: "Jumat",
  6: "Sabtu",
  7: "Minggu",
};

const TZ_LABEL = {
  "Asia/Jakarta": "WIB",
  "Asia/Makassar": "WITA",
  "Asia/Jayapura": "WIT",
};

function isValidTimeHHMM(v) {
  if (!v) return true; // kosong = nonaktif → valid
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(v);
}

function isValidIanaTZ(tz) {
  try {
    new Intl.DateTimeFormat("id-ID", { timeZone: tz }).format(new Date());
    return true;
  } catch {
    return false;
  }
}

function nowInTZ(tz) {
  try {
    const s = new Intl.DateTimeFormat("id-ID", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date());
    return s;
  } catch {
    return "";
  }
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { data: session, isLoading: sessionLoading } = useSession();
  const logoutMutation = useLogout();
  const { add: addToast } = useToast();
  const { confirm } = useConfirm();

  useDocumentTitle("Dashboard Admin");

  const {
    data: scheduleResponse,
    isLoading: scheduleLoading,
    isFetching: scheduleFetching,
  } = useAdminSchedule();
  const { data: nextRun, isLoading: nextRunLoading } = useAdminNextRun();

  const updateScheduleMutation = useUpdateSchedule();

  const schedule = scheduleResponse?.schedule;

  const isSchedulePending = scheduleLoading && !schedule;
  const isScheduleUpdating = scheduleFetching && !scheduleLoading;

  const [dailyTimes, setDailyTimes] = useState(DEFAULT_TIMES);
  const [timezone, setTimezone] = useState("Asia/Makassar");
  const [paused, setPaused] = useState(false);

  const [panelTab, setPanelTab] = useState("logs"); // logs | schedule | next
  const tablistRef = useRef(null);

  // hydrate dari server
  useEffect(() => {
    if (schedule) {
      setDailyTimes({ ...DEFAULT_TIMES, ...(schedule.dailyTimes ?? {}) });
      setTimezone(schedule.timezone || "Asia/Makassar");
      setPaused(Boolean(schedule.paused));
    }
  }, [schedule]);

  // auth gate
  useEffect(() => {
    if (!sessionLoading && !session?.authenticated) {
      navigate("/admin/login", { replace: true });
    }
  }, [session, sessionLoading, navigate]);

  // hotkey: Ctrl/Cmd+S pada tab Jadwal
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        if (panelTab === "schedule") {
          e.preventDefault();
          handleScheduleSubmit();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    panelTab,
    dailyTimes,
    timezone,
    paused,
    updateScheduleMutation.isLoading,
  ]);

  const handleScheduleSubmit = (event) => {
    event?.preventDefault?.();

    const normalized = Object.fromEntries(
      Object.entries(dailyTimes).map(([day, value]) => [day, value || null])
    );
    updateScheduleMutation.mutate(
      { dailyTimes: normalized, timezone, paused },
      {
        onSuccess: () =>
          addToast("Jadwal berhasil disimpan.", { type: "success" }),
        onError: (err) =>
          addToast(err?.message || "Gagal menyimpan jadwal.", {
            type: "error",
          }),
      }
    );
  };

  const metrics = useMemo(
    () => [
      {
        label: "Status Jadwal",
        value: schedule ? (schedule.paused ? "Dijeda" : "Aktif") : "Memuat…",
        helper: schedule
          ? schedule.paused
            ? "Penjadwalan otomatis sedang dihentikan sementara."
            : "Penjadwalan berjalan sesuai jadwal default."
          : "Menunggu data jadwal dari server.",
        tone: schedule?.paused ? "amber" : "emerald",
      },
      {
        label: "Zona Waktu",
        value: schedule?.timezone || "Asia/Makassar",
        helper: schedule
          ? "Digunakan sebagai acuan perhitungan jadwal."
          : "Menunggu data jadwal dari server.",
        tone: "sky",
      },
      {
        label: "Override Aktif",
        value: schedule?.manualOverrides?.length ?? "…",
        helper: schedule?.manualOverrides?.length
          ? "Override akan otomatis terhapus setelah digunakan."
          : schedule
          ? "Belum ada override manual."
          : "Menunggu data jadwal dari server.",
        tone: "slate",
      },
    ],
    [schedule]
  );

  // validasi waktu per hari
  const invalidDays = useMemo(() => {
    return Object.entries(dailyTimes)
      .filter(([, v]) => !isValidTimeHHMM(v))
      .map(([d]) => Number(d));
  }, [dailyTimes]);

  // validasi timezone
  const tzValid = isValidIanaTZ(timezone);
  const tzNow = tzValid ? nowInTZ(timezone) : "";
  const tzSuffix = TZ_LABEL[timezone];

  // dirty check
  const scheduleDirty = useMemo(() => {
    const normalized = Object.fromEntries(
      Object.entries(dailyTimes).map(([d, v]) => [d, v || null])
    );
    const server = Object.fromEntries(
      Object.entries({ ...DEFAULT_TIMES, ...(schedule?.dailyTimes || {}) }).map(
        ([d, v]) => [d, v || null]
      )
    );
    return (
      JSON.stringify(normalized) !== JSON.stringify(server) ||
      timezone !== (schedule?.timezone || "Asia/Makassar") ||
      Boolean(paused) !== Boolean(schedule?.paused)
    );
  }, [
    dailyTimes,
    timezone,
    paused,
    schedule?.dailyTimes,
    schedule?.timezone,
    schedule?.paused,
  ]);

  const disableSave =
    updateScheduleMutation.isLoading || invalidDays.length > 0 || !tzValid;

  return (
    <AdminLayout
      username={session?.user?.username}
      onLogout={() =>
        logoutMutation.mutate(undefined, {
          onSuccess: () => navigate("/admin/login", { replace: true }),
        })
      }
      isLoggingOut={logoutMutation.isLoading}
      loading={sessionLoading}
    >
      <div className="space-y-12">
        {/* Ringkasan + Kontrol Bot */}
        <section className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <Card className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 p-8 shadow-xl backdrop-blur-md">
            <div className="absolute inset-y-0 right-[-40%] -z-10 hidden w-3/4 bg-gradient-to-l from-primary-500/20 to-transparent blur-3xl lg:block" />
            <div className="flex h-full flex-col justify-between gap-6">
              <div className="space-y-5">
                <Badge variant="info" className="w-fit uppercase tracking-wide">
                  Ringkasan Harian
                </Badge>
                <h1 className="text-4xl font-bold text-white">
                  Halo, {session?.user?.username || "Admin"}!
                </h1>
                <p className="max-w-xl text-base text-slate-400">
                  Pantau performa bot dan jadwal pengiriman. Gunakan panel di
                  bawah untuk mengatur jadwal default dan memantau log aktivitas
                  terkini.
                </p>
                {isScheduleUpdating && (
                  <div className="flex items-center gap-2 text-xs font-medium text-primary-200 animate-pulse">
                    <Spinner size="sm" />
                    <span>Pembaruan data jadwal sedang diproses…</span>
                  </div>
                )}
              </div>
              <div className="grid gap-6 sm:grid-cols-3">
                {metrics.map((metric) => (
                  <MetricCard
                    key={metric.label}
                    label={metric.label}
                    value={metric.value}
                    helper={metric.helper}
                    tone={metric.tone}
                    loading={isSchedulePending}
                    loadingTone="onDark"
                  />
                ))}
              </div>
            </div>
          </Card>
          <BotControlPanel />
        </section>

        {/* Tabs: Log | Jadwal | Berikutnya */}
        <section>
          <Card className="space-y-6 border-white/10 bg-slate-900/70 p-0">
            <div className="px-4 pt-4">
              <div
                role="tablist"
                aria-label="Panel Admin"
                ref={tablistRef}
                className="inline-flex w-full max-w-full items-center gap-1 overflow-x-auto rounded-xl border border-white/10 bg-slate-950/60 p-1 text-sm"
              >
                {[
                  { id: "logs", label: "Log" },
                  { id: "schedule", label: "Jadwal" },
                  { id: "next", label: "Berikutnya" },
                ].map((t) => {
                  const selected = panelTab === t.id;
                  return (
                    <button
                      key={t.id}
                      role="tab"
                      aria-selected={selected}
                      aria-controls={`panel-${t.id}`}
                      id={`tab-${t.id}`}
                      onClick={() => setPanelTab(t.id)}
                      className={
                        selected
                          ? "flex-1 rounded-lg bg-primary-500/20 px-4 py-2 font-semibold text-white shadow-inner shadow-primary-500/20"
                          : "flex-1 rounded-lg px-4 py-2 text-slate-300 hover:bg-white/5 hover:text-white"
                      }
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6">
              {/* LOGS */}
              <div
                role="tabpanel"
                id="panel-logs"
                aria-labelledby="tab-logs"
                hidden={panelTab !== "logs"}
                className="sm:max-h-none max-h-[480px]"
              >
                {panelTab === "logs" && <LogsPanel />}
              </div>

              {/* SCHEDULE */}
              <div
                role="tabpanel"
                id="panel-schedule"
                aria-labelledby="tab-schedule"
                hidden={panelTab !== "schedule"}
              >
                {panelTab === "schedule" && (
                  <div className="space-y-6">
                    <div className="flex flex-col gap-2">
                      <h2 className="text-xl font-semibold text-white">
                        Pengaturan Jadwal Otomatis
                      </h2>
                      <p className="text-sm text-slate-400">
                        Sesuaikan jam pengiriman untuk setiap hari serta zona
                        waktu yang digunakan sistem.
                      </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleScheduleSubmit}>
                      {/* Grid jadwal */}
                      <ScheduleGrid
                        values={dailyTimes}
                        onChange={setDailyTimes}
                        timeSuffix={tzSuffix}
                      />

                      {/* Validasi waktu */}
                      {invalidDays.length > 0 && (
                        <div className="rounded-lg border border-amber-400/30 bg-amber-500/10 p-3 text-xs text-amber-100">
                          <div className="flex items-start gap-2">
                            <Info className="mt-0.5 h-4 w-4 flex-none" />
                            <span>
                              Format waktu tidak valid pada:{" "}
                              <strong>
                                {invalidDays
                                  .map((d) => DAY_NAMES[d] || d)
                                  .join(", ")}
                              </strong>{" "}
                              (gunakan format 24 jam <code>HH:MM</code>, mis.
                              <code> 07:30</code>).
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Zona waktu + pause */}
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="timezone">Zona waktu</Label>
                          <div className="relative">
                            <Input
                              id="timezone"
                              list="tz-list"
                              value={timezone}
                              onChange={(e) => setTimezone(e.target.value)}
                              required
                              aria-invalid={!tzValid}
                              className="rounded-lg border-slate-700 bg-slate-900/60 pr-28"
                              placeholder="Asia/Makassar"
                            />
                            <datalist id="tz-list">
                              <option value="Asia/Jakarta">WIB</option>
                              <option value="Asia/Makassar">WITA</option>
                              <option value="Asia/Jayapura">WIT</option>
                            </datalist>
                            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-slate-200">
                              {TZ_LABEL[timezone] || "TZ"}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            Gunakan IANA TZ, mis. <code>Asia/Makassar</code>,{" "}
                            <code>Asia/Jakarta</code>, atau{" "}
                            <code>Asia/Jayapura</code>.
                          </p>
                          <p
                            className={`text-xs ${
                              tzValid ? "text-slate-400" : "text-rose-300"
                            }`}
                          >
                            {tzValid
                              ? `Sekarang di ${timezone}: ${tzNow}`
                              : "Zona waktu tidak dikenali."}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label>Status penjadwalan</Label>
                          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/70 p-3">
                            <input
                              id="paused"
                              type="checkbox"
                              className="h-4 w-4 accent-primary-500"
                              checked={paused}
                              onChange={(e) => setPaused(e.target.checked)}
                            />
                            <label
                              htmlFor="paused"
                              className="text-sm text-slate-300"
                            >
                              Jeda pengiriman otomatis{" "}
                              <span className="opacity-70">
                                (override manual tetap berjalan)
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Error API */}
                      {updateScheduleMutation.error && (
                        <p className="text-sm text-rose-300">
                          {updateScheduleMutation.error.message}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex justify-end gap-3">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={async () => {
                            if (!schedule) return;
                            const ok = await confirm({
                              title: "Reset perubahan?",
                              message:
                                "Perubahan yang belum disimpan akan hilang.",
                              confirmText: "Ya, reset",
                              variant: "warning",
                            });
                            if (!ok) return;
                            setDailyTimes({
                              ...DEFAULT_TIMES,
                              ...(schedule.dailyTimes || {}),
                            });
                            setTimezone(schedule.timezone || "Asia/Makassar");
                            setPaused(Boolean(schedule.paused));
                            addToast("Perubahan jadwal direset.", {
                              type: "info",
                            });
                          }}
                          className="inline-flex items-center gap-2 rounded-lg"
                        >
                          <RotateCcw className="h-4 w-4" /> Reset
                        </Button>

                        <Button
                          type="submit"
                          disabled={disableSave}
                          className="
      inline-flex items-center gap-2 rounded-lg px-4 py-2
      bg-sky-600 text-on-accent hover:bg-sky-500
      border border-sky-400/30 shadow-lg shadow-sky-600/20
      disabled:opacity-60
    "
                        >
                          {updateScheduleMutation.isLoading ? (
                            "Menyimpan…"
                          ) : (
                            <>
                              <Save className="h-4 w-4" /> Simpan
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
              </div>

              {/* NEXT */}
              <div
                role="tabpanel"
                id="panel-next"
                aria-labelledby="tab-next"
                hidden={panelTab !== "next"}
              >
                {panelTab === "next" && (
                  <NextRunCard nextRun={nextRun} loading={nextRunLoading} />
                )}
              </div>
            </div>
          </Card>

          {/* Sticky Action Bar (muncul jika jadwal berubah) */}
          {panelTab === "schedule" && scheduleDirty && (
            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md">
              <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
                <p className="text-xs text-slate-300">
                  <span className="inline-flex items-center gap-1">
                    <Info className="h-3.5 w-3.5" />
                    Perubahan belum disimpan
                  </span>
                  {invalidDays.length > 0 && (
                    <>
                      {" "}
                      •{" "}
                      <span className="text-amber-200">
                        Perbaiki waktu tidak valid
                      </span>
                    </>
                  )}
                  {!tzValid && (
                    <>
                      {" "}
                      •{" "}
                      <span className="text-rose-200">
                        Zona waktu tidak valid
                      </span>
                    </>
                  )}
                </p>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={async () => {
                      if (!schedule) return;
                      const ok = await confirm({
                        title: "Reset perubahan?",
                        message: "Perubahan yang belum disimpan akan hilang.",
                        confirmText: "Ya, reset",
                        variant: "warning",
                      });
                      if (!ok) return;
                      setDailyTimes({
                        ...DEFAULT_TIMES,
                        ...(schedule.dailyTimes || {}),
                      });
                      setTimezone(schedule.timezone || "Asia/Makassar");
                      setPaused(Boolean(schedule.paused));
                      addToast("Perubahan jadwal direset.", { type: "info" });
                    }}
                  >
                    Reset
                  </Button>
                  <Button onClick={handleScheduleSubmit} disabled={disableSave}>
                    Simpan
                  </Button>
                </div>
              </div>
              {/* safe area untuk iOS */}
              <div className="h-[env(safe-area-inset-bottom,0)]" />
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}
