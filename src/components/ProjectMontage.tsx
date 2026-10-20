import { useEffect, useRef, type CSSProperties } from "react";
import { gsap, useGSAP } from "../motion/gsap";
import { MM } from "../motion/useMotionPreference";
import { projects } from "../data/portfolio";
import styles from "./ProjectMontage.module.css";

/**
 * Scale moment #1: the two projects start as a small frame under the hero
 * and grow to fill the stage as the visitor scrolls.
 */
export function ProjectMontage({ play }: { play: boolean }) {
  const root = useRef<HTMLElement>(null);
  const enter = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const stage = root.current?.querySelector<HTMLElement>("[data-montage-stage]");
      const frame = root.current?.querySelector<HTMLElement>("[data-montage-frame]");
      if (!stage || !frame) return;

      mm.add(MM.motion, () => {
        // Entrance lives on the stage: the frame's transform belongs to the scroll scene alone.
        enter.current = gsap.from(stage, { y: 40, autoAlpha: 0, duration: 0.9, ease: "power3.out", delay: 0.55, paused: true, clearProps: "transform" });
      });

      mm.add(MM.scenes, () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top 62%",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        tl.fromTo(frame, { scale: 0.46 }, { scale: 0.46, duration: 0.2 })
          .to(frame, { scale: 1, duration: 0.6, ease: "power1.inOut" })
          .to(frame, { scale: 1, duration: 0.2 });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  useEffect(() => {
    if (play) enter.current?.play();
  }, [play]);

  return (
    <section ref={root} className={styles.montage} aria-label="Project preview">
      <div className={styles.stage} data-montage-stage>
        <div className={styles.frame} data-montage-frame style={{ "--n": projects.length } as CSSProperties}>
          <div className={styles.screens}>
            {projects.map((p) => (
              <a key={p.id} href="#work" className={styles.screen}>
                <span className={styles.chrome} aria-hidden>
                  <i />
                  <i />
                  <i />
                  <span className={styles.url}>{new URL(p.liveUrl).host}</span>
                </span>
                <img
                  src={p.preview}
                  srcSet={`${p.previewSmall} 800w, ${p.preview} 1600w`}
                  sizes="(min-width: 1024px) 31vw, 92vw"
                  width={1600}
                  height={1000}
                  alt={p.previewAlt}
                  fetchPriority="high"
                />
              </a>
            ))}
          </div>
          <div className={styles.caption}>
            {projects.map((p) => (
              <p key={p.id} className="label">
                <span className="label-mono">{p.index}</span> {p.title}
                <span className={styles.client}> — {p.client}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
