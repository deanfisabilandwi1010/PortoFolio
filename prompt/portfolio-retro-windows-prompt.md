# MASTER PROMPT V2.1 — Portofolio Neutomni-feel dengan palet Calm Luxury
## Tech stack • storyboard • motion • arsitektur • pengerjaan • pengujian

Pembaruan: 20 Oktober 2026. Dokumen ini menggantikan seluruh versi sebelumnya.

**Cara pakai:** berikan seluruh dokumen ini kepada coding agent bersama tiga foto personal, screenshot referensi, wallpaper retro, dan maskot CRT dari percakapan. Lengkapi nama, peran, email, dan tautan repository sebelum publikasi. Dokumen ini adalah instruksi implementasi; website dan koneksi GitHub belum dibuat dalam penyusunan prompt.

## Pembaruan khusus tone warna
Gunakan palet **Calm Luxury** dari gambar pengguna image(20261020-074353).png: #DFE5F3, #557373, #272401, #F2EFEA, dan #0D0D0D. Warna ini menggantikan seluruh arahan merah-putih dari V2. Pertahankan wordmark raksasa, komposisi asimetris, sans-serif + serif miring, ruang kosong lebar, perpindahan skala, komputer CRT, serta semua perilaku jendela.

**Batas revisi: hanya warna dan penerapannya.** Tech stack, font, grid, ukuran, struktur halaman, storyboard, durasi, easing, interaksi, dan tahapan pengerjaan tetap mengikuti V2. Referensi Neutomni mengatur feel dan motion; gambar palet pengguna menjadi sumber warna yang mengikat. Maskot tetap aksen kecil. Jangan mengubah layout menjadi desain luxury baru yang berbeda.

---

# MULAI PROMPT UNTUK CODING AGENT

Anda bertindak sebagai creative frontend developer, art director, motion designer, dan UI engineer. Bangun portofolio personal yang terasa sangat dekat dengan pengalaman visual https://neutomni.com/, tetapi memakai identitas, foto, konten, dan proyek pemilik.

Terapkan lima warna Calm Luxury secara konsisten pada seluruh UI. Kualitas hasil tetap ditentukan oleh komposisi, hierarki, tipografi, perpindahan skala, ritme scroll, dan respons interaksinya secara keseluruhan.

## 1. Tujuan dan batas tugas
Pengunjung harus dapat:
1. Mengenali nama dan peran pemilik dalam beberapa detik.
2. Melihat Kalili dan Tooday sebagai dua karya utama.
3. Membuka live website, detail karya, serta repository yang benar.
4. Menjelajahi desktop personal: membuka foto, menggeser jendela, menutup, membuka kembali.
5. Menemukan kontak tanpa harus menjalankan desktop.

Buat website yang dapat dijalankan dan diuji. Jangan menyalin logo, nama, copywriting, testimonial, atau foto tim Neutomni. Buat ulang karakter pengalamannya dengan aset pemilik.

Portofolio utama tetap berada di halaman. Desktop adalah bab interaktif di bagian bawah. Jangan menjadikan seluruh website simulasi OS yang menyembunyikan karya di dalam folder.

Ikuti instruksi repository yang tersedia. Kerjakan implementasi lokal dan preview sampai tuntas. Publikasi dan perubahan remote hanya dilakukan bila instruksi pemilik mencakup tindakan tersebut. Jangan menghentikan pengerjaan lokal hanya karena data opsional belum tersedia; catat field yang perlu dilengkapi dan sembunyikan field kosong dari UI publik.

## 2. Dasar referensi: fakta dan rancangan
Referensi sudah ditinjau melalui halaman publik, browser, dan screenshot lampiran. Penyebutan merah/putih/biru pada kolom pengamatan berikut hanya menjelaskan situs asli; **bukan instruksi warna implementasi**. Semua adaptasi menggunakan palet pada Bagian 5.

| Elemen | Yang terlihat pada referensi | Adaptasi yang harus dibuat |
|---|---|---|
| Pembuka | Wordmark merah sangat besar di atas latar putih | Wordmark olive gelap pada ivory; skala tetap hampir selebar layar |
| Tipografi | Sans-serif diselingi serif miring pada frasa tertentu | Manrope + Instrument Serif Italic sebagai pasangan alternatif |
| Hero | Headline berada di sisi kanan, banyak ruang putih, media di bawah | Copy personal di kanan, montage Kalili–Tooday di bawah |
| Navigasi | Identitas kecil dan navigasi menjadi header ringkas saat halaman bergeser | Header kompak setelah melewati wordmark besar |
| Proses | Komposisi editorial dengan kartu merah | Kartu olive gelap berteks ivory; isi langkah kerja tetap |
| Karya | Selected work dengan gambar besar | Dua presentasi Kalili dan Tooday |
| Desktop | Monitor CRT biru dengan wallpaper langit/bukit dan ikon di kanan | CRT biru pucat/teal + wallpaper bertone lembut + file personal |
| Viewer | Jendela putih, judul merah, kontrol kecil | Jendela ivory, title bar biru pucat, judul olive gelap; fungsi sama |
| Penutup | CTA berbentuk geometris dan footer merah dengan wordmark putih besar | Footer olive gelap dengan wordmark ivory besar |
| Loader | Struktur halaman memuat loader geometris dan counter | Intro singkat yang dapat dilewati; jangan membuat progress unduhan palsu |

Seluruh angka durasi, easing, ukuran, dan scroll progress dalam dokumen ini adalah **target implementasi rancangan**, bukan pengukuran persis source code Neutomni. Stack berikut adalah stack yang dipilih untuk portofolio ini, bukan klaim stack internal Neutomni.

Jangan mengklaim kemiripan “100%” sebelum inspeksi visual berdampingan. Cocokkan pola pengalaman dan komposisinya; teks serta identitas tetap personal.

## 3. Tech stack yang ditetapkan
Untuk proyek baru gunakan keputusan ini, bukan daftar alternatif tanpa keputusan:

