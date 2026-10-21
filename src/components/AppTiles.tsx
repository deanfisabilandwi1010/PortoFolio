import { useRef, useState } from "react";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { gsap, useGSAP } from "../motion/gsap";
import type { InternalApp } from "../data/portfolio";
import { useMotion } from "../app/MotionProvider";
import styles from "./AppTiles.module.css";

gsap.registerPlugin(DrawSVGPlugin);

/**
 * Internal systems as "classified" tiles: the real names stay private. At rest each
 * shows a codename, a redaction bar and a faint blueprint; on hover / focus / tap the
 * tile floods with olive from the side the pointer came in, the lock opens, the bar
 * wipes away to reveal only the broad area, the illustration plays, and the card tilts.
 */
export function AppTiles({ apps }: { apps: InternalApp[] }) {
  return (
    <div className={styles.wrap}>
      <p className={`${styles.brief} label-mono`}>
        <span>{String(apps.length).padStart(2, "0")} systems · in daily use · names withheld</span>
        <span className={styles.stamp} data-stamp aria-hidden>
          Internal only
        </span>
      </p>
      <ul className={styles.tiles} aria-label="Internal systems I manage, by area">
        {apps.map((app) => (
          <li key={app.code} className={styles.tile} data-app-tile>
            <AppTile app={app} />
          </li>
        ))}
      </ul>
    </div>
  );
}

type Edge = "top" | "right" | "bottom" | "left";
const CLOSED: Record<Edge, string> = {
  top: "inset(0% 0% 100% 0%)",
  right: "inset(0% 0% 0% 100%)",
  bottom: "inset(100% 0% 0% 0%)",
  left: "inset(0% 100% 0% 0%)",
};

function nearestEdge(el: HTMLElement, e: { clientX: number; clientY: number }): Edge {
  const r = el.getBoundingClientRect();
  const d = { top: e.clientY - r.top, bottom: r.bottom - e.clientY, left: e.clientX - r.left, right: r.right - e.clientX };
  return (Object.keys(d) as Edge[]).reduce((a, b) => (d[a] <= d[b] ? a : b));
}

function AppTile({ app }: { app: InternalApp }) {
  const card = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const { reduced, finePointer } = useMotion();

  useGSAP(
    (_ctx, contextSafe) => {
      const el = card.current;
      if (!el || !contextSafe) return;
      const q = gsap.utils.selector(el);
      const fill = q("[data-fill]")[0];
      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      // Name rolls letter by letter to its twin underneath.
      // Declassify: the lock opens, the redaction bar wipes off, the area rolls in, the status line flips.
      tl.to(q("[data-shackle]"), { y: -3, duration: 0.35, ease: "back.out(3)" }, 0)
        .to(q("[data-redact]"), { scaleX: 0, duration: 0.45, ease: "power3.inOut" }, 0.05)
        .to(q("[data-roll] > span > span"), { yPercent: -100, duration: 0.5, stagger: 0.025, ease: "power3.inOut" }, 0.12)
        .to(q("[data-desc] > span"), { yPercent: -50, duration: 0.45, ease: "power3.inOut" }, 0.15);
      buildArt(app.art, q, tl);
      gsap.set(fill, { clipPath: CLOSED.bottom });
      let active = false;

      const activate = contextSafe((edge: Edge) => {
        if (active) return;
        active = true;
        setOn(true);
        if (reduced) {
          gsap.set(fill, { clipPath: "inset(0% 0% 0% 0%)" });
          tl.progress(1);
          return;
        }
        gsap.fromTo(fill, { clipPath: CLOSED[edge] }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.5, ease: "power3.out", overwrite: true });
        tl.timeScale(1).play();
      });

      const deactivate = contextSafe((edge: Edge) => {
        if (!active) return;
        active = false;
        setOn(false);
        if (reduced) {
          gsap.set(fill, { clipPath: CLOSED[edge] });
          tl.progress(0);
          return;
        }
        gsap.to(fill, { clipPath: CLOSED[edge], duration: 0.4, ease: "power3.in", overwrite: true });
        tl.timeScale(1.6).reverse();
        gsap.to(el, { rotationX: 0, rotationY: 0, duration: 0.6, ease: "power3.out" });
      });

      const tilt = contextSafe((e: PointerEvent) => {
        if (reduced || e.pointerType !== "mouse") return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.style.setProperty("--gx", `${px * 100}%`);
        el.style.setProperty("--gy", `${py * 100}%`);
        gsap.to(el, { rotationY: (px - 0.5) * 10, rotationX: (0.5 - py) * 8, transformPerspective: 700, duration: 0.4, ease: "power2.out" });
      });

      const onEnter = (e: PointerEvent) => e.pointerType === "mouse" && activate(nearestEdge(el, e));
      const onLeave = (e: PointerEvent) => e.pointerType === "mouse" && deactivate(nearestEdge(el, e));
      // Touch: tap toggles.
      const onUp = (e: PointerEvent) => {
        if (e.pointerType === "mouse") return;
        if (active) deactivate("bottom");
        else activate("bottom");
      };
      // Keyboard: focus plays it, leaving stops it.
      const onFocus = () => {
        if (el.matches(":focus-visible")) activate("left");
      };
      const onBlur = () => deactivate("left");

      el.addEventListener("pointerenter", onEnter);
      el.addEventListener("pointerleave", onLeave);
      el.addEventListener("pointermove", tilt);
      el.addEventListener("pointerup", onUp);
      el.addEventListener("focus", onFocus);
      el.addEventListener("blur", onBlur);
      return () => {
        el.removeEventListener("pointerenter", onEnter);
        el.removeEventListener("pointerleave", onLeave);
        el.removeEventListener("pointermove", tilt);
        el.removeEventListener("pointerup", onUp);
        el.removeEventListener("focus", onFocus);
        el.removeEventListener("blur", onBlur);
      };
    },
    { scope: card, dependencies: [reduced, finePointer], revertOnUpdate: true },
  );

  return (
    <div
      ref={card}
      className={styles.card}
      data-on={on || undefined}
      role="group"
      aria-label={`System ${app.code}, ${app.area}: ${app.short}`}
      tabIndex={0}
    >
      <span className={styles.fill} data-fill aria-hidden />
      <span className={styles.glare} aria-hidden />
      <span className={styles.top} aria-hidden>
        <span className="label-mono">{app.code}</span>
        <svg className={styles.lock} viewBox="0 0 14 16">
          <path data-shackle d="M4 7V4.6a3 3 0 0 1 6 0V7" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <rect x="2" y="7" width="10" height="8" rx="1.6" fill="currentColor" />
        </svg>
      </span>
      <span className={styles.name} aria-hidden>
        <span className={styles.roll} data-roll>
          {[0, 1].map((copy) => (
            <span key={copy} className={styles.rollLine}>
              {[...app.area].map((ch, i) => (
                <span key={i}>{ch}</span>
              ))}
            </span>
          ))}
        </span>
        <span className={styles.redact} data-redact>
          <span className="label-mono">Classified</span>
        </span>
      </span>
      <span className={styles.desc} data-desc aria-hidden>
        <span className={styles.descTrack}>
          <span className="label-mono">Access: internal only</span>
          <span>{app.short}</span>
        </span>
      </span>
      <Art kind={app.art} />
    </div>
  );
}

