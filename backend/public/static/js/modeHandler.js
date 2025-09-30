const toggleDarkModeBtn = document.getElementById("toggleDarkMode");

function getInitialTheme() {
  const stored = localStorage.getItem("darkMode");
  if (stored !== null) return stored === "true";

  // Deteksi preferensi sistem
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function setDarkMode(on) {
  document.body.classList.toggle("dark", on);
  if (toggleDarkModeBtn) {
    toggleDarkModeBtn.classList.toggle("dark", on);
  }
  localStorage.setItem("darkMode", on);
}

export function initDarkMode(renderCharts) {
  const preferredDark = getInitialTheme();
  setDarkMode(preferredDark);

  if (!toggleDarkModeBtn) return;

  toggleDarkModeBtn.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark");
    setDarkMode(!isDark);
    if (renderCharts) renderCharts(); // agar grafik re-render saat ganti tema
  });
}
