import { useEffect, useRef, useState, type PointerEvent } from "react";
import { gsap, useGSAP } from "../motion/gsap";
import { MM } from "../motion/useMotionPreference";
import { experiments, type Experiment } from "../data/portfolio";
import { useReveal } from "../motion/useReveal";
import { useMotion } from "../app/MotionProvider";
import { ArrowUpRight, GithubMark } from "./Icons";
import styles from "./Experiments.module.css";

const pad = (n: number) => String(n).padStart(2, "0");
const ADVANCE_MS = 2600;

/**
 * Small side projects, styled as a dark lab bench rather than the editorial
 * Selected work: each one is a monitor you scrub through like a flipbook
 * (pointer across the screen, or the frame strip below), with a lab-log write-up.
 */
export function Experiments() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  // Each monitor powers on like a CRT as it scrolls in.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MM.motion, () => {
        gsap.utils.toArray<HTMLElement>("[data-screen]", root.current).forEach((screen) => {
          gsap.from(screen, {
            scaleY: 0.006,
            scaleX: 0.7,
            filter: "brightness(3)",
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: { trigger: screen, start: "top 82%", once: true },
          });
        });
        gsap.from(root.current?.querySelectorAll("[data-note]") ?? [], {
          x: -12,
          autoAlpha: 0,
          duration: 0.4,
          stagger: 0.07,
          ease: "power2.out",
          scrollTrigger: { trigger: root.current?.querySelector("[data-notes]"), start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="experiments" className={`${styles.section} on-dark`} aria-labelledby="experiments-title">
      <div className="shell">
        <header className={styles.head}>
          <p className={`${styles.kicker} label-mono`} data-reveal>
            (09) Experiments
          </p>
          <h2 id="experiments-title" className="section-title" data-reveal-lines>
            <span className="line-mask">
              <span>Small things,</span>
            </span>
            <span className="line-mask">
              <span className="serif">built to find out.</span>
            </span>
          </h2>
          <p className={styles.intro} data-reveal>
            Side projects that start with a question and get built to answer it. Move across a screen to flip through it.
          </p>
          <p className={`${styles.count} label-mono`} data-reveal>
            <i className={styles.recDot} aria-hidden /> {pad(experiments.length)} in the lab
          </p>
        </header>
        {experiments.map((exp) => (
          <Specimen key={exp.id} exp={exp} />
        ))}
      </div>
    </section>
  );
}

function Specimen({ exp }: { exp: Experiment }) {
  const { reduced } = useMotion();
  const [frame, setFrame] = useState(0);
  const [inView, setInView] = useState(false);
  const [held, setHeld] = useState(false); // pointer is scrubbing: auto-advance waits
  const [picked, setPicked] = useState(false); // a frame was chosen by hand: it stays until the bench leaves the screen
  const screen = useRef<HTMLSpanElement>(null);
  const bench = useRef<HTMLDivElement>(null);
  const n = exp.frames.length;

  useEffect(() => {
    const el = bench.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        if (!e.isIntersecting) setPicked(false);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Plays on its own while on screen and nobody is scrubbing.
  useEffect(() => {
    if (!inView || held || picked || reduced) return;
    const id = window.setInterval(() => setFrame((f) => (f + 1) % n), ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [inView, held, picked, reduced, n]);

  // A short RGB-split glitch on every frame change.
  useEffect(() => {
    const el = screen.current;
    if (!el || reduced) return;
    el.removeAttribute("data-glitch");
    void el.offsetWidth; // restart the animation
    el.setAttribute("data-glitch", "");
  }, [frame, reduced]);

  const scrub = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const i = Math.min(n - 1, Math.max(0, Math.floor(((e.clientX - r.left) / r.width) * n)));
    setHeld(true);
    setFrame((f) => (f === i ? f : i));
  };

  return (
    <article className={styles.specimen} aria-labelledby={`${exp.id}-title`}>
      <div ref={bench} className={styles.bench} data-reveal>
        <a
          href={exp.liveUrl}
          target="_blank"
          rel="noreferrer"
          className={styles.monitor}
          data-cursor="view"
          tabIndex={-1}
          aria-hidden
          onPointerMove={scrub}
          onPointerLeave={() => setHeld(false)}
        >
          <span ref={screen} className={styles.screen} data-screen>
            {exp.frames.map((f, i) => (
              <img
                key={f.src}
                src={f.src}
                srcSet={`${f.sm} 640w, ${f.src} 1200w`}
                sizes="(min-width: 1024px) 56vw, 92vw"
                width={1200}
                height={750}
                loading="lazy"
                alt=""
                data-on={i === frame || undefined}
              />
            ))}
            <span className={styles.scan} />
          </span>
          <span className={styles.hud}>
            <span className={styles.bracket} data-pos="tl" />
            <span className={styles.bracket} data-pos="tr" />
            <span className={styles.bracket} data-pos="bl" />
            <span className={styles.bracket} data-pos="br" />
            <span className={`${styles.hudTag} label-mono`} data-pos="tl">
              {exp.code}
            </span>
            <span className={`${styles.hudTag} label-mono`} data-pos="tr">
              <i className={styles.recDot} /> Rec
            </span>
            <span className={`${styles.hudTag} label-mono`} data-pos="bl">
              Frame {pad(frame + 1)}/{pad(n)}
            </span>
            <span className={`${styles.hudTag} label-mono`} data-pos="br">
              <span className={styles.hintPointer}>← move to scrub →</span>
              <span className={styles.hintTouch}>Tap a frame below</span>
            </span>
          </span>
        </a>

        <figure className={styles.phone}>
          <img src={exp.mobile} width={430} height={932} loading="lazy" alt={exp.mobileAlt} />
          <figcaption className="label-mono">On a phone</figcaption>
        </figure>

        <div className={styles.strip} role="group" aria-label={`${exp.title}: frames`}>
          {exp.frames.map((f, i) => (
            <button
              key={f.src}
              type="button"
              className={styles.thumb}
              aria-pressed={i === frame}
              aria-label={`Frame ${i + 1} of ${n}: ${f.alt}`}
              onClick={() => {
                setPicked(true);
                setFrame(i);
              }}
            >
              <img src={f.sm} width={640} height={400} loading="lazy" alt="" />
              {/* fills while the frame is on screen, so the auto-advance reads as a timeline */}
              <span
                className={styles.progress}
                data-run={(i === frame && inView && !held && !picked && !reduced) || undefined}
                style={{ animationDuration: `${ADVANCE_MS}ms` }}
              />
            </button>
          ))}
        </div>
      </div>

      <div className={styles.log}>
        <p className={`${styles.meta} label-mono`} data-reveal>
          <span>{exp.code}</span>
          {exp.year && <span>{exp.year}</span>}
          <span className={styles.live}>
            <i className={styles.liveDot} aria-hidden /> Live
          </span>
        </p>
        <h3 id={`${exp.id}-title`} className={styles.title} data-reveal>
          {exp.title}
        </h3>
        <p className={`${styles.tagline} serif`} data-reveal>
          {exp.tagline}
        </p>
        <p className={styles.summary} data-reveal>
          {exp.summary}
        </p>
        <ol className={styles.notes} data-notes aria-label="What to look for">
          {exp.notes.map((note, i) => (
            <li key={note} data-note>
              <span className="label-mono">{pad(i + 1)}</span>
              {note}
            </li>
          ))}
        </ol>
        <ul className={styles.stack} aria-label="Built with" data-reveal>
          {exp.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <div className={styles.actions} data-reveal>
          <a href={exp.liveUrl} target="_blank" rel="noreferrer" className="btn btn-on-dark" data-magnetic="0.3">
            Open experiment <ArrowUpRight />
            <span className="sr-only">: {exp.title} (opens in a new tab)</span>
          </a>
          {exp.githubUrl && (
            <a href={exp.githubUrl} target="_blank" rel="noreferrer" className={`btn ${styles.ghost}`} data-magnetic="0.3">
              <GithubMark /> Source
              <span className="sr-only">: {exp.title} on GitHub (opens in a new tab)</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
