import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "../motion/gsap";
import { useMotion } from "../app/MotionProvider";
import styles from "./SecurityConsole.module.css";

const STEPS = [
  { key: "DETECT", text: "Watch SecurityScorecard for findings on public-facing web assets." },
  { key: "TRIAGE", text: "Trace each finding to the asset — and the owner — behind it." },
  { key: "FIX", text: "Remediate the configuration: TLS settings and security headers." },
  { key: "VERIFY", text: "Re-check and document each fix until the finding is resolved." },
];
const RUN_TIME = 2.4; // seconds a step "runs" in the auto loop

/**
 * The remediation loop as a retro terminal window. While on screen it runs
 * through the steps on its own; pointing at (or focusing) a step jumps to it.
 */
export function SecurityConsole() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [typed, setTyped] = useState(STEPS[0].text.length);
  const [auto, setAuto] = useState(true);
  const [inView, setInView] = useState(false);
  const { reduced } = useMotion();

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Auto loop: fill the active step, then move on.
  useEffect(() => {
    if (reduced || !auto || !inView) return;
    const state = { p: 0 };
    const tween = gsap.to(state, {
      p: 1,
      duration: RUN_TIME,
      ease: "power1.inOut",
      onUpdate: () => setProgress(state.p),
      onComplete: () => {
        setProgress(0);
        setActive((a) => (a + 1) % STEPS.length);
      },
    });
    return () => {
      tween.kill();
    };
  }, [active, auto, inView, reduced]);

  // Typewriter for the detail line.
  useEffect(() => {
    if (reduced) return;
    const full = STEPS[active].text.length;
    const state = { n: 0 };
    const tween = gsap.to(state, { n: full, duration: full * 0.018, ease: "none", onUpdate: () => setTyped(Math.round(state.n)) });
    return () => {
      tween.kill();
    };
  }, [active, reduced]);

  const pick = (i: number) => {
    setAuto(false);
    setActive(i);
    setProgress(1);
  };

  const fill = (i: number) => (i < active ? 1 : i === active ? (auto && !reduced ? progress : 1) : 0);
  const status = (i: number) => (i < active ? "done" : i === active ? (fill(i) >= 1 ? "done" : "running") : "queued");

  return (
    <div ref={root} className={styles.console} onPointerLeave={() => setAuto(true)}>
      <div className={styles.titleBar}>
        <span className={styles.controls} aria-hidden>
          <i className={styles.dot} />
          <i className={styles.square} />
          <i className={styles.diamond} />
        </span>
        <span className={`${styles.title} label-mono`}>posture.log — SecurityScorecard</span>
        <span className={`${styles.live} label-mono`} data-on={(inView && auto && !reduced) || undefined}>
          <i aria-hidden /> {auto && !reduced ? "Live" : "Paused"}
        </span>
      </div>

      <div className={styles.body}>
        <p className={styles.cmd} aria-hidden>
          <span className={styles.prompt}>$</span> posture --watch public-web --loop
        </p>
        <ol className={styles.steps} aria-label="Remediation loop">
          {STEPS.map((s, i) => (
            <li key={s.key}>
              <button
                type="button"
                className={styles.step}
                data-status={status(i)}
                data-active={i === active || undefined}
                aria-current={i === active ? "step" : undefined}
                aria-label={`${s.key}: ${s.text}`}
                onPointerEnter={(e) => e.pointerType === "mouse" && pick(i)}
                onFocus={() => pick(i)}
                onClick={() => pick(i)}
                style={{ "--p": fill(i) } as CSSProperties}
              >
                <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.key}>{s.key}</span>
                <span className={styles.bar} aria-hidden>
                  <span className={styles.barFill} />
                </span>
                <span className={styles.status}>{status(i)}</span>
              </button>
            </li>
          ))}
        </ol>
        <p className={styles.detail} aria-live="polite">
          <span className={styles.prompt}>&gt;</span> {reduced ? STEPS[active].text : STEPS[active].text.slice(0, typed)}
          <span className={styles.caret} aria-hidden />
        </p>
      </div>
    </div>
  );
}
