// --- KONFIGURASI DATA BARANG & ASSETS VARIASI ---
// Data barang dengan harga bulat agar mudah dipelajari oleh anak-anak SLB
const daftarBarang = [
  { nama: "Mie Instan", harga: 3500, img: "assets/barang-mie.png" },
  { nama: "Air Mineral", harga: 5000, img: "assets/barang-air.png" },
  { nama: "Kopi Susu", harga: 8000, img: "assets/barang-kopi.png" },
  { nama: "Camilan Keripik", harga: 12500, img: "assets/barang-keripik.png" },
  { nama: "Sabun Cuci", harga: 18000, img: "assets/barang-sabun.png" },
];

const daftarPembeli = ["assets/pembeli-1.png", "assets/pembeli-2.png", "assets/pembeli-3.png"];

// --- STATE / VARIABEL SISTEM UTAMA GAME ---
let pendapatanTotal = 0;
let jumlahPembeliSelesai = 1;
let keranjangBelanjaan = [];
let indeksBarangAktif = 0; // Menandai urutan barang belanjaan aktif
let inputKetik = "0"; // Penampung ketikan numpad kasir
let totalStrukBelanja = 0; // Akumulasi total belanja internal pembeli
let isTotalPressed = false; // Pengunci validasi langkah tombol total

// --- MANAJEMEN ELEMEN DOM ---
const calcDisplay = document.getElementById("calc-display");
const receiptList = document.getElementById("receipt-list");
const receiptTotalPrice = document.getElementById("receipt-total-price");
const totalRevenueEme = document.getElementById("total-revenue");
const customerCountElm = document.getElementById("customer-count");
const instructionText = document.getElementById("instruction-text");

const itemSprite = document.getElementById("item-sprite");
const itemPriceTag = document.getElementById("item-price-tag");
const customerSprite = document.getElementById("customer-sprite");

// --- PEMUTAR AUDIO PERMAINAN ---
function playSound(id) {
  const sound = document.getElementById(id);
  if (sound) {
    sound.currentTime = 0; // Memastikan audio langsung merespon dari detik awal
    sound.play().catch((e) => console.log("Audio play terhambat setelan privasi browser: ", e));
  }
}

// --- PENGHENTI SUARA PROMPT BERJALAN ---
// Membantu mencegah penumpukan instruksi suara yang membingungkan siswa SLB
function stopAllInstructionPrompts() {
  const prompts = ["audio-instruction", "prompt-input", "prompt-total", "prompt-bayar"];
  prompts.forEach((id) => {
    const sound = document.getElementById(id);
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  });
}

// --- FORMAT RUPIAH STANDARD INDONESIA ---
function formatRupiah(angka) {
  return "Rp " + Number(angka).toLocaleString("id-ID");
}

// --- LOGIKA ALUR PERMAINAN ---

// Inisialisasi Karakter Pelanggan dan Keranjang Belanja Baru
function generateCustomer() {
  // 1. Ambil karakter pembeli acak
  const randomPembeli = daftarPembeli[Math.floor(Math.random() * daftarPembeli.length)];
  customerSprite.src = randomPembeli;

  // 2. Tentukan jumlah item bawaan (Diset konstan 2 item agar anak tidak cepat lelah/tantrum)
  const jumlahBarangBawaan = 2;
  keranjangBelanjaan = [];

  for (let i = 0; i < jumlahBarangBawaan; i++) {
    const barangAcak = daftarBarang[Math.floor(Math.random() * daftarBarang.length)];
    keranjangBelanjaan.push(barangAcak);
  }

  // 3. Reset Penanda Indeks
  indeksBarangAktif = 0;

  // 4. Bersihkan Seluruh Riwayat Mesin Kasir
  inputKetik = "0";
  totalStrukBelanja = 0;
  isTotalPressed = false;
  calcDisplay.innerText = "0";
  receiptList.innerHTML = "";
  receiptTotalPrice.innerText = "Rp 0";

  // Perbarui tampilan item pertama ke layar kasir
  updateTampilanBarangAktif();
}

// Pembaruan Tampilan Item yang Harus Dimasukkan Siswa
function updateTampilanBarangAktif() {
  const barangSekarang = keranjangBelanjaan[indeksBarangAktif];

  itemSprite.src = barangSekarang.img;
  itemPriceTag.innerText = formatRupiah(barangSekarang.harga);

  // Instruksi tekstual konkret dan sederhana
  instructionText.innerText = `Ketik angka ${barangSekarang.harga} lalu tekan tombol TAMBAH (➕)`;

  // Fitur Aksesibilitas: Otomatis bunyikan petunjuk suara ketik harga
  stopAllInstructionPrompts();
  playSound("prompt-input");
}

// Respon Input Tombol Angka Numpad
function inputNumber(num) {
  playSound("audio-beep");
  if (inputKetik === "0") {
    inputKetik = num;
  } else {
    inputKetik += num;
  }
  calcDisplay.innerText = inputKetik;
}

// Respon Tombol Reset / Clear Keseluruhan Ketikan
function actionClear() {
  playSound("audio-beep");
  inputKetik = "0";
  calcDisplay.innerText = "0";
}

// Respon Tombol Hapus Karakter Terakhir (Delete)
function actionDelete() {
  playSound("audio-beep");
  if (inputKetik.length > 1) {
    inputKetik = inputKetik.slice(0, -1);
  } else {
    inputKetik = "0";
  }
  calcDisplay.innerText = inputKetik;
}

