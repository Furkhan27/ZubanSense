document.addEventListener("DOMContentLoaded", () => {
  // Inject custom font dynamically
  const style = document.createElement("style");
  style.innerHTML = `
    @font-face {
      font-family: 'Amar Nastaleeq';
      src: url(chrome-extension://${chrome.runtime.id}/fonts/AmarNastaleeq.ttf) format('truetype');
    }
    .nastaleeq {
      font-family: 'Amar Nastaleeq', serif !important;
      font-size: 24px !important;
      direction: rtl !important;
      text-align: right;
    }
  `;
  document.head.appendChild(style);

  // Show SweetAlert with Urdu word
  Swal.fire({
    title: '📘 Urdu Sukhan',
    html: `
      <p style="direction: rtl; text-align: right;">
        <strong style="color:#003366;">Word:</strong>
        <span id="word-text" class="nastaleeq">کتابیں</span>
        <button id="speak-word" style="background:none; border:none; cursor:pointer; font-size: 18px;">🔊</button>
      </p>
      <p><strong style="color:#003366;">Meaning:</strong> Books 🔊</p>
    `,
    showCloseButton: true,
    confirmButtonText: 'Close',
    width: 420,
  });

  // Download button logic
  document.getElementById("downloadBtn").addEventListener("click", () => {
    fetch("http://127.0.0.1:5000/download_notes")
      .then(res => {
        if (!res.ok) throw new Error("Failed to download");
        return res.blob();
      })
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "zuban_sense_notes.xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch(err => {
        console.error("Download error:", err);
        alert("Failed to download notes.");
      });
  });
});
