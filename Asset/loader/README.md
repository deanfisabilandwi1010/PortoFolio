# Dean — loader pusher character assets

Character art based on the supplied `DDT_1809(1).JPG` and `loader-pusher-codex-prompt.md`.

## Included

- `Asset/loader/pusher-01.png` through `pusher-06.png`: six push-cycle frames.
- `Asset/loader/pusher-07.png`: brace/strain.
- `Asset/loader/pusher-08.png`: upright thumbs-up / forehead wipe.
- `public/assets/loader/pusher.webp`: full-size horizontal sprite sheet, eight 1024 × 1024 cells, 8192 × 1024 overall, lossless WebP with alpha.
- `public/assets/loader/pusher-256.webp`: smaller runtime alternative, eight 256 × 256 cells, 2048 × 256 overall, lossless WebP with alpha.
- `public/assets/loader/pusher.json`: frame order, rectangles, alignment and source dimensions.
- `preview.html`: self-contained offline viewer with walk, brace, done, frame scrubber and simulated wall reveal.
- `preview/contact-sheet-olive.png` and `preview/contact-sheet-ivory.png`: background inspection images only. The actual PNG frames have transparent backgrounds.

## Place in the existing repository

1. Copy the eight PNGs into your repository's existing `Asset/loader/` folder, replacing its placeholder frames.
2. Run your existing command: `node scripts/build-pusher-sheet.mjs`.
3. Do not pass `--placeholder`.
4. Run `npm run dev` and inspect the real loader at its configured localhost URL.

The provided `public/assets/loader/pusher.webp` is a ready-made eight-column sheet. Its compatibility with the existing component's cell size cannot be confirmed without that component. Prefer running the repository's own build script when available. Do not replace existing application code or the existing build script with this package.

## Alignment

All PNG canvases are 1024 × 1024 RGBA. Frames 01–07 have their rightmost visible palm pixels at x=960. All eight frames have their lowest visible sole pixels at y=960 (zero-based). The upright final pose is intentionally taller, with the same uniform anatomical scale. Frame 08 is horizontally centered.

At the 256-pixel runtime size, the corresponding geometric anchor is x=240 / y=240. Match your component's CSS scale and cell size before using the smaller sheet.

The artwork was generated together for consistent character design, then cropped, cleaned of weak isolated alpha noise, resized uniformly and aligned. Each 1024-pixel deliverable uses a 2× raster enlargement from the generated source; it is not a native 1024-pixel-per-frame drawing. Intended on-screen height is around 200 pixels. There is slight natural variation in the hand-drawn silhouettes across the cycle.

## Verification scope

The PNG sizes, real alpha, frame count, sheet dimensions, matching sheet cells, palm boundary and sole baseline were checked. The artwork was visually inspected on olive. The offline preview's JavaScript syntax and embedded image were checked. Browser playback was not verified because the execution environment has no browser binary; the preview is provided for your own inspection of the cycle and reveal behavior.

The actual Vite/React repository, `scripts/build-pusher-sheet.mjs`, `src/components/Intro.tsx` and CSS were not supplied. Consequently the original build and real website loader could not be run or validated. No original application files were modified.
