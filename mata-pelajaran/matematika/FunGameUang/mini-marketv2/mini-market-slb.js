/* =====================================================================
   KASIR CILIK SLB — LOGIKA GAME
   ---------------------------------------------------------------------
   Struktur file ini dibagi jadi beberapa bagian besar, cari pakai
   Ctrl+F sesuai judul bagian:

     1. DATA BARANG & PEMBELI
     2. STATE / VARIABEL GAME
     3. REFERENSI ELEMEN DOM
     4. PENGATURAN AKSESIBILITAS (localStorage)
     5. SUARA & MASKOT BICARA
     6. LOGIKA UTAMA GAMEPLAY
     7. NUMPAD & TRANSAKSI
     8. SISTEM BANTUAN / HINT (untuk slow learner)
     9. POPUP & INISIALISASI

   Semua nama fungsi/variabel pakai awalan "mm" (mini-market) supaya
   tidak bentrok dengan game lain jika nanti digabung ke situs utama
   BuVita EduPlay (sama seperti konvensi "kc" pada game Kasir Cilik).
===================================================================== */

/* =====================================================================
   1. DATA BARANG & PEMBELI
   Tambah/ubah barang di sini. "gambar" harus ada di folder assets/.
===================================================================== */
const mmDaftarBarang = [
  { nama: "Mie Instan", harga: 3500, gambar: "assets/barang-mie.png" },
  { nama: "Air Mineral", harga: 5000, gambar: "assets/barang-air.png" },
  { nama: "Kopi Susu", harga: 8000, gambar: "assets/barang-kopi.png" },
  { nama: "Camilan Keripik", harga: 12500, gambar: "assets/barang-keripik.png" },
  { nama: "Sabun Cuci", harga: 18000, gambar: "assets/barang-sabun.png" },
];

const mmDaftarPembeli = ["assets/pembeli-1.png", "assets/pembeli-2.png", "assets/pembeli-3.png"];

/* Pengaturan jumlah barang per tingkat kesulitan [minimum, maksimum] */
const mmRentangKesulitan = {
  mudah: [1, 2],
  sedang: [2, 3],
  menantang: [3, 4],
};

/* =====================================================================
   2. STATE / VARIABEL GAME
===================================================================== */
let mmPendapatanTotal = 0;
let mmJumlahPembeliSelesai = 1;

let mmKeranjang = []; // daftar barang milik pembeli saat ini
let mmIndeksBarangAktif = 0; // barang keberapa yang sedang diproses

let mmInputAngkaTeks = "0"; // teks angka yang sedang diketik di numpad
let mmTotalStruk = 0; // total belanjaan yang sudah berhasil di-scan
let mmTotalSudahDitekan = false;

let mmJumlahSalahBerturut = 0; // dipakai sistem bantuan otomatis
let mmTingkatBantuanBarangIni = 0; // 0 = belum minta bantuan sama sekali

/* Pengaturan aksesibilitas (nilai default, akan ditimpa oleh
   localStorage jika sebelumnya sudah pernah diatur) */
let mmPengaturan = {
  volume: 0.8,
  ukuranTeks: "normal",
  kontrasTinggi: false,
  gerakBerkurang: false,
  kesulitan: "sedang",
};

/* =====================================================================
   3. REFERENSI ELEMEN DOM
===================================================================== */
const mmLayarHitung = document.getElementById("mm-layar-hitung");
const mmDaftarStrukEl = document.getElementById("mm-daftar-struk");
const mmTotalStrukEl = document.getElementById("mm-total-struk");
const mmTotalPendapatanEl = document.getElementById("mm-total-pendapatan");
const mmJumlahPembeliEl = document.getElementById("mm-jumlah-pembeli");
const mmTeksInstruksiEl = document.getElementById("mm-teks-instruksi");
const mmProgresBarangEl = document.getElementById("mm-progres-barang");
const mmMaskotEl = document.getElementById("mm-maskot");
const mmTombolUlangiEl = document.getElementById("mm-tombol-ulangi");

const mmSpriteBarang = document.getElementById("mm-sprite-barang");
const mmLabelHarga = document.getElementById("mm-label-harga");
const mmSpritePembeli = document.getElementById("mm-sprite-pembeli");

