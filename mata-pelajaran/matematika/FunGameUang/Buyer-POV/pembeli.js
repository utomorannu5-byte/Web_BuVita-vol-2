// ==========================================================================
// LOGIKA UTAMA GAME PEMBELI DENGAN SHUFFLE & AUDIO KUSTOM
// ==========================================================================

// 1. BANK DATA BARANG (Banyak Item)
const MASTER_PRODUCTS = [
  { id: "sabun", name: "Sabun BERSIH", price: 18000, img: "assets/barang-sabun.png" }, //
  { id: "mie", name: "Mi Instan", price: 3500, img: "assets/barang-mie.png" },
  { id: "susu", name: "Susu Kotak", price: 6000, img: "assets/barang-susu.png" },
  { id: "roti", name: "Roti Tawar", price: 15000, img: "assets/barang-roti.png" },
  { id: "snack", name: "Keripik Kentang", price: 9500, img: "assets/barang-snack.png" },
  { id: "jus", name: "Jus Buah", price: 8000, img: "assets/barang-jus.png" },
];

let targetBelanja = null;
let uangDompet = 50000;
let uangDiberikan = 0;
let keranjang = [];

// Objek Audio Global (Tinggal kamu sesuaikan nama file-nya nanti)
const audioAnnouncer = new Audio();

// 2. TIMING AWAL: POPUP WELCOME & SHUFFLE
// CORRECTION: Mengubah .style.style menjadi .style.display
function startGame() {
  document.getElementById("popup-welcome").style.display = "none"; // Ini yang benar 👍
  initGameRound();
}

function initGameRound() {
  uangDompet = 50000;
  uangDiberikan = 0;
  keranjang = [];

  // Pilih 1 barang secara acak dari database sebagai misi belanjaan
  const randomIndex = Math.floor(Math.random() * MASTER_PRODUCTS.length);
  targetBelanja = { ...MASTER_PRODUCTS[randomIndex], sudahDibeli: false };

  // Set Total Tagihan di Kasir berdasarkan barang terpilih
  document.getElementById("text-bill-tag").innerText = `Total Tagihan: Rp ${targetBelanja.price.toLocaleString("id-ID")}`;

  // Jalankan algoritma Shuffle untuk mengacak susunan rak toko
  let shuffledProducts = [...MASTER_PRODUCTS];
  shuffledProducts.sort(() => Math.random() - 0.5);

  // Render komponen ke UI
  renderShelf(shuffledProducts);
  renderShoppingList();
  renderStatusSaku();

  // Set petunjuk instruksi pertama
  setInstruction(`Yuk, cari ${targetBelanja.name} di rak toko dan klik harganya!`, "suara-cari-barang.mp3");
}

// 3. RENDER RAK TOKO & CATATAN BELANJA SECARA DINAMIS
function renderShelf(products) {
  const shelf = document.getElementById("shelf-container");
  shelf.innerHTML = "";

  products.forEach((item) => {
    shelf.innerHTML += `
            <div class="shelf-item" onclick="clickShelfItem('${item.id}', ${item.price})">
                <div class="item-price">Rp ${item.price.toLocaleString("id-ID")}</div>
                <img src="${item.img}" alt="${item.name}" class="shelf-img" />
                <div class="item-name">${item.name}</div>
            </div>
        `;
  });
}

function renderShoppingList() {
  const list = document.getElementById("shopping-list");
  list.innerHTML = `
        <li id="target-item-box">🛒 1 ${targetBelanja.name} <span class="status-badge">Belum</span></li>
    `;
}

function renderStatusSaku() {
  document.getElementById("current-cash").innerText = "Rp " + uangDompet.toLocaleString("id-ID");
}

// 4. MEKANIK KLIK BARANG DI RAK
function clickShelfItem(itemId, harga) {
  if (itemId === targetBelanja.id) {
    if (targetBelanja.sudahDibeli) return;

    uangDompet -= harga;
    targetBelanja.sudahDibeli = true;
    keranjang.push(targetBelanja.name);

    // Update Struk Catatan & Keranjang Visual
    document.getElementById("target-item-box").innerHTML = `✅ <s>1 ${targetBelanja.name}</s> <span class="status-badge" style="background: #00e676;">Selesai</span>`;
    document.getElementById("target-item-box").style.color = "#757575";

    const cartBasket = document.getElementById("cart-items");
    cartBasket.className = "cart-basket";
    cartBasket.innerHTML = `
            <div style="padding: 10px; text-align: center;">
                <img src="${targetBelanja.img}" style="width: 50px; height: 50px; object-fit: contain; margin-bottom: 5px;" />
                <b style="font-size: 13px; color: #212121;">${targetBelanja.name}</b>
            </div>
        `;

    renderStatusSaku();
    setInstruction(`Bagus sekali! ${targetBelanja.name} sudah masuk keranjang. Yuk kita pergi ke kasir!`, "suara-ke-kasir.mp3");

    // Munculkan tombol kasir
    document.getElementById("btn-go-to-cashier").style.display = "block";
  } else {
    setInstruction(`Hmm, itu ${MASTER_PRODUCTS.find((p) => p.id === itemId).name}. Coba cari yang namanya ${targetBelanja.name}!`, "suara-salah-barang.mp3");
  }
}

