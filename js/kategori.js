/**
 * kategori.js
 * ---------------------------------------------------------
 * Khusus untuk kategori.html.
 * Beda dengan games.html (filter satu-satu), halaman ini
 * menampilkan SEMUA kategori & game sekaligus sebagai
 * "peta situs" katalog BuVita EduPlay.
 *
 * Membutuhkan data.js dimuat lebih dulu.
 * ---------------------------------------------------------
 */

function renderCategoryEmptyState() {
  return `
    <div class="empty-state empty-state--inline">
      <p class="empty-state-text">
        Game untuk kategori ini sedang disiapkan oleh BuVita. Tunggu ya! 🌟
      </p>
    </div>`;
}

function renderCategoryBlock(subjectKey) {
  const meta = subjectMeta[subjectKey];
  const games = buvitaDatabase[subjectKey] || [];

  const gamesHtml =
    games.length === 0
      ? renderCategoryEmptyState()
      : `<div class="games-grid-layout">${games.map(renderThemeCard).join("")}</div>`;

  return `
    <section id="${subjectKey}" class="category-block">
      <div class="category-block-header">
        <div class="filter-icon ${meta.bg}">${meta.icon}</div>
        <h3>${meta.label}</h3>
      </div>
      ${gamesHtml}
    </section>`;
}

function renderAllCategories() {
  const container = document.getElementById("allCategoriesArea");
  const html = Object.keys(subjectMeta).map(renderCategoryBlock).join("");
  container.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", renderAllCategories);
