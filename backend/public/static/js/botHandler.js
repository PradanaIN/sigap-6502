// botHandler.js
import { fetchStatus } from "./statusHandler.js";

export function initBotControl() {
  const startBtn = document.getElementById("startBtn");
  const stopBtn = document.getElementById("stopBtn");
  const confirmModal = document.getElementById("confirmModal");
  const confirmStopBtn = document.getElementById("confirmStop");
  const cancelStopBtn = document.getElementById("cancelStop");
  const pageLoader = document.getElementById("pageLoader");

  function showLoader(show = true) {
    if (!pageLoader) return;
    pageLoader.classList.toggle("hidden", !show);
  }

  startBtn?.addEventListener("click", async () => {
    showLoader(true);
    try {
      const res = await fetch("/bot/start", { method: "POST" });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal mengaktifkan bot.");
      }

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: data.message,
        timer: 1500,
        showConfirmButton: false,
        position: "center",
        toast: false,
      });

      await fetchStatus(true);
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: e.message || "Terjadi kesalahan.",
        position: "center",
        toast: false,
        timer: 1500,
        showConfirmButton: false,
      });
      console.error(e);
    } finally {
      showLoader(false);
    }
  });

  stopBtn?.addEventListener("click", () => {
    confirmModal.classList.remove("hidden");
  });

  cancelStopBtn?.addEventListener("click", () => {
    confirmModal.classList.add("hidden");
  });

  confirmStopBtn?.addEventListener("click", async () => {
    confirmModal.classList.add("hidden");
    showLoader(true);
    try {
      const res = await fetch("/bot/stop", { method: "POST" });
      const data = await res.json();
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: data.message,
        timer: 1500,
        showConfirmButton: false,
        position: "center",
        toast: false,
      });
      fetchStatus();
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal menghentikan bot.",
        position: "center",
        toast: false,
        timer: 1500,
        showConfirmButton: false,
      });
      console.error(e);
    } finally {
      showLoader(false);
    }
  });
}