| Lapisan | Pilihan | Tanggung jawab |
|---|---|---|
| UI | React + TypeScript strict | Komponen, data, interaksi |
| Build | Vite, template react-ts | Development server, bundling, output dist |
| Runtime pengembangan | Node.js LTS yang masih didukung dan kompatibel dengan Vite yang dipilih | Catat versi aktual pada .nvmrc dan README |
| Styling | CSS Modules + global CSS custom properties | Layout editorial, responsive, window chrome |
| Motion utama | gsap | Timeline pembuka, reveal, transisi |
| Scroll scene | GSAP ScrollTrigger | Progress scroll, pin terbatas, zoom monitor |
| Integrasi React | @gsap/react, useGSAP | Scope animasi dan cleanup |
| Smooth scroll | lenis | Aktif hanya pada desktop pointer halus dan tanpa reduced motion |
| Drag | GSAP Draggable | Drag title bar dengan batas area |
| State desktop | zustand | Open/focus/minimize/maximize/restore/close |
| Font | Manrope + Instrument Serif Italic, self-hosted | Dua keluarga utama |
| Ikon | SVG inline sederhana buatan sendiri | Folder, file, close, maximize, source |
| Optimasi gambar | sharp sebagai alat build/dev | WebP/AVIF, thumbnail, srcset |
| Unit test terarah | Vitest | Invariant window manager dan clamp posisi |
| End-to-end | Playwright | Alur jendela, keyboard, mobile, link |
| Kualitas | ESLint + TypeScript | Kesalahan kode dan tipe |
| Hosting target | Static hosting Vercel atau Netlify | Build npm run build, output dist |

Aturan versi:
- Gunakan rilis stabil kompatibel saat implementasi, bukan canary.
- Periksa dukungan Node dan peer dependency sebelum instalasi.
- Simpan versi yang benar-benar terpasang dalam package-lock.json.
- Untuk repository lama, gunakan package manager dan stack yang sudah ada; adaptasi arsitektur tanpa migrasi framework yang tidak perlu.
- Jika repo sudah Next.js, tetap gunakan Next.js. Batas komponen client harus spesifik pada motion/desktop; jangan mengubah semua halaman menjadi client component.
- Tidak perlu backend, database, auth, CMS, WebSocket, React Three Fiber, atau Three.js untuk versi ini.
- Jangan menambahkan Framer Motion di samping GSAP untuk tugas animasi yang sama.
- Tidak perlu Tailwind atau component library besar untuk proyek baru ini; komposisi custom adalah prioritas.

Contoh setup hanya untuk folder proyek baru yang kosong:

~~~bash
npm create vite@latest portfolio -- --template react-ts
cd portfolio
npm install
npm install gsap @gsap/react lenis zustand
npm install @fontsource-variable/manrope @fontsource/instrument-serif
npm install -D vitest @playwright/test sharp
~~~

Pastikan path import font cocok dengan paket aktual, termasuk berkas italic. Jangan menjalankan scaffolding pada folder berisi pekerjaan pengguna.

## 4. Integrasi motion: satu sistem yang terkendali
- Daftarkan plugin GSAP yang digunakan.
- Satu pengelola Lenis untuk halaman, bukan satu per section.
- Gunakan satu pemilik RAF. Jika Lenis memakai ticker GSAP, matikan autoRaf; jangan juga menjalankan loop requestAnimationFrame terpisah.
- Ikuti integrasi resmi Lenis–ScrollTrigger; event scroll menyinkronkan ScrollTrigger, ticker mengirim timestamp dalam unit yang benar.
- Simpan callback agar dapat dilepas saat unmount; destroy instance Lenis pada cleanup.
- Gunakan useGSAP dengan scope ref. Handler yang membuat tween setelah setup harus ikut context-safe cleanup.
- Media query motion menggunakan satu kebijakan terpusat. Reduced motion dan ponsel mendapat jalur yang sederhana.
- Gunakan gsap.matchMedia untuk membentuk dan membersihkan timeline desktop/mobile.
- Jalankan refresh setelah font/gambar yang memengaruhi layout selesai dimuat, bukan setiap frame.
- ResizeObserver menghitung ulang ukuran stage dan bounds. Debounce refresh agar tidak membuat loop layout.
- Jangan menganimasikan transform yang sama dari CSS, GSAP, dan drag sekaligus.

Pembagian wrapper jendela:
1. WindowPosition: x/y milik Draggable.
2. WindowTransition: opacity/scale milik tween buka/tutup.
3. WindowSurface: ukuran, title bar, dan isi.

Dengan pemisahan ini, membuka jendela tidak menghapus posisi drag. Saat maximize, nonaktifkan drag, simpan normalRect, dan set posisi dengan satu pemilik state. Saat restore, sinkronkan kembali instance Draggable.

Scroll body harus tetap berjalan ketika kursor berada di wallpaper. Scroll di dalam isi jendela yang panjang harus bergerak secara lokal tanpa menyeret halaman. Hindari event wheel global yang selalu preventDefault.

## 5. Design system
### Palet wajib — Calm Luxury
Gunakan kode HEX persis dari gambar pengguna; jangan menggantinya dengan merah Neutomni, neon, emas, atau warna luxury tambahan.

| Warna | HEX | Token | Fungsi utama |
|---|---|---|---|
| Biru pucat | #DFE5F3 | --color-mist | Panel sekunder, title bar, highlight, bezel CRT |
| Teal redup | #557373 | --color-teal | Aksen, border, ikon, detail hover |
| Olive sangat gelap | #272401 | --color-olive | Wordmark, heading, CTA utama, kartu proses, footer |
| Ivory hangat | #F2EFEA | --color-ivory | Latar halaman, surface jendela, teks di bidang gelap |
| Hitam lembut | #0D0D0D | --color-ink | Body, label penting, detail kontras |

Tokens implementasi:
~~~css
:root {
  --color-mist: #DFE5F3;
  --color-teal: #557373;
  --color-olive: #272401;
  --color-ivory: #F2EFEA;
  --color-ink: #0D0D0D;
  --page-bg: var(--color-ivory);
  --surface: var(--color-ivory);
  --surface-secondary: var(--color-mist);
  --text-primary: var(--color-ink);
  --text-heading: var(--color-olive);
  --accent: var(--color-teal);
  --button-bg: var(--color-olive);
  --button-text: var(--color-ivory);
  --border-subtle: rgba(85, 115, 115, 0.24);
  --shadow-window: 0 12px 36px rgba(13, 13, 13, 0.14);
}
~~~