// Respon Tombol Tambah (+) / Masuk Ke Resi Struk Belanja
function actionAdd() {
  if (indeksBarangAktif >= keranjangBelanjaan.length) {
    playSound("audio-wrong");
    instructionText.innerText = "Semua barang sudah masuk. Ayo tekan tombol TOTAL (📊)";
    return;
  }

  let hargaDiinput = parseInt(inputKetik);
  let barangTarget = keranjangBelanjaan[indeksBarangAktif];

  // Validasi ketepatan kalkulasi siswa
  if (hargaDiinput === barangTarget.harga) {
    playSound("audio-beep");

    // Cetak item ke resi struk belanja sisi kiri
    const li = document.createElement("li");
    li.innerText = `🛒 ${barangTarget.nama} -> ${formatRupiah(barangTarget.harga)}`;
    receiptList.appendChild(li);

    // Akumulasi total hitungan belanja internal
    totalStrukBelanja += hargaDiinput;

    // Reset layar monitor ketik untuk antrean item berikutnya
    inputKetik = "0";
    calcDisplay.innerText = "0";
    indeksBarangAktif++;

    if (indeksBarangAktif < keranjangBelanjaan.length) {
      // Masih ada item tersisa, tampilkan item berikutnya
      updateTampilanBarangAktif();
    } else {
      // Semua item selesai dimasukkan ke struk belanja
      instructionText.innerText = "Bagus! Sekarang tekan tombol TOTAL (📊)";
      itemPriceTag.innerText = "Selesai Scan";

      // Aksesibilitas: Bunyikan suara petunjuk menekan tombol total
      stopAllInstructionPrompts();
      playSound("prompt-total");
    }
  } else {
    // Siswa salah memasukkan nominal nominal angka
    playSound("audio-wrong");
    instructionText.innerText = `Salah ketik. Coba lihat angka kuning di atas, ketik: ${barangTarget.harga}`;
  }
}

// Respon Tombol Total (Mengesahkan kalkulasi akhir belanjaan)
function actionTotal() {
  if (indeksBarangAktif >= keranjangBelanjaan.length && totalStrukBelanja > 0) {
    playSound("audio-beep");
    receiptTotalPrice.innerText = formatRupiah(totalStrukBelanja);
    isTotalPressed = true;

    instructionText.innerText = "Hebat! Terakhir, ketuk tombol hijau BAYAR (✅)";

    // Aksesibilitas: Bunyikan suara petunjuk menekan tombol bayar
    stopAllInstructionPrompts();
    playSound("prompt-bayar");
  } else {
    playSound("audio-wrong");
    instructionText.innerText = "Belum semua barang dimasukkan! Masukkan harga barang terlebih dulu.";
  }
}

// Respon Tombol Bayar (Menyelesaikan Transaksi Aktif)
function actionPay() {
  if (isTotalPressed) {
    playSound("audio-cash");

    // Update akumulasi kas toko
    pendapatanTotal += totalStrukBelanja;
    totalRevenueEme.innerText = formatRupiah(pendapatanTotal);

    const successPopup = document.getElementById("success-popup");
    const successMessage = document.getElementById("success-message");

    // Tampilkan detail sukses nominal transaksi
    successMessage.innerText = `Kamu berhasil menghitung belanjaan senilai ${formatRupiah(totalStrukBelanja)} dengan tepat!`;
    successPopup.style.display = "flex";

    instructionText.innerText = "Luar biasa! Kamu kasir yang hebat.";
  } else {
    playSound("audio-wrong");
    instructionText.innerText = "Tekan dulu tombol TOTAL (📊) sebelum menekan tombol bayar.";
  }
}

// Respon Menutup Dialog Keberhasilan & Mendatangkan Pelanggan Baru
function closeSuccessPopup() {
  playSound("audio-beep");

  const successPopup = document.getElementById("success-popup");
  successPopup.style.display = "none";

  // Perbarui data counter jumlah pelanggan terlayani
  jumlahPembeliSelesai += 1;
  customerCountElm.innerText = jumlahPembeliSelesai;

  // Datangkan pelanggan berikutnya
  generateCustomer();
}

// --- CONTROLLER POPUP SELAMAT DATANG ---

// Memutar penjelasan audio panduan bermain awal
function playInstruction() {
  stopAllInstructionPrompts();
  playSound("audio-instruction");

  const btnInst = document.getElementById("btn-instruction");
  btnInst.innerText = "🔊 Memutar Instruksi...";
  btnInst.style.opacity = "0.7";
}

// Memulai dan mengaktifkan game dari kondisi selamat datang
function startGame() {
  playSound("audio-beep");
  stopAllInstructionPrompts();

  const popup = document.getElementById("welcome-popup");
  popup.style.display = "none";

  // Jalankan siklus pelanggan pertama
  generateCustomer();
}

// --- FUNGSI MEMUTAR ULANG AUDIO PROMPT AKTIF SAAT BOX DIKLIK ---
function replayCurrentPrompt() {
  // Hentikan dulu semua prompt suara yang mungkin sedang berjalan agar tidak tumpang tindih
  stopAllInstructionPrompts();

  // Cek kondisi permainan saat ini untuk menentukan audio mana yang harus diputar ulang
  if (indeksBarangAktif < keranjangBelanjaan.length) {
    // Kondisi 1: Siswa masih dalam proses memasukkan/mengetik harga barang
    playSound("prompt-input");
  } else if (indeksBarangAktif >= keranjangBelanjaan.length && !isTotalPressed) {
    // Kondisi 2: Semua barang sudah di-scan, tapi siswa belum menekan tombol TOTAL
    playSound("prompt-total");
  } else if (isTotalPressed) {
    // Kondisi 3: Tombol TOTAL sudah ditekan, siswa tinggal menekan tombol BAYAR
    playSound("prompt-bayar");
  }
}

// Window Loader untuk menahan alur otomatis sebelum siap dimainkan oleh siswa
window.onload = () => {
  console.log("Mesin simulator kasir inklusif siap digunakan.");
};
