import { expect, test, type Page } from "@playwright/test";

const PORTRAIT = "Portrait — Dean Fisabil Andwi";

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  return errors;
}

/** Deep link straight to the full-size desktop and wait for the zoom to settle. */
async function openDesktop(page: Page) {
  await page.goto("/#desktop");
  await expect(page.locator("#desktop-heading")).toBeVisible({ timeout: 15_000 });
  await expect
    .poll(
      () =>
        page.locator("[data-zoom]").evaluate((el) => {
          const t = getComputedStyle(el).transform;
          return t === "none" || t === "matrix(1, 0, 0, 1, 0, 0)";
        }),
      { timeout: 15_000 },
    )
    .toBe(true);
}

const win = (page: Page, name: string) => page.getByRole("dialog", { name });

test.describe("intro & page", () => {
  test("intro can be skipped and never leaves the page locked", async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto("/");
    const skip = page.getByRole("button", { name: "Skip intro" });
    // The overlay may already be leaving; a stalled click must not hang the test.
    if (await skip.isVisible().catch(() => false)) await skip.click({ timeout: 1500, force: true }).catch(() => {});
    await expect(skip).toHaveCount(0);
    await expect(page.locator("body")).not.toHaveClass(/is-locked/);
    await expect(page.locator("html")).not.toHaveClass(/lenis-stopped/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Dean Fisabil Andwi");
    await page.mouse.wheel(0, 1200);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(200);
    expect(errors).toEqual([]);
  });

  test("project links are real and no dead links exist", async ({ page }) => {
    await page.goto("/#work");
    await expect(page.locator('#project-kalili a[href="https://kalilidimsum.netlify.app/"]').first()).toBeAttached();
    // Below the fold the second block may still be waiting for its reveal; check the DOM directly.
    await expect(page.locator('#project-tooday a[href="https://toodaycafee.vercel.app/"]').first()).toBeAttached();
    await expect(page.locator('#project-kalili a[href="https://github.com/deanfisabilandwi1010/kaliliDimsum"]')).toHaveCount(1);
    await expect(page.locator('#project-tooday a[href="https://github.com/deanfisabilandwi1010/t00day"]')).toHaveCount(1);
    await expect(page.locator('#project-dompetqu a[href="https://dompetqu-personal.vercel.app/"]').first()).toBeAttached();
    await expect(page.locator('#project-dompetqu a[href="https://github.com/deanfisabilandwi1010/DompDigital"]')).toHaveCount(1);
    expect(await page.locator('a[href="#"], a[href=""], a:not([href])').count()).toBe(0);
  });

  test("desktop: the pinned showcase flips through to the last project while scrolling", async ({ page, isMobile }) => {
    test.skip(!!isMobile, "showcase is the desktop layout");
    await page.goto("/#work");
    await expect(page.locator("#project-kalili")).toHaveAttribute("data-active", "true");
    const pin = await page.locator("#work").evaluate((el) => {
      const spacer = el.parentElement!;
      return { top: spacer.getBoundingClientRect().top + window.scrollY, h: spacer.offsetHeight };
    });
    await page.evaluate((y) => window.scrollTo(0, y), pin.top + pin.h - page.viewportSize()!.height);
    await expect(page.locator("#project-dompetqu")).toHaveAttribute("data-active", "true");
    await expect(page.locator("#project-dompetqu").getByRole("link", { name: /Live website/ })).toBeVisible();
  });

  test("project details disclosure toggles", async ({ page, isMobile }) => {
    test.skip(!isMobile, "disclosure is the phone / reduced-motion layout");
    await page.goto("/#work");
    // Content reveals as it scrolls into view, the way a visitor reaches it.
    // Scroll the way a visitor would: bring the card's bottom into view, before the next card covers it.
    await page.locator("#project-kalili").evaluate((el: HTMLElement) =>
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + el.offsetHeight - window.innerHeight + 40),
    );
    await page.waitForTimeout(400);
    const btn = page.locator("#project-kalili").getByRole("button", { name: "Project details" });
    await btn.click();
    await expect(page.locator("#project-kalili").getByText("Rotatable 3D dumpling cross-section")).toBeVisible();
    await expect(page.locator("#project-kalili").getByRole("button", { name: "Hide details" })).toHaveAttribute("aria-expanded", "true");
  });
});