Distribusi: ivory menjadi bidang dominan; biru pucat memberi variasi panel; teal menjadi aksen terkontrol; olive dan ink membentuk hierarki. Pertahankan ruang kosong dan bentuk dari V2. Jangan membuat seluruh halaman gelap hanya karena tersedia dua warna gelap.

| Komponen | Penerapan warna |
|---|---|
| Intro | Bidang ivory, shape olive/teal/mist, teks ink |
| Hero | Latar ivory, wordmark olive, body ink, aksen teal |
| Header | Latar ivory, link olive/ink, underline hover teal |
| Montage dan karya | Frame ivory/mist; screenshot proyek tetap warna asli |
| About | Latar ivory atau mist; judul olive, paragraf ink |
| Kartu proses | Bidang olive, teks ivory, detail garis mist |
| CTA utama | Olive + label ivory; hover ink + label ivory |
| CTA sekunder | Surface ivory, teks olive, border teal |
| Monitor CRT | Bezel mist, sisi/bayangan teal, kontrol olive |
| Jendela | Body ivory, title bar mist, judul olive, teks ink |
| Taskbar | Ivory/mist; aplikasi aktif olive + teks ivory |
| Footer | Bidang olive, wordmark ivory, metadata ivory/mist |

Aturan keterbacaan: body kecil memakai ink/olive pada ivory/mist, atau ivory/mist pada olive. Kombinasi ivory–teal menghasilkan rasio sekitar 4,48:1 dan mist–teal sekitar 4,07:1 dari kode di atas; jangan membulatkannya menjadi lulus ambang 4,5:1. Gunakan teal untuk aksen/grafis atau teks besar yang sesuai, bukan default paragraf kecil. Border dekoratif transparan tidak boleh menjadi satu-satunya indikator fokus; focus ring memakai olive/ivory yang kontras dengan bidangnya.

Warna asli foto pengguna dan screenshot Kalili–Tooday tetap utuh. Tone dekorasi desktop boleh diselaraskan melalui overlay lembut dan penurunan saturasi khusus wallpaper/bezel/maskot; jangan menerapkan filter global pada section yang juga memuat foto atau proyek. Thumbnail foto tetap asli. Wallpaper tetap langit/bukit, dengan biru dan hijau yang lebih tenang bila diperlukan. Jangan mengganti bentuk aset, komposisi, atau animasinya.

### Tipografi
- Manrope: navigasi, headline utama, body, label.
- Instrument Serif Italic: satu frasa penting per headline, email/CTA tertentu.
- System monospace cukup untuk jam dan metadata singkat; tidak perlu mengunduh keluarga ketiga.
- Wordmark atas: tinggi visual sekitar 14–18vw, maksimal sekitar 240–270px pada desktop lebar; sesuaikan panjang nama.
- Headline hero: clamp sekitar 38–64px; panjang baris 15–23 karakter.
- Section title: 64–112px pada desktop, 40–60px pada mobile.
- Body: 16–18px, line-height 1.45–1.6.
- Label: 12–14px.
- Hindari letter-spacing negatif sampai huruf bertabrakan.
- Jangan merenggangkan font secara horizontal untuk meniru logo. Bentuk wordmark personal melalui pemilihan font, tracking, line break, atau SVG teks orisinal.

### Grid dan bentuk
- Desktop: 12 kolom; outer gutter 20–32px; jarak antarkolom 20–28px.
- Wordmark dan media tertentu boleh hampir full bleed.
- Teks panjang tetap maksimal sekitar 60–70ch.
- Hero copy berada pada kolom 7–12. Sisi kiri sengaja lebih kosong.
- Ruang vertikal besar merupakan bagian komposisi, tetapi jangan menghasilkan beberapa viewport kosong tanpa isi.
- Mayoritas panel bersudut tegas; thumbnail foto boleh radius 6–10px.
- Shadow hanya untuk lapisan jendela atau kedalaman monitor.
- Tidak ada grid kartu rounded berulang yang membuatnya tampak seperti dashboard SaaS.

## 6. Storyboard pembukaan — berbasis waktu
Waktu dihitung dari shell halaman siap tampil. Hero sudah mounted; animasi tidak boleh menunggu semua foto desktop.

| Waktu target | Adegan | Gerakan dan perilaku | Tujuan |
|---|---|---|---|
| 0–0,15 dtk | Canvas ivory muncul stabil | Geometri olive/teal/mist dan identitas; ukuran layout sudah tersedia | Hindari flash dan layout shift |
| 0,15–0,65 dtk | Intro geometris singkat | Circle/diamond/square berganti dengan opacity/rotate ringan | Membangun rasa studio kreatif |
| 0,50–1,10 dtk | Wordmark besar terbuka | Reveal melalui clip/mask vertikal; tidak membesar dari tengah seperti popup | Kesan editorial tegas |
| 0,70–1,25 dtk | Baris navigasi dan metadata masuk | translateY 8–12px, opacity, stagger 50–80ms | Membuat orientasi jelas |
| 0,85–1,45 dtk | Headline kanan terbaca | Mask per baris, stagger 70–100ms; frasa italic tetap satu kesatuan | Mengenalkan karakter personal |
| 1,05–1,60 dtk | Montage proyek muncul di bawah | translateY 24px → 0, opacity; tanpa memutar seluruh frame | Mengarahkan ke karya |
| Setelah 1,60 dtk | Halaman siap dijelajahi | Tidak ada animasi masuk yang menghalangi tombol | Pengguna mengambil kendali |

Intro overlay maksimal 900ms dan tersedia Skip sejak awal. Keseluruhan reveal dapat overlap hingga 1,6 detik; overlay tidak menutupi hero selama itu.

Jika memakai counter, nilainya harus terkait aset kritis yang benar-benar selesai, termasuk penanganan error. Pilihan default yang lebih sederhana: nomor adegan/shape, tanpa persentase unduhan. Jangan membuat penghitung loading acak.

Intro hanya sekali per session. Deep link ke #work, #desktop, #contact langsung menuju tujuannya. Reduced motion langsung menampilkan state akhir. Semua handler error dan Skip harus melepas scroll lock serta menghilangkan overlay.