/* ---------- Illustrations ---------- */

function Art({ kind }: { kind: InternalApp["art"] }) {
  return (
    <svg className={styles.art} viewBox="0 0 120 90" aria-hidden>
      {kind === "modules" && (
        <>
          {/* blueprint */}
          <path className={styles.ghost} d="M60 45 L18 18 M60 45 L102 18 M60 45 L18 72 M60 45 L102 72" />
          {/* live */}
          <path data-draw d="M60 45 L18 18" />
          <path data-draw d="M60 45 L102 18" />
          <path data-draw d="M60 45 L18 72" />
          <path data-draw d="M60 45 L102 72" />
          {[
            [8, 8],
            [92, 8],
            [8, 62],
            [92, 62],
          ].map(([x, y], i) => (
            <rect key={i} data-pop className={styles.solid} x={x} y={y} width="20" height="20" rx="4" />
          ))}
          <rect data-hub className={styles.panel} x="42" y="30" width="36" height="30" rx="6" />
          <path data-hub-lines className={styles.thin} d="M49 40 H71 M49 46 H65 M49 52 H69" />
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} data-dot className={styles.dot} cx="60" cy="45" r="2.6" />
          ))}
        </>
      )}

      {kind === "archive" && (
        <>
          <path className={styles.panel} d="M14 28 H42 L48 34 H106 V82 H14 Z" />
          {[0, 1, 2].map((i) => (
            <g key={i} data-sheet>
              <rect className={styles.sheet} x="36" y="26" width="48" height="56" rx="3" />
              <path className={styles.thin} d="M43 37 H77 M43 44 H71 M43 51 H75" />
            </g>
          ))}
          <path data-front className={styles.solid} d="M10 48 H110 L104 84 H16 Z" />
          <path data-front-line className={styles.thinOnSolid} d="M48 64 H72" />
        </>
      )}

      {kind === "kpi" && (
        <>
          <path className={styles.ghost} d="M8 82 H112" />
          {[
            [16, 24],
            [40, 40],
            [64, 32],
            [88, 58],
          ].map(([x, h], i) => (
            <rect key={i} data-bar className={i === 3 ? styles.solid : styles.panel} x={x} y={82 - h} width="16" height={h} rx="2" />
          ))}
          <path data-trend className={styles.line} d="M24 52 L48 36 L72 44 L96 18" />
          <circle data-end className={styles.dot} cx="96" cy="18" r="4" />
        </>
      )}

      {kind === "governance" && (
        <>
          <path className={styles.ghost} d="M60 6 L94 18 V42 C94 64 80 78 60 85 C40 78 26 64 26 42 V18 Z" />
          <path data-shield-fill className={styles.panel} d="M60 6 L94 18 V42 C94 64 80 78 60 85 C40 78 26 64 26 42 V18 Z" />
          <path data-shield className={styles.line} d="M60 6 L94 18 V42 C94 64 80 78 60 85 C40 78 26 64 26 42 V18 Z" />
          <path data-check className={styles.check} d="M45 45 L56 56 L77 33" />
          {[0, 1, 2].map((i) => (
            <path key={i} data-ray className={styles.line} d={["M60 0 V-6", "M100 12 L105 8", "M20 12 L15 8"][i]} />
          ))}
        </>
      )}
    </svg>
  );
}