/* =====================================================================
   4. PENGATURAN AKSESIBILITAS
   Disimpan di localStorage supaya guru tidak perlu mengulang setting
   setiap kali membuka game (misalnya kontras tinggi untuk siswa
   tertentu, atau ukuran teks besar).
===================================================================== */
function mmMuatPengaturan() {
  try {
    const tersimpan = localStorage.getItem("mmPengaturanSLB");
    if (tersimpan) {
      mmPengaturan = { ...mmPengaturan, ...JSON.parse(tersimpan) };
    }
  } catch (e) {
    console.log("Gagal memuat pengaturan tersimpan, memakai default.", e);
  }
  mmTerapkanPengaturan();
}

function mmSimpanPengaturan() {
  try {
    localStorage.setItem("mmPengaturanSLB", JSON.stringify(mmPengaturan));
  } catch (e) {
    console.log("Gagal menyimpan pengaturan (mode privat/incognito?).", e);
  }
}

/* Menerapkan seluruh pengaturan ke tampilan + menyalakan tombol aktif
   di panel Pengaturan supaya guru tahu opsi mana yang sedang dipilih. */
function mmTerapkanPengaturan() {
  document.documentElement.setAttribute("data-ukuran-teks", mmPengaturan.ukuranTeks);
  document.body.classList.toggle("mm-kontras-tinggi", mmPengaturan.kontrasTinggi);
  document.body.classList.toggle("mm-gerak-berkurang", mmPengaturan.gerakBerkurang);

  document.getElementById("mm-slider-volume").value = Math.round(mmPengaturan.volume * 100);

  mmSetTombolAktif("mm-grup-ukuran-teks", mmPengaturan.ukuranTeks);
  mmSetTombolAktif("mm-grup-kontras", mmPengaturan.kontrasTinggi ? "tinggi" : "biasa");
  mmSetTombolAktif("mm-grup-animasi", mmPengaturan.gerakBerkurang ? "kurang" : "normal");
  mmSetTombolAktif("mm-grup-kesulitan", mmPengaturan.kesulitan);
}

/* Menandai tombol pilihan yang sedang aktif dengan class .mm-terpilih */
function mmSetTombolAktif(idGrup, nilaiAktif) {
  const grup = document.getElementById(idGrup);
  if (!grup) return;
  grup.querySelectorAll("button").forEach((tombol) => {
    tombol.classList.toggle("mm-terpilih", tombol.dataset.nilai === nilaiAktif);
  });
}

function mmUbahVolume(nilaiSlider) {
  mmPengaturan.volume = Number(nilaiSlider) / 100;
  mmSimpanPengaturan();
}

function mmSetUkuranTeks(nilai) {
  mmPengaturan.ukuranTeks = nilai;
  mmTerapkanPengaturan();
  mmSimpanPengaturan();
}

function mmSetKontrasTinggi(aktif) {
  mmPengaturan.kontrasTinggi = aktif;
  mmTerapkanPengaturan();
  mmSimpanPengaturan();
}

function mmSetGerakBerkurang(aktif) {
  mmPengaturan.gerakBerkurang = aktif;
  mmTerapkanPengaturan();
  mmSimpanPengaturan();
}

function mmSetKesulitan(nilai) {
  mmPengaturan.kesulitan = nilai;
  mmTerapkanPengaturan();
  mmSimpanPengaturan();
}

function mmBukaPengaturan() {
  mmPutarSuara("mm-audio-klik");
  document.getElementById("mm-popup-pengaturan").style.display = "flex";
}

function mmTutupPengaturan() {
  mmPutarSuara("mm-audio-klik");
  document.getElementById("mm-popup-pengaturan").style.display = "none";
}

/* =====================================================================
   5. SUARA & MASKOT BICARA
===================================================================== */

/* Memutar salah satu elemen <audio> di HTML berdasarkan id-nya.
   Volume otomatis mengikuti pengaturan. Kalau file mp3 belum ada /
   gagal dimuat, kesalahan ditangkap secara diam-diam (tidak
   mengganggu jalannya game — lihat komentar di HTML soal file apa
   saja yang perlu disiapkan). */
function mmPutarSuara(id) {
  const audio = document.getElementById(id);
  if (!audio) return;
  audio.volume = mmPengaturan.volume;
  audio.currentTime = 0;
  audio.play().catch((e) => console.log(`Audio "${id}" tidak bisa diputar:`, e));
}

