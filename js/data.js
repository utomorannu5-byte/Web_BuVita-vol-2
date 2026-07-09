/**
 * data.js
 * ---------------------------------------------------------
 * Sumber data tunggal (single source of truth) untuk seluruh
 * katalog game BuVita EduPlay.
 *
 * PENTING: Jangan copy-paste object ini ke file HTML lain.
 * Cukup panggil <script src="js/data.js"></script> di halaman
 * yang membutuhkan (index.html, games.html, kategori.html).
 * Kalau ada game baru, cukup tambahkan di sini SEKALI SAJA,
 * otomatis akan muncul di semua halaman.
 * ---------------------------------------------------------
 */

const buvitaDatabase = {
  matematika: [
    {
      tema: "Mengenal Uang Rupiah",
      deskripsi:
        "Belajar mengenal nilai pecahan uang kertas Rupiah melalui stimulus suara dan visual interaktif.",
      badgeClass: "badge-matematika",
      badgeText: "Matematika",
      levels: [
        {
          name: "🟢 Dasar (Mengenal & Mengurutkan)",
          url: "mata-pelajaran/matematika/tema-mengenal-uang-dasar/MengenalUang-Suara.html",
        },
        {
          name: "🟡 Menengah (Praktik Penggunaan Uang Sehari-hari)",
          url: "mata-pelajaran/matematika/tema-mengenal-uang-menengah/KiosJajanan.html",
        },
        {
          name: "🟠 Lanjutan (Segera Hadir!)",
          url: "mata-pelajaran/matematika/tema-mengenal-uang-lanjutan/index.html",
        },
      ],
    },
  ],
  bahasa: [],
  umum: [],
  ipa: [],
  seni: [],
};

/**
 * Metadata tampilan per kategori (label, ikon, warna).
 * Dipakai bareng oleh games.html (mode filter) dan
 * kategori.html (mode tampilkan semua).
 */
const subjectMeta = {
  matematika: { label: "Matematika", icon: "🔢", bg: "bg-yellow" },
  bahasa: { label: "Bahasa", icon: "🔤", bg: "bg-pink" },
  umum: { label: "Pengetahuan Umum", icon: "🗺️", bg: "bg-purple" },
  ipa: { label: "IPA", icon: "🧪", bg: "bg-red" },
  seni: { label: "Seni Budaya", icon: "🎨", bg: "bg-blue" },
};
