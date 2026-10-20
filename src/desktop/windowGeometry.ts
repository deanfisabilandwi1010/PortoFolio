export type Rect = { x: number; y: number; width: number; height: number };
export type Size = { width: number; height: number };

/** Gap kept between a maximized/oversized window and the desktop edge. */
export const EDGE_MARGIN = 12;
export const MIN_WIDTH = 260;
export const MIN_HEIGHT = 180;
/** Space reserved on the right for the desktop icon column. */
export const ICON_COLUMN = 156;

const clampNum = (v: number, min: number, max: number) => Math.min(Math.max(v, min), Math.max(min, max));

/**
 * Keep a window fully inside the desktop area (above the taskbar).
 * The whole frame — and therefore the title bar — always stays reachable.
 */
export function clampRect(rect: Rect, bounds: Size): Rect {
  const maxW = Math.max(160, bounds.width - EDGE_MARGIN * 2);
  const maxH = Math.max(120, bounds.height - EDGE_MARGIN * 2);
  const width = Math.round(clampNum(rect.width, Math.min(MIN_WIDTH, maxW), maxW));
  const height = Math.round(clampNum(rect.height, Math.min(MIN_HEIGHT, maxH), maxH));
  const x = Math.round(clampNum(rect.x, 0, bounds.width - width));
  const y = Math.round(clampNum(rect.y, 0, bounds.height - height));
  return { x, y, width, height };
}

export function maximizedRect(bounds: Size): Rect {
  return {
    x: EDGE_MARGIN,
    y: EDGE_MARGIN,
    width: Math.max(160, bounds.width - EDGE_MARGIN * 2),
    height: Math.max(120, bounds.height - EDGE_MARGIN * 2),
  };
}

export function centerRect(rect: Rect, bounds: Size): Rect {
  const r = clampRect(rect, bounds);
  return clampRect({ ...r, x: (bounds.width - r.width) / 2, y: (bounds.height - r.height) / 2 }, bounds);
}

/** Rects equal within a pixel. */
export function sameRect(a: Rect, b: Rect) {
  return Math.abs(a.x - b.x) < 1 && Math.abs(a.y - b.y) < 1 && Math.abs(a.width - b.width) < 1 && Math.abs(a.height - b.height) < 1;
}
