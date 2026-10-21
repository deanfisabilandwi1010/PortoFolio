# Codex prompt — navigation "puller" character frames

Copy everything below the line into Codex (run it from the repo root so it can read `Asset/` and run the build script).

---

You are creating a second set of character frames for my portfolio (repo: this folder, Vite + React). It is the **same cartoon character** as the loader art you made before: the eight PNGs in `Asset/loader/pusher-01.png` … `pusher-08.png`. Open them first and match them exactly — same face, glasses, curly black hair, teal overshirt over an ivory T-shirt, dark olive chinos, black-and-white sneakers, same ink line weight, same flat colours, same proportions. Treat those files as the model sheet.

## What the animation does (so you understand the poses)

When a visitor clicks a menu link, a dark olive **roller shade** (#272401) unrolls from the top of the screen and covers the page. The character is in front of the shade, **hanging from a horizontal grab-bar** that is fixed across the shade, so his weight drags the shade down. He drops from the top of the screen, legs kicking, and lands on the floor as the shade reaches the bottom. While the destination name shows on the shade, the page changes behind it. Then he gives the shade one hard tug, lets it snap back up, and gets carried up and off the top of the screen, hanging by one hand and waving. The code already exists; it draws the grab-bar itself and plays your frames on top of it. You only make the character.

## Frames to produce (8 files)

All frames: **front view** (body facing the viewer), full body head to shoes, **transparent background (real alpha, PNG)**, no bar drawn, no shade, no floor line, no shadow, no text, no border. Same canvas size for all 8 files (**768 × 1024**, portrait), character drawn at the same scale in each.

| File | Pose |
|---|---|
| `Asset/loader/puller-01.png` … `puller-04.png` | **Hanging cycle**, 4 evenly spaced steps that loop seamlessly (04 → 01). Both arms straight up above the head, both hands gripping an invisible horizontal bar (fists closed, about shoulder-width apart). Body hangs straight down. Legs kick and swing like he is dropping fast — knees bending alternately, feet off the ground. Excited, slightly alarmed face. |
| `Asset/loader/puller-05.png` | **Landing**: knees bent to absorb the landing, feet flat and apart, arms still straight up gripping the bar. |
| `Asset/loader/puller-06.png` | **Holding, standing**: standing tall, feet apart, arms up gripping the bar, big confident grin at the viewer. |
| `Asset/loader/puller-07.png` | **The tug**: a hard downward pull — deep knee bend, hips back, elbows slightly bent, gritted teeth, still gripping the bar overhead with both hands. |
| `Asset/loader/puller-08.png` | **Carried away, waving**: hanging by **one** hand from the bar (arm straight up), the other hand waving at the viewer, legs together and dangling, happy face. |

## Alignment rules (the code depends on these)

- In every frame the **gripping hand(s) are the topmost pixels** of the drawing. Nothing — hair, elbows, the waving hand — may rise above the gripping fists.
- The grip is **centred horizontally on the canvas** (x = 384 for a 768-wide canvas): with two hands, the midpoint between the fists; with one hand (frame 08), that fist.
- The fists sit near the top of the canvas (around y = 30) in every frame.
- Feet go wherever the pose puts them (the landing frames are shorter than the hanging ones — that is expected). The build script measures where the soles are in each frame.

How to get consistency: generate one reference image with all 8 poses side by side using the existing pusher frames as the model sheet, then cut it into 8 equal canvases and align the grip as above. Clean up stray pixels, halos and white fringes so the alpha edge is clean on a dark olive background.

## After the art exists

1. Save the 8 PNGs to exactly the paths above (replace the placeholder frames that are there now).
2. Run `node scripts/build-puller-sheet.mjs` (no flags — `--placeholder` would overwrite your art). It writes `public/assets/loader/puller.webp` and `src/data/puller-sheet.json` (where the soles land in each frame), and warns if a frame does not fit its cell.
3. Open `public/assets/loader/puller.webp` and check: 8 cells, same size character in each, the grip at the same point (top centre) in every cell.
4. Run `npm run dev`, load `http://localhost:5173/`, skip the intro, and click the menu links (Work, About, Contact…). Check that the hands sit on the grab-bar, the landing puts the feet on the bottom edge of the screen, and nothing jitters between frames.
5. Do not change `src/components/NavTransition.tsx` or its CSS unless the alignment is off; if it is, prefer fixing the art.