test.describe("navigation & hero", () => {
  test("nav links go through the curtain and land on the section", async ({ page, isMobile }) => {
    test.skip(!!isMobile, "primary nav row is the desktop layout");
    await page.goto("/");
    const skip = page.getByRole("button", { name: "Skip intro" });
    if (await skip.isVisible().catch(() => false)) await skip.click({ timeout: 1500, force: true }).catch(() => {});
    await expect(skip).toHaveCount(0);
    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Contact" }).click();
    await expect(page).toHaveURL(/#contact$/);
    await expect(page.locator("#contact-title")).toBeFocused({ timeout: 5000 });
    await expect(page.locator("#contact-title")).toBeInViewport();
    // the curtain is gone and the page is scrollable again
    await expect.poll(() => page.evaluate(() => document.body.classList.contains("is-locked"))).toBe(false);
  });

  test("the hero portrait reveals the second photo on hover / tap", async ({ page, isMobile }) => {
    await page.goto("/#about");
    await page.evaluate(() => window.scrollTo(0, 0));
    const arch = page.locator("[data-arch]");
    await arch.scrollIntoViewIfNeeded();
    if (isMobile) await arch.tap();
    else await arch.hover();
    await expect(arch).toHaveAttribute("data-revealed", "true");
    await expect(page.locator("[data-arch-meta]")).toContainText(/After hours/);
  });
});

test.describe("tech stack", () => {
  test("pointing at an element opens its card; filters dim other disciplines", async ({ page, isMobile }) => {
    await page.goto("/#stack");
    const table = page.locator("[data-table]");
    await table.evaluate((el) => el.scrollIntoView({ block: "center" }));
    const three = page.locator('[data-cell][aria-label^="Three.js"]');
    await expect(three).toBeVisible();
    if (isMobile) await three.tap();
    else await three.hover();
    const panel = page.locator("#stack aside");
    await expect(panel).toContainText("Three.js");
    await expect(panel).toContainText("3D graphics");
    await expect(panel).toContainText("WebGL");
    await page.locator('[role="toolbar"] button[data-cat="backend"]').click();
    await expect(page.locator('[data-cell][aria-label^="Laravel"]')).not.toHaveAttribute("data-dim", "true");
    await expect(page.locator('[data-cell][aria-label^="React"]')).toHaveAttribute("data-dim", "true");
  });
});

test.describe("security console & mobile work", () => {
  test("pointing at a console step selects it and types its detail", async ({ page, isMobile }) => {
    await page.goto("/#day-job");
    // Located by attribute: the card may still be hidden by its scroll reveal until scrolled to.
    const step = page.locator('button[aria-label^="FIX:"]');
    await step.evaluate((el) => el.scrollIntoView({ block: "center" }));
    if (isMobile) await step.tap();
    else await step.hover();
    await expect(step).toHaveAttribute("aria-current", "step");
    await expect(page.locator("[aria-live='polite']").filter({ hasText: "Remediate" })).toContainText("security headers");
  });

  test("phone: the project preview flips between desktop and phone", async ({ page, isMobile }) => {
    test.skip(!isMobile, "stacking cards are the phone/tablet layout");
    await page.goto("/#work");
    const card = page.locator("#project-kalili");
    const phoneBtn = card.getByRole("button", { name: "Phone" });
    await phoneBtn.evaluate((el) => el.scrollIntoView({ block: "center" }));
    await phoneBtn.tap();
    await expect(phoneBtn).toHaveAttribute("aria-pressed", "true");
    await expect(card.getByRole("img", { name: /on a phone/ })).toBeVisible();
  });
});

test.describe("interests", () => {
  test("the three interest tickets are dealt and readable", async ({ page }) => {
    await page.goto("/#interests");
    const track = page.locator("[data-track]");
    // scroll to the end of the scene (desktop pin) or past each ticket (phones)
    await track.evaluate((el: HTMLElement) => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + el.offsetHeight - window.innerHeight));
    for (const title of ["Web Development", "UI/UX Design", "Interactive Website"]) {
      // located by text: the ticket may still be hidden by its entrance until scrolled to
      const t = page.locator("#interests h3", { hasText: title });
      await t.evaluate((el) => el.scrollIntoView({ block: "center" }));
      await expect(t).toBeVisible();
    }
    await expect(page.locator("#interests-title")).toHaveText("Interested in");
  });
});

