// Builds the navigation "puller" sprite sheet from 8 transparent frames in Asset/loader/.
//
//   node scripts/build-puller-sheet.mjs                 -> Asset/loader/puller-0{1..8}.png -> public/assets/loader/puller.webp
//                                                          + src/data/puller-sheet.json (frame metrics the code reads)
//   node scripts/build-puller-sheet.mjs --placeholder   -> first draws simple stand-in frames into Asset/loader/
//
// Frames 1-4: hanging cycle, 5: landing, 6: standing hold, 7: tug, 8: one-hand wave.
// The character hangs from a bar, so every frame is aligned by its grip (the topmost
// pixels) to the same point at the top centre of its cell. Where the soles end up
// differs per pose; the JSON records it so the code can put the feet on the floor.
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

const SRC = "Asset/loader";
const OUT = "public/assets/loader/puller.webp";
const META = "src/data/puller-sheet.json";
const FRAMES = 8;
const CELL_W = 360;
const CELL_H = 480; // displayed at up to ~420px tall
const GRIP_X = 0.5; // grip point, as fractions of the cell
const GRIP_Y = 0.03;
const BODY_H = 0.92; // height of a hanging frame, as a fraction of the cell
const GRIP_BAND = 0.04; // the top slice of a figure that counts as "the hands"

const files = Array.from({ length: FRAMES }, (_, i) => `${SRC}/puller-${String(i + 1).padStart(2, "0")}.png`);

if (process.argv.includes("--placeholder")) await drawPlaceholders();

// Trim each frame to its drawn pixels and find the grip: the horizontal centre of the topmost slice.
const trimmed = await Promise.all(
  files.map(async (file) => {
    const { data, info } = await sharp(file).ensureAlpha().trim({ threshold: 1 }).raw().toBuffer({ resolveWithObject: true });
    const { width: w, height: h } = info;
    const band = Math.max(2, Math.round(h * GRIP_BAND));
    let min = w;
    let max = -1;
    for (let y = 0; y < band; y++) {
      for (let x = 0; x < w; x++) {
        if (data[(y * w + x) * 4 + 3] > 24) {
          if (x < min) min = x;
          if (x > max) max = x;
        }
      }
    }
    const png = await sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
    return { png, w, h, grip: max >= min ? (min + max) / 2 : w / 2 };
  }),
);

// One scale for every frame (from the hanging frames), so the character never changes size.
const hang = trimmed.slice(0, 4).map((f) => f.h).sort((a, b) => a - b);
const scale = (CELL_H * BODY_H) / ((hang[1] + hang[2]) / 2);

const soles = [];
const tiles = await Promise.all(
  trimmed.map(async (f, i) => {
    let s = scale;
    const gx = CELL_W * GRIP_X;
    const gy = CELL_H * GRIP_Y;
    // Never distort; a frame that would spill out of its cell is shrunk as a whole (and the build says so).
    const fit = Math.min(1, (CELL_H - gy) / (f.h * s), gx / (f.grip * s), (CELL_W - gx) / ((f.w - f.grip) * s));
    if (fit < 1) console.warn(`frame ${i + 1} is ${Math.round((1 - fit) * 100)}% too big for its cell; lower BODY_H or widen CELL_W`);
    s *= fit;
    const w = Math.round(f.w * s);
    const h = Math.round(f.h * s);
    const left = Math.round(gx - f.grip * s);
    const top = Math.round(gy);
    soles[i] = +((top + h) / CELL_H).toFixed(4);
    const input = await sharp(f.png).resize(w, h, { fit: "fill" }).toBuffer();
    return { input, left: i * CELL_W + left, top };
  }),
);

