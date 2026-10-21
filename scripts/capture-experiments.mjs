// Captures the experiments' live sites into Asset/experiments/: a few desktop frames taken
// at different scroll depths (they play as a flipbook on the site) and one phone frame.
// Run: node scripts/capture-experiments.mjs  (then `npm run images` to optimize)
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const targets = [
  // Scroll is wheel-driven on this site; each step advances the story.
  { id: "err4or", url: "https://err4or.vercel.app/", frames: 4, step: 900 },
];

await mkdir("Asset/experiments", { recursive: true });
const browser = await chromium.launch();

for (const { id, url, frames, step } of targets) {
  const desk = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  await desk.goto(url, { waitUntil: "networkidle", timeout: 90_000 }).catch(() => {});
  await desk.waitForTimeout(4000);
  await desk.mouse.move(800, 500);
  for (let i = 1; i <= frames; i++) {
    if (i > 1) {
      await desk.mouse.wheel(0, step);
      await desk.waitForTimeout(1600);
    }
    await desk.screenshot({ path: `Asset/experiments/${id}-frame-${i}.png` });
    console.log(`captured ${id}-frame-${i}`);
  }
  await desk.close();

  const phone = await browser.newPage({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await phone.goto(url, { waitUntil: "networkidle", timeout: 90_000 }).catch(() => {});
  await phone.waitForTimeout(3000);
  await phone.screenshot({ path: `Asset/experiments/${id}-mobile.png` });
  console.log(`captured ${id}-mobile`);
  await phone.close();
}

await browser.close();
