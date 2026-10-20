import { createStore, type StoreApi } from "zustand/vanilla";
import { useStore } from "zustand";
import { appById, windowIds, type WindowId } from "../data/desktopApps";
import { clampRect, centerRect, maximizedRect, type Rect, type Size } from "./windowGeometry";

export type WindowStatus = "closed" | "open" | "minimized";

export type WindowState = {
  id: WindowId;
  status: WindowStatus;
  maximized: boolean;
  rect: Rect;
  normalRect: Rect | null;
  z: number;
  triggerId: string | null;
};

export type DesktopState = {
  windows: Record<WindowId, WindowState>;
  topZ: number;
  focusedId: WindowId | null;
  bounds: Size;
  /** False until the real desktop size is known; default rects are laid out once. */
  laidOut: boolean;
  /** Last known layout mode; phones reset to an empty desktop. */
  windowed: boolean;
  motionPaused: boolean;

  openWindow: (id: WindowId, triggerId?: string | null) => void;
  focusWindow: (id: WindowId) => void;
  closeWindow: (id: WindowId) => void;
  minimizeWindow: (id: WindowId) => void;
  restoreWindow: (id: WindowId) => void;
  toggleMaximize: (id: WindowId) => void;
  commitWindowRect: (id: WindowId, rect: Partial<Rect>) => void;
  centerWindow: (id: WindowId) => void;
  setBounds: (bounds: Size, opts?: { windowed?: boolean }) => void;
  resetDesktop: () => void;
  toggleMotionPaused: () => void;
};

export const DEFAULT_BOUNDS: Size = { width: 1200, height: 720 };
const REINDEX_AT = 900;
const INITIAL_OPEN: WindowId[] = ["projects"];

function initialWindows(bounds: Size, windowed = true): Record<WindowId, WindowState> {
  return Object.fromEntries(
    windowIds.map((id, i) => {
      const open = windowed && INITIAL_OPEN.includes(id);
      const w: WindowState = {
        id,
        status: open ? "open" : "closed",
        maximized: false,
        rect: clampRect(appById[id].layout(bounds), bounds),
        normalRect: null,
        z: open ? 10 : i + 1,
        triggerId: null,
      };
      return [id, w];
    }),
  ) as Record<WindowId, WindowState>;
}

/** Highest-z window that is currently open, excluding `except`. */
function topOpen(windows: Record<WindowId, WindowState>, except?: WindowId): WindowId | null {
  let best: WindowState | null = null;
  for (const w of Object.values(windows)) {
    if (w.id === except || w.status !== "open") continue;
    if (!best || w.z > best.z) best = w;
  }
  return best?.id ?? null;
}

/** Compact z values while preserving order, so they never grow unbounded. */
function reindex(windows: Record<WindowId, WindowState>) {
  const sorted = Object.values(windows).sort((a, b) => a.z - b.z);
  const next = { ...windows };
  sorted.forEach((w, i) => (next[w.id] = { ...w, z: i + 1 }));
  return { windows: next, topZ: sorted.length };
}

