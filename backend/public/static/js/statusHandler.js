const STATUS_TEXT = {
  idle: "⚪️ BOT IDLE",
  starting: "🟡 MENYIAPKAN CLIENT...",
  "waiting-qr": "🟡 MENUNGGU PEMINDAIAN QR",
  authenticated: "🟡 QR TERSCAN, MENUNGGU SIAP...",
  ready: "🟢 BOT AKTIF",
  stopped: "⚪️ BOT DIHENTIKAN",
  error: "🔴 TERJADI KESALAHAN AUTENTIKASI",
};

const TRANSITIONAL_PHASES = new Set(["starting", "waiting-qr", "authenticated"]);
const CLIENT_CREATED_PHASES = new Set(["waiting-qr", "authenticated", "ready"]);

export function updateStatus(data = {}) {
  const statusEl = document.getElementById("status");
  const startBtn = document.getElementById("startBtn");
  const stopBtn = document.getElementById("stopBtn");

  if (!statusEl || !startBtn || !stopBtn) return;

  const active = Boolean(data.active);
  const phase = typeof data.phase === "string" ? data.phase : "idle";

  statusEl.textContent = STATUS_TEXT[phase] || (active ? "🟢 BOT AKTIF" : "🔴 BOT NONAKTIF");
  statusEl.dataset.phase = phase;

  const disableStart = active || TRANSITIONAL_PHASES.has(phase);
  const allowStop = active || CLIENT_CREATED_PHASES.has(phase);

  startBtn.disabled = disableStart;
  stopBtn.disabled = !allowStop;
}

export async function fetchStatus(repeat = false) {
  try {
    const res = await fetch("/bot/status");
    const data = await res.json();
    updateStatus(data);

    if (repeat && !data.active) {
      setTimeout(() => fetchStatus(true), 1000); // coba lagi tiap 1 detik
    }
  } catch (e) {
    console.error("[Status] Error:", e);
  }
}
