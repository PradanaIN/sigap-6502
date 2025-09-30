const actions = document.querySelectorAll('[data-action]');
const statusEl = document.querySelector('.status');

const STATUS_TEXT = {
  idle: 'Bot belum berjalan',
  starting: 'Menyalakan bot...',
  'waiting-qr': 'Menunggu pemindaian QR',
  authenticated: 'QR terscan, menunggu siap...',
  ready: 'Bot aktif',
  stopped: 'Bot dihentikan',
  error: 'Terjadi kesalahan autentikasi',
};

const TRANSITIONAL_PHASES = new Set(['starting', 'waiting-qr', 'authenticated']);
const CLIENT_CREATED_PHASES = new Set(['waiting-qr', 'authenticated', 'ready']);
const logViewer = document.querySelector('.log-viewer');

async function fetchJson(url, options) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options,
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Permintaan gagal');
  }
  return response.json();
}

function updateStatus(status) {
  if (!statusEl) return;
  const active = Boolean(status?.active);
  const phase = typeof status?.phase === 'string' ? status.phase : 'idle';
  const label = STATUS_TEXT[phase] || (active ? 'Bot aktif' : 'Bot nonaktif');

  statusEl.dataset.phase = phase;
  statusEl.classList.toggle('active', active);
  statusEl.classList.toggle('inactive', !active && phase !== 'starting');
  statusEl.textContent = label;

  const startBtn = document.querySelector('[data-action="start"]');
  const stopBtn = document.querySelector('[data-action="stop"]');

  if (startBtn) {
    startBtn.disabled = active || TRANSITIONAL_PHASES.has(phase);
  }
  if (stopBtn) {
    stopBtn.disabled = !active && !CLIENT_CREATED_PHASES.has(phase);
  }
}

actions.forEach((button) => {
  button.addEventListener('click', async () => {
    const action = button.dataset.action;
    if (!['start', 'stop'].includes(action)) {
      console.warn(`Mengabaikan aksi tidak dikenal: "${action}"`);
      return;
    }

    const endpoint = `/api/admin/bot/${action}`;

    button.disabled = true;
    button.classList.add('is-loading');

    try {
      const result = await fetchJson(endpoint, { method: 'POST' });
      updateStatus(result);
    } catch (err) {
      console.error(err);
      if (window.Swal) {
        window.Swal.fire({
          icon: 'error',
          title: 'Terjadi kesalahan',
          text: err?.message || 'Permintaan gagal',
        });
      } else {
        alert('Terjadi kesalahan: ' + err.message);
      }
    } finally {
      button.disabled = false;
      button.classList.remove('is-loading');
    }
  });
});

async function refreshLogs() {
  if (!logViewer) return;
  try {
    const result = await fetchJson('/api/system/logs?limit=50');
    logViewer.textContent = result.logs.join('\n');
  } catch (err) {
    console.warn('Gagal memuat log:', err.message);
  }
}

setInterval(refreshLogs, 60_000);
