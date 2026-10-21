import { useRef, useState } from "react";
import { gsap, useGSAP } from "../motion/gsap";
import { useMotion } from "../app/MotionProvider";
import styles from "./PortraitArch.module.css";

/**
 * Hero centrepiece: the studio portrait in an arched frame. On hover a circle follows
 * the cursor and shows the "after hours" photo only where you point (tap on touch
 * opens it fully). The frame tilts and the photo drifts slightly.
 */
export function PortraitArch({ play }: { play: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const { reduced } = useMotion();

  useGSAP(
    (_ctx, contextSafe) => {
      const el = root.current;
      if (!el || !contextSafe || reduced) return;
      const arch = el.querySelector<HTMLElement>("[data-arch]")!;
      const photos = gsap.utils.toArray<HTMLElement>("[data-photo]", arch);
      const spot = { r: 0 };
      const paint = () => arch.style.setProperty("--r", `${spot.r}px`);
      const full = () => Math.hypot(arch.offsetWidth, arch.offsetHeight);

      // The lens centre eases after the cursor.
      const pos = { x: 0, y: 0 };
      const placeLens = () => {
        arch.style.setProperty("--x", `${pos.x}px`);
        arch.style.setProperty("--y", `${pos.y}px`);
      };
      const follow = (x: number, y: number) => gsap.to(pos, { x, y, duration: 0.35, ease: "power3.out", onUpdate: placeLens, overwrite: true });
      const setOrigin = (e: PointerEvent) => {
        const a = arch.getBoundingClientRect();
        pos.x = e.clientX - a.left;
        pos.y = e.clientY - a.top;
        arch.style.setProperty("--x", `${pos.x}px`);
        arch.style.setProperty("--y", `${pos.y}px`);
      };
      const lens = () => Math.min(arch.offsetWidth, arch.offsetHeight) * 0.3;
      const wipe = contextSafe((open: boolean, radius = full()) => {
        setRevealed(open);
        gsap.to(spot, { r: open ? radius : 0, duration: open ? 0.6 : 0.5, ease: "power3.out", onUpdate: paint, overwrite: true });
      });

      const rotY = gsap.quickTo(arch, "rotationY", { duration: 0.8, ease: "power3.out" });
      const rotX = gsap.quickTo(arch, "rotationX", { duration: 0.8, ease: "power3.out" });
      const imgX = photos.map((p) => gsap.quickTo(p, "xPercent", { duration: 0.9, ease: "power3.out" }));
      const imgY = photos.map((p) => gsap.quickTo(p, "yPercent", { duration: 0.9, ease: "power3.out" }));

      const onMove = contextSafe((e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const a = arch.getBoundingClientRect();
        const nx = (e.clientX - a.left) / a.width - 0.5;
        const ny = (e.clientY - a.top) / a.height - 0.5;
        rotY(nx * 7);
        rotX(-ny * 5);
        follow(e.clientX - a.left, e.clientY - a.top);
        photos.forEach((_, i) => {
          imgX[i](-nx * 3);
          imgY[i](-ny * 3);
        });
      });
      const onEnter = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        setOrigin(e);
        wipe(true, lens());
      };
      const onLeave = contextSafe((e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        setOrigin(e);
        wipe(false);
        rotY(0);
        rotX(0);
        photos.forEach((_, i) => {
          imgX[i](0);
          imgY[i](0);
        });
      });
      let tapped = false;
      const onTap = (e: PointerEvent) => {
        if (e.pointerType === "mouse") return;
        setOrigin(e);
        tapped = !tapped;
        wipe(tapped);
      };

      // Entrance: the arch opens from the bottom while the photo settles.
      if (play) {
        gsap
          .timeline()
          .fromTo(arch, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "power4.inOut", clearProps: "clipPath" })
          .from(photos[0], { scale: 1.2, duration: 1.4, ease: "power3.out" }, 0)
          .from(el.querySelectorAll("[data-arch-meta] > *"), { y: 10, autoAlpha: 0, duration: 0.5, stagger: 0.08, ease: "power3.out" }, 0.7);
      }

      arch.addEventListener("pointermove", onMove);
      arch.addEventListener("pointerenter", onEnter);
      arch.addEventListener("pointerleave", onLeave);
      arch.addEventListener("pointerup", onTap);
      return () => {
        arch.removeEventListener("pointermove", onMove);
        arch.removeEventListener("pointerenter", onEnter);
        arch.removeEventListener("pointerleave", onLeave);
        arch.removeEventListener("pointerup", onTap);
      };
    },
    { scope: root, dependencies: [reduced, play], revertOnUpdate: true },
  );

  return (
    <div ref={root} className={styles.wrap}>
      <figure className={styles.arch} data-arch data-revealed={revealed || undefined} onClick={() => reduced && setRevealed((r) => !r)}>
        <img
          className={`${styles.photo} ${styles.base}`}
          data-photo
          src="/assets/photos/portrait-crop.webp"
          srcSet="/assets/photos/portrait-crop-sm.webp 520w, /assets/photos/portrait-crop.webp 900w"
          sizes="(min-width: 1024px) 26vw, 80vw"
          width={900}
          height={1579}
          alt="Studio portrait of Dean in a dark suit, seated on a stool"
          fetchPriority="high"
          draggable={false}
        />
        <img
          className={`${styles.photo} ${styles.reveal}`}
          data-photo
          src="/assets/photos/me.webp"
          width={1020}
          height={1280}
          alt=""
          aria-hidden
          draggable={false}
        />
      </figure>
      <figcaption className={`${styles.meta} label-mono`} data-arch-meta aria-live="polite">
        <span>{revealed ? "Fig. 02 — After hours" : "Fig. 01 — Studio"}</span>
        <span className={styles.hint}>{revealed ? "Move away to return" : "Hover the frame"}</span>
      </figcaption>
    </div>
  );
}
