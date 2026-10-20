import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import type { WindowId } from "../data/desktopApps";
import { desktopStore } from "./useWindowStore";

gsap.registerPlugin(Draggable);

type Options = {
  id: WindowId;
  /** WindowPosition element — Draggable owns its x/y transform. */
  target: RefObject<HTMLElement | null>;
  handle: RefObject<HTMLElement | null>;
  bounds: RefObject<HTMLElement | null>;
  x: number;
  y: number;
  enabled: boolean;
};

/**
 * Title-bar dragging for one window. The DOM transform is the source of truth
 * while dragging; the store only hears about the final position on release.
 */
export function useDraggableWindow({ id, target, handle, bounds, x, y, enabled }: Options) {
  const instance = useRef<Draggable | null>(null);

  useEffect(() => {
    const el = target.current;
    if (!el || !handle.current) return;
    const [d] = Draggable.create(el, {
      type: "x,y",
      trigger: handle.current,
      bounds: bounds.current ?? undefined,
      inertia: false,
      dragClickables: false,
      clickableTest: (node: Element) => !!node.closest("button, a, [data-no-drag]"),
      zIndexBoost: false,
      cursor: "grab",
      activeCursor: "grabbing",
      onPress() {
        desktopStore.getState().focusWindow(id);
      },
      onDragStart() {
        document.documentElement.classList.add("is-dragging-window");
      },
      onRelease() {
        document.documentElement.classList.remove("is-dragging-window");
      },
      onDragEnd() {
        desktopStore.getState().commitWindowRect(id, { x: this.x, y: this.y });
      },
    });
    instance.current = d;
    return () => {
      d.kill();
      instance.current = null;
      document.documentElement.classList.remove("is-dragging-window");
    };
  }, [id, target, handle, bounds]);

  useEffect(() => {
    const d = instance.current;
    if (!d) return;
    if (enabled) d.enable();
    else d.disable();
  }, [enabled]);

  // Store-driven moves (maximize, restore, clamp, center) are written here,
  // then Draggable is re-synced so the next drag starts from the right place.
  useLayoutEffect(() => {
    const el = target.current;
    if (!el) return;
    gsap.set(el, { x, y });
    instance.current?.update(true);
  }, [target, x, y]);
}
