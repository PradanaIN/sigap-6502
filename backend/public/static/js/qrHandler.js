let qrContainer = null;
let qrCanvas = null;
let domReadyListenerRegistered = false;

function resolveQRElements() {
  if (!qrContainer || !qrCanvas) {
    qrContainer = document.getElementById("qrContainer");
    qrCanvas = document.getElementById("qrCanvas");
  }

  return Boolean(qrContainer && qrCanvas);
}

export async function fetchQRCode() {
  // Delay cek elemen sampai DOM siap
  if (!resolveQRElements()) {
    console.warn("Elemen QR tidak ditemukan di DOM.");
    return;
  }

  try {
    const res = await fetch("/qr");
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();

    if (data.qr) {
      qrContainer.classList.remove("hidden");
      renderQR(data.qr);
    } else {
      qrContainer.classList.add("hidden");
    }
  } catch (e) {
    console.error("[QR] Gagal fetch QR:", e);
    qrContainer.classList.add("hidden");
  }
}

// Optional helper untuk init dari luar
export function initQRHandler() {
  const triggerFetch = () => {
    resolveQRElements();
    fetchQRCode();
  };

  if (document.readyState === "loading") {
    if (domReadyListenerRegistered) return;

    domReadyListenerRegistered = true;

    const onReady = () => {
      document.removeEventListener("DOMContentLoaded", onReady);
      domReadyListenerRegistered = false;
      triggerFetch();
    };

    document.addEventListener("DOMContentLoaded", onReady);
    return;
  }

  triggerFetch();
}

export function renderQR(data) {
  if (!resolveQRElements()) {
    console.warn("Elemen QR tidak ditemukan di DOM");
    return;
  }

  qrContainer.classList.remove("hidden");

  QRCode.toCanvas(qrCanvas, data, { width: 256 }, (error) => {
    if (error) console.error("Error render QR:", error);
    else console.log("QR code berhasil dirender dari socket!");
  });
}
