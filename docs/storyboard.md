# Storyboard (sesuai implementasi)

Nilai di bawah adalah nilai yang benar-benar ada di kode, bukan pengukuran situs referensi.

## Pembukaan — loader "garis potong" (`Intro.tsx`)

Diputar di setiap load penuh (dilewati untuk reduced motion dan deep link). Skip / Escape kapan saja; semua jalur melepas scroll lock.

| Fase | Kejadian |
|---|---|
| Muat | Layar olive, garis putus-putus melintang. Huruf wordmark nama lengkap (ivory) jatuh satu per satu mengikuti progres nyata, tepat di posisi wordmark hero; 5 titik = 5 aset. Counter `000→100` **hanya** mengikuti aset nyata (font + 2 logo + 2 screenshot); diamond "pemotong" berjalan dan menggambar garis solid. Minimal 1,1 dtk, maksimal 6 dtk (aset gagal tetap dihitung) |
| Potong | Garis diselesaikan (0,25 dtk), metadata & garis memudar |
| Belah | Huruf ivory ikut pergi bersama separuh layar tempatnya berada (kini separuh bawah, karena nama ada di dasar hero), menyingkap huruf olive hero di posisi yang sama. Separuh bawah turun (0,95 dtk, power4.inOut) |
| Hero | Huruf wordmark naik dari mask dengan rotasi kecil (0,9 dtk, stagger 35 ms), metadata, baris headline, CTA; frame montage masuk +0,55 dtk |

## Perjalanan scroll

| Bab | Implementasi |
|---|---|
| 01 Hero | Satu layar, tiga kolom tanpa tumpang-tindih: **kiri** headline (frasa italic bergilir tiap 3 dtk) + paragraf + CTA; **tengah** potret dalam bingkai lengkung bergaris — hover: **lensa lingkaran mengikuti kursor** dan hanya menyingkap foto After Hours di bagian yang ditunjuk (tap di HP membuka penuh); **kanan** daftar *Index* bernomor (Now, Manages, Secures, Studied, Shipped) — hover: blok olive menyapu dari kiri, teks bergeser, panah muncul; klik → navigasi tirai ke section terkait. Nama raksasa di dasar layar (huruf terangkat seperti tuts saat disentuh kursor; terangkat halus saat di-scroll, desktop saja). Grid titik menyala di sekitar kursor |
| — Marquee | Dua pita teks raksasa (olive & mist) miring dan berputar pelan; kecepatan naik mengikuti velocity scroll dan arah berbalik saat scroll ke atas. Pita kedua sebelum Contact |
| 02 Montage | Section 150svh, stage sticky setinggi frame (tidak menyisakan ruang kosong setelah lepas). Animasi masuk ada di stage; transform frame hanya milik scene scroll. Progress 0–0,2: scale 0,46; 0,2–0,8: scale → 1 (power1.inOut); 0,8–1: diam. Scrub 0,6. ≥1024px & motion saja |
| 03 About | Heading per baris; paragraf bio terisi kata per kata mengikuti scroll (opacity 0,14→1, scrub); foto potret terbuka seperti shutter (clip-path dari bawah) sambil foto di dalamnya turun skala 1,3→1 |
| 04 Day job | Panel mist melebar dari kartu bersudut membulat (inset 5%, radius 40px) menjadi full-bleed; huruf A/B parallax. **Tile aplikasi internal** (ERP, E-Arsip, Kinerja, GCG): diam = blueprint putus-putus; hover/focus/tap = isian olive masuk dari sisi datangnya kursor, nama bergulir per huruf, ilustrasi tergambar & bergerak (ERP modul tersambung + data mengalir; E-Arsip dokumen keluar dari map; Kinerja batang tumbuh + garis tren; GCG perisai + centang), tilt 3D + kilau mengikuti kursor. Dua "file": Internal applications (ivory) & SecurityScorecard (olive) dengan radar Detect → Triage → Fix → Verify (loop CSS 6 dtk, hanya berjalan saat terlihat) |
| 05 How I work | Desktop: di-pin (+170%). Kartu naik seperti grafik batang (tangga menurun), **heksagon kasar menggelinding sambil memantul lalu menjadi lingkaran mulus** (MorphSVG), dan "jalan" bergelombang di tiap kartu menjadi lurus setelah roda lewat. Mobile/tablet: judul tampil dulu, lalu **baris kartu di-pin** dan bergeser horizontal mengikuti scroll vertikal, roda heksagon yang sama menggelinding & membulat, jalan tiap kartu meluruskan diri saat kartu lewat |
| 06 Toolkit | **Tabel periodik** 21 alat (warna per disiplin: Frontend, Motion & 3D, Backend & data, Testing & delivery, Security). Sel berhamburan lalu tersusun saat masuk layar; hover/fokus/tap satu sel → hanya sel itu terangkat, kartu detail di kanan (sticky) menampilkan simbol, catatan, dan **"Used in"** (proyek nyata). Chip filter meredupkan disiplin lain. Mobile: 4 kolom, kartu detail menempel di atas grid |
| 07 Selected work | Desktop: **showcase di-pin** — daftar proyek kiri (aktif tebal, lainnya pudar, garis progres), detail aktif crossfade; gambar kanan menyapu ke atas ke proyek berikutnya, yang sebelumnya mengecil & meredup; lencana bundar "View live site" berputar. Mobile/reduced: dua blok editorial |
| 08 Desktop | Track 340svh (ponsel 280svh), stage sticky, 4 fase: **1)** bloom lembut (mask radial berbulu) tumbuh dari bawah menyingkap desktop sementara "Step inside my desktop." menajam dari blur lalu larut; **2)** desktop penuh (tujuan tombol & `#desktop`, progress 0,33); **3)** kamera mundur — casing CRT/ponsel muncul, perangkat mengecil, glare CRT muncul; **4)** pin lepas, perangkat naik ke Contact. Desktop interaktif di semua fase |
| 09 Contact/footer | Heading tengah; CTA meluncur di rel putus-putus dari kiri ke tengah sebagai diamond berputar lalu berubah jadi lengkung (MorphSVG), rel di belakangnya menjadi solid; wordmark "ANDWI" naik huruf per huruf |

