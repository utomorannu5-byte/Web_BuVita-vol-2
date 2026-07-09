# BuVita EduPlay — Struktur Project (Versi Rapi)

## 📁 Struktur folder akhir

```
buvita-eduplay/                (root project kamu)
├── index.html
├── games.html
├── kategori.html
├── aboutUs.html
├── style.css
├── js/
│   ├── data.js          <-- SATU-SATUNYA sumber data game
│   ├── catalog.js        <-- logika filter (index.html & games.html)
│   └── kategori.js        <-- logika tampilkan-semua (kategori.html)
├── assets/                (folder game kamu yang SUDAH ADA, tidak diubah)
├── audio/                 (folder game kamu yang SUDAH ADA, tidak diubah)
└── mata-pelajaran/         (folder game kamu yang SUDAH ADA, tidak diubah)
    └── matematika/
        ├── tema-mengenal-uang-dasar/
        ├── tema-mengenal-uang-menengah/
        └── tema-mengenal-uang-lanjutan/
```

**Cara pakai:** timpa (replace) 5 file lama kamu (`index.html`, `games.html`,
`kategori.html`, `aboutUs.html`, `style.css`) dengan versi baru dari paket ini,
lalu tambahkan folder `js/` di root. Folder `assets/`, `audio/`, dan
`mata-pelajaran/` yang sudah kamu punya **tidak perlu dipindah** — biarkan di
tempatnya karena semua path sudah disesuaikan (tidak ada yang tiga level
`../../../` untuk 4 halaman utama ini, cuma game di dalam `mata-pelajaran/`
yang tetap pakai `../../../style.css` dan `../../../assets/`, jadi jangan
pindahkan `style.css` atau `assets/` dari root).

## 🔧 Apa saja yang diperbaiki

1. **Kode JS tidak lagi diduplikasi 4x.** `buvitaDatabase` dan fungsi
   `switchSubject()` dulu di-copy-paste di 4 file HTML. Sekarang cukup satu
   file `js/data.js` — kalau mau tambah game baru, edit di situ saja, otomatis
   muncul di `index.html`, `games.html`, dan `kategori.html`.

2. **Data game disinkronkan.** Sebelumnya `index.html` dan 3 file lain punya
   data & link berbeda (path `tema-mengenal-uang-dasar` vs
   `mengenal-uang-dasar`, status Menengah beda). Sekarang semua ikut data dari
   `index.html` (sesuai konfirmasi kamu) — Menengah sudah link ke
   `KiosJajanan.html`.

3. **`aboutUs.html` diperbaiki total.** Sebelumnya isinya salinan halaman
   Games (filter subjek + katalog). Sekarang berisi konten "Tentang Kami" yang
   sebenarnya: misi, prinsip desain inklusif, dan penjelasan sistem level.
   Silakan sunting teksnya sesuai kebutuhan kamu.

4. **`kategori.html` dibuat ulang sesuai fungsinya.** Dulu isinya identik
   dengan `games.html` (mode filter). Sekarang jadi halaman "peta situs" yang
   menampilkan SEMUA kategori & game sekaligus dalam satu scroll, dengan
   navigasi cepat (anchor link) di atas untuk lompat ke kategori tertentu.

5. **Navigasi diperbaiki.** Link "KATEGORI" di `aboutUs.html` yang salah arah
   ke `games.html` sudah diperbaiki ke `kategori.html`.

6. **Semua inline `style="..."` dihapus** dan dipindah jadi class CSS baru di
   `style.css` (bagian 7–9 di paling bawah file): `.catalog-title`,
   `.catalog-subtitle`, `.catalog-section--tall`, `.empty-state`,
   `.category-block`, `.about-*`, dll. Kode HTML jadi jauh lebih bersih dan
   gampang dibaca.

## ➕ Kalau mau nambah game baru

Cukup edit `js/data.js`, tambahkan entry baru di kategori yang sesuai
(`matematika`, `bahasa`, `umum`, `ipa`, atau `seni`), contoh:

```js
bahasa: [
  {
    tema: "Mengenal Huruf",
    deskripsi: "Belajar mengenal huruf A-Z lewat game interaktif.",
    badgeClass: "badge-bahasaIndonesia",
    badgeText: "Bahasa Indonesia",
    levels: [
      { name: "🟢 Dasar", url: "mata-pelajaran/bahasa/mengenal-huruf-dasar/index.html" },
    ],
  },
],
```

Game barunya otomatis muncul di `games.html` (saat kategori Bahasa diklik) dan
`kategori.html` (langsung terlihat di section Bahasa) — tanpa perlu sentuh
HTML sama sekali.