// 5. FUNGSI TRANSISI KASIR & PENGGUNAAN LEMBARAN UANG
function goToCashier() {
  document.getElementById("view-shelf").style.display = "none";
  document.getElementById("view-cashier").style.display = "flex";
  setInstruction(`Kasir: "Totalnya Rp ${targetBelanja.price.toLocaleString("id-ID")}, Kak." Yuk pilih uang di dompet!`, "suara-pilih-uang.mp3");
}

function payWithBill(nominal) {
  uangDiberikan += nominal;
  document.getElementById("money-placed").innerText = "Rp " + uangDiberikan.toLocaleString("id-ID");

  if (uangDiberikan < targetBelanja.price) {
    setInstruction(`Uang di nampan Rp ${uangDiberikan.toLocaleString("id-ID")}. Masih kurang, yuk tambah lagi!`, "suara-uang-kurang.mp3");
  } else {
    setInstruction(`Uangmu Rp ${uangDiberikan.toLocaleString("id-ID")} sudah CUKUP. Ayo klik tombol hijau SERAHKAN UANG!`, "suara-uang-cukup.mp3");
  }
}

function resetPaymentTray() {
  uangDiberikan = 0;
  document.getElementById("money-placed").innerText = "Rp 0";
  setInstruction("Uang diambil kembali. Yuk dihitung ulang dengan teliti!", "suara-ambil-uang.mp3");
}

// 6. POPUP KUSTOM UNTUK HALAMAN HASIL AKHIR (ANTI-ALERT)
function finishTransaction() {
  if (uangDiberikan === 0) {
    setInstruction("Dompet belum dibuka! Masukkan uangmu ke nampan dulu.", "suara-dompet-kosong.mp3");
    return;
  }

  const popup = document.getElementById("popup-result");
  const title = document.getElementById("result-title");
  const msg = document.getElementById("result-message");

  if (uangDiberikan >= targetBelanja.price) {
    let kembalian = uangDiberikan - targetBelanja.price;

    title.innerText = "🎉 HEBAT, KAMU SUKSES!";
    title.style.color = "#00c853";

    if (kembalian > 0) {
      msg.innerText = `Kamu berhasil membeli ${targetBelanja.name}!\nUang yang kamu serahkan Rp ${uangDiberikan.toLocaleString("id-ID")} dan mendapatkan kembalian sebesar Rp ${kembalian.toLocaleString("id-ID")}.`;
      playAudioFile("suara-sukses-kembalian.mp3");
    } else {
      msg.innerText = `Luar biasa! Kamu berhasil membayar dengan UANG PAS (Rp ${uangDiberikan.toLocaleString("id-ID")}) tanpa kembalian!`;
      playAudioFile("suara-sukses-pas.mp3");
    }

    popup.style.display = "flex";
  } else {
    setInstruction(`Waduh, uangmu masih kurang Rp ${(targetBelanja.price - uangDiberikan).toLocaleString("id-ID")} lagi. Kasir tidak bisa memproses.`, "suara-transaksi-gagal.mp3");
  }
}

// 7. ENGINE SAKLAR PANDUAN AUDIO & TEKS
let currentAudioFile = "";

function setInstruction(text, audioFile) {
  document.getElementById("instruction-text").innerHTML = `"${text}" 🔊`;
  currentAudioFile = audioFile; // Simpan rute file audio aktif
  playAudioFile(audioFile);
}

function triggerAudioInstruction() {
  if (currentAudioFile) playAudioFile(currentAudioFile);
}

function playAudioFile(fileName) {
  // Jalankan sistem audio jika string file dikonfigurasi
  if (!fileName) return;
  try {
    audioAnnouncer.src = "assets/audio/" + fileName; // Letakkan aset suaramu di folder assets/audio/
    audioAnnouncer.play();
  } catch (err) {
    console.log("Audio belum siap dikonfigurasi: " + err);
  }
}

function resetGame() {
  document.getElementById("popup-result").style.display = "none";
  document.getElementById("view-cashier").style.display = "none";
  document.getElementById("view-shelf").style.display = "block";
  document.getElementById("btn-go-to-cashier").style.display = "none";
  initGameRound();
}
