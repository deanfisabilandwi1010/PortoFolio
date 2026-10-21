import { useEffect, useRef } from "react";
import { gsap, useGSAP } from "../motion/gsap";
import { useMotion } from "../app/MotionProvider";
import { profile } from "../data/portfolio";
import { PUSHER, pusherFrame } from "./pusherSprite";
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
const { src: SPRITE, brace: BRACE, done: DONE, palms: PALMS, soles: SOLES } = PUSHER;
const MIN_TIME = 2.2; // seconds the push takes even on a warm cache, so it reads as a push
const MAX_WAIT = 7000; // never hold the page hostage to a slow asset

type Props = {
  /** Called when the window bursts open — the hero entrance begins here. */
  onReveal: () => void;
  /** Called when the loader is gone. */
  onDone: () => void;
};

/** Window size for the current viewport: it opens to `max` wide while loading. */
function measure() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const phone = vw < 640;
  const h = Math.round(Math.min(phone ? 380 : 480, Math.max(200, vh * (phone ? 0.4 : 0.46))));
  const max = Math.round(Math.min(vw - (phone ? 32 : 96), 1120));
  const cell = Math.round(Math.min(h * 0.92, max * 0.5));
  return { vw, vh, h, max, cell, start: cell * 0.95 };
}

/**
 * Loader: olive screen with a small ivory window in the middle. A cartoon Dean stands
 * inside it and pushes its edge outward as real assets load (000 → 100), uncovering
 * his name. At 100 the window bursts to full screen and dissolves into the hero.
 */
