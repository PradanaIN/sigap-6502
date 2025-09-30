import { renderCharts } from "./chartHandler.js";

let chartRendered = false;

export function initTabs(elements = {}) {
  const {
    tabLogBtn = document.getElementById("tabLog"),
    tabChartBtn = document.getElementById("tabChart"),
    tabContentLog = document.getElementById("tabContentLog"),
    tabContentChart = document.getElementById("tabContentChart"),
  } = elements;

  if (!tabLogBtn || !tabChartBtn || !tabContentLog || !tabContentChart) {
    return false;
  }

  function showTab(tabName) {
    const isChart = tabName === "chart";

    tabChartBtn.classList.toggle("active", isChart);
    tabLogBtn.classList.toggle("active", !isChart);

    tabContentChart.classList.toggle("hidden", !isChart);
    tabContentLog.classList.toggle("hidden", isChart);

    // Render chart hanya sekali saat tab chart pertama kali dibuka
    if (isChart && !chartRendered) {
      renderCharts();
      chartRendered = true;
    }

    localStorage.setItem("lastTab", tabName);
  }

  tabLogBtn.addEventListener("click", () => showTab("log"));
  tabChartBtn.addEventListener("click", () => showTab("chart"));

  // Saat halaman pertama kali dimuat
  const savedTab = localStorage.getItem("lastTab") || "log";
  showTab(savedTab);

  return true;
}
