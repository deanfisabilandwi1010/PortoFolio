# Portofolio — Dean Fisabil Andwi

Portofolio personal: wordmark raksasa, montage proyek yang membesar saat di-scroll, bagian "Day job" PLN Nusa Daya, dua karya utama (Kalili Steam Club & Tooday), lalu monitor CRT yang di-zoom sampai menjadi desktop interaktif (buka file, drag jendela, minimize/maximize).

Palet: Calm Luxury — `#DFE5F3` `#557373` `#272401` `#F2EFEA` `#0D0D0D` (lihat `src/styles/tokens.css`).

## Menjalankan

Butuh Node.js LTS terbaru (dikembangkan dengan Node 26, lihat `.nvmrc`).

```bash
npm install
npm run dev          # http://localhost:5173
```

| Script | Fungsi |
|---|---|
| `npm run dev` | Dev server Vite |
| `npm run build` | Typecheck + build produksi ke `dist/` |
| `npm run preview` | Menyajikan hasil build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm test` | Unit test Vitest (window manager & geometri) |
| `npm run test:e2e` | Playwright (Chromium, WebKit, Pixel 7). Pertama kali: `npx playwright install chromium webkit` |
| `npm run images` | Membuat ulang semua gambar web dari `Asset/` ke `public/assets/` |
| `npm run check:publish` | Daftar data yang masih kosong sebelum publikasi |

## Mengubah konten

Semua teks dan link ada di **`src/data/portfolio.ts`**:

- `profile` — nama, peran, bio, `email`, `githubUrl`, `linkedinUrl`, `instagramUrl`, `availability`. Field `null` otomatis disembunyikan.
- `credentials` — UNAND & PLN Nusa Daya (logo di `public/assets/logos/`).
- `dutyAreas` — isi bagian "Day job" (Internal applications, SecurityScorecard).
- `projects` — Kalili & Tooday. `githubUrl: null` = tombol "View source" disembunyikan. `role: null` = baris Role disembunyikan.

Aplikasi di desktop (ikon, judul jendela, posisi awal) ada di `src/data/desktopApps.ts`; foto viewer di `src/data/photos.ts`.

### Menambah proyek

1. Ambil screenshot: tambahkan target di `scripts/capture-projects.mjs`, jalankan `node scripts/capture-projects.mjs`.
2. Tambahkan job gambar di `scripts/optimize-images.mjs` (pola `kalili`/`tooday`), lalu `npm run images`.
3. Tambahkan objek ke `projects` di `portfolio.ts` (perluas tipe `id`). Section Selected Work, montage dan folder Projects di desktop mengikutinya.

## Aset

Sumber asli disimpan tidak berubah di `Asset/`; salinan web yang dioptimasi ada di `public/assets/`.

| Sumber | Hasil | Dipakai di |
|---|---|---|
| `DDT_1809.JPG` | `photos/portrait-crop*.webp`, `photos/portrait-studio.webp`, `thumbs/portrait.webp` | About (crop), viewer Portrait (utuh) |
| `webcam-toy-photo8.jpg` | `photos/photobooth.webp` (ukuran asli, tidak di-upscale) | viewer Photo Booth |
| `Gemini_Generated_Image_…png` | `photos/after-hours.webp` | viewer After Hours |
| `Dreamy Lime Meadow and Blue Sky.png` | `desktop/retro-meadow.webp` (saturasi diturunkan sedikit) | wallpaper desktop |
| `Tiny Waving CRT Mascot.png` | `desktop/crt-buddy.webp` (alpha dipertahankan) | maskot desktop |
| `logos/unand.png` | `logos/unand.webp` (latar checkerboard dihapus) | Hero, About |
| `logos/pln-nusa-daya.png` | `logos/pln-nusa-daya.webp` | Hero, About, Day job |
| `projects/*.png` (screenshot situs live, 20 Okt 2026) | `projects/*-preview*.webp`, `*-mobile.webp` | Montage, Selected Work, folder Projects |

Bezel monitor CRT dibuat dengan CSS (`src/desktop/MonitorFrame.tsx`), ukurannya dihitung dari layar desktop yang sebenarnya.

## Deploy (belum dilakukan)

Situs ini statis: build `npm run build`, folder output `dist`.

- **Vercel**: import repo `deanfisabilandwi1010/PortoFolio` → Framework preset *Vite* → Build `npm run build`, Output `dist`.
- **Netlify**: Build command `npm run build`, Publish directory `dist`.

Setelah ada domain, tambahkan `<link rel="canonical">` dan `og:url` di `index.html` dan ubah `og:image` menjadi URL absolut.

## Struktur

```
src/app         App + MotionProvider (Lenis + ScrollTrigger, satu RAF via gsap.ticker)
src/components  Section halaman (Hero, ProjectMontage, About, DayJob, Process, SelectedWork, Contact, Footer)
src/desktop     Scene CRT, desktop, jendela, store Zustand, Draggable
src/motion      Kebijakan motion terpusat, token, reveal hook
src/data        Satu sumber konten
src/tests       Unit test
e2e             Playwright
docs            Storyboard, audit referensi, laporan verifikasi
```

Lihat `docs/verification.md` untuk apa yang sudah dan belum diuji.
