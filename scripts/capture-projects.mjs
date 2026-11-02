// Captures fresh screenshots of the live project sites into Asset/projects/.
// Run: node scripts/capture-projects.mjs [id ...]  (then `npm run images` to optimize)
// DompetQu is captured by hand from its demo mode, so it is not listed here.
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const targets = [
  { id: "kalili", url: "https://kalilidimsum.netlify.app/" },
  { id: "tooday", url: "https://toodaycafee.vercel.app/" },
  { id: "plnservices", url: "https://plnservices.co.id/beranda" },
];
const only = process.argv.slice(2);

await mkdir("Asset/projects", { recursive: true });
const browser = await chromium.launch();

for (const { id, url } of targets.filter((t) => !only.length || only.includes(t.id))) {
  for (const [suffix, viewport] of [
    ["desktop", { width: 1600, height: 1000 }],
    ["mobile", { width: 430, height: 932 }],
  ]) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: suffix === "mobile" ? 2 : 1 });
    await page.goto(url, { waitUntil: "networkidle", timeout: 90_000 }).catch(() => {});
    // Let intro/loader screens finish and dismiss any skip button.
    await page.waitForTimeout(6000);
    for (const label of ["Skip", "Lewati", "Masuk"]) {
      const btn = page.getByRole("button", { name: new RegExp(label, "i") }).first();
      if (await btn.isVisible().catch(() => false)) await btn.click().catch(() => {});
    }
    await page.waitForTimeout(2500);
    await page.screenshot({ path: `Asset/projects/${id}-${suffix}.png` });
    console.log(`captured ${id}-${suffix}`);
    await page.close();
  }
}

await browser.close();
