// Pre-publish check: lists owner data that is still empty or unconfirmed.
// Empty optional fields are hidden on the site, so this only warns — except for
// core identity fields, which fail the check.
import { readFile, access } from "node:fs/promises";

const src = await readFile("src/data/portfolio.ts", "utf8");
const problems = [];
const warnings = [];

const field = (name) => src.match(new RegExp(`\\b${name}:\\s*(null|"[^"]*")`))?.[1];

for (const core of ["name", "role", "company"]) {
  const v = field(core);
  if (!v || v === "null" || v === '""' || /placeholder|todo|lorem/i.test(v)) problems.push(`profile.${core} is missing or a placeholder`);
}
if (field("email") === "null") warnings.push("profile.email is empty — the contact CTA falls back to GitHub");
if (field("linkedinUrl") === "null") warnings.push("profile.linkedinUrl is empty (hidden)");
if (field("instagramUrl") === "null") warnings.push("profile.instagramUrl is empty (hidden)");
if (field("availability") === "null") warnings.push("profile.availability is empty (no 'open for work' badge is shown)");
const nullRoles = [...src.matchAll(/role:\s*null/g)].length;
if (nullRoles) warnings.push(`${nullRoles} project(s) have role: null (hidden) — add your contribution if you want it shown`);

const assets = [...src.matchAll(/"(\/assets\/[^"]+)"/g)].map((m) => m[1]);
for (const a of new Set(assets)) {
  try {
    await access(`public${a}`);
  } catch {
    problems.push(`missing asset: public${a}`);
  }
}

for (const w of warnings) console.log(`⚠ ${w}`);
for (const p of problems) console.log(`✗ ${p}`);
if (problems.length) process.exitCode = 1;
else console.log(`✓ core identity and ${new Set(assets).size} referenced assets OK`);
