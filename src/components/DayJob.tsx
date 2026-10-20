import { useEffect, useRef, type CSSProperties } from "react";
import { dutyAreas, profile } from "../data/portfolio";
import { useReveal } from "../motion/useReveal";
import { ScrubWords } from "./ScrubWords";
import { AppTiles } from "./AppTiles";
import { gsap, useGSAP } from "../motion/gsap";
import { MM } from "../motion/useMotionPreference";
import styles from "./DayJob.module.css";

const LOOP = ["Detect", "Triage", "Fix", "Verify"];
const PIPELINE = ["Request", "Build", "Deploy", "Support"];
const idx = (i: number) => ({ "--i": i }) as CSSProperties;

/** What Dean does at PLN Nusa Daya, beyond the personal projects. */
export function DayJob() {
  const root = useRef<HTMLElement>(null);
  const radar = useRef<HTMLDivElement>(null);
  useReveal(root);

  // The mist panel opens from an inset card to full bleed as it scrolls in.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MM.motion, () => {
        gsap.fromTo(
          root.current,
          { clipPath: "inset(0% 5% 0% 5% round 40px)" },
          { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 25%", scrub: 0.6 } },
        );
        const tiles = gsap.utils.toArray<HTMLElement>("[data-app-tile]", root.current);
        gsap.from(tiles, {
          y: 18,
          autoAlpha: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: tiles[0], start: "top 88%", once: true },
        });
        gsap.utils.toArray<HTMLElement>("[data-file-letter]", root.current).forEach((el) => {
          gsap.fromTo(el, { yPercent: 40, rotate: -8 }, { yPercent: -20, rotate: 4, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.8 } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // The sweep is a CSS loop: run it only while it is on screen.
  useEffect(() => {
    const el = radar.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => el.toggleAttribute("data-running", entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const [apps, security] = dutyAreas;

  return (
    <section ref={root} id="day-job" className={styles.section} aria-labelledby="dayjob-title">
      <div className="shell">
        <div className={styles.head}>
          <p className={`${styles.kicker} label-mono`} data-reveal>
            (04) Day job — {profile.company}
          </p>
          <h2 id="dayjob-title" className="section-title" data-reveal-lines>
            <span className="line-mask">
              <span>The work nobody sees,</span>
            </span>
            <span className="line-mask">
              <span className="serif">until it matters.</span>
            </span>
          </h2>
          <div className={styles.intro} data-reveal>
            <img src="/assets/logos/pln-nusa-daya.webp" alt="PLN Nusa Daya logo" width={538} height={160} loading="lazy" />
            <ScrubWords
              text={`Alongside the websites I build, my role as a ${profile.role.toLowerCase()} at ${profile.company} sits behind the login screen: the applications colleagues use every day, and the security of what the public can reach.`}
            />
          </div>
        </div>

        <div className={styles.files}>
          <article className={`${styles.file} ${styles.light}`} data-reveal>
            <header className={styles.fileHead}>
              <span className={styles.letter} aria-hidden data-file-letter>
                {apps.index}
              </span>
              <span className="label-mono">File {apps.index} — ongoing</span>
            </header>
            <h3 className={styles.fileTitle}>
              {apps.title} <span className="serif">{apps.italic}</span>
            </h3>
            <p className={styles.summary}>{apps.summary}</p>
            {apps.apps && <AppTiles apps={apps.apps} />}
            <ul className={styles.points}>
              {apps.points.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
            <div className={styles.pipeline} aria-hidden>
              {PIPELINE.map((s, i) => (
                <span key={s} style={idx(i)}>
                  {s}
                </span>
              ))}
            </div>
            <ul className={styles.tags} aria-label="Tools">
              {apps.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </article>

          <article className={`${styles.file} ${styles.dark} on-dark`} data-reveal data-reveal-delay="0.08">
            <header className={styles.fileHead}>
              <span className={styles.letter} aria-hidden data-file-letter>
                {security.index}
              </span>
              <span className="label-mono">File {security.index} — ongoing</span>
            </header>
            <h3 className={styles.fileTitle}>
              {security.title} <span className="serif">{security.italic}</span>
            </h3>
            <p className={styles.summary}>{security.summary}</p>
            <div className={styles.loopWrap}>
              <div ref={radar} className={styles.radar} aria-hidden>
                <span className={styles.ring} />
                <span className={styles.ring} />
                <span className={styles.ring} />
                <span className={styles.sweep} />
                {LOOP.map((step, i) => (
                  <span key={step} className={styles.node} data-n={i}>
                    <b>{String(i + 1).padStart(2, "0")}</b> {step}
                  </span>
                ))}
              </div>
              <ol className={styles.points}>
                {security.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ol>
            </div>
            <ul className={styles.tags} aria-label="Focus areas">
              {security.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
