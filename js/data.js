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
      deskripsi: "Belajar mengenal nilai pecahan uang kertas Rupiah melalui stimulus suara dan visual interaktif.",
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
          name: "🟠 Lanjutan (Menghitung Uang Kembalian)",
          url: "mata-pelajaran/matematika/tema-mengenal-uang-lanjutan/index.html",
        },
      ],
    },
  ],
  bahasa: [
    {
      tema: "Mengenal Huruf",
      deskripsi: "Belajar mengenal huruf abjad melalui stimulus suara dan visual interaktif.",
      badgeClass: "badge-bahasa",
      badgeText: "Bahasa",
      levels: [
        {
          name: "🟢 Dasar (Mengenal Benda Sekolah)",
          url: "mata-pelajaran/bahasa/tema-tebak-kata/cocokGambar.html",
        },
        {
          name: "🟡 Menengah (Segera Hadir!)",
          url: "mata-pelajaran/bahasa/tema-mengenal-huruf-menengah/KiosJajanan.html",
        },
        {
          name: "🟠 Lanjutan (Segera Hadir!)",
          url: "mata-pelajaran/bahasa/tema-mengenal-huruf-lanjutan/index.html",
        },
      ],
    },
  ],
  umum: [
    {
      tema: "Mengenal Benda dan Lingkungan",
      deskripsi: "Belajar mengenal benda dan lingkungan sekitar melalui stimulus suara dan visual interaktif.",
      badgeClass: "badge-umum",
      badgeText: "Pengetahuan Umum",
      levels: [
        {
          name: "🟢 Dasar (Segera Hadir!)",
          url: "mata-pelajaran/umum/tema-mengenal-benda-dan-lingkungan-dasar/MengenalBenda.html",
        },
        {
          name: "🟡 Menengah (Segera Hadir!)",
          url: "mata-pelajaran/umum/tema-mengenal-benda-dan-lingkungan-menengah/KiosJajanan.html",
        },
        {
          name: "🟠 Lanjutan (Segera Hadir!)",
          url: "mata-pelajaran/umum/tema-mengenal-benda-dan-lingkungan-lanjutan/index.html",
        },
      ],
    },
  ],
  ipa: [
    {
      tema: "Mengenal Hewan dan Tumbuhan",
      deskripsi: "Belajar mengenal hewan dan tumbuhan melalui stimulus suara dan visual interaktif.",
      badgeClass: "badge-ipa",
      badgeText: "IPA",
      levels: [
        {
          name: "🟢 Dasar (Segera Hadir!)",
          url: "mata-pelajaran/ipa/tema-mengenal-hewan-dan-tumbuhan-dasar/MengenalHewan.html",
        },
        {
          name: "🟡 Menengah (Segera Hadir!)",
          url: "mata-pelajaran/ipa/tema-mengenal-hewan-dan-tumbuhan-menengah/KiosJajanan.html",
        },
        {
          name: "🟠 Lanjutan (Segera Hadir!)",
          url: "mata-pelajaran/ipa/tema-mengenal-hewan-dan-tumbuhan-lanjutan/index.html",
        },
      ],
    },
  ],
  seni: [
    {
      tema: "Mengenal Warna dan Bentuk",
      deskripsi: "Belajar mengenal warna dan bentuk melalui stimulus suara dan visual interaktif.",
      badgeClass: "badge-seni",
      badgeText: "Seni Budaya",
      levels: [
        {
          name: "🟢 Dasar (Segera Hadir!)",
          url: "mata-pelajaran/seni/tema-mengenal-warna-dan-bentuk-dasar/MengenalWarna.html",
        },
        {
          name: "🟡 Menengah (Segera Hadir!)",
          url: "mata-pelajaran/seni/tema-mengenal-warna-dan-bentuk-menengah/KiosJajanan.html",
        },
        {
          name: "🟠 Lanjutan (Segera Hadir!)",
          url: "mata-pelajaran/seni/tema-mengenal-warna-dan-bentuk-lanjutan/index.html",
        },
      ],
    },
  ],
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