test.describe("internal app tiles", () => {
  test("hover, keyboard focus and tap all play a tile", async ({ page, isMobile }) => {
    await page.goto("/#day-job");
    // Located by attribute: the tile can still be hidden by its scroll reveal until scrolled to.
    const tile = page.locator('[role="group"][aria-label^="System SYS-03"]');
    await tile.evaluate((el) => el.scrollIntoView({ block: "center" }));
    await expect(tile).toBeVisible();
    if (isMobile) {
      await tile.tap();
      await expect(tile).toHaveAttribute("data-on", "true");
      await tile.tap();
      await expect(tile).not.toHaveAttribute("data-on", "true");
      return;
    }
    await tile.hover();
    await expect(tile).toHaveAttribute("data-on", "true");
    await page.mouse.move(5, 5);
    await expect(tile).not.toHaveAttribute("data-on", "true");
    // keyboard
    await page.locator('[role="group"][aria-label^="System SYS-02"]').focus();
    await page.keyboard.press("Tab");
    await expect(page.locator('[role="group"][aria-label^="System SYS-03"]')).toBeFocused();
    await expect(page.locator('[role="group"][aria-label^="System SYS-03"]')).toHaveAttribute("data-on", "true");
  });
});

test.describe("desktop (windowed)", () => {
  test.skip(({ isMobile }) => isMobile, "windowed desktop only");

  test("deep link #desktop is usable; Portrait opens, closes, reopens", async ({ page }) => {
    const errors = collectErrors(page);
    await openDesktop(page);
    await page.getByRole("button", { name: "Open Portrait.jpg" }).click();
    const portrait = win(page, PORTRAIT);
    await expect(portrait).toBeVisible();
    await expect(portrait.locator("img")).toHaveAttribute("src", "/assets/photos/portrait-studio.webp");
    await expect.poll(() => portrait.locator("img").evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth)).toBeGreaterThan(0);
    // The whole photo is visible inside the viewer (contain, not cropped).
    const [img, stage] = await Promise.all([portrait.locator("img").boundingBox(), portrait.locator("figure > div").boundingBox()]);
    expect(img!.y).toBeGreaterThanOrEqual(stage!.y);
    expect(img!.y + img!.height).toBeLessThanOrEqual(stage!.y + stage!.height + 0.5);
    await portrait.getByRole("button", { name: "Close Portrait.jpg" }).click();
    await expect(portrait).toBeHidden();
    await page.getByRole("button", { name: "Open Portrait.jpg" }).click();
    await expect(portrait).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("the desktop is still clickable after the camera pulls back to the monitor", async ({ page }) => {
    await page.goto("/");
    await page.locator("[data-desktop-track]").evaluate((el: HTMLElement) => {
      const top = el.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo(0, top + (el.offsetHeight - (window.innerHeight - 64)) * 0.9);
    });
    await expect.poll(() => page.locator("[data-zoom]").evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).a)).toBeLessThan(0.7);
    await page.getByRole("button", { name: "Open Portrait.jpg" }).click();
    await expect(win(page, PORTRAIT)).toBeVisible();
  });

  test("two windows: the clicked one comes to the front", async ({ page }) => {
    await openDesktop(page);
    await page.getByRole("button", { name: "Open About Me.txt" }).click();
    await page.getByRole("button", { name: "Open Photo Booth.jpg" }).click();
    const z = (name: string) => win(page, name).evaluate((el) => Number(getComputedStyle(el.parentElement!.parentElement!).zIndex));
    expect(await z("Photo Booth.jpg")).toBeGreaterThan(await z("About Me.txt"));
    // The left end of About's title bar is not covered by Photo Booth.
    await win(page, "About Me.txt").click({ position: { x: 12, y: 20 } });
    expect(await z("About Me.txt")).toBeGreaterThan(await z("Photo Booth.jpg"));
  });

  test("drag by title bar moves the window; pressing Close does not drag", async ({ page, browserName }) => {
    // Playwright's WebKit build on Windows fires pointer events but not the compatibility
    // mousedown that GSAP Draggable listens for in WebKit, so drag cannot be exercised there.
    test.skip(browserName === "webkit" && process.platform === "win32", "WebKit-on-Windows emits no compat mouse events");
    await openDesktop(page);
    const projects = win(page, "Projects");
    // Measure relative to the taskbar so any page scroll settling doesn't matter.
    const rel = async () => {
      const [w, bar] = await Promise.all([projects.boundingBox(), page.getByRole("toolbar", { name: "Taskbar" }).boundingBox()]);
      return { x: w!.x - bar!.x, y: w!.y - bar!.y };
    };
    const before = await rel();
    const title = (await projects.getByRole("heading", { name: "Projects" }).boundingBox())!;
    await page.mouse.move(title.x + 20, title.y + title.height / 2);
    await page.mouse.down();
    await page.mouse.move(title.x + 120, title.y + title.height / 2 - 60, { steps: 8 });
    await page.mouse.up();
    const after = await rel();
    expect(Math.round(after.x - before.x)).toBe(100);
    expect(Math.round(after.y - before.y)).toBe(-60);

    const close = (await projects.getByRole("button", { name: "Close Projects" }).boundingBox())!;
    await page.mouse.move(close.x + close.width / 2, close.y + close.height / 2);
    await page.mouse.down();
    await page.mouse.move(close.x - 80, close.y + 40, { steps: 5 });
    await page.mouse.up();
    // Close either closed the window or did nothing — it must never have dragged it.
    if (await projects.isVisible()) expect(Math.round((await rel()).x)).toBe(Math.round(after.x));
    else await expect(projects).toBeHidden();
  });

  test("minimize keeps a taskbar button that restores the window", async ({ page }) => {
    await openDesktop(page);
    await page.getByRole("button", { name: "Open After Hours.png" }).click();
    const w = win(page, "After Hours.png");
    // Positions relative to the taskbar, so page scroll settling doesn't matter.
    const bar = page.getByRole("toolbar", { name: "Taskbar" });
    const rel = async () => {
      const [a, t] = await Promise.all([w.boundingBox(), bar.boundingBox()]);
      return { x: a!.x - t!.x, y: a!.y - t!.y };
    };
    const box = await rel();
    await w.getByRole("button", { name: "Minimize After Hours.png" }).click();
    await expect(w).toBeHidden();
    const task = page.getByRole("toolbar", { name: "Taskbar" }).getByRole("button", { name: /After Hours\.png/ });
    await expect(task).toBeVisible();
    await task.click();
    await expect(w).toBeVisible();
    // Poll until the restore tween settles; allow sub-pixel rounding.
    await expect.poll(async () => Math.abs((await rel()).x - box.x)).toBeLessThanOrEqual(1);
    await expect.poll(async () => Math.abs((await rel()).y - box.y)).toBeLessThanOrEqual(1);
  });

  test("maximize then restore returns to the previous size", async ({ page }) => {
    await openDesktop(page);
    const w = win(page, "Projects");
    const before = (await w.boundingBox())!;
    await w.getByRole("button", { name: "Maximize Projects" }).click();
    await expect.poll(async () => (await w.boundingBox())!.width).toBeGreaterThan(before.width + 200);
    await w.getByRole("button", { name: "Restore Projects" }).click();
    await expect.poll(async () => Math.round((await w.boundingBox())!.width)).toBe(Math.round(before.width));
  });

  test("resizing the viewport keeps title bars on screen", async ({ page }) => {
    await openDesktop(page);
    await page.getByRole("button", { name: "Open After Hours.png" }).click();
    await page.setViewportSize({ width: 900, height: 700 });
    await page.waitForTimeout(400);
    const surface = (await page.getByRole("toolbar", { name: "Taskbar" }).boundingBox())!;
    for (const name of ["After Hours.png", "Projects"]) {
      const title = await win(page, name).getByRole("heading", { name }).boundingBox();
      if (!title) continue;
      expect(title.x).toBeGreaterThanOrEqual(0);
      expect(title.x + 40).toBeLessThanOrEqual(900);
      expect(title.y + title.height).toBeLessThanOrEqual(surface.y);
    }
  });

  test("keyboard: reach an icon, open with Enter, Escape closes and returns focus", async ({ page }) => {
    await openDesktop(page);
    const icon = page.getByRole("button", { name: "Open About Me.txt" });
    await icon.focus();
    await page.keyboard.press("Enter");
    const w = win(page, "About Me.txt");
    await expect(w).toBeVisible();
    await expect(w.getByRole("heading", { name: "About Me.txt" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(w).toBeHidden();
    await expect(icon).toBeFocused();
  });

  test("window content scrolls locally; wallpaper scroll moves the page", async ({ page }) => {
    await openDesktop(page);
    await page.getByRole("button", { name: "Open Day Job.txt" }).click();
    const w = win(page, "Day Job.txt — PLN Nusa Daya");
    await expect(w).toBeVisible();
    const body = w.locator("[data-lenis-prevent]");
    const box = (await body.boundingBox())!;
    const pageY = await page.evaluate(() => window.scrollY);
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.wheel(0, 240);
    await expect.poll(() => body.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
    expect(Math.abs((await page.evaluate(() => window.scrollY)) - pageY)).toBeLessThan(40);

    await w.getByRole("button", { name: "Close Day Job.txt" }).click();
    const hint = (await page.locator("#desktop-heading").boundingBox())!;
    await page.mouse.move(hint.x + 400, hint.y + 200);
    await page.mouse.wheel(0, 600);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(pageY + 100);
  });
});

test.describe("mobile", () => {
  test.skip(({ isMobile }) => !isMobile, "phone layout only");

  test("opens one panel at a time without horizontal overflow", async ({ page }) => {
    await page.goto("/#desktop");
    await expect(page.locator("#desktop-heading")).toBeVisible();
    await page.getByRole("button", { name: "Open Portrait.jpg" }).click();
    await expect(win(page, PORTRAIT)).toBeVisible();
    await win(page, PORTRAIT).getByRole("button", { name: /Next file/ }).click();
    await expect(win(page, PORTRAIT)).toBeHidden();
    await expect(win(page, "Photo Booth.jpg")).toBeVisible();
    await win(page, "Photo Booth.jpg").getByRole("button", { name: "Back to files" }).click();
    await expect(win(page, "Photo Booth.jpg")).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
});

test.describe("photo booth clip", () => {
  test("opens from its desktop icon, plays, and stops when closed", async ({ page, isMobile }) => {
    await openDesktop(page);
    await page.getByRole("button", { name: "Open Photooboth<3" }).click();
    await expect(win(page, "Photooboth<3")).toBeVisible();
    const video = page.locator('[data-window="photoboothClip"] video');
    // Playwright's WebKit on Windows ships without H.264; only assert playback where the codec exists.
    const canPlay = await video.evaluate((v: HTMLVideoElement) => v.canPlayType('video/mp4; codecs="avc1.42E01E"') !== "");
    if (canPlay) await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime), { timeout: 8000 }).toBeGreaterThan(0.3);
    await win(page, "Photooboth<3")
      .getByRole("button", { name: isMobile ? "Back to files" : "Close Photooboth<3" })
      .click();
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("no intro, nothing left hidden, no pinned scroll spacers", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Skip intro" })).toHaveCount(0);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    const hidden = await page.$$eval("[data-reveal], [data-hero-line], [data-wm-char], [data-process-card]", (els) =>
      els.filter((el) => Number(getComputedStyle(el).opacity) < 1 || getComputedStyle(el).visibility === "hidden").length,
    );
    expect(hidden).toBe(0);
    const desktopH = await page.locator("#desktop").evaluate((el) => el.getBoundingClientRect().height);
    expect(desktopH).toBeLessThan(page.viewportSize()!.height * 1.6);
  });
});
