import { useSyncExternalStore } from "react";

// One central motion policy. Every component asks this hook instead of
// writing its own media queries.
const QUERIES = {
  reduced: "(prefers-reduced-motion: reduce)",
  finePointer: "(hover: hover) and (pointer: fine)",
  desktop: "(min-width: 1024px)",
  windowed: "(min-width: 768px)",
} as const;

type Key = keyof typeof QUERIES;

function subscribe(query: string) {
  return (cb: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", cb);
    return () => mql.removeEventListener("change", cb);
  };
}

const subscribers = Object.fromEntries(
  (Object.keys(QUERIES) as Key[]).map((k) => [k, subscribe(QUERIES[k])]),
) as Record<Key, (cb: () => void) => () => void>;

function useQuery(key: Key) {
  return useSyncExternalStore(
    subscribers[key],
    () => window.matchMedia(QUERIES[key]).matches,
    () => false,
  );
}

export type MotionPreference = {
  reduced: boolean;
  finePointer: boolean;
  /** >= 1024px */
  desktop: boolean;
  /** >= 768px: overlapping draggable windows; below this, single-panel desktop */
  windowed: boolean;
  /** Pinned scroll scenes (montage zoom, monitor zoom) */
  scenes: boolean;
  /** Lenis smooth scroll */
  smoothScroll: boolean;
};

export function useMotionPreference(): MotionPreference {
  const reduced = useQuery("reduced");
  const finePointer = useQuery("finePointer");
  const desktop = useQuery("desktop");
  const windowed = useQuery("windowed");
  return {
    reduced,
    finePointer,
    desktop,
    windowed,
    scenes: desktop && !reduced,
    smoothScroll: finePointer && !reduced,
  };
}

/** gsap.matchMedia conditions mirroring the policy above. */
export const MM = {
  scenes: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  motion: "(prefers-reduced-motion: no-preference)",
  reduced: QUERIES.reduced,
} as const;