export function createWindowStore(initialBounds: Size = DEFAULT_BOUNDS): StoreApi<DesktopState> {
  return createStore<DesktopState>()((set, get) => {
    const patch = (id: WindowId, p: Partial<WindowState>) => set((s) => ({ windows: { ...s.windows, [id]: { ...s.windows[id], ...p } } }));

    const raise = (id: WindowId) =>
      set((s) => {
        let { windows, topZ } = s;
        if (topZ >= REINDEX_AT) ({ windows, topZ } = reindex(windows));
        topZ += 1;
        return { windows: { ...windows, [id]: { ...windows[id], z: topZ } }, topZ, focusedId: id };
      });

    return {
      windows: initialWindows(initialBounds),
      topZ: 10,
      focusedId: INITIAL_OPEN[0] ?? null,
      bounds: initialBounds,
      laidOut: false,
      windowed: true,
      motionPaused: false,

      openWindow: (id, triggerId) => {
        const w = get().windows[id];
        if (w.status === "minimized") {
          get().restoreWindow(id);
        } else if (w.status === "closed") {
          const { bounds } = get();
          patch(id, {
            status: "open",
            rect: w.maximized ? maximizedRect(bounds) : clampRect(w.rect, bounds),
            triggerId: triggerId ?? w.triggerId,
          });
        } else if (triggerId) {
          patch(id, { triggerId });
        }
        raise(id);
      },

      focusWindow: (id) => {
        const s = get();
        if (s.windows[id].status !== "open") return;
        if (s.focusedId === id && s.windows[id].z === s.topZ) return;
        raise(id);
      },

      closeWindow: (id) => {
        const w = get().windows[id];
        if (w.status === "closed") return;
        // A closed window reopens in its normal (non-maximized) state.
        const rect = w.maximized && w.normalRect ? clampRect(w.normalRect, get().bounds) : w.rect;
        patch(id, { status: "closed", maximized: false, normalRect: null, rect });
        set((s) => ({ focusedId: s.focusedId === id ? topOpen(s.windows, id) : s.focusedId }));
      },

      minimizeWindow: (id) => {
        if (get().windows[id].status !== "open") return;
        patch(id, { status: "minimized" });
        set((s) => ({ focusedId: s.focusedId === id ? topOpen(s.windows, id) : s.focusedId }));
      },

      restoreWindow: (id) => {
        const { windows, bounds } = get();
        const w = windows[id];
        if (w.status === "closed") return;
        patch(id, { status: "open", rect: w.maximized ? maximizedRect(bounds) : clampRect(w.rect, bounds) });
        raise(id);
      },

      toggleMaximize: (id) => {
        const { windows, bounds } = get();
        const w = windows[id];
        if (w.status === "closed") return;
        if (!w.maximized) {
          patch(id, { maximized: true, normalRect: w.normalRect ?? w.rect, rect: maximizedRect(bounds) });
        } else {
          patch(id, { maximized: false, rect: clampRect(w.normalRect ?? w.rect, bounds), normalRect: null });
        }
        raise(id);
      },

      commitWindowRect: (id, rect) => {
        const { windows, bounds } = get();
        const w = windows[id];
        if (w.maximized) return;
        patch(id, { rect: clampRect({ ...w.rect, ...rect }, bounds) });
      },

      centerWindow: (id) => {
        const { windows, bounds } = get();
        const w = windows[id];
        if (w.maximized) return;
        patch(id, { rect: centerRect(w.rect, bounds) });
      },

      setBounds: (bounds, opts) => {
        const s = get();
        const windowed = opts?.windowed ?? s.windowed;
        if (windowed !== s.windowed) set({ windowed });
        if (!s.laidOut) {
          // First real measurement: lay out the defaults for this desktop size.
          const fresh = initialWindows(bounds, windowed);
          if (s.topZ === 10) {
            set({ bounds, laidOut: true, windowed, windows: fresh, focusedId: windowed ? (INITIAL_OPEN[0] ?? null) : null });
            return;
          }
          // The visitor already opened/closed something before we could measure:
          // keep what they did, only move windows to their real default positions.
          const windows = { ...s.windows };
          for (const w of Object.values(windows)) {
            windows[w.id] = { ...w, rect: w.maximized ? maximizedRect(bounds) : fresh[w.id].rect };
          }
          set({ bounds, laidOut: true, windowed, windows });
          return;
        }
        if (bounds.width === s.bounds.width && bounds.height === s.bounds.height) return;
        const windows = { ...s.windows };
        for (const w of Object.values(windows)) {
          // normalRect is kept untouched; it is clamped again on restore.
          windows[w.id] = { ...w, rect: w.maximized ? maximizedRect(bounds) : clampRect(w.rect, bounds) };
        }
        set({ bounds, windows });
      },

      resetDesktop: () => {
        const { bounds, windowed } = get();
        set({ windows: initialWindows(bounds, windowed), topZ: 10, focusedId: windowed ? (INITIAL_OPEN[0] ?? null) : null });
      },

      toggleMotionPaused: () => set((s) => ({ motionPaused: !s.motionPaused })),
    };
  });
}

export const desktopStore = createWindowStore();

export function useDesktop<T>(selector: (s: DesktopState) => T): T {
  return useStore(desktopStore, selector);
}
