import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "../motion/gsap";
import { useMotion } from "../app/MotionProvider";
import { profile } from "../data/portfolio";
import { Wordmark } from "./Wordmark";
import styles from "./Intro.module.css";

/** Decide once, before first paint, whether the loader should run this visit. */
// eslint-disable-next-line react-refresh/only-export-components
export function shouldPlayIntro() {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    if (window.location.hash && window.location.hash !== "#top") return false;
  } catch {
    return false;
  }
  return true;
}

/** Assets the first screen actually needs. The counter only reports these. */
const CRITICAL_IMAGES = [
  "/assets/logos/pln-nusa-daya.webp",
  "/assets/logos/unand.webp",
  "/assets/projects/kalili-preview-sm.webp",
  "/assets/projects/tooday-preview-sm.webp",
  "/assets/projects/dompetqu-preview-sm.webp",
];
const MIN_TIME = 1.1; // seconds the line needs to travel, even on a warm cache
const MAX_WAIT = 6000; // never hold the page hostage to a slow asset

type Props = {
  /** Called when the screen starts to split — the hero reveal begins here. */
  onReveal: () => void;
  /** Called when the loader is gone. */
  onDone: () => void;
};

/**
 * Loader: a perforated line is "cut" from left to right as real assets load
 * (000 → 100). At 100 the screen tears open along that line.
 */
