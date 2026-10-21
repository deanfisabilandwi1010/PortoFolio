// Builds optimized web copies of everything in Asset/ into public/assets/.
// Sources in Asset/ are never modified.
import sharp from "sharp";
import { copyFile, mkdir, stat } from "node:fs/promises";
import path from "node:path";

const SRC = "Asset";
const OUT = "public/assets";

const jobs = [];
const job = (name, fn) => jobs.push({ name, fn });

async function ensure(file) {
  await mkdir(path.dirname(file), { recursive: true });
  return file;
}

async function report(file) {
  const { size } = await stat(file);
  console.log(`${file.padEnd(52)} ${(size / 1024).toFixed(0).padStart(5)} KB`);
}

async function webp(input, out, { width, height, quality = 78, crop, fit = "inside", modulate } = {}) {
  let img = sharp(input).rotate();
  if (crop) img = img.extract(crop);
  if (width || height) img = img.resize({ width, height, fit, withoutEnlargement: true });
  if (modulate) img = img.modulate(modulate);
  await img.webp({ quality, effort: 6 }).toFile(await ensure(out));
  await report(out);
}

// --- Photos -----------------------------------------------------------------
const PORTRAIT = `${SRC}/DDT_1809.JPG`; // 2752x4128 after EXIF rotation
job("portrait viewer", () => webp(PORTRAIT, `${OUT}/photos/portrait-studio.webp`, { height: 1600, quality: 76 }));
// Editorial crop for About: keeps the full seated pose, trims the empty studio ceiling.
const portraitCrop = { left: 560, top: 1180, width: 1680, height: 2948 };
job("portrait crop", () => webp(PORTRAIT, `${OUT}/photos/portrait-crop.webp`, { crop: portraitCrop, width: 900, quality: 78 }));
job("portrait crop sm", () => webp(PORTRAIT, `${OUT}/photos/portrait-crop-sm.webp`, { crop: portraitCrop, width: 520, quality: 76 }));
job("portrait thumb", () =>
  webp(PORTRAIT, `${OUT}/thumbs/portrait.webp`, { crop: { left: 1000, top: 1350, width: 960, height: 960 }, width: 160, quality: 70 }),
);

const BOOTH = `${SRC}/webcam-toy-photo8.jpg`; // 800x600 — never upscale
job("photobooth", () => webp(BOOTH, `${OUT}/photos/photobooth.webp`, { quality: 82 }));
job("photobooth thumb", () =>
  webp(BOOTH, `${OUT}/thumbs/photobooth.webp`, { crop: { left: 0, top: 0, width: 600, height: 600 }, width: 160, quality: 70 }),
);

// Hover photo in the hero portrait arch. 1020x1280 — never upscale.
job("me", () => webp(`${SRC}/Me.jpeg`, `${OUT}/photos/me.webp`, { quality: 80 }));

const AFTER = `${SRC}/Gemini_Generated_Image_3ndul13ndul13ndu.png`;
job("after hours", () => webp(AFTER, `${OUT}/photos/after-hours.webp`, { width: 1600, quality: 76 }));
job("after hours thumb", () =>
  webp(AFTER, `${OUT}/thumbs/after-hours.webp`, { crop: { left: 1200, top: 80, width: 900, height: 900 }, width: 160, quality: 70 }),
);

// Instant-film collage, 1080x1920 portrait — kept at source size.
const MEMORIES = `${SRC}/Memories.png`;
job("memories", () => webp(MEMORIES, `${OUT}/photos/memories.webp`, { quality: 78 }));
job("memories thumb", () =>
  webp(MEMORIES, `${OUT}/thumbs/memories.webp`, { crop: { left: 170, top: 300, width: 560, height: 560 }, width: 160, quality: 70 }),
);

