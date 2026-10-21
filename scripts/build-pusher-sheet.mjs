// Builds the loader's "pusher" sprite sheet from 8 transparent frames in Asset/loader/.
//
//   node scripts/build-pusher-sheet.mjs                 -> Asset/loader/pusher-0{1..8}.png -> public/assets/loader/pusher.webp
//   node scripts/build-pusher-sheet.mjs --placeholder   -> first draws simple stand-in frames into Asset/loader/
//
// Frames 1-6: push cycle, 7: brace (stalled), 8: done. The character faces right and
// pushes a wall at the right edge of its cell, so every push frame is aligned with its
// hands on the same vertical line and its feet on the same floor, whatever the source
// framing was.
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

const SRC = "Asset/loader";
const OUT = "public/assets/loader/pusher.webp";
const FRAMES = 8;
const CELL = 480; // px, square; displayed at up to ~280px so this covers 1.7x DPR
const HANDS_X = 0.97; // where the palms land, as a fraction of the cell width
const FLOOR_Y = 0.98; // where the soles land
const BODY_H = 0.8; // height of a push frame, as a fraction of the cell (the upright done pose is taller)

const files = Array.from({ length: FRAMES }, (_, i) => `${SRC}/pusher-${String(i + 1).padStart(2, "0")}.png`);

if (process.argv.includes("--placeholder")) await drawPlaceholders();

// Trim each frame to its drawn pixels, remembering where they were.
const trimmed = await Promise.all(
  files.map(async (file) => {
    const { data, info } = await sharp(file).ensureAlpha().trim({ threshold: 1 }).png().toBuffer({ resolveWithObject: true });
    return { data, w: info.width, h: info.height };
  }),
);

// One scale for all frames (from the median push-frame height), so the character never changes size.
const pushHeights = trimmed.slice(0, 6).map((f) => f.h).sort((a, b) => a - b);
const scale = (CELL * BODY_H) / ((pushHeights[2] + pushHeights[3]) / 2);

const tiles = await Promise.all(
  trimmed.map(async (f, i) => {
    // Never distort: a frame that would not fit is shrunk as a whole (and the build says so).
    const fit = Math.min(1, (CELL * FLOOR_Y) / (f.h * scale), CELL / (f.w * scale));
    if (fit < 1) console.warn(`frame ${i + 1} is ${Math.round((1 - fit) * 100)}% too big for the cell; lower BODY_H`);
    const w = Math.round(f.w * scale * fit);
    const h = Math.round(f.h * scale * fit);
    const input = await sharp(f.data).resize(w, h, { fit: "fill" }).toBuffer();
    const top = Math.max(0, Math.round(CELL * FLOOR_Y) - h);
    // Push and brace frames: hands on the wall line. Done frame: stands where the pusher stood.
    const right = i < 7 ? Math.round(CELL * HANDS_X) : Math.round(CELL * 0.72) + Math.round(w / 2);
    const left = Math.max(0, Math.min(CELL - w, right - w));
    return { input, left: i * CELL + left, top };
  }),
);

await mkdir("public/assets/loader", { recursive: true });
await sharp({ create: { width: CELL * FRAMES, height: CELL, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
  .composite(tiles)
  .webp({ quality: 80, alphaQuality: 85, effort: 6 })
  .toFile(OUT);
console.log(`${OUT}  ${FRAMES} frames @ ${CELL}px`);

// --- Stand-in art -----------------------------------------------------------
// A plain line-art figure in the site palette, only so the loader works before the real art exists.
async function drawPlaceholders() {
  await mkdir(SRC, { recursive: true });
  const ink = "#0D0D0D";
  const pose = (i) => {
    if (i === 7) return { lean: 0, phase: 0, done: true };
    if (i === 6) return { lean: 1.15, phase: 0.25, brace: true };
    return { lean: 1, phase: i / 6 };
  };
  for (let i = 0; i < FRAMES; i++) {
    const { lean, phase, done, brace } = pose(i);
    const hip = done ? [200, 255] : [175, 265];
    const shoulder = done ? [200, 160] : [175 + 92 * lean, 265 - 100 + 8 * lean];
    const head = done ? [200, 112] : [shoulder[0] + 30, shoulder[1] - 42];
    const hands = done ? [[150, 230], [262, 92]] : [[380, 172], [384, 190]];
    const legs = [0, 0.5].map((off) => {
      const a = (phase + off) * Math.PI * 2;
      const foot = done ? [hip[0] + (off ? 28 : -28), 385] : [hip[0] - 40 + 70 * Math.cos(a), 385 - Math.max(0, Math.sin(a)) * 20];
      if (brace) foot[0] = hip[0] + (off ? 40 : -70);
      const knee = [(hip[0] + foot[0]) / 2 + 22, (hip[1] + foot[1]) / 2 - 6];
      return { foot, knee };
    });
    const line = (pts, color, width) =>
      `<polyline points="${pts.map((p) => p.join(",")).join(" ")}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
    const outlined = (pts, color, width) => line(pts, ink, width + 10) + line(pts, color, width);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      ${legs.map((l) => outlined([hip, l.knee, l.foot], "#272401", 20)).join("")}
      ${legs.map((l) => `<ellipse cx="${l.foot[0] + 10}" cy="${l.foot[1]}" rx="20" ry="9" fill="${ink}"/>`).join("")}
      ${outlined([hip, shoulder], "#557373", 50)}
      ${hands.map((h) => outlined([shoulder, [(shoulder[0] + h[0]) / 2, (shoulder[1] + h[1]) / 2 + 8], h], "#557373", 16)).join("")}
      ${hands.map((h) => `<circle cx="${h[0]}" cy="${h[1]}" r="10" fill="#F2EFEA" stroke="${ink}" stroke-width="5"/>`).join("")}
      <circle cx="${head[0]}" cy="${head[1]}" r="34" fill="#F2EFEA" stroke="${ink}" stroke-width="6"/>
      <path d="M${head[0] - 34},${head[1] - 6} q4,-40 40,-36 q30,2 30,26 q-30,-14 -70,10z" fill="${ink}"/>
      <circle cx="${head[0] + 10}" cy="${head[1] + 2}" r="9" fill="none" stroke="${ink}" stroke-width="4"/>
      <circle cx="${head[0] + 30}" cy="${head[1] + 2}" r="7" fill="none" stroke="${ink}" stroke-width="4"/>
    </svg>`;
    await writeFile(files[i], await sharp(Buffer.from(svg)).png().toBuffer());
  }
  console.log(`placeholder frames -> ${SRC}/`);
}
