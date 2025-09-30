const logContainer = document.getElementById("logContainer");

export function appendLog(logEntry) {
  if (!logContainer) return;

  const entry = document.createElement("div");
  entry.className = "log-entry mb-1";
  entry.textContent = logEntry;
  logContainer.appendChild(entry);

  logContainer.scrollTop = logContainer.scrollHeight;
}

export async function fetchLogs() {
  try {
    const res = await fetch("/logs");
    const data = await res.json();
    if (!logContainer) return;

    logContainer.innerHTML = ""; // bersihkan isi lama
    data.logs.forEach((line) => {
      const div = document.createElement("div");
      div.className = "log-entry mb-1";
      div.textContent = line;
      logContainer.appendChild(div);
    });

    logContainer.scrollTop = logContainer.scrollHeight;
  } catch (e) {
    console.error("[Logs] Gagal fetch:", e);
  }
}

export function enableLogFiltering() {
  const searchInput = document.getElementById("logSearch");
  if (!searchInput || !logContainer) return;

  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase();
    const entries = logContainer.querySelectorAll(".log-entry");

    entries.forEach((entry) => {
      const text = entry.textContent.toLowerCase();
      entry.style.display = text.includes(keyword) ? "" : "none";
    });
  });
}
