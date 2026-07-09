/**
 * catalog.js
 * ---------------------------------------------------------
 * Logika untuk halaman bertipe "filter": index.html & games.html.
 * User klik salah satu kartu subjek -> daftar game subjek itu
 * ditampilkan di #gamesDisplayArea.
 *
 * Membutuhkan data.js dimuat lebih dulu (butuh `buvitaDatabase`).
 * ---------------------------------------------------------
 */

function renderEmptyState() {
  return `
    <div class="empty-state">
      <p class="empty-state-title">🎮 Halo Teman-Teman!</p>
      <p class="empty-state-text">
        Game untuk kategori ini sedang disiapkan oleh BuVita ya.
        Tunggu petualangan seru berikutnya! 🌟
      </p>
    </div>`;
}

function renderThemeCard(item) {
  const levelButtonsHtml = item.levels
    .map((lvl) => `<a href="${lvl.url}" class="level-link-btn">${lvl.name}</a>`)
    .join("");

  return `
    <div class="theme-card">
      <div class="theme-card-body">
        <span class="game-badge ${item.badgeClass}">${item.badgeText}</span>
        <h3>${item.tema}</h3>
        <p>${item.deskripsi}</p>
        <div class="level-zone-container">
          <h4>Pilih Tingkatan Level:</h4>
          <div class="level-buttons-grid">
            ${levelButtonsHtml}
          </div>
        </div>
      </div>
    </div>`;
}

function switchSubject(subjectKey, buttonElement) {
  document
    .querySelectorAll(".filter-card")
    .forEach((card) => card.classList.remove("active"));
  buttonElement.classList.add("active");

  const displayArea = document.getElementById("gamesDisplayArea");
  const dataSubject = buvitaDatabase[subjectKey] || [];

  displayArea.innerHTML =
    dataSubject.length === 0
      ? renderEmptyState()
      : dataSubject.map(renderThemeCard).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  const firstFilterBtn = document.querySelector(".filter-card");
  if (firstFilterBtn) {
    switchSubject("matematika", firstFilterBtn);
  }
});