## 7. Storyboard perjalanan halaman — berbasis scroll
Progress berikut adalah progress **lokal section**, bukan persentase seluruh halaman. Jangan membuat pengunjung menunggu animasi berbasis waktu saat scroll cepat.

| Bab | Komposisi | Interaksi/motion | Implementasi |
|---|---|---|---|
| 01. Hero | Nama raksasa, metadata di bawah, copy di kanan, montage di tengah bawah | Reveal pembuka; wordmark melewati viewport lalu header kecil tampil | Hero native scroll, header terpisah |
| 02. Work montage | Cuplikan Kalili dan Tooday pada kanvas sederhana | Frame bertambah dominan saat discroll | Satu scene pendek dengan transform |
| 03. About/manifesto | Headline kiri, potret dan narasi kanan | Reveal sekali, dua kolom asimetris | Native scroll, tidak dipin |
| 04. How I work | Label kecil dan kartu olive dengan teks ivory | Kartu masuk bertahap dari level berbeda hingga sejajar | Trigger pendek, bukan pin panjang |
| 05. Selected work | Dua karya dengan gambar besar, metadata dan CTA | Preview halus, detail tetap mudah dibaca | Native scroll, dua blok editorial |
| 06. Enter my desktop | CRT mist/teal di tengah dengan layar langit/bukit | Mendekat ke layar sampai desktop luas dapat dipakai | Satu scene scroll zoom terukur |
| 07. Personal desktop | Ikon di kanan, jendela ivory/mist, taskbar tipis | Klik, drag, close, minimize, restore | State-driven; scroll halaman tetap normal |
| 08. Contact/footer | CTA geometris olive, lalu bidang olive dan nama ivory besar | Hover CTA lentur ringan; footer menjadi penutup kuat | Native scroll; link kontak nyata |

Jangan mengganti seluruh perjalanan ini menjadi kumpulan fade-in. Ada dua momen perubahan skala yang nyata: montage dan masuk ke desktop.

### Scene montage
- Section sekitar 160–180svh pada desktop; stage sticky sekitar viewport dikurangi header.
- Progress 0–0,2: frame sekitar 40–48% lebar ruang stage, posisi agak ke bawah.
- Progress 0,2–0,8: frame mendekati 90–94% lebar stage.
- Progress 0,8–1: frame stabil lalu section berikutnya masuk.
- Sisakan konteks; jangan membuat screenshot proyek menjadi blur karena dibesarkan melebihi sumber.
- Hanya satu wrapper yang discale; isi dan caption tidak berlawanan arah.
- Mobile: frame tampil lebar biasa tanpa pin/zoom besar.
- Jika montage belum memiliki aset yang benar, gunakan dua panel nama proyek dengan komposisi jelas. Jangan mengarang screenshot.

### Scene masuk desktop
- Desktop besar: section sekitar 180–220svh; stage tinggi viewport dikurangi header.
- 0–0,25: monitor CRT tampil utuh dengan lebar sekitar 55–65vw.
- 0,25–0,7: area layar menjadi pusat zoom; bezel bergerak ke tepi.
- 0,7–0,85: layar memenuhi area stage, perspektif menjadi datar agar UI terbaca.
- 0,85–1: desktop berada pada ukuran stabil; petunjuk singkat “Open a file” muncul.
- Setelah scene selesai, pengunjung dapat memakai desktop tanpa masih terjebak pin.
- Tombol “Open my desktop” mengantar langsung ke state desktop yang dapat dipakai, tanpa memaksa menjalani seluruh zoom.
- Scene dapat kembali saat scroll ke atas; jendela yang dibuka tidak dihapus hanya karena scroll.

Implementasi pilihan: bezel/monitor adalah lapisan presentasi, desktop HTML adalah lapisan fungsional. Saat transisi skala masih berjalan, gunakan preview inert; layer interaktif aktif pada posisi final yang sejajar. Handoff harus tanpa kedipan dan tanpa duplikasi elemen fokus.

Preview boleh berupa render dekoratif tersendiri yang aria-hidden dan inert, tetapi state window manager hanya satu. Semua ID, fokus, drag, dan taskbar berada pada surface interaktif final. Jangan membuat dua desktop aktif.

Gunakan data ukuran aperture monitor untuk menghitung fit/zoom; jangan menebak transform origin secara berbeda di setiap breakpoint. Bila aset raster tidak memiliki bukaan transparan yang tepat, bangun bezel CSS/SVG yang terukur. Jangan menempelkan UI di atas gambar layar yang sudah berisi UI lain.

## 8. Detail setiap section
### Hero
Gunakan wordmark personal dari nama nyata. Jangan menulis NEUTOMNI atau memodifikasi logonya.

Copy konsep:
- Headline: “I build websites / with character / and a clear purpose.”
- Frasa terakhir memakai serif italic.
- Copy final harus cocok dengan peran nyata pemilik.

Header awal: peran di kiri, Work/About/Desktop/Contact di tengah, email di kanan jika tersedia. Jam kecil memakai Asia/Jakarta. Status available hanya jika pemilik mengonfirmasi; jangan mengarang “Open for work”.

CTA utama “View selected work”; CTA sekunder “Open my desktop”. Hindari tombol besar yang memenuhi hero. Identitas dan karya menjadi pusat perhatian.

### About
DDT_1809.JPG menjadi potret editorial utama pada bagian ini; boleh tampil sebagai cameo kecil di montage, tanpa menggantikan preview proyek. Foto memiliki ruang kosong besar di atas: lakukan crop yang menghormati wajah, kacamata, pose, dan busana.

Bio hanya berdasarkan data pemilik. Jangan menyimpulkan pekerjaan atau usia dari foto. Jangan mengambil riwayat akademik dari konteks pengguna lain.

### How I work
Tampilkan metode yang dinyatakan sebagai pendekatan kerja, bukan klaim jumlah pengalaman:
- Understand.
- Design.
- Build.
- Refine.