// --- Video ------------------------------------------------------------------
// 720x480, 6.5 s, no audio track — small enough to ship as is.
const CLIP = `${SRC}/photoobooth-2.mp4`;
job("photobooth clip", async () => {
  const out = await ensure(`${OUT}/videos/photobooth-2.mp4`);
  await copyFile(CLIP, out);
  await report(out);
});
// No ffmpeg in this toolchain: the poster is a frame grabbed from the clip, kept in Asset/ beside it.
const CLIP_POSTER = `${SRC}/photoobooth-2-poster.png`;
job("photobooth clip poster", () => webp(CLIP_POSTER, `${OUT}/videos/photobooth-2-poster.webp`, { quality: 78 }));
job("photobooth clip thumb", () =>
  webp(CLIP_POSTER, `${OUT}/thumbs/photobooth-clip.webp`, { crop: { left: 120, top: 0, width: 480, height: 480 }, width: 160, quality: 70 }),
);

// --- Desktop decoration -----------------------------------------------------
job("wallpaper", () =>
  webp(`${SRC}/Dreamy Lime Meadow and Blue Sky.png`, `${OUT}/desktop/retro-meadow.webp`, {
    width: 1672,
    quality: 74,
    modulate: { saturation: 0.78, brightness: 1.02 },
  }),
);
job("mascot", async () => {
  const out = await ensure(`${OUT}/desktop/crt-buddy.webp`);
  // Trim to the alpha bounds (keeps the soft glow) and keep transparency intact.
  await sharp(`${SRC}/Tiny Waving CRT Mascot.png`)
    .trim({ threshold: 2 })
    .resize({ width: 280 })
    .webp({ quality: 82, alphaQuality: 90, effort: 6 })
    .toFile(out);
  await report(out);
});

// --- Projects ---------------------------------------------------------------
for (const id of ["kalili", "tooday", "dompetqu"]) {
  job(`${id} desktop`, () => webp(`${SRC}/projects/${id}-desktop.png`, `${OUT}/projects/${id}-preview.webp`, { width: 1600, quality: 80 }));
  job(`${id} desktop sm`, () => webp(`${SRC}/projects/${id}-desktop.png`, `${OUT}/projects/${id}-preview-sm.webp`, { width: 800, quality: 76 }));
  job(`${id} mobile`, () => webp(`${SRC}/projects/${id}-mobile.png`, `${OUT}/projects/${id}-mobile.webp`, { width: 430, quality: 78 }));
}

// --- Logos ------------------------------------------------------------------
job("unand logo", async () => {
  // The supplied PNG has a baked-in "transparency" checkerboard. Flood-fill the light,
  // unsaturated pixels connected to the border and make them transparent.
  const { data, info } = await sharp(`${SRC}/logos/unand.png`).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const isBg = (i) => {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    return min >= 196 && max - min <= 22;
  };
  const seen = new Uint8Array(w * h);
  const stack = [];
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
  while (stack.length) {
    const p = stack.pop();
    if (seen[p]) continue;
    seen[p] = 1;
    if (!isBg(p * 4)) continue;
    data[p * 4 + 3] = 0;
    const x = p % w, y = (p / w) | 0;
    if (x > 0) stack.push(p - 1);
    if (x < w - 1) stack.push(p + 1);
    if (y > 0) stack.push(p - w);
    if (y < h - 1) stack.push(p + w);
  }
  const out = await ensure(`${OUT}/logos/unand.webp`);
  await sharp(data, { raw: info }).trim({ threshold: 1 }).resize({ height: 240 }).webp({ quality: 86, alphaQuality: 100 }).toFile(out);
  await report(out);
});
job("pln logo", async () => {
  const out = await ensure(`${OUT}/logos/pln-nusa-daya.webp`);
  await sharp(`${SRC}/logos/pln-nusa-daya.png`).trim({ threshold: 1 }).resize({ height: 160 }).webp({ quality: 88, alphaQuality: 100 }).toFile(out);
  await report(out);
});

for (const { name, fn } of jobs) {
  try {
    await fn();
  } catch (err) {
    console.error(`✗ ${name}:`, err.message);
    process.exitCode = 1;
  }
}
