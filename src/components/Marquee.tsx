import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "../motion/gsap";
import { MM } from "../motion/useMotionPreference";
import styles from "./Marquee.module.css";

type Props = {
  /** Words alternate between solid sans and outlined/italic serif. */
  rows: string[][];
  label: string;
};

/**
 * Oversized type band. It drifts on its own and reacts to the scroll:
 * faster when the visitor scrolls fast, reversing when they scroll back up.
 */
export function Marquee({ rows, label }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MM.motion, () => {
        const tracks = gsap.utils.toArray<HTMLElement>("[data-marquee-track]", root.current);
        const loops = tracks.map((track, i) =>
          gsap.fromTo(track, { xPercent: i % 2 ? -50 : 0 }, { xPercent: i % 2 ? 0 : -50, duration: 38 + i * 6, ease: "none", repeat: -1 }),
        );
        let direction = 1;
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => loops.forEach((l) => (self.isActive ? l.resume() : l.pause())),
          onUpdate: (self) => {
            direction = self.direction;
            const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 220, 7);
            loops.forEach((l) => {
              l.timeScale(direction * boost);
              gsap.to(l, { timeScale: direction, duration: 0.9, ease: "power2.out", overwrite: true });
            });
          },
        });
        if (!st.isActive) loops.forEach((l) => l.pause());
        // A slight lean while passing through, for depth.
        gsap.fromTo(root.current, { rotate: -2.5 }, { rotate: 1.5, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.6 } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className={styles.marquee} role="img" aria-label={label}>
      {rows.map((words, r) => (
        <div key={r} className={`${styles.row} ${r % 2 ? styles.alt : ""}`} aria-hidden>
          <div className={styles.track} data-marquee-track>
            {[0, 1].map((copy) => (
              <span key={copy} className={styles.group}>
                {words.map((w, i) => (
                  <span key={i} className={i % 2 ? styles.serif : styles.solid}>
                    {w}
                    <i className={styles.star} />
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