Jika pemilik hanya membutuhkan tiga tahap, gabungkan Build/Refine. Kartu olive gelap dengan teks ivory, judul campuran sans/italic. Pada desktop, kartu dapat masuk dari posisi Y berbeda 24/48/72/96px lalu rata; mobile berurutan normal. Jangan menaruh 200vh ruang kosong untuk animasi empat kartu.

### Selected work
Buat dua blok besar, bukan dua thumbnail kecil:
1. Dimsum by Kalili — https://kalilidimsum.netlify.app/
2. Tooday — https://toodaycafee.vercel.app/

Setiap blok berisi nama, nomor, screenshot atau preview autentik, ringkasan singkat, kontribusi pemilik jika diketahui, Live Website, serta View Source jika repo tersedia.

Klik detail membuka region detail yang aksesibel atau halaman/detail panel yang sudah dipilih secara konsisten. Versi dasar: detail inline melalui disclosure agar tidak menambah router. URL live tetap berupa anchor normal.

Periksa situs aktual sebelum menyatakan stack, fitur ordering, 3D, kasir, atau payment. Jika tidak dapat dimuat, gunakan informasi yang memang diberikan dan catat keterbatasannya di README, bukan menampilkan narasi spekulatif ke pengunjung.

### Contact
CTA geometris olive gelap dengan label ivory “Let’s build something.” Shape dapat sedikit morph atau bergeser pada hover; label tetap stabil dan terbaca. Kontak harus dapat diklik biasa, tanpa drag sebagai syarat.

Footer olive gelap, email ivory, tautan sosial yang tersedia, jam kecil, wordmark ivory besar. Tidak perlu cookie banner palsu jika situs tidak memakai teknologi yang membutuhkannya. Jangan menyalin daftar layanan atau pricing studio referensi.

## 9. Data dan integrasi GitHub
Gunakan satu sumber data, misalnya src/data/portfolio.ts. Bentuk konseptual:

~~~ts
type Project = {
  id: "kalili" | "tooday";
  title: string;
  liveUrl: string;
  githubUrl: string | null;
  summary: string;
  role: string | null;
  stack: string[];
  year: number | null;
  preview: string | null;
  previewAlt: string;
};

type Profile = {
  name: string;
  role: string;
  bio: string;
  email: string | null;
  githubUrl: string | null;
  timezone: string;
  availability: string | null;
};
~~~

Data belum diberikan: nama tampilan final, peran, bio, email, GitHub profile, repository Kalili, repository Tooday, kontribusi detail, dan stack setiap proyek.

GitHub mempunyai dua cakupan berbeda:
1. **Tautan pada portofolio:** profil dan repository sumber tiap proyek. Ini termasuk implementasi dasar.
2. **Repository sumber portofolio dan deployment otomatis:** disiapkan melalui README/config; pengaitan remote/push/deploy mengikuti otorisasi dan URL pemilik.

Jangan menganggap URL Netlify/Vercel memberi tahu nama repo GitHub. Jangan menggunakan href="#", slug tebakan, token client-side, star counter palsu, atau commit palsu. githubUrl null berarti tombol disembunyikan. Repo private tetap private. Tidak perlu OAuth atau GitHub API untuk menampilkan tautan.

Nama/peran adalah data inti: selama pengembangan boleh placeholder yang ditandai di config, tetapi pemeriksaan sebelum publikasi harus mendeteksinya. Data opsional kosong cukup disembunyikan.

## 10. Asset manifest
| Sumber | Target | Kegunaan |
|---|---|---|
| DDT_1809.JPG, 1365×2048 | /assets/photos/portrait-studio.webp | About + Portrait viewer |
| webcam-toy-photo8.jpg, 800×600 | /assets/photos/photobooth.webp | Viewer kolase utuh |
| Gemini_Generated_Image_3ndul13ndul13ndu.png, 2048×1364 | /assets/photos/after-hours.webp | Viewer personal |
| image(20261020-072542).png, 1920×987 | /references/desktop-reference.png | Referensi saja, bukan aset produksi |
| Wallpaper hasil percakapan | /assets/desktop/retro-meadow.webp | Desktop background |
| Maskot transparan hasil percakapan | /assets/desktop/crt-buddy.png | Aksen kecil pada desktop |
| Screenshot Kalili yang terverifikasi | /assets/projects/kalili-preview.webp | Hero montage dan selected work |
| Screenshot Tooday yang terverifikasi | /assets/projects/tooday-preview.webp | Hero montage dan selected work |
| Bezel CRT orisinal CSS/SVG | Komponen MonitorFrame | Adegan transisi ke desktop |
| SVG folder/file/control | Komponen ikon | UI fungsional |

Wallpaper dan maskot sudah dibuat. Screenshot proyek dan bezel CRT produksi belum disediakan; agent harus membuat bezel dengan kode atau menambahkan aset orisinal yang sesuai, serta memperoleh screenshot proyek secara sah bila akses tersedia.

Maskot bukan bezel monitor dan tidak boleh dipakai sebagai pengganti frame layar.

Aturan:
- Simpan sumber asli; optimalkan salinannya.
- Pastikan file dapat ditemukan; jangan membuat path asset palsu.
- Hero/About crop dapat berbeda dari viewer. Viewer selalu contain.
- Foto webcam jangan diperbesar menjadi foto hero tajam palsu.
- Pertahankan alpha maskot; jangan menghilangkan latarnya dengan blending yang merusak.
- Nama baru di tabel adalah target, bukan klaim bahwa file tersebut sudah ada.
- Gambar AI tetap gambar statis. Animasi berasal dari implementasi.
- Jangan membuat foto pengguna berkedip, berbicara, atau berubah wajah.

Prompt opsional bezel jika diperlukan:
“Create one original front-facing early-2000s CRT monitor frame in pale blue #DFE5F3 with muted teal #557373 shading and dark olive #272401 controls, straight-on camera with minimal perspective, softly molded plastic, subtle worn material, thick rounded bezel, small physical power button, bottom ventilation slots. The entire outer background AND the entire screen aperture must be genuinely transparent. No wallpaper, UI, icons, text, branding, cables, keyboard, or extra objects. Clean isolated frame for compositing a real HTML desktop underneath. Preserve a precisely defined, regular screen opening and provide generous outer padding. Calm Luxury color tone; no saturated cobalt, red, neon, or gold.”
Jika transparansi aperture tidak bersih, gunakan SVG/CSS. Jangan mengandalkan hasil generatif untuk geometri UI presisi.

