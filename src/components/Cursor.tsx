import { useEffect, useRef, useState } from "react";
import { gsap } from "../motion/gsap";
import styles from "./Cursor.module.css";

type Mode = "idle" | "link" | "view";

/**
 * A soft halo that trails the (still visible) system cursor, grows into a
 * "View site" badge over project images, and makes [data-magnetic] elements
 * lean toward the pointer. Mounted only for fine pointers without reduced motion.
 */
export function Cursor() {
  const halo = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("idle");
  const [label, setLabel] = useState("View site");

  useEffect(() => {
    const el = halo.current;
    if (!el) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
    let magnet: HTMLElement | null = null;
    let magnetTo: { x: gsap.QuickToFunc; y: gsap.QuickToFunc } | null = null;
    let visible = false;

    const releaseMagnet = () => {
      if (!magnet) return;
      gsap.to(magnet, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
      magnet = null;
      magnetTo = null;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!visible) {
        visible = true;
        gsap.set(el, { x: e.clientX, y: e.clientY });
        gsap.to(el, { autoAlpha: 1, duration: 0.2 });
      }
      xTo(e.clientX);
      yTo(e.clientY);

      const target = e.target instanceof Element ? e.target : null;
      const view = target?.closest<HTMLElement>("[data-cursor='view']");
      const link = target?.closest("a, button, [role='button']");
      setMode(view ? "view" : link ? "link" : "idle");
      if (view?.dataset.cursorLabel) setLabel(view.dataset.cursorLabel);

      const m = target?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (m !== magnet) {
        releaseMagnet();
        if (m) {
          magnet = m;
          magnetTo = {
            x: gsap.quickTo(m, "x", { duration: 0.4, ease: "power3.out" }),
            y: gsap.quickTo(m, "y", { duration: 0.4, ease: "power3.out" }),
          };
        }
      }
      if (magnet && magnetTo) {
        const r = magnet.getBoundingClientRect();
        const strength = Number(magnet.dataset.magnetic) || 0.3;
        magnetTo.x((e.clientX - (r.left + r.width / 2)) * strength);
        magnetTo.y((e.clientY - (r.top + r.height / 2)) * strength);
      }
    };
    const onLeave = () => {
      visible = false;
      gsap.to(el, { autoAlpha: 0, duration: 0.2 });
      releaseMagnet();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      releaseMagnet();
    };
  }, []);

  return (
    <div ref={halo} className={styles.halo} data-mode={mode} aria-hidden>
      <span className={styles.badge}>{label} ↗</span>
    </div>
  );
}
