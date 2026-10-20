# Laporan verifikasi — 20 Oktober 2026

Semua hasil di bawah dijalankan pada build produksi (`npm run build` + `vite preview`), Windows 10, Node 26.7.

## Sudah diuji (lulus)

| Pemeriksaan | Hasil |
|---|---|
| `npm run lint` | 0 error, 0 warning |
| `npm run typecheck` | Lulus |
| `npm test` (Vitest) | 15/15 — instance tunggal, open-on-minimized, minimize/restore menjaga posisi, close→reopen, maximize→resize→restore aman, fokus pindah saat close, reindex z, layout pertama tidak menghapus jendela yang sudah dibuka, ponsel mulai tanpa jendela |
| `npm run test:e2e` (Playwright) | 30 lulus, 12 di-skip sesuai desain (tes desktop berjendela tidak relevan di ponsel, dan sebaliknya; drag di WebKit-Windows, lihat di bawah). Suite penuh juga diulang 2× tanpa flake (60/60) |
| Engine | Chromium (1440×900), WebKit / Desktop Safari (1440×900), Pixel 7 (Chromium mobile) |
| Alur e2e | Intro bisa di-skip & tidak mengunci scroll · tidak ada `href="#"`/link kosong · link live & repo benar · disclosure detail · deep link `#desktop` · Portrait buka → gambar benar & utuh (contain) → tutup → buka lagi · **desktop bisa diklik saat monitor masih kecil (zoom belum selesai)** · dua jendela: z-index pindah saat diklik · drag title bar (+100, −60) & tombol Close tidak ikut drag · minimize → tombol taskbar → restore di posisi sama · maximize → restore · resize viewport → title bar tetap terlihat · keyboard: Enter membuka, fokus ke judul, Escape menutup, fokus kembali ke ikon · scroll isi jendela lokal & scroll wallpaper menggerakkan halaman · ponsel: satu panel, Next file / Back, tanpa overflow horizontal · reduced motion: tanpa intro, tanpa konten tersembunyi, tanpa spacer pin · tanpa error console |
| Visual (screenshot) | 1440×900, 1920×1080, 768×1024, 390×844 — lihat `docs/screenshots/`. Tidak ada scroll horizontal di semua lebar yang diperiksa |
| `npm run check:publish` | Identitas inti & 8 aset yang direferensikan ada |

## Keterbatasan pengujian

- **Drag di WebKit (Playwright di Windows)**: build WebKit Playwright untuk Windows mengirim pointer event tetapi tidak mengirim `mousedown` kompatibilitas yang dipakai GSAP Draggable di WebKit, sehingga drag tidak bisa diuji di sana (tes di-skip dengan alasan tertulis). Safari asli mengirim event tersebut, tetapi **belum diuji di Safari/iPhone asli**.
- Viewport 375×812 tidak difoto terpisah (390×844 dan Pixel 7 sudah); Firefox tidak diuji.
- Angka LCP/CLS belum diukur dengan Lighthouse; tidak ada data lapangan.

## Bug yang ditemukan & diperbaiki selama QA

- Header kompak tidak pernah muncul (selector ScrollTrigger ter-scope ke dalam header).
- Wordmark: celah antar kata dan huruf "A" terpotong mask → rasio diukur saat runtime, mask diberi ruang samping.
- Node radar SecurityScorecard salah posisi.
- Deep link `#work` dll. tidak menggulir saat load.
- Viewer foto hanya menampilkan bagian atas Portrait (grid tidak membatasi tinggi).
- Draggable ter-bundle di chunk utama → dipindah ke chunk desktop yang di-lazy-load.
- Transform `perspective` tersisa di wrapper zoom (matrix3d) → dipindah ke CSS.
- Jendela yang dibuka sebelum pengukuran pertama desktop bisa ter-reset (terlihat di tes paralel; juga bisa terjadi di perangkat lambat).
- Deep link `#desktop` mencuri fokus beberapa saat setelah load.
- Montage: animasi masuk menimpa skala scroll (frame langsung skala 1 di build produksi) dan stage sticky menyisakan ~300px kosong sebelum About.

## Data belum tersedia

Lihat `docs/reference-audit.md` — Instagram, status ketersediaan, peran per proyek, domain produksi. Semua disembunyikan dari UI sampai diisi.

## Belum dilakukan

Commit, push, dan deploy belum dilakukan (instruksi deploy ada di README).