## 11. Desktop: appearance dan aplikasi
Desktop memakai wallpaper langit/bukit bertone lembut, ikon foto di sisi kanan, label ivory di atas alas olive tipis bila diperlukan agar terbaca, serta jendela ivory dengan title bar mist. Ini desktop nostalgia yang ditata ulang, bukan skin literal Windows 98.

Ukuran akhir desktop: lebar area section, tinggi sekitar clamp(620px, 82svh, 920px) pada desktop. Reserve area taskbar sekitar 40–48px. Ikon tidak boleh tertutup permanently oleh jendela default.

Aplikasi:
- About Me.txt
- Portrait.jpg
- Photo Booth.jpg
- After Hours.png
- Projects
- Contact.txt jika ada kontak
- GitHub.url jika ada URL

Ikon foto memakai thumbnail asli, bukan ikon file generik untuk semuanya. Folder Projects memuat Kalili dan Tooday dengan tombol live dan source sesuai config.

State awal: satu welcome/Projects window kecil boleh terbuka di kiri bawah, seperti ruang kerja yang sudah dipakai. Tiga foto personal tetap tertutup sampai diklik. Jangan membuka seluruh jendela sekaligus.

Chrome jendela:
- Title bar mist #DFE5F3, judul olive #272401, padding 8–12px.
- Kontrol Close olive dan Minimize/Maximize teal; dapat memakai bentuk circle/square/diamond dengan tooltip dan label jelas. Hover dapat memakai ink; jangan menambahkan merah untuk kontrol Close.
- Target interaksi tetap minimal 44px, meskipun simbol visual kecil.
- Judul dapat berupa “Portrait — [Nama]”.
- Border tipis, shadow terbatas, tanpa gradient metalik tebal.
- Photo content contain; background ivory/mist sesuai rasio; warna foto tetap asli.

## 12. Window manager
Setiap aplikasi hanya mempunyai satu instance.

~~~ts
type WindowId =
  | "about" | "portrait" | "photobooth"
  | "afterHours" | "projects" | "contact";

type Rect = { x: number; y: number; width: number; height: number };

type WindowState = {
  id: WindowId;
  status: "closed" | "open" | "minimized";
  maximized: boolean;
  rect: Rect;
  normalRect: Rect | null;
  z: number;
  triggerId: string | null;
};
~~~

Action: openWindow, focusWindow, closeWindow, minimizeWindow, restoreWindow, toggleMaximize, commitWindowRect, resetDesktop.

Invariant:
- Open yang sudah open → focus.
- Open yang minimized → restore + focus.
- Close → status closed; instance dapat dibuka lagi.
- Minimizing tidak menghapus rect.
- Maximize menyimpan normalRect sekali; Restore mengembalikannya.
- rect hasil restore harus reclamp terhadap ukuran stage terbaru.
- Window selalu berada di bawah chrome navigasi situs; z-index lokal dibatasi dalam stacking context desktop.
- Simpan hanya data serializable di Zustand. Ref DOM dan instance Draggable berada di hook/ref, bukan store.
- Commit posisi ke store saat drag berakhir; gunakan transform pada frame agar seluruh React tree tidak rerender tiap pointermove.
- Tekan kontrol title bar tidak boleh memulai drag.
- Saat viewport berubah dari desktop ke mobile, normalRect tetap tersimpan; mobile menampilkan satu aplikasi aktif.
- Focus state berasal dari interaksi aktif, bukan sekadar file terakhir dalam array.
- Reindex z secara aman jika terus naik.

Posisi:
- Bounds adalah rectangle desktop di atas taskbar, bukan document.body.
- Gunakan ResizeObserver untuk applyBounds dan clamp.
- Width maksimal menyisakan margin 12–24px; height maksimal tidak menyembunyikan title bar.
- Title bar tidak boleh berada di luar layar.
- Sediakan Center Window dan Reset Desktop yang bekerja dengan keyboard.
- Drag tanpa inertia agar jendela tidak terpental keluar.
- Disable drag ketika maximized, mobile, atau scene zoom belum selesai.

Fokus:
- Enter/Space pada ikon membuka file.
- Setelah open, fokus menuju kontrol/judul jendela yang relevan.
- Escape menutup hanya jendela aktif ketika fokus berada di desktop.
- Close mengembalikan fokus ke trigger yang valid; jika trigger tidak ada, ke heading desktop.
- Jendela desktop nonmodal tidak menjebak Tab.
- Jika detail proyek memakai modal, bedakan focus trap modal itu dari jendela nonmodal.

## 13. Motion specification
Semua nilai adalah baseline yang dituning setelah rendering.

| Elemen | Nilai awal → akhir | Durasi | Easing/pemicu |
|---|---|---|---|
| Hero wordmark | mask tertutup → terbuka | 650–800ms | power3.out |
| Baris headline | y 105% → 0 | 600ms; stagger 80ms | power3.out |
| Header kompak | y -8 → 0, opacity 0 → 1 | 220ms | setelah wordmark lewat |
| Reveal teks section | y 20 → 0, opacity | 450–550ms | once, top 85% |
| Montage scale | sekitar 0,48 → 1 | progress section | scrub 0,5–0,8 |
| Process cards | y berbeda → 0 | 450ms; stagger 70ms | sekali |
| Monitor zoom | aperture kecil → stage final | progress section | scrub 0,6–0,9 |
| Window open | opacity 0 → 1, scale 0,97 → 1 | 200–240ms | power2.out |
| Window close | opacity 1 → 0, scale 1 → 0,98 | 140–160ms | power2.in |
| Minimize | scale 1 → 0,92, opacity turun | 180ms | lalu hidden, taskbar tetap |
| Icon hover | y 0 → -3px | 140ms | ease-out |
| Icon press | scale 1 → 0,97 | 90ms | pointer/keyboard |
| CTA shape | rotasi maksimal 6°, scale 1,03 | 220ms | hover |
| Maskot | y ±4px, rotasi ±2° | 6 detik per loop | hanya saat terlihat |