Tombol "Open my desktop" langsung menuju progress 0,33 lalu memindahkan fokus ke desktop (deep link `#desktop` tidak memindahkan fokus). Scroll ke atas memutar zoom mundur; jendela yang terbuka tetap ada.

## Interaksi global

- **Navigasi tirai**: semua link `#section` → tirai dua lapis (teal lalu olive) naik 0,55 dtk, nama tujuan muncul per huruf ("(06) Selected *work*"), halaman berpindah di balik tirai (section yang di-pin mendarat di awal pin), tirai terangkat, fokus ke judul tujuan, URL ikut berubah. Reduced motion: lompat langsung.
- **Pill aktif** di header kompak meluncur (elastic) ke menu section yang sedang dibaca; teks menu bergulir per huruf saat hover.

- Lenis lerp 0,085 (lebih meluncur), hanya pointer halus.
- Halo kursor mengikuti kursor sistem (tetap terlihat); membesar di link, menjadi badge di gambar proyek; tersembunyi saat drag jendela.
- Tombol utama magnetik (`data-magnetic`), kembali dengan elastic saat kursor keluar.

## Desktop

- Jendela buka: opacity 0→1, scale 0,97→1, 220 ms; tutup: → 0,98, 150 ms; minimize: → 0,92 dari bawah, 180 ms.
- Ikon: hover y −3px (140 ms), tekan scale 0,97 (90 ms).
- Maskot: y ±4px, rotasi ±2°, 6 dtk per loop; berhenti saat tab tersembunyi, di luar viewport, atau "Pause motion".

## Jalur sederhana

- **Reduced motion**: tanpa intro, tanpa Lenis, tanpa sticky/zoom; semua konten langsung terlihat.
- **< 1024px**: tanpa scene montage. Scene perangkat tetap ada (tablet: monitor + jendela yang bisa di-drag; < 768px: ponsel dengan satu panel aktif — Back / Next file / Close).