export function Intro({ onReveal, onDone }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const exiting = useRef(false);
  const exitRef = useRef<() => void>(() => {});
  const { lockScroll } = useMotion();

  useGSAP(
    () => {
      lockScroll(true);
      const q = gsap.utils.selector(root);
      const state = { real: 0, shown: 0 };

      // Sit the loader's wordmark exactly over the hero's, so the split reveals it in place.
      const heroMark = document.querySelector<HTMLElement>("[data-hero-wordmark] [aria-hidden='true']");
      const [mark] = q("[data-loader-mark]") as HTMLElement[];
      if (heroMark && mark) {
        const r = heroMark.getBoundingClientRect();
        Object.assign(mark.style, { top: `${r.top}px`, left: `${r.left}px`, width: `${r.width}px` });
      }
      // Letters drop in as real loading progresses: one letter per slice of progress.
      const letters = q("[data-loader-mark] [data-wm-char]");
      gsap.set(letters, { yPercent: -115 });
      let dropped = 0;
      const dropTo = (v: number) => {
        const due = Math.min(letters.length, Math.floor(v * letters.length + 0.0001));
        for (; dropped < due; dropped++) {
          gsap.to(letters[dropped], { yPercent: 0, rotate: 0, duration: 0.7, ease: "power4.out", startAt: { rotate: dropped % 2 ? 8 : -8 } });
        }
      };
      const dots = q("[data-dot]");
      const started = performance.now();

      const exit = () => {
        if (exiting.current) return;
        exiting.current = true;
        gsap.killTweensOf(state);
        setCount(100);
        dropTo(1);
        gsap.to(dots, { scale: 1, backgroundColor: "#F2EFEA", duration: 0.2 });
        gsap
          .timeline({
            defaults: { ease: "power4.inOut" },
            onComplete: () => {
              lockScroll(false);
              onDone();
            },
          })
          .to(q("[data-cut]"), { scaleX: 1, duration: 0.25, ease: "power2.out" })
          .to(q("[data-cutter]"), { left: "100%", rotate: 540, duration: 0.25, ease: "power2.out" }, "<")
          .to(q("[data-loader-meta]"), { autoAlpha: 0, y: -6, duration: 0.2, ease: "power2.in" }, ">+0.15")
          .to(q("[data-line]"), { autoAlpha: 0, duration: 0.15 }, "<")
          .call(() => {
            lockScroll(false);
            onReveal();
          })
          .to(q("[data-half='top']"), { yPercent: -101, duration: 0.95 }, "<")
          .to(q("[data-half='bottom']"), { yPercent: 101, duration: 0.95 }, "<")
          // the ivory letters leave with the half they sit in, uncovering the olive ones in place
          .to(
            q("[data-loader-mark]"),
            {
              y: () => {
                const r = (q("[data-loader-mark]")[0] as HTMLElement).getBoundingClientRect();
                const inBottom = r.top + r.height / 2 > window.innerHeight / 2;
                return (inBottom ? 1 : -1) * window.innerHeight * 0.51;
              },
              duration: 0.95,
            },
            "<",
          );
      };
      exitRef.current = exit;

      // Count real progress; the displayed number eases toward it, never ahead.
      const units = CRITICAL_IMAGES.length + 1;
      let done = 0;
      const tick = () => {
        done += 1;
        state.real = done / units;
        if (dots[done - 1]) gsap.to(dots[done - 1], { scale: 1, backgroundColor: "#F2EFEA", duration: 0.3, ease: "back.out(3)" });
        gsap.to(state, {
          shown: state.real,
          duration: 0.5,
          ease: "power2.out",
          overwrite: true,
          onUpdate: () => {
            const v = state.shown;
            setCount(Math.round(v * 100));
            gsap.set(q("[data-cut]"), { scaleX: v });
            gsap.set(q("[data-cutter]"), { left: `${v * 100}%`, rotate: v * 540 });
            dropTo(v);
          },
          onComplete: () => {
            if (state.real < 1) return;
            const wait = Math.max(0, MIN_TIME * 1000 - (performance.now() - started));
            gsap.delayedCall(wait / 1000, exit);
          },
        });
      };
      for (const src of CRITICAL_IMAGES) {
        const img = new Image();
        img.onload = img.onerror = tick; // a failed asset still counts: the page must not stall
        img.src = src;
      }
      (document.fonts?.ready ?? Promise.resolve()).then(tick, tick);
      gsap.delayedCall(MAX_WAIT / 1000, exit);

      gsap.from(q("[data-loader-meta] > *"), { y: 12, autoAlpha: 0, duration: 0.5, stagger: 0.06, ease: "power3.out" });

      return () => {
        // Whatever happens (unmount, error, HMR) the page must never stay locked.
        lockScroll(false);
      };
    },
    { scope: root },
  );

  // Escape or Skip ends the loader at once.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && exitRef.current();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const digits = String(count).padStart(3, "0");

  return (
    <div ref={root} className={`${styles.loader} on-dark`} role="status" aria-live="polite" aria-label={`Loading portfolio, ${count}%`}>
      <div className={`${styles.half} ${styles.top}`} data-half="top">
        <div className={styles.topMeta} data-loader-meta>
          <span className={`${styles.counter} label-mono`} aria-hidden>
            {digits}
          </span>
          <span className={`${styles.hint} label-mono`} aria-hidden>
            Loading dean.os <span className={styles.arrows}>▸▸▸</span>
          </span>
        </div>
      </div>
      <div className={`${styles.half} ${styles.bottom}`} data-half="bottom">
        <div className={styles.bottomMeta} data-loader-meta>
          <span className={styles.name}>
            Dean Fisabil Andwi <span className="serif">— portfolio</span>
          </span>
          <span className="label-mono">Programmer · PLN Nusa Daya</span>
        </div>
        <div className={styles.dots} aria-hidden>
          {Array.from({ length: CRITICAL_IMAGES.length + 1 }, (_, i) => (
            <span key={i} data-dot />
          ))}
        </div>
      </div>
      <div className={styles.mark} data-loader-mark>
        <Wordmark text={profile.wordmark} ratio={9.5} stackedRatio={3.35} maxSize="360px" />
      </div>
      <div className={styles.line} data-line aria-hidden>
        <span className={styles.cut} data-cut />
        <span className={styles.cutter} data-cutter />
      </div>
      <button type="button" className={`${styles.skip} label`} onClick={() => exitRef.current()}>
        Skip intro
      </button>
    </div>
  );
}
