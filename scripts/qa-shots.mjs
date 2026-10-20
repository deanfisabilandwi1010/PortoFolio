// Visual QA helper: full-journey screenshots + console errors.
// Usage: node scripts/qa-shots.mjs [baseUrl] [outDir] [width] [height]
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.argv[2] ?? "http://localhost:5173";
const out = process.argv[3] ?? "qa-shots";
const width = Number(process.argv[4] ?? 1440);
const height = Number(process.argv[5] ?? 900);
await mkdir(out, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height } });
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(e.message));

await page.goto(base, { waitUntil: "networkidle" });
await page.waitForTimeout(2200);

// Wordmark fit check: rendered width vs container width
const fit = await page.evaluate(() =>
  [...document.querySelectorAll("[aria-hidden='true'] > span")].slice(0, 2).map((el) => {
    const fs = parseFloat(getComputedStyle(el).fontSize);
    return { text: el.textContent, ratio: +(el.scrollWidth / fs).toFixed(3), width: el.scrollWidth, container: el.parentElement.clientWidth };
  }),
);
console.log("wordmark", JSON.stringify(fit));

const total = await page.evaluate(() => document.documentElement.scrollHeight);
let i = 0;
for (let y = 0; y < total; y += Math.round(height * 0.8)) {
  await page.mouse.wheel(0, 0);
  await page.evaluate((top) => window.scrollTo(0, top), y);
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${out}/${String(i++).padStart(2, "0")}-${y}.png` });
}
console.log("shots", i, "height", total, "overflowX", await page.evaluate(() => document.documentElement.scrollWidth > innerWidth));
console.log("errors", JSON.stringify(errors));
await browser.close();
