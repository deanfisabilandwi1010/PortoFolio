# Audit referensi & data (20 Oktober 2026)

## Referensi visual — neutomni.com

Ditinjau lewat halaman publik. Pola yang diadaptasi: wordmark raksasa, headline di kolom kanan dengan ruang kosong di kiri, header ringkas setelah scroll, kartu proses berwarna gelap, blok "Selected Work" besar, monitor/desktop interaktif, dan footer berwarna dengan wordmark besar. Tidak ada logo, copy, foto tim, testimoni, pricing, atau banner cookie Neutomni yang disalin. Warna merah/putih referensi diganti seluruhnya dengan palet Calm Luxury.

## Proyek (diverifikasi dari situs live & repo publik)

| Proyek | Live | Repo | Yang terverifikasi |
|---|---|---|---|
| Kalili Steam Club | kalilidimsum.netlify.app | github.com/deanfisabilandwi1010/kaliliDimsum | Landing page interaktif; tombol "tahan untuk membuka" kukusan; model 3D dimsum yang bisa diputar; menu + Black Series; daftar "Pilihanmu". `package.json`: Next.js 15, React 19, Three.js, GSAP. Tidak ada pembayaran/checkout |
| Tooday | toodaycafee.vercel.app | github.com/deanfisabilandwi1010/t00day | Menu berkategori & swipe, saran pairing, "Pilihanku", alur `/order` "pilih, kirim, bayar di kasir". `package.json`: Next.js 16, React 19, GSAP, Lenis, Supabase |
| DompetQu (Kantong — Retro Money Club) | dompetqu-personal.vercel.app | github.com/deanfisabilandwi1010/DompDigital | Aplikasi keuangan pribadi bergaya desktop retro: rekening, transaksi & transfer (dengan refund), kantong virtual, anggaran, tujuan tabungan, pengingat, laporan arus kas/kategori, ekspor CSV, backup/restore JSON, mode demo. `package.json`/README: React 19, TypeScript, Vite, Nhost (Postgres + Hasura GraphQL), Dexie (IndexedDB), Vitest. Screenshot diambil dari **mode demo** (data fiktif). **Catatan:** di deployment live tertulis "Konfigurasi Nhost belum diisi (VITE_NHOST_SUBDOMAIN/REGION)" — mode catatan pribadi belum aktif di Vercel |

**Asumsi yang perlu dikonfirmasi:** ada dua repo Tooday (`tooday` dan `t00day`). Saya memakai `t00day` karena paling baru dan memuat sistem order yang cocok dengan alur `/order` di situs live. Ganti `githubUrl` di `portfolio.ts` bila salah.

## Pekerjaan di PLN Nusa Daya

Dari pemilik: programmer, mengelola empat aplikasi internal — serta menangani SecurityScorecard web. Atas permintaan pemilik, nama aplikasi **tidak ditampilkan**: situs hanya memakai kode (SYS-01–04) dan bidang umum (Operations, Records, Performance, Governance) di `dutyAreas[0].apps`. Butir pekerjaan SecurityScorecard (triage temuan, perbaikan TLS/security header, verifikasi ulang) adalah deskripsi umum dari "penanganan SecurityScorecard web" — tidak ada skor atau angka yang ditampilkan. Sunting `dutyAreas` bila ingin lebih spesifik.

## Data dari pemilik (20 Okt 2026)

Email `deanfisabilandwi@gmail.com`, LinkedIn `linkedin.com/in/deanfisabilandwi`, dan status pendidikan: lulusan Sistem Informasi Universitas Andalas.

## Data yang belum tersedia (disembunyikan dari UI)

- Instagram
- Status ketersediaan ("open for work")
- Peran/kontribusi per proyek
- Domain produksi (canonical/og:url)