/* Menampilkan instruksi di gelembung bicara maskot SEKALIGUS
   membacakannya lewat suara (Web Speech API) untuk siswa non-verbal
   atau yang belum lancar membaca. Ini FITUR TAMBAHAN yang otomatis
   nonaktif dengan sendirinya kalau browser/perangkat tidak
   mendukung text-to-speech Bahasa Indonesia -- game tetap berjalan
   normal hanya dengan teks + mp3 instruksi/efek suara.

   mmSimpanUntukDiulang menentukan apakah kalimat ini akan disimpan
   sebagai "instruksi terakhir" sehingga bisa diputar ulang lewat
   tombol Ulangi. */
let mmInstruksiTerakhir = "";

function mmTampilkanInstruksi(teks, mmSimpanUntukDiulang = true) {
  mmTeksInstruksiEl.innerText = teks;
  if (mmSimpanUntukDiulang) {
    mmInstruksiTerakhir = teks;
  }
  mmBicaraTeks(teks);
}

function mmBicaraTeks(teks) {
  if (!("speechSynthesis" in window)) return; // browser tidak mendukung, lewati saja

  window.speechSynthesis.cancel(); // hentikan ucapan sebelumnya biar tidak menumpuk

  const ucapan = new SpeechSynthesisUtterance(teks);
  ucapan.lang = "id-ID";
  ucapan.rate = 0.92; // sedikit lebih pelan dari normal, lebih mudah diikuti
  ucapan.volume = mmPengaturan.volume;

  // Animasikan mulut maskot selama kira-kira durasi bicara berlangsung
  mmMaskotEl.classList.add("mm-bicara");
  ucapan.onend = () => mmMaskotEl.classList.remove("mm-bicara");
  ucapan.onerror = () => mmMaskotEl.classList.remove("mm-bicara");

  window.speechSynthesis.speak(ucapan);
}

/* Tombol "Ulangi" -- mengucapkan ulang instruksi terakhir. Penting
   untuk siswa slow learner/autis yang butuh pengulangan tanpa harus
   meminta bantuan guru secara verbal setiap saat. */
function mmUlangiInstruksi() {
  mmPutarSuara("mm-audio-klik");
  if (mmInstruksiTerakhir) {
    mmBicaraTeks(mmInstruksiTerakhir);
  }
}

/* =====================================================================
   6. LOGIKA UTAMA GAMEPLAY
===================================================================== */
function mmFormatRupiah(angka) {
  return "Rp " + Number(angka).toLocaleString("id-ID");
}

/* Memulai pembeli baru dengan barang acak. Jumlah barang mengikuti
   tingkat kesulitan yang dipilih guru di panel Pengaturan. */
function mmMulaiPembeliBaru() {
  const pembeliAcak = mmDaftarPembeli[Math.floor(Math.random() * mmDaftarPembeli.length)];
  mmSpritePembeli.src = pembeliAcak;

  const [min, max] = mmRentangKesulitan[mmPengaturan.kesulitan] || mmRentangKesulitan.sedang;
  const jumlahBarang = Math.floor(Math.random() * (max - min + 1)) + min;

  mmKeranjang = [];
  for (let i = 0; i < jumlahBarang; i++) {
    mmKeranjang.push(mmDaftarBarang[Math.floor(Math.random() * mmDaftarBarang.length)]);
  }

  mmIndeksBarangAktif = 0;
  mmInputAngkaTeks = "0";
  mmTotalStruk = 0;
  mmTotalSudahDitekan = false;
  mmJumlahSalahBerturut = 0;
  mmTingkatBantuanBarangIni = 0;

  mmLayarHitung.innerText = "0";
  mmDaftarStrukEl.innerHTML = "";
  mmTotalStrukEl.innerText = "Rp 0";

  mmGambarTitikProgres();
  mmTampilkanBarangAktif();
}

/* Menggambar ulang titik-titik progres di pojok kiri atas: bantuan
   visual non-verbal supaya siswa tahu berapa barang sudah selesai /
   sedang dikerjakan / belum dikerjakan, tanpa perlu membaca angka. */
function mmGambarTitikProgres() {
  mmProgresBarangEl.innerHTML = "";
  mmKeranjang.forEach((_, i) => {
    const titik = document.createElement("span");
    titik.className = "mm-titik-progres";
    if (i < mmIndeksBarangAktif) titik.classList.add("mm-selesai");
    else if (i === mmIndeksBarangAktif) titik.classList.add("mm-aktif");
    mmProgresBarangEl.appendChild(titik);
  });
}

