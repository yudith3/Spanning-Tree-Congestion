# Spanning-Tree-Congestion
Project to visualize Graph Theory sub part, especially Spanning Tree problem

## STC Explorer, Modul 1: Penjelajahan

Visualisasi interaktif untuk memahami *spanning-tree congestion* (STC) pada graf kecil. Pengguna membentuk pohon rentang dengan mengklik sisi, lalu melihat kongesti tiap sisi pohon dan potongan (cut) yang diinduksinya.

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

### Struktur proyek

| File | Isi |
|---|---|
| `index.html` | Kerangka halaman, termasuk kolom input graf |
| `style.css` | Tampilan, termasuk mode gelap otomatis |
| `app.js` | Data graf, pembaca input, logika graf, dan tampilan |
| `graf.js` | Logika graf bersama (potongan, kongesti, solver) |
| `modul2.html`, `reduksi.js` | Modul 2: reduksi (M2P1N)-SAT ke graf G* |

Di dalam `app.js`:

- `GRAPHS`: daftar graf contoh.
- `parseGraph`: membaca dan memvalidasi graf dari teks.
- `reach`, `cutOf`, `cong`, `maxCong`: menghitung potongan dan kongesti.
- `solve`: enumerasi semua pohon rentang untuk mencari stc(G).
- `render` dan event handler: menggambar graf dan menangani interaksi.

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

### Hasil verifikasi

| Graf | stc(G) | Jumlah pohon rentang |
|---|---|---|
| K4 | 3 | 16 |
| K5 | 4 | 125 |
| K6 | 5 | 1296 |
| Grid 3x3 | 3 | 192 |

Nilai stc(K_n) = n−1 sesuai fakta di paper, dan jumlah pohon rentang klik sesuai rumus Cayley (n^(n−2)).

## Modul 2: Reduksi SAT

Menampilkan graf G* hasil reduksi dari instans (M2P1N)-SAT dengan 12 variabel dan 16 klausa. Pengguna memindahkan sisi klausa-variabel untuk membentuk pohon, lalu situs menghitung kongesti tiap sisi akar-variabel dan menurunkan penugasan variabel dari pohon (Lemma 3.3 dan 3.4 paper).

## Referensi

S. Atalig, M. Chrobak, C. Dürr, P. Kolman, H. Luu, J. Sgall, G. Zhu. *Two Complexity Results on Spanning-Tree Congestion Problems*. arXiv:2601.10881v2, 2026.