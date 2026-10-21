import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "../motion/gsap";
import { useMotion } from "../app/MotionProvider";
import { ArrowDown } from "../components/Icons";
import { goToDesktop } from "./desktopNav";
import { MonitorFrame, MonitorMini, PhoneFrame } from "./MonitorFrame";
import styles from "./DesktopScene.module.css";

const DesktopSurface = lazy(() => import("./DesktopSurface"));

/** Casing proportions relative to the measured screen width. */
const MONITOR = { side: 0.045, top: 0.045, bottom: 0.175 };
const PHONE = { side: 0.05, top: 0.17, bottom: 0.2 };

const DEVICE_MQ = {
  monitor: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
  phone: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
};

/** Timeline phases (fractions of the pinned scroll); desktopNav targets the middle of "full". */
const PHASE = { revealEnd: 0.24, fullEnd: 0.42, pullEnd: 0.86 } as const;

const STATEMENT = ["Step", "inside", "my"];

/**
 * Scale moment #2, in four phases:
 *  1. a blob grows from the bottom and reveals the desktop while a statement sharpens;
 *  2. the full-size desktop holds, live;
 *  3. the camera pulls back until the device (CRT on desktop, phone on phones) sits in the page;
 *  4. the pin releases and the device drifts up into Contact.
 * The desktop is interactive in every phase.
 */
export function DesktopScene() {
  const { windowed, reduced, scrollTo } = useMotion();
  const root = useRef<HTMLElement>(null);
  const [load, setLoad] = useState(() => window.location.hash === "#desktop");
  const scene = !reduced;
  const device = windowed ? "monitor" : "phone";

  // Fetch the desktop (and Draggable) about one viewport before it is needed.
  useEffect(() => {
    if (load || !root.current) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setLoad(true), { rootMargin: "120% 0px" });
    io.observe(root.current);
    return () => io.disconnect();
  }, [load]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(DEVICE_MQ, (ctx) => {
        const isPhone = !!ctx.conditions?.phone;
        const q = gsap.utils.selector(root);
        const [track] = q("[data-desktop-track]") as HTMLElement[];
        const [stage] = q("[data-desktop-stage]") as HTMLElement[];
        const [zoom] = q("[data-zoom]") as HTMLElement[];
        const [screen] = q("[data-screen]") as HTMLElement[];
        if (!track || !stage || !zoom || !screen) return;
        const casing = isPhone ? PHONE : MONITOR;

        // Measure the screen aperture, size the casing around it, and find the
        // pulled-back scale that shows the whole device.
        const measure = () => {
          const W = zoom.offsetWidth;
          const H = zoom.offsetHeight;
          const side = Math.round(W * casing.side);
          const top = Math.round(W * casing.top);
          const bottom = Math.round(W * casing.bottom);
          zoom.style.setProperty("--bz", `${side}px`);
          zoom.style.setProperty("--bz-top", `${top}px`);
          zoom.style.setProperty("--bz-bottom", `${bottom}px`);
          const stageW = stage.offsetWidth;
          const stageH = stage.offsetHeight;
          const s = isPhone
            ? Math.min((stageW * 0.66) / (W + side * 2), (stageH * 0.6) / (H + top + bottom))
            : Math.min((window.innerWidth * 0.5) / (W + side * 2), (stageH * 0.64) / (H + top + bottom));
          // Scale is about the screen centre; keep the whole device centred.
          const y = -((bottom - top) / 2) * s;
          return { s, y };
        };

        const { revealEnd, fullEnd, pullEnd } = PHASE;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: track,
            start: () => `top top+=${parseFloat(getComputedStyle(stage).top) || 0}`,
            end: "bottom bottom",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        // 1. Blob reveal + statement
        // The casing only exists for the pull-back; before that the blob grows over the page.
        tl.set(q("[data-device]"), { autoAlpha: 0 }, 0)
          .set(q("[data-device]"), { autoAlpha: 1 }, fullEnd)
          // Soft-edged bloom (a feathered radial mask) rising from the bottom edge.
          .fromTo(screen, { "--blob": "0px" }, { "--blob": () => `${Math.hypot(stage.offsetWidth, stage.offsetHeight) * 1.25}px`, duration: revealEnd, ease: "power2.in" }, 0)
          .fromTo(
            q("[data-statement-word]"),
            { autoAlpha: 0, filter: "blur(14px)", yPercent: 30 },
            { autoAlpha: 1, filter: "blur(0px)", yPercent: 0, duration: revealEnd * 0.45, stagger: revealEnd * 0.06, ease: "power2.out" },
            0,
          )
          .to(q("[data-statement]"), { autoAlpha: 0, filter: "blur(10px)", scale: 1.06, duration: revealEnd * 0.3, ease: "power1.in" }, revealEnd * 0.62)
          // 2. Full desktop holds (fullEnd − revealEnd)
          // 3. Pull back to the device
          .fromTo(
            zoom,
            { scale: 1, y: 0 },
            { scale: () => measure().s, y: () => measure().y, duration: pullEnd - fullEnd, ease: "power2.inOut", immediateRender: false },
            fullEnd,
          )
          .fromTo(q("[data-glare]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: (pullEnd - fullEnd) * 0.5, immediateRender: false }, fullEnd + (pullEnd - fullEnd) * 0.35)
          // 4. Hold, then the pin releases
          .to({}, { duration: 1 - pullEnd }, pullEnd);
        measure();

        return () => {
          for (const v of ["--bz", "--bz-top", "--bz-bottom"]) zoom.style.removeProperty(v);
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const sceneClass = scene ? (device === "monitor" ? styles.monitorScene : styles.phoneScene) : styles.flat;

  return (
    <section ref={root} id="desktop" className={`${styles.scene} ${sceneClass}`} aria-labelledby="desktop-title" data-scene={scene || undefined}>
      {!scene && (
        <div className={`${styles.intro} shell`}>
          <p className={`${styles.kicker} label-mono`}>(10) Personal desktop</p>
          <h2 id="desktop-title" className="section-title">
            Enter my <span className="serif">desktop.</span>
          </h2>
          <p className={styles.introText}>Old-school, but it works. Open files, flip through photos and notes, and visit both projects — all in here.</p>
          <button type="button" className="btn btn-primary" onClick={() => goToDesktop(scrollTo)} data-arrow="down">
            Open my desktop <ArrowDown />
          </button>
          {windowed && <MonitorMini />}
        </div>
      )}

      <div className={styles.track} data-desktop-track>
        <div className={styles.stage} data-desktop-stage>
          {scene && (
            <div className={styles.statement} data-statement>
              <p className={`${styles.kicker} label-mono`}>(10) Personal desktop</p>
              <h2 id="desktop-title" className={styles.statementTitle}>
                {STATEMENT.map((w) => (
                  <span key={w} className={styles.word} data-statement-word>
                    {w}
                  </span>
                ))}
                <span className={`${styles.word} serif`} data-statement-word>
                  desktop.
                </span>
              </h2>
              <p className={`${styles.statementSub} label-mono`} data-statement-word>
                Open files · drag windows · it stays clickable as you scroll
              </p>
            </div>
          )}
          <div className={styles.zoom} data-zoom>
            {scene && (device === "monitor" ? <MonitorFrame /> : <PhoneFrame />)}
            <div className={styles.screen} data-screen>
              {load ? (
                <Suspense fallback={<div className={styles.placeholder} />}>
                  <DesktopSurface windowed={windowed} reduced={reduced} />
                </Suspense>
              ) : (
                <div className={styles.placeholder} />
              )}
              {scene && <div className={styles.glare} data-glare aria-hidden />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
