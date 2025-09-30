import { initDarkMode } from "./modeHandler.js";
import { initBotControl } from "./botHandler.js";
import { fetchStatus, updateStatus } from "./statusHandler.js";
import { initSocket } from "./socketHandler.js";
import { fetchLogs, appendLog, enableLogFiltering } from "./logHandler.js";
import { initQRHandler, renderQR } from "./qrHandler.js";
import { renderCharts } from "./chartHandler.js";
import { initTabs } from "./tabHandler.js";
import { showLoader } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Dark mode setup
  initDarkMode(renderCharts);
  document.body.style.visibility = "visible";

  // 2. Socket.IO realtime update listeners
  initSocket(
    updateStatus, // ⬅ Status langsung update UI
    appendLog, // ⬅ Tambah 1 baris log
    renderQR // ⬅ Tampilkan QR dari socket
  );

  // 3. Tombol start/stop bot
  initBotControl(fetchStatus);

  // 4. Ambil data awal: status, log, QR
  fetchStatus();
  fetchLogs();
  enableLogFiltering();
  initQRHandler(); // hanya fetch QR awal

  // 5. Grafik dashboard
  renderCharts();

  // 6. Navigasi tab
  const tabElements = {
    tabLogBtn: document.getElementById("tabLog"),
    tabChartBtn: document.getElementById("tabChart"),
    tabContentLog: document.getElementById("tabContentLog"),
    tabContentChart: document.getElementById("tabContentChart"),
  };

  if (Object.values(tabElements).every(Boolean)) {
    initTabs(tabElements);
  }

  // 7. Sembunyikan loading
  showLoader(false);
});