type Q = (selector: string) => Element[];

/** Each illustration's hover choreography, appended to the tile's timeline. */
function buildArt(kind: InternalApp["art"], q: Q, tl: gsap.core.Timeline) {
  if (kind === "modules") {
    gsap.set(q("[data-draw]"), { drawSVG: "0%" });
    gsap.set(q("[data-pop]"), { scale: 0.4, transformOrigin: "50% 50%", opacity: 0.35 });
    gsap.set(q("[data-dot]"), { opacity: 0 });
    tl.fromTo(q("[data-hub]"), { scale: 0.85, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.4, ease: "back.out(3)" }, 0.05)
      .to(q("[data-draw]"), { drawSVG: "100%", duration: 0.45, stagger: 0.07 }, 0.1)
      .to(q("[data-pop]"), { scale: 1, opacity: 1, duration: 0.4, stagger: 0.07, ease: "back.out(2.5)" }, 0.3);
    const targets = [
      [-42, -27],
      [42, -27],
      [-42, 27],
      [42, 27],
    ];
    q("[data-dot]").forEach((dot, i) => {
      tl.fromTo(dot, { x: 0, y: 0, opacity: 1 }, { x: targets[i][0], y: targets[i][1], opacity: 0, duration: 0.6, ease: "power1.in" }, 0.45 + i * 0.06);
    });
  }

  if (kind === "archive") {
    const sheets = q("[data-sheet]");
    gsap.set(sheets, { y: 16, transformOrigin: "50% 100%" });
    tl.to(q("[data-front]"), { scaleY: 0.86, transformOrigin: "50% 100%", duration: 0.35 }, 0.05)
      .to(q("[data-front-line]"), { y: 3, duration: 0.35 }, 0.05)
      .to(sheets, { y: (i) => [-6, -16, -8][i], x: (i) => [-16, 0, 16][i], rotate: (i) => [-14, 0, 12][i], duration: 0.6, stagger: 0.06, ease: "back.out(1.6)" }, 0.12);
  }

  if (kind === "kpi") {
    const bars = q("[data-bar]");
    gsap.set(bars, { scaleY: 0.22, transformOrigin: "50% 100%" });
    gsap.set(q("[data-trend]"), { drawSVG: "0%" });
    gsap.set(q("[data-end]"), { scale: 0, transformOrigin: "50% 50%" });
    tl.to(bars, { scaleY: 1, duration: 0.55, stagger: 0.07, ease: "back.out(1.8)" }, 0.05)
      .to(q("[data-trend]"), { drawSVG: "100%", duration: 0.5, ease: "power2.inOut" }, 0.35)
      .to(q("[data-end]"), { scale: 1, duration: 0.35, ease: "back.out(3)" }, 0.75);
  }

  if (kind === "governance") {
    gsap.set(q("[data-shield]"), { drawSVG: "0%" });
    gsap.set(q("[data-check]"), { drawSVG: "0%" });
    gsap.set(q("[data-shield-fill]"), { opacity: 0, scale: 0.85, transformOrigin: "50% 50%" });
    gsap.set(q("[data-ray]"), { drawSVG: "0%" });
    tl.to(q("[data-shield]"), { drawSVG: "100%", duration: 0.6, ease: "power2.inOut" }, 0.05)
      .to(q("[data-shield-fill]"), { opacity: 1, scale: 1, duration: 0.4 }, 0.35)
      .to(q("[data-check]"), { drawSVG: "100%", duration: 0.35, ease: "power2.out" }, 0.55)
      .to(q("[data-ray]"), { drawSVG: "100%", duration: 0.25, stagger: 0.05 }, 0.75);
  }
}
