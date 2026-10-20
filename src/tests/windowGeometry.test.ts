import { describe, expect, it } from "vitest";
import { clampRect, centerRect, maximizedRect, EDGE_MARGIN } from "../desktop/windowGeometry";

const bounds = { width: 1000, height: 600 };

describe("clampRect", () => {
  it("keeps a window that was dragged off-screen fully reachable", () => {
    const r = clampRect({ x: 2000, y: -300, width: 400, height: 300 }, bounds);
    expect(r.x).toBe(600);
    expect(r.y).toBe(0);
  });

  it("keeps the title bar on screen after the desktop shrinks", () => {
    const r = clampRect({ x: 700, y: 400, width: 500, height: 400 }, { width: 640, height: 420 });
    expect(r.y).toBeGreaterThanOrEqual(0);
    expect(r.x).toBeGreaterThanOrEqual(0);
    expect(r.x + r.width).toBeLessThanOrEqual(640);
    expect(r.y + r.height).toBeLessThanOrEqual(420);
  });

  it("caps oversize windows with an edge margin", () => {
    const r = clampRect({ x: 0, y: 0, width: 5000, height: 5000 }, bounds);
    expect(r.width).toBe(bounds.width - EDGE_MARGIN * 2);
    expect(r.height).toBe(bounds.height - EDGE_MARGIN * 2);
  });
});

describe("maximizedRect / centerRect", () => {
  it("leaves a margin when maximized", () => {
    expect(maximizedRect(bounds)).toEqual({ x: EDGE_MARGIN, y: EDGE_MARGIN, width: 976, height: 576 });
  });

  it("centers inside bounds", () => {
    expect(centerRect({ x: 0, y: 0, width: 400, height: 200 }, bounds)).toEqual({ x: 300, y: 200, width: 400, height: 200 });
  });
});