/* Menampilkan barang yang sedang aktif untuk di-scan + instruksi
   singkat & jelas (kalimat pendek supaya mudah dipahami). */
function mmTampilkanBarangAktif() {
  const barang = mmKeranjang[mmIndeksBarangAktif];
  mmTingkatBantuanBarangIni = 0;

  mmSpriteBarang.src = barang.gambar;
  mmLabelHarga.innerText = mmFormatRupiah(barang.harga);

  mmTampilkanInstruksi(`Barang: ${barang.nama}. Harganya ${mmFormatRupiah(barang.harga)}. Ketik angkanya, lalu tekan Tambah.`);
  mmGambarTitikProgres();
}

/* =====================================================================
   7. NUMPAD & TRANSAKSI
===================================================================== */
function mmInputAngka(angka) {
  mmPutarSuara("mm-audio-klik");
  mmInputAngkaTeks = mmInputAngkaTeks === "0" ? angka : mmInputAngkaTeks + angka;
  mmLayarHitung.innerText = mmInputAngkaTeks;
}

function mmAksiBersihkan() {
  mmPutarSuara("mm-audio-klik");
  mmInputAngkaTeks = "0";
  mmLayarHitung.innerText = "0";
}

function mmAksiHapusSatu() {
  mmPutarSuara("mm-audio-klik");
  mmInputAngkaTeks = mmInputAngkaTeks.length > 1 ? mmInputAngkaTeks.slice(0, -1) : "0";
  mmLayarHitung.innerText = mmInputAngkaTeks;
}

/* Tombol '+' / Tambah: memasukkan satu barang ke struk.
   Penanganan SALAH dibuat SELEMBUT mungkin (tanpa kata "SALAH" besar,
   tanpa suara buzzer keras) supaya siswa tidak takut mencoba lagi.
   Setelah 2x salah berturut-turut pada barang yang sama, game akan
   otomatis menawarkan petunjuk (scaffolding) supaya siswa tidak
   terjebak frustrasi berkepanjangan. */
function mmAksiTambah() {
  if (mmIndeksBarangAktif >= mmKeranjang.length) {
    mmPutarSuara("mm-audio-coba-lagi");
    mmTampilkanInstruksi("Semua barang sudah dimasukkan. Sekarang tekan tombol Total.");
    return;
  }

  const hargaDiinput = parseInt(mmInputAngkaTeks, 10);
  const barangTarget = mmKeranjang[mmIndeksBarangAktif];

  if (hargaDiinput === barangTarget.harga) {
    mmPutarSuara("mm-audio-benar");
    mmJumlahSalahBerturut = 0;

    const item = document.createElement("li");
    item.innerText = `${barangTarget.nama} .... ${mmFormatRupiah(barangTarget.harga)}`;
    mmDaftarStrukEl.appendChild(item);

    mmTotalStruk += hargaDiinput;
    mmInputAngkaTeks = "0";
    mmLayarHitung.innerText = "0";
    mmIndeksBarangAktif++;

    if (mmIndeksBarangAktif < mmKeranjang.length) {
      mmTampilkanBarangAktif();
    } else {
      mmGambarTitikProgres();
      mmLabelHarga.innerText = "Selesai";
      mmTampilkanInstruksi("Semua barang sudah di-scan! Sekarang tekan tombol Total.");
    }
  } else {
    mmJumlahSalahBerturut++;
    mmPutarSuara("mm-audio-coba-lagi");

    if (mmJumlahSalahBerturut >= 2) {
      // Otomatis tawarkan bantuan, dengan nada mengajak bukan menegur
      mmTampilkanInstruksi(`Belum tepat, tidak apa-apa. Coba tekan "Beri Petunjuk" ya.`);
    } else {
      mmTampilkanInstruksi(`Coba cek lagi angka di tag harga ${barangTarget.nama} ya.`);
    }
  }
}