Jangan memberi semua elemen bounce. Kesan referensi bergantung pada kontrol dan ruang, bukan banyak efek.

Cursor: kursor sistem tetap tersedia. Halo kecil di belakang cursor boleh di desktop pointer halus, pointer-events none, opacity rendah. Jangan menyembunyikan kursor asli atau membuat pointer tertinggal jauh. Matikan di sentuh, reduced motion, dan saat drag.

Maskot maksimal sekitar 80–110px, tidak menutupi ikon. Klik memunculkan bubble HTML singkat. Bubble bukan teks pada bitmap. Pause loop saat tab tidak aktif atau desktop keluar viewport. Tersedia Pause Motion untuk loop berkelanjutan.

Tidak ada audio autoplay, flashing glitch, forced scrolling, atau FPS counter dekoratif. Optimasi gerakan ke transform/opacity. Jangan memaksa seluruh elemen memakai will-change selamanya.

## 14. Responsive dan accessibility
Breakpoints acuan:
- <640px: ponsel.
- 640–1023px: tablet.
- >=1024px: desktop.

Ponsel:
- Wordmark tetap besar tetapi tidak overflow; boleh dua baris sesuai nama.
- Headline full width, tidak dikunci ke kolom kanan.
- Montage statis, tanpa section panjang.
- Process cards bertumpuk.
- Selected work full width.
- Monitor menjadi gambar/bezel ringkas dengan tombol “Open desktop”; desktop ditampilkan sebagai section langsung.
- Ikon grid 2–3 kolom; satu panel aplikasi aktif.
- Tidak ada drag, minimize/maximize dekoratif yang tidak bekerja, atau window tumpang tindih.
- Close, next file, dan back to files jelas.
- Tombol minimal 44×44px.
- Tidak ada horizontal page scroll.

Keyboard dan pembaca layar:
- Skip to content; semantic nav/main/section/footer.
- H1 tunggal berisi identitas atau headline utama; wordmark duplikat dekoratif aria-hidden.
- Link asli untuk navigasi; button untuk aksi.
- Focus ring jelas dan tidak dihapus.
- Nama fungsi kontrol tidak hanya warna/bentuk.
- Photo alt menjelaskan gambar tanpa menyimpulkan identitas sensitif.
- Preview desktop dekoratif inert dan aria-hidden.
- Reduced motion: skip intro, matikan smooth scroll/pin/zoom/loop; semua section hadir dalam aliran normal dan seluruh fungsi tetap ada.
- Jangan membuat teks penting opacity 0 secara default sebelum JavaScript memastikan animasi siap.
- Berikan noscript sederhana dengan identitas yang tersedia dan tautan dua proyek.

## 15. Struktur sumber
Gunakan struktur yang mendukung tanggung jawab terpisah; sesuaikan nama bila repo memiliki pola sendiri.

~~~text
src/
  app/
    App.tsx
    MotionProvider.tsx
  data/
    portfolio.ts
    desktopApps.ts
  components/
    Intro.tsx
    Header.tsx
    Hero.tsx
    ProjectMontage.tsx
    About.tsx
    Process.tsx
    SelectedWork.tsx
    Contact.tsx
    Footer.tsx
  desktop/
    DesktopScene.tsx
    MonitorFrame.tsx
    DesktopSurface.tsx
    DesktopIcon.tsx
    DesktopTaskbar.tsx
    RetroWindow.tsx
    PhotoViewer.tsx
    ProjectsApp.tsx
    DesktopBuddy.tsx
    useWindowStore.ts
    useDraggableWindow.ts
    windowGeometry.ts
  motion/
    tokens.ts
    useMotionPreference.ts
    useSceneTimeline.ts
  styles/
    tokens.css
    global.css
  tests/
    windowGeometry.test.ts
    windowStore.test.ts
e2e/
  portfolio.spec.ts
public/
  assets/photos/
  assets/projects/
  assets/desktop/
  assets/fonts/
scripts/
  optimize-images.mjs
docs/
  reference-audit.md
  storyboard.md
  verification.md
README.md
~~~

CSS Modules diletakkan dekat komponennya. Hindari satu App.tsx ribuan baris atau satu effect global yang mengendalikan semua elemen.

## 16. Rencana pengerjaan dan exit criteria
Kerjakan berurutan; jangan menambahkan ornamen sementara fungsi dasar belum selesai.

| Tahap | Pekerjaan | Hasil yang harus tersedia sebelum lanjut |
|---|---|---|
| 1. Audit | Baca repo, instruksi, aset, referensi, URL proyek | Daftar aset nyata, data kosong, keputusan stack |
| 2. Fondasi | Setup, tokens, font, config, layout responsive | Semua section dapat dibaca tanpa motion |
| 3. Komposisi | Wordmark, grid kanan-kiri, montage, About, karya, footer | Tampilan statis sudah dekat pada ritme referensi |
| 4. Desktop core | Store, ikon, viewer, taskbar, window controls | Open/drag/close/reopen/minimize/restore bekerja |
| 5. Opening/motion | Intro, hero, montage, process, monitor zoom | Timeline mulus; tidak ada konflik transform |
| 6. Mobile/keyboard | Jalur sederhana, focus, reduced motion | Alur penuh dapat dipakai tanpa mouse |
| 7. Asset/performance | Gambar, preload, lazy load, chunking | Request terkendali, layout stabil |
| 8. QA visual/fungsional | Browser checks, tes terarah, production build | Bukti dan daftar masalah terselesaikan |
| 9. Handoff | README, setup/deploy steps, data belum lengkap | Pemilik dapat mengganti konten dan menjalankan proyek |

Setelah setiap tahap, berikan ringkasan singkat hasil dan hal yang belum terverifikasi. Jangan meminta konfirmasi untuk keputusan kecil yang sudah diatur dalam prompt ini.