await mkdir("public/assets/loader", { recursive: true });
await sharp({ create: { width: CELL_W * FRAMES, height: CELL_H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
  .composite(tiles)
  .webp({ quality: 80, alphaQuality: 85, effort: 6 })
  .toFile(OUT);
const meta = { frames: FRAMES, cellW: CELL_W, cellH: CELL_H, grip: [GRIP_X, GRIP_Y], soles };
await writeFile(META, `${JSON.stringify(meta, null, 2)}\n`);
console.log(`${OUT}  ${FRAMES} frames @ ${CELL_W}x${CELL_H}px`);
console.log(`${META}  soles ${soles.join(", ")}`);

// --- Stand-in art -----------------------------------------------------------
// A plain line-art figure in the site palette, only so the transition works before the real art exists.
async function drawPlaceholders() {
  await mkdir(SRC, { recursive: true });
  const ink = "#0D0D0D";
  const line = (pts, color, width) =>
    `<polyline points="${pts.map((p) => p.join(",")).join(" ")}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const outlined = (pts, color, width) => line(pts, ink, width + 10) + line(pts, color, width);
  for (let i = 0; i < FRAMES; i++) {
    const a = (i / 4) * Math.PI * 2;
    // Hands at the top centre; the rest of the body hangs from them.
    let hands = [[184, 24], [216, 24]];
    let hip = [200, 300];
    let feet = [[180 + 26 * Math.sin(a), 470 - 22 * Math.max(0, Math.cos(a))], [220 - 26 * Math.sin(a), 470 - 22 * Math.max(0, -Math.cos(a))]];
    let kneeOut = 14;
    if (i === 4) {
      hip = [200, 290];
      feet = [[160, 400], [240, 400]];
      kneeOut = 40;
    } else if (i === 5) {
      feet = [[168, 470], [232, 470]];
      kneeOut = 6;
    } else if (i === 6) {
      hip = [200, 270];
      feet = [[165, 380], [235, 380]];
      kneeOut = 48;
    } else if (i === 7) {
      hands = [[200, 24]];
      feet = [[192, 474], [208, 474]];
      kneeOut = 4;
    }
    const shoulders = [[178, 120], [222, 120]];
    const head = [200, 98];
    const knees = feet.map((f, k) => [(hip[0] + f[0]) / 2 + (k ? kneeOut : -kneeOut), (hip[1] + f[1]) / 2]);
    const arms =
      hands.length === 2
        ? hands.map((h, k) => outlined([shoulders[k], h], "#557373", 16)).join("")
        : outlined([shoulders[1], hands[0]], "#557373", 16) + outlined([shoulders[0], [120, 110], [96, 60]], "#557373", 16);
    const fists = (hands.length === 2 ? hands : [hands[0], [96, 60]]).map((h) => `<circle cx="${h[0]}" cy="${h[1]}" r="11" fill="#F2EFEA" stroke="${ink}" stroke-width="5"/>`).join("");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
      ${feet.map((f, k) => outlined([hip, knees[k], f], "#272401", 20)).join("")}
      ${feet.map((f) => `<ellipse cx="${f[0]}" cy="${f[1] + 4}" rx="18" ry="9" fill="${ink}"/>`).join("")}
      ${outlined([[200, 130], hip], "#557373", 52)}
      ${arms}
      ${fists}
      <circle cx="${head[0]}" cy="${head[1]}" r="32" fill="#F2EFEA" stroke="${ink}" stroke-width="6"/>
      <path d="M${head[0] - 32},${head[1] - 4} q2,-40 34,-36 q32,-2 30,30 q-28,-18 -64,6z" fill="${ink}"/>
      <circle cx="${head[0] - 12}" cy="${head[1] + 2}" r="9" fill="none" stroke="${ink}" stroke-width="4"/>
      <circle cx="${head[0] + 12}" cy="${head[1] + 2}" r="9" fill="none" stroke="${ink}" stroke-width="4"/>
    </svg>`;
    await writeFile(files[i], await sharp(Buffer.from(svg)).png().toBuffer());
  }
  console.log(`placeholder frames -> ${SRC}/`);
}