export function Intro({ onReveal, onDone }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const exitRef = useRef<() => void>(() => {});
  const { lockScroll } = useMotion();

  useGSAP(
    () => {
      lockScroll(true);
      const q = gsap.utils.selector(root);
      const [win] = q("[data-window]") as HTMLElement[];
      const [pusher] = q("[data-pusher]") as HTMLElement[];
      const [sprite] = q("[data-sprite]") as HTMLElement[];
      const [readout] = q("[data-readout]") as HTMLElement[];
      const [counter] = q("[data-counter]") as HTMLElement[];

      const state = { real: 0, shown: 0, w: 0, frame: -1, travelled: 0, still: 0 };
      let geo = measure();
      let exiting = false;
      // Async callbacks (image loads) can outlive this effect, e.g. StrictMode's dev remount; they must go quiet.
      let alive = true;
      let begun = false; // the sprite load and the grace timer both try to start it; only the first may
      let pushStart = 0; // set once the window has cracked open
      const crack = { w: 0 };

      const showFrame = (f: number) => {
        if (f === state.frame) return;
        state.frame = f;
        sprite.style.backgroundPositionX = pusherFrame(f);
      };
      const size = () => {
        geo = measure();
        gsap.set(pusher, { width: geo.cell, height: geo.cell });
      };
      // Centred window of width w (and height h); the pusher's palms sit on its right edge.
      const place = (w: number, h = geo.h, follow = Infinity) => {
        const moved = w - state.w;
        state.w = w;
        const left = (geo.vw - w) / 2;
        const top = (geo.vh - h) / 2;
        gsap.set(win, { left, top, width: w, height: h });
        gsap.set(pusher, { x: Math.min(w, follow - left) - geo.cell * PALMS, y: h - geo.cell * SOLES });
        gsap.set(readout, { x: left + w, y: top + h, xPercent: -100 });
        return moved;
      };

      // Feet move with the edge: one frame per stride slice, so a stall becomes a strain, not a moonwalk.
      // The window grows on both sides, so the edge travels half of what the width does.
      const stride = () => geo.cell * 0.11;
      const walk = (moved: number) => {
        state.travelled += moved / 2;
        showFrame(Math.floor(state.travelled / stride()) % PUSHER.cycle);
      };

      const render = (_t: number, dtMs: number) => {
        if (!alive || exiting || !pushStart) return;
        const dt = dtMs / 1000;
        // Displayed progress eases toward real progress, but never faster than MIN_TIME allows.
        const cap = Math.min(1, (performance.now() - pushStart) / 1000 / MIN_TIME);
        const target = Math.min(state.real, cap);
        state.shown += (target - state.shown) * (1 - Math.exp(-dt * 5));
        if (target - state.shown < 0.002) state.shown = target;
        const v = state.shown;
        counter.textContent = String(Math.round(v * 100)).padStart(3, "0");
        const moved = place(geo.start + v * (geo.max - geo.start));
        if (moved > 0.25) {
          state.still = 0;
          walk(moved);
        } else if ((state.still += dt) > 0.35) {
          showFrame(BRACE);
        }
        if (state.real >= 1 && v >= 1) exit();
      };

      const exit = () => {
        if (!alive || exiting) return;
        exiting = true;
        gsap.ticker.remove(render);
        gsap.killTweensOf(crack);
        counter.textContent = "100";
        const burst = { w: Math.max(state.w, crack.w), h: geo.h };
        const follow = geo.vw * 0.93; // he stops short of the screen edge and turns round
        gsap
          .timeline({
            onComplete: () => {
              lockScroll(false);
              onDone();
            },
          })
          .to(q("[data-loader-meta], [data-readout]"), { autoAlpha: 0, duration: 0.25, ease: "power2.in" })
          // Last big shove: the window bursts to full screen, the hero is underneath.
          .to(
            burst,
            {
              w: geo.vw,
              h: geo.vh,
              duration: 0.8,
              ease: "power3.inOut",
              onUpdate: () => {
                const before = state.w;
                place(burst.w, burst.h, follow);
                // The reveal overlaps the burst's tail; once he has turned round, stay turned.
                if (state.frame !== DONE && (geo.vw - burst.w) / 2 + burst.w < follow) walk(state.w - before);
              },
            },
            "<",
          )
          .to(q("[data-card]"), { autoAlpha: 0, duration: 0.5, ease: "power2.out" }, "-=0.35")
          .call(
            () => {
              lockScroll(false);
              onReveal();
              showFrame(DONE);
            },
            undefined,
            "<",
          )
          .fromTo(pusher, { yPercent: 0 }, { yPercent: -6, duration: 0.18, ease: "power2.out", yoyo: true, repeat: 1 })
          .to(pusher, { autoAlpha: 0, yPercent: 8, duration: 0.35, ease: "power2.in" }, "+=0.45")
          .to(q("[data-skip]"), { autoAlpha: 0, duration: 0.2 }, "<");
      };
      exitRef.current = exit;

      // Count real progress; the sprite counts as one unit so the character exists before it moves.
      const units = CRITICAL_IMAGES.length + 2;
      let done = 0;
      const tick = () => (state.real = ++done / units);
      for (const src of CRITICAL_IMAGES) {
        const img = new Image();
        img.onload = img.onerror = tick; // a failed asset still counts: the page must not stall
        img.src = src;
      }
      (document.fonts?.ready ?? Promise.resolve()).then(tick, tick);

      // The window cracks open from a hairline once the character can be drawn (or after a short grace period).
      size();
      showFrame(BRACE);
      place(0);
      const begin = () => {
        if (!alive || begun || exiting) return;
        begun = true;
        tick();
        gsap.to(crack, {
          w: geo.start,
          duration: 0.7,
          ease: "power3.out",
          onUpdate: () => place(crack.w),
          onComplete: () => {
            pushStart = performance.now();
          },
        });
      };
      const sheet = new Image();
      sheet.onload = sheet.onerror = begin;
      sheet.src = SPRITE;
      gsap.delayedCall(0.8, begin);
      gsap.ticker.add(render);
      gsap.delayedCall(MAX_WAIT / 1000, exit);

      const onResize = () => {
        if (exiting) return;
        size();
        place(pushStart ? geo.start + state.shown * (geo.max - geo.start) : crack.w);
      };
      window.addEventListener("resize", onResize);

      gsap.from(q("[data-loader-meta] > *"), { y: 12, autoAlpha: 0, duration: 0.5, stagger: 0.06, ease: "power3.out" });

      return () => {
        alive = false;
        gsap.killTweensOf(crack);
        gsap.ticker.remove(render);
        window.removeEventListener("resize", onResize);
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

  const [first, ...rest] = profile.wordmark.split(" ");

  return (
    <div ref={root} className={`${styles.loader} on-dark`} role="status" aria-label="Loading portfolio">
      <div className={styles.window} data-window>
        <div className={styles.card} data-card aria-hidden>
          <span className={styles.name}>
            <span>{first}</span>
            {rest.map((word) => (
              <span key={word}>{word}</span>
            ))}
          </span>
        </div>
        <div className={styles.pusher} data-pusher aria-hidden>
          <div className={styles.sprite} data-sprite style={{ backgroundImage: `url(${SPRITE})` }} />
        </div>
      </div>
      <div className={styles.readout} data-readout aria-hidden>
        <span className={`${styles.counter} label-mono`} data-counter>
          000
        </span>
        <span className={`${styles.hint} label-mono`}>
          push <span className={styles.arrows}>▸▸▸</span>
        </span>
      </div>
      <p className={`${styles.top} label-mono`} data-loader-meta aria-hidden>
        <span>Loading dean.os</span>
      </p>
      <p className={styles.bottom} data-loader-meta aria-hidden>
        <span className={styles.who}>
          {profile.name} <span className="serif">— portfolio</span>
        </span>
        <span className="label-mono">Programmer · PLN Nusa Daya</span>
      </p>
      <button type="button" className={`${styles.skip} label`} data-skip onClick={() => exitRef.current()}>
        Skip intro
      </button>
    </div>
  );
}