function mmAksiTotal() {
  if (mmIndeksBarangAktif >= mmKeranjang.length && mmTotalStruk > 0) {
    mmPutarSuara("mm-audio-benar");
    mmTotalStrukEl.innerText = mmFormatRupiah(mmTotalStruk);
    mmTotalSudahDitekan = true;
    mmTampilkanInstruksi("Totalnya sudah benar. Sekarang tekan tombol BAYAR.");
  } else {
    mmPutarSuara("mm-audio-coba-lagi");
    mmTampilkanInstruksi("Scan dulu semua barang belanjaan sebelum menekan Total ya.");
  }
}

function mmAksiBayar() {
  if (!mmTotalSudahDitekan) {
    mmPutarSuara("mm-audio-coba-lagi");
    mmTampilkanInstruksi("Tekan tombol Total dulu sebelum menerima pembayaran.");
    return;
  }

  mmPutarSuara("mm-audio-cash");

  mmPendapatanTotal += mmTotalStruk;
  mmTotalPendapatanEl.innerText = mmFormatRupiah(mmPendapatanTotal);

  document.getElementById("mm-pesan-sukses").innerText = `Kamu berhasil menghitung belanjaan senilai ${mmFormatRupiah(mmTotalStruk)} dengan tepat!`;
  document.getElementById("mm-popup-sukses").style.display = "flex";

  setTimeout(() => mmPutarSuara("mm-audio-sukses"), 300);
  mmTampilkanInstruksi("Kerja bagus! Tekan Pembeli Berikutnya untuk lanjut.", false);
}

function mmTutupPopupSukses() {
  mmPutarSuara("mm-audio-klik");
  document.getElementById("mm-popup-sukses").style.display = "none";

  mmJumlahPembeliSelesai++;
  mmJumlahPembeliEl.innerText = mmJumlahPembeliSelesai;

  mmMulaiPembeliBaru();
}

/* =====================================================================
   8. SISTEM BANTUAN / HINT
   Dirancang untuk siswa slow learner: bantuan diberikan BERTAHAP,
   bukan langsung memberi jawaban penuh, supaya tetap ada proses
   belajar berhitung. Tekan tombol berkali-kali untuk level bantuan
   berikutnya.
     Level 1 -> jumlah digit harga
     Level 2 -> angka pertama harga
     Level 3 -> harga lengkap disorot & dibacakan
===================================================================== */
function mmMintaBantuan() {
  if (mmIndeksBarangAktif >= mmKeranjang.length) return;

  mmPutarSuara("mm-audio-klik");
  const barang = mmKeranjang[mmIndeksBarangAktif];
  const teksHarga = String(barang.harga);
  mmTingkatBantuanBarangIni++;

  if (mmTingkatBantuanBarangIni === 1) {
    mmTampilkanInstruksi(`Petunjuk: harganya terdiri dari ${teksHarga.length} angka.`, false);
  } else if (mmTingkatBantuanBarangIni === 2) {
    mmTampilkanInstruksi(`Petunjuk: angka pertamanya adalah ${teksHarga[0]}.`, false);
  } else {
    mmTampilkanInstruksi(`Ini harganya: ${mmFormatRupiah(barang.harga)}. Coba ketik sekarang ya.`, false);
  }
}

/* =====================================================================
   9. POPUP & INISIALISASI
===================================================================== */
function mmMainkanInstruksiAwal() {
  mmPutarSuara("mm-audio-instruksi");
  const tombol = document.getElementById("mm-btn-instruksi");
  tombol.innerText = "Memutar Instruksi...";
  tombol.style.opacity = "0.75";
}

function mmMulaiPermainan() {
  mmPutarSuara("mm-audio-klik");

  const audioInstruksi = document.getElementById("mm-audio-instruksi");
  audioInstruksi.pause();
  audioInstruksi.currentTime = 0;

  document.getElementById("mm-popup-selamat-datang").style.display = "none";

  // Tombol "Ulangi Instruksi" baru muncul setelah permainan dimulai,
  // supaya tidak membingungkan saat popup selamat datang masih terbuka.
  mmTombolUlangiEl.style.display = "flex";

  mmMulaiPembeliBaru();
}

/* Game TIDAK langsung mulai saat halaman dibuka -- menunggu siswa
   menekan salah satu tombol di popup selamat datang, supaya audio
   browser diizinkan untuk diputar (kebijakan autoplay browser modern
   mengharuskan ada interaksi pengguna terlebih dahulu). */
window.onload = () => {
  mmMuatPengaturan();
  console.log("Kasir Cilik SLB siap. Menunggu siswa menekan tombol mulai.");
};
