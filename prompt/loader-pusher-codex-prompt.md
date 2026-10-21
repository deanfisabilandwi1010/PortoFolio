# Codex prompt — loader "pusher" character frames

Copy everything below the line into Codex (run it from the repo root so it can read `Asset/` and run the build script).

---

You are creating the character art for the loading screen of my portfolio (repo: this folder, Vite + React).

## What the loader does (so you understand the poses)

The screen starts covered by a dark olive wall (#272401). A small cartoon version of me stands on the left and **pushes the wall to the right** with both hands while the page loads; behind the wall the real homepage appears (ivory #F2EFEA background, a huge olive wordmark "DEAN FISABIL ANDWI" along the bottom). At 100% he gives a last shove, the wall flies off screen, and he turns to the viewer with a thumbs up. The code already exists — it plays an 8-frame sprite sheet. You only make the art.

## The character

- An original cartoon of **me, Dean** — use `Asset/DDT_1809.JPG` as the likeness reference: young Indonesian man, slim, short black hair swept up at the front, **black rectangular glasses**, light-brown skin.
- Outfit (casual developer, not the suit from the photo): **teal overshirt #557373** open over an **ivory T-shirt #F2EFEA**, **dark olive chinos #272401**, black-and-white sneakers. Optional small detail: a lanyard ID card.
- Style: **hand-drawn editorial line art** — confident black ink outlines (#0D0D0D, ~3–4 px at 1024 px tall), flat fills in the colours above, no gradients, no 3D, no soft shading, at most one flat shadow tone. Slightly big head (about 1/5.5 of body height), friendly and a bit comic. Think a modern magazine spot illustration, readable when small (about 200 px tall on screen).
- Must look like the **same character in every frame**: same proportions, line weight, colours, clothes and face.
- Do not copy any existing character or website mascot; the design is ours.

## Frames to produce (8 files)

All frames: **side view, character faces RIGHT**, full body head to shoes, **transparent background (real alpha, PNG)**, no ground line, no shadow on the floor, no text, no wall drawn, no border. Same canvas size for all 8 files (1024 × 1024), character drawn at the same scale in each.

| File | Pose |
|---|---|
| `Asset/loader/pusher-01.png` … `pusher-06.png` | **Push-walk cycle**, 6 evenly spaced steps that loop seamlessly (06 → 01). Body leaning forward ~35–40°, both arms straight out in front at shoulder height, **palms flat and vertical as if pressed on an invisible wall to his right**; the palms are the right-most thing in the drawing. Legs step: back leg long and driving, front leg bent, feet alternate through the cycle. Determined face, teeth gritted a little. |
| `Asset/loader/pusher-07.png` | **Brace / strain** (used when loading stalls): same lean but deeper, both feet planted wide, eyes squeezed shut, one small sweat drop. Palms still on the invisible wall, still right-most. |
| `Asset/loader/pusher-08.png` | **Done**: standing upright, body turned 3/4 toward the viewer, big grin, one hand giving a **thumbs up**, the other wiping his forehead. |

Important for the code: in frames 01–07 **nothing may stick out further right than the palms**, and the soles of the feet are the lowest pixels. The build script aligns the palms to the wall edge and the soles to the floor.

How to get consistency: generate one reference sheet with the character first, then generate the frames using that sheet as the reference (or generate all 8 poses together in one wide image and cut it into 8 equal parts). Clean up any stray pixels, halos or white fringes around the outline so the alpha edge is clean on a dark background.

## After the art exists

1. Save the 8 PNGs to exactly the paths above (replace the placeholder frames that are there now).
2. Run `node scripts/build-pusher-sheet.mjs` (no flags — `--placeholder` would overwrite your art). It writes `public/assets/loader/pusher.webp`.
3. Open `public/assets/loader/pusher.webp` and check: 8 cells, same size character in each, palms touching the same vertical line in cells 1–7, feet on the same baseline.
4. Run `npm run dev`, load `http://localhost:5173/` and watch the loader: the hands must touch the wall edge, the walk must not jitter, and the thumbs-up frame must look intentional.
5. Do not change `src/components/Intro.tsx` or the CSS unless the alignment is off; if it is, prefer fixing the art.
