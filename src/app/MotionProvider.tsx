import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "../motion/gsap";
import { useMotionPreference, type MotionPreference } from "../motion/useMotionPreference";

type ScrollTarget = string | HTMLElement | number;

type MotionContextValue = MotionPreference & {
  scrollTo: (target: ScrollTarget, opts?: { offset?: number; immediate?: boolean; onComplete?: () => void }) => void;
  lockScroll: (locked: boolean) => void;
};

const MotionContext = createContext<MotionContextValue | null>(null);

export function MotionProvider({ children }: { children: ReactNode }) {
  const pref = useMotionPreference();
  const lenisRef = useRef<Lenis | null>(null);

  // Single Lenis instance driven by GSAP's ticker — the one RAF owner on the page.
  useEffect(() => {
    if (!pref.smoothScroll) return;
    const lenis = new Lenis({ autoRaf: false, lerp: 0.085, wheelMultiplier: 0.95 });
    lenisRef.current = lenis;
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    if (document.body.classList.contains("is-locked")) lenis.stop();
    return () => {
      gsap.ticker.remove(tick);
      lenis.off("scroll", onScroll);
      lenis.destroy();
      lenisRef.current = null;
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, [pref.smoothScroll]);

  // Refresh trigger positions once fonts and images that affect layout are in.
  useEffect(() => {
    let timer = 0;
    const refresh = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    };
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("load", refresh);
    };
  }, []);

  const scrollTo = useCallback<MotionContextValue["scrollTo"]>((target, opts = {}) => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target, {
        offset: opts.offset ?? 0,
        immediate: opts.immediate,
        duration: 1.2,
        onComplete: opts.onComplete,
      });
      return;
    }
    let top: number;
    if (typeof target === "number") top = target;
    else {
      const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
      if (!el) return;
      top = el.getBoundingClientRect().top + window.scrollY;
    }
    const smooth = !opts.immediate && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: top + (opts.offset ?? 0), behavior: smooth ? "smooth" : "auto" });
    if (opts.onComplete) window.setTimeout(opts.onComplete, smooth ? 700 : 0);
  }, []);

  const lockScroll = useCallback((locked: boolean) => {
    document.body.classList.toggle("is-locked", locked);
    if (locked) lenisRef.current?.stop();
    else lenisRef.current?.start();
  }, []);

  const { reduced, finePointer, desktop, windowed, scenes, smoothScroll } = pref;
  const value = useMemo(
    () => ({ reduced, finePointer, desktop, windowed, scenes, smoothScroll, scrollTo, lockScroll }),
    [reduced, finePointer, desktop, windowed, scenes, smoothScroll, scrollTo, lockScroll],
  );
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useMotion() {
  const ctx = useContext(MotionContext);
  if (!ctx) throw new Error("useMotion must be used inside <MotionProvider>");
  return ctx;
}
