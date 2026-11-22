# Spanning-Tree-Congestion
Project to visualize Graph Theory sub part, especially Spanning Tree problem

## STC Explorer
 
Visualisasi interaktif untuk memahami *spanning-tree congestion* (STC) pada graf kecil, dalam tiga modul:
 
1. **Penjelajah**: membentuk pohon rentang dan melihat kongesti serta potongan tiap sisi.
2. **Reduksi SAT**: reduksi (M2P1N)-SAT ke graf G* yang membuktikan STC NP-hard untuk derajat 3.
3. **Kaktus dan hub**: algoritma waktu hampir linear untuk memutuskan stc(G) = K pada graf K-edge-connected.
Proyek ini mengacu pada paper *Two Complexity Results on Spanning-Tree Congestion Problems* (Atalig dkk., arXiv:2601.10881).

### Latar belakang singkat

Diberikan graf G dan pohon rentang T. Kongesti sebuah sisi e di T adalah jumlah sisi G yang lintasannya di T melewati e. Secara ekuivalen, itu adalah ukuran potongan yang terbentuk ketika e dilepas dari T. Kongesti pohon adalah nilai maksimum dari kongesti sisinya, dan stc(G) adalah nilai minimum atas semua pohon rentang.

### Fitur

- Membentuk pohon rentang dengan mengklik sisi. Sisi yang membentuk siklus ditolak.
- Menampilkan kongesti tiap sisi pohon setelah pohon lengkap.
- Menyorot potongan yang diinduksi sebuah sisi pohon: shore A, shore B, dan sisi yang menyeberang.
- Mencari pohon optimal dan nilai stc(G) dengan brute force.
- Pilihan graf: contoh 6 simpul, klik K4, K5, K6, dan grid 3x3.
- Memasukkan graf sendiri langsung dari website lewat daftar sisi.
- Modul 2: memindahkan sisi klausa-variabel, lalu melihat kongesti tiap sisi akar-variabel dan penugasan variabel yang diturunkan dari pohon.
- Modul 3: melihat potongan minimum, pohon kaktus, dan himpunan hub dihitung langkah demi langkah, dicek silang dengan brute force Modul 1.

### Struktur proyek

| File | Isi |
|---|---|
| `index.html`, `app.js` | Modul 1, termasuk kolom input graf |
| `modul2.html`, `reduksi.js` | Modul 2: reduksi (M2P1N)-SAT ke graf G* |
| `modul3.html`, `kaktus.js` | Modul 3: kaktus dan hub |
| `graf.js` | Logika graf bersama (potongan, kongesti, solver) |
| `style.css` | Tampilan, termasuk mode gelap otomatis |
| `favicon.svg` | Ikon situs |

Di dalam `app.js`:

- `GRAPHS`: daftar graf contoh.
- `parseGraph`: membaca dan memvalidasi graf dari teks.
- `reach`, `cutOf`, `cong`, `maxCong`: menghitung potongan dan kongesti.
- `solve`: enumerasi semua pohon rentang untuk mencari stc(G).
- `render` dan event handler: menggambar graf dan menangani interaksi.

Di dalam `graf.js`: `reach`, `cutOf`, `cong`, `maxCong` (potongan dan kongesti) serta `solve` (enumerasi semua pohon rentang untuk mencari stc(G)). Di `kaktus.js`: `analyze` (potongan-K, pohon kaktus, himpunan hub).

### Menambah graf baru

Isi kolom "Masukkan graf sendiri" dengan daftar sisi, lalu klik "Gunakan graf ini". Graf muncul di menu sebagai "Graf kustom".

```
A-B, B-C, C-D, D-A, A-C
```

Aturan input:

- Satu sisi ditulis sebagai dua nama simpul, dipisah tanda hubung atau spasi.
- Sisi dipisah koma, titik koma, atau baris baru.
- Nama simpul maksimal 3 karakter.
- Sisi ganda diabaikan, sedangkan sisi ke diri sendiri ditolak.
- Graf harus terhubung, dengan maksimal 12 simpul dan 18 sisi.
- Simpul ditata otomatis melingkar.

### Modul 2: Reduksi SAT

Menampilkan graf G* hasil reduksi dari instans (M2P1N)-SAT dengan 12 variabel dan 16 klausa. Pengguna memindahkan sisi klausa-variabel untuk membentuk pohon, lalu situs menghitung kongesti tiap sisi akar-variabel dan menurunkan penugasan variabel dari pohon (Lemma 3.3 dan 3.4 paper). K bersifat simbolik; gadget flower dan bobot ganda dibiarkan abstrak.

### Modul 3: Kaktus dan hub
 
Untuk graf dengan K ganjil, potongan-K membentuk pohon kaktus. Situs menampilkan himpunan hub H(Z) tiap potongan dari bawah ke atas (Lemma 5.7, 5.9, 5.13) dan memutuskan stc(G) = K jika r ∈ H(V∖{r}). Kasus K genap (siklus kaktus) belum didukung, dan potongan dicari dengan brute force.

## Hasil verifikasi

| Graf | stc(G) | Jumlah pohon rentang |
|---|---|---|
| K4 | 3 | 16 |
| K5 | 4 | 125 |
| K6 | 5 | 1296 |
| Grid 3x3 | 3 | 192 |

Nilai stc(K_n) = n−1 sesuai fakta di paper, dan jumlah pohon rentang klik sesuai rumus Cayley (n^(n−2)).

Hasil verifikasi

| Graf | stc(G) | Jumlah pohon rentang |
|---|---|---|
| K4 | 3 | 16 |
| K5 | 4 | 125 |
| K6 | 5 | 1296 |
| Grid 3x3 | 3 | 192 |

Nilai stc(K_n) = n−1 sesuai fakta di paper, dan jumlah pohon rentang klik sesuai rumus Cayley (n^(n−2)).

## Referensi

S. Atalig, M. Chrobak, C. Dürr, P. Kolman, H. Luu, J. Sgall, G. Zhu. *Two Complexity Results on Spanning-Tree Congestion Problems*. arXiv:2601.10881v2, 2026.

## Website

[Klik disini untuk mengunjungi website](https://spanning-tree-congestion.vercel.app/index.html)