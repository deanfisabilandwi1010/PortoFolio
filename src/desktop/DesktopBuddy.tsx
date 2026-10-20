import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useDesktop } from "./useWindowStore";
import styles from "./DesktopSurface.module.css";

const LINES = [
  "Hi! I'm the desktop's tiny monitor.",
  "Try opening Portrait.jpg →",
  "Drag a window by its title bar.",
  "Projects lives in the folder on the right.",
  "Psst — double-click a title bar to maximize.",
];

/** Small CRT mascot: a gentle idle loop that only runs while it is visible. */
export function DesktopBuddy({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLButtonElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [line, setLine] = useState<number | null>(null);
  const paused = useDesktop((s) => s.motionPaused);
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(() => document.visibilityState === "visible");

  useEffect(() => {
    if (reduced || !ref.current) return;
    const img = ref.current.querySelector("img");
    const t = gsap.timeline({ repeat: -1, yoyo: true, paused: true, defaults: { ease: "sine.inOut" } });
    t.fromTo(img, { y: 4, rotation: -2 }, { y: -4, rotation: 2, duration: 3 });
    tl.current = t;
    return () => {
      t.kill();
      tl.current = null;
    };
  }, [reduced]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    io.observe(el);
    const onVis = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  useEffect(() => {
    const t = tl.current;
    if (!t) return;
    if (inView && tabVisible && !paused) t.play();
    else t.pause();
  }, [inView, tabVisible, paused]);

  useEffect(() => {
    if (line === null) return;
    const id = window.setTimeout(() => setLine(null), 4200);
    return () => window.clearTimeout(id);
  }, [line]);

  return (
    <div className={styles.buddy}>
      <p className={styles.bubble} role="status" aria-live="polite" data-show={line !== null || undefined}>
        {line !== null ? LINES[line] : ""}
      </p>
      <button
        ref={ref}
        type="button"
        className={styles.buddyBtn}
        onClick={() => setLine((l) => (l === null ? 0 : (l + 1) % LINES.length))}
        aria-label="Say hi to the desktop buddy"
      >
        <img src="/assets/desktop/crt-buddy.webp" width={280} height={228} alt="" loading="lazy" />
      </button>
    </div>
  );
}
