import { beforeEach, describe, expect, it } from "vitest";
import type { StoreApi } from "zustand/vanilla";
import { createWindowStore, type DesktopState } from "../desktop/useWindowStore";

let store: StoreApi<DesktopState>;
const s = () => store.getState();

beforeEach(() => {
  store = createWindowStore();
  s().setBounds({ width: 1200, height: 760 });
});

describe("window manager invariants", () => {
  it("starts with only the Projects window open", () => {
    const open = Object.values(s().windows).filter((w) => w.status === "open");
    expect(open.map((w) => w.id)).toEqual(["projects"]);
  });

  it("opening an app twice never creates a second instance — it focuses", () => {
    s().openWindow("portrait", "icon-portrait");
    s().openWindow("about");
    const zBefore = s().windows.portrait.z;
    s().openWindow("portrait");
    expect(Object.keys(s().windows).filter((k) => k === "portrait")).toHaveLength(1);
    expect(s().focusedId).toBe("portrait");
    expect(s().windows.portrait.z).toBeGreaterThan(zBefore);
  });

  it("open on a minimized window restores and focuses it", () => {
    s().openWindow("about");
    s().minimizeWindow("about");
    expect(s().windows.about.status).toBe("minimized");
    s().openWindow("about");
    expect(s().windows.about.status).toBe("open");
    expect(s().focusedId).toBe("about");
  });

  it("minimize / restore keeps the position", () => {
    s().openWindow("about");
    s().commitWindowRect("about", { x: 210, y: 140 });
    const before = s().windows.about.rect;
    s().minimizeWindow("about");
    s().restoreWindow("about");
    expect(s().windows.about.rect).toEqual(before);
  });

  it("close can be reopened", () => {
    s().openWindow("photobooth");
    s().closeWindow("photobooth");
    expect(s().windows.photobooth.status).toBe("closed");
    s().openWindow("photobooth");
    expect(s().windows.photobooth.status).toBe("open");
  });

  it("maximize → resize → restore returns a safe rect", () => {
    s().openWindow("afterHours");
    s().commitWindowRect("afterHours", { x: 500, y: 200, width: 680, height: 520 });
    const normal = s().windows.afterHours.rect;
    s().toggleMaximize("afterHours");
    s().toggleMaximize("afterHours"); // normalRect is stored once, never overwritten by the max rect
    s().toggleMaximize("afterHours");
    expect(s().windows.afterHours.normalRect).toEqual(normal);

    s().setBounds({ width: 800, height: 520 });
    expect(s().windows.afterHours.rect.width).toBeLessThanOrEqual(800);

    s().toggleMaximize("afterHours");
    const r = s().windows.afterHours.rect;
    expect(s().windows.afterHours.maximized).toBe(false);
    expect(r.x).toBeGreaterThanOrEqual(0);
    expect(r.y).toBeGreaterThanOrEqual(0);
    expect(r.x + r.width).toBeLessThanOrEqual(800);
    expect(r.y + r.height).toBeLessThanOrEqual(520);
  });

  it("closing the focused window hands focus to the next open window", () => {
    s().openWindow("about");
    s().openWindow("portrait");
    s().closeWindow("portrait");
    expect(s().focusedId).toBe("about");
  });

  it("z-index is reindexed instead of growing forever", () => {
    s().openWindow("about");
    s().openWindow("portrait");
    for (let i = 0; i < 1200; i++) s().focusWindow(i % 2 ? "about" : "portrait");
    expect(s().topZ).toBeLessThan(1000);
    expect(s().windows.about.z).toBeGreaterThan(s().windows.portrait.z);
    expect(s().focusedId).toBe("about");
  });

  it("a window opened before the first measurement survives the first layout", () => {
    const early = createWindowStore();
    early.getState().openWindow("about", "icon-about");
    early.getState().setBounds({ width: 1200, height: 760 });
    const about = early.getState().windows.about;
    expect(about.status).toBe("open");
    expect(about.triggerId).toBe("icon-about");
    expect(early.getState().focusedId).toBe("about");
  });

  it("phones start with no window covering the icons", () => {
    const phone = createWindowStore();
    phone.getState().setBounds({ width: 360, height: 600 }, { windowed: false });
    expect(Object.values(phone.getState().windows).every((w) => w.status === "closed")).toBe(true);
  });
});