## 17. Performa dan loading
Target awal untuk mengarahkan implementasi, bukan klaim hasil:
- Hero/core image yang diprioritaskan kira-kira <=350KB jika kualitas memungkinkan.
- Thumbnail <=40KB per file sebagai anggaran awal.
- Wallpaper sekitar <=450KB, lazy-load menjelang desktop.
- Jangan preload seluruh foto personal.
- Lazy import desktop dan Draggable; mulai memuat sekitar satu viewport sebelum scene masuk.
- Pakai width/height, aspect-ratio, dan srcset.
- Dua keluarga font, hanya style/weight yang benar-benar dipakai.
- LCP lab target <=2,5 detik pada profil pengujian yang dilaporkan; CLS target <=0,1.
- Respons interaksi harus langsung terasa; jangan menunda tombol menunggu tween selesai.
- Sasaran Core Web Vitals di lapangan memerlukan data pengguna nyata; jangan menyatakan hasil lab sebagai data lapangan.
- Jangan menggunakan video autoplay sebagai ketergantungan pembuka; montage gambar harus cukup.

Jika animasi mahal, sederhanakan efek blur/noise dan jumlah elemen, bukan mengorbankan tombol, akses keyboard, atau kualitas proyek. Test production build, bukan hanya dev server.

SEO: title/meta/OG/canonical memakai data final. Hindari canonical domain palsu. Untuk Vite, meta yang penting bagi link preview tersedia pada HTML hasil build, tidak hanya setelah JavaScript mengubah head. Jika domain belum ada, jangan mengarang canonical.

## 18. Pengujian yang wajib relevan
Command package scripts minimal: dev, build, preview, lint, typecheck, test, test:e2e. Jalankan sesuai project dan laporkan hasil nyata.

Unit test terarah:
- Membuka aplikasi dua kali tidak membuat dua instance.
- Maximize lalu resize lalu restore mengembalikan rect yang aman.
- Minimize/restore tidak menghapus posisi.
- Clamp menjaga title bar dapat dijangkau.

End-to-end:
- Intro dapat di-skip; body tidak tetap terkunci.
- Deep link #desktop langsung bisa dipakai.
- Klik Portrait → gambar benar → Close → buka lagi.
- Buka dua aplikasi → fokus/z-index berubah.
- Drag title bar → posisi berubah; klik Close tidak ikut drag.
- Minimize → tombol taskbar tetap ada → restore.
- Maximize → restore bekerja.
- Resize tidak menghilangkan title bar.
- Null githubUrl tidak menghasilkan link mati.
- Keyboard mencapai ikon, membuka, menutup, dan fokus kembali.
- Mobile membuka satu panel tanpa overflow.
- Reduced motion tidak menyisakan konten tersembunyi atau pin spacer.
- Scroll isi jendela dan scroll halaman tidak saling memblokir.
- Semua asset loaded atau fallback bermakna; tidak ada error console.

Viewport yang diperiksa: 375×812, 390×844, 768×1024, 1440×900, 1920×1080. Periksa Chromium dan setidaknya satu engine berbeda yang tersedia, terutama WebKit untuk resize/pin. Jika environment tidak menyediakan engine, jelaskan batas pengujiannya.

## 19. Review kemiripan visual
Bandingkan screenshot implementasi dengan referensi pada lebar viewport yang sama. Screenshot referensi untuk review internal; jangan bundel foto/logo referensi sebagai aset produksi.

Nilai tiap kategori 1–5 berdasarkan inspeksi manusia/agent, bukan metrik otomatis yang diklaim objektif:
- Komposisi dan ruang kosong.
- Skala wordmark serta hierarki tipografi.
- Ketepatan lima warna Calm Luxury terhadap gambar palet pengguna; penggunaan serif italic tetap mengikuti V2.
- Ritme pergantian section.
- Perubahan skala montage dan monitor.
- Rasa klik, buka, drag, dan tutup jendela.
- Kualitas mobile dan aksesibilitas.

Gunakan skor hanya untuk menentukan perbaikan; sertakan contoh selisih konkret. Jangan menyatakan “95% mirip” tanpa definisi pengukuran.

Prioritas perbaikan:
1. Komposisi dan tipografi.
2. Skala/posisi media.
3. Gerak besar dan timing.
4. Detail kontrol dan hover.
5. Ornamen kecil.

Website dengan komposisi salah tidak bisa diperbaiki hanya dengan menambah animasi.

## 20. Handoff dan definisi selesai
Berikan:
- Source code yang bekerja dengan versi dependency terkunci.
- README: instalasi, scripts, config, aset, cara menambah proyek, cara mengisi GitHub.
- Dokumen storyboard sesuai implementasi aktual.
- Verification report yang membedakan tested, untested, dan data belum tersedia.
- Screenshot hasil implementasi pada viewport utama bila tooling memungkinkan.
- Build produksi sukses.
- Instruksi deploy untuk hosting yang dipilih, tanpa mengklaim sudah deploy.

Definisi selesai: identitas jelas, Kalili dan Tooday terlihat, link nyata bekerja, desktop fungsional, foto tepat, motion mendukung pengalaman, mobile usable, tidak ada placeholder publik, serta tidak ada kontrol palsu.

Kalimat pengarah akhir:
**“Match Neutomni’s composition, pacing, scale changes, and playful desktop behavior as closely as practical. Apply ONLY the supplied Calm Luxury palette (#DFE5F3, #557373, #272401, #F2EFEA, #0D0D0D) to the interface, preserving the original colors of personal photos and project screenshots. This is a color-only revision: keep the approved layout, typography, storyboard, timing, tech stack, and interactions. Keep the owner’s identity and work unmistakably personal.”**

# AKHIR PROMPT UNTUK CODING AGENT

---

## Referensi teknis untuk implementasi
Dokumentasi ditinjau 20 Oktober 2026; cek lagi kompatibilitas saat instalasi. Ringkasan stack adalah keputusan desain untuk proyek ini.

- Referensi visual: https://neutomni.com/
- React: https://react.dev/learn
- Vite: https://vite.dev/guide/
- GSAP React/useGSAP: https://gsap.com/resources/React/
- GSAP ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- GSAP Draggable: https://gsap.com/docs/v3/Plugins/Draggable/
- Lenis dan integrasinya: https://github.com/darkroomengineering/lenis
- Zustand: https://zustand.docs.pmnd.rs/
- Manrope: https://fontsource.org/fonts/manrope
- Instrument Serif: https://fontsource.org/fonts/instrument-serif
- Vitest: https://vitest.dev/guide/
- Playwright: https://playwright.dev/docs/intro

