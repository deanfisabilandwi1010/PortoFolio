import { useRef, useState } from "react";
import { gsap, useGSAP } from "../motion/gsap";
import { projects } from "../data/portfolio";
import { ArrowUpRight, GithubMark } from "./Icons";
import styles from "./WorkShowcase.module.css";

/**
 * Pinned showcase. The list on the left tracks the active project; on the right
 * each project's image wipes up over the previous one as the visitor scrolls.
 */
export function WorkShowcase() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const n = projects.length;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const slides = q("[data-slide]") as HTMLElement[];
      let current = 0;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top+=64",
          end: () => `+=${(n - 1) * 110 + 50}%`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate(self) {
            const next = Math.min(n - 1, Math.floor(self.progress * (n - 0.0001) + 0.15));
            if (next !== current) {
              current = next;
              setActive(next);
            }
          },
        },
      });
      // Hold on the first project, then wipe each next one up over the last.
      tl.to({}, { duration: 0.3 });
      slides.slice(1).forEach((slide, i) => {
        const prev = slides[i];
        tl.fromTo(slide, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power2.inOut" })
          .fromTo(slide.querySelector("[data-slide-shot]"), { yPercent: 18, scale: 1.08 }, { yPercent: 0, scale: 1, duration: 1, ease: "power2.out" }, "<")
          .fromTo(prev, { scale: 1, filter: "brightness(1)" }, { scale: 0.9, filter: "brightness(0.8)", duration: 1, ease: "power2.inOut" }, "<")
          .to({}, { duration: 0.4 });
      });
      tl.fromTo(q("[data-progress-bar]"), { scaleY: 1 / n }, { scaleY: 1, duration: tl.duration(), ease: "none" }, 0);
      // Shots drift inside their frames for depth.
      tl.fromTo(q("[data-slide-phone]"), { y: 60 }, { y: -60, duration: tl.duration() }, 0);
    },
    { scope: root },
  );

  const p = projects[active];

  return (
    <section ref={root} id="work" className={`${styles.showcase} shell`} aria-labelledby="work-title">
      <div className={styles.left}>
        <p className={`${styles.kicker} label-mono`}>(07) Selected work</p>
        <h2 id="work-title" className={styles.title}>
          Selected <span className="serif">work</span>
        </h2>
        <p className={styles.intro}>Two live websites — designed, built and shipped. Scroll to flip through them.</p>

        <div className={styles.listWrap}>
          <span className={styles.progress} aria-hidden>
            <span data-progress-bar />
          </span>
          <ol className={styles.list}>
            {projects.map((proj, i) => (
              <li key={proj.id} className={i === active ? styles.on : undefined} aria-current={i === active ? "true" : undefined}>
                <span className="label-mono">{proj.index}.</span>
                <span className={styles.name}>{proj.title}</span>
                <span className={`${styles.tags} label-mono`}>{proj.stack.slice(0, 3).join(", ")}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.details}>
          {projects.map((proj, i) => (
            <article
              key={proj.id}
              id={`project-${proj.id}`}
              className={styles.detail}
              data-active={i === active || undefined}
              aria-hidden={i !== active}
              inert={i !== active}
              aria-labelledby={`${proj.id}-title`}
            >
              <h3 id={`${proj.id}-title`} className="sr-only">
                {proj.title} — {proj.client}
              </h3>
              <p className={styles.summary}>{proj.summary}</p>
              <ul className={styles.highlights}>
                {proj.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              <div className={styles.actions}>
                <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="btn btn-primary" data-magnetic="0.3">
                  Live website <ArrowUpRight />
                  <span className="sr-only">: {proj.title} (opens in a new tab)</span>
                </a>
                {proj.githubUrl && (
                  <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="btn btn-secondary" data-magnetic="0.3">
                    <GithubMark /> View source
                    <span className="sr-only">: {proj.title} on GitHub (opens in a new tab)</span>
                  </a>
                )}
              </div>
              <p className={`${styles.meta} label-mono`}>
                {proj.client}
                {proj.year ? ` · ${proj.year}` : ""} · {proj.stack.join(" · ")}
              </p>
            </article>
          ))}
        </div>
      </div>

      <div className={styles.right}>
        {projects.map((proj) => (
          <div key={proj.id} className={styles.slide} data-slide>
            <img
              className={styles.shot}
              data-slide-shot
              src={proj.preview}
              srcSet={`${proj.previewSmall} 800w, ${proj.preview} 1600w`}
              sizes="58vw"
              width={1600}
              height={1000}
              alt={proj.previewAlt}
              loading="lazy"
            />
            <img className={styles.phone} data-slide-phone src={proj.previewMobile} width={430} height={932} alt="" loading="lazy" />
            <span className={`${styles.slideLabel} label-mono`} aria-hidden>
              {proj.index} — {new URL(proj.liveUrl).host}
            </span>
          </div>
        ))}
        <a href={p.liveUrl} target="_blank" rel="noreferrer" className={styles.badge} data-cursor="view" data-magnetic="0.4">
          <svg viewBox="0 0 120 120" aria-hidden>
            <defs>
              <path id="badge-ring" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" />
            </defs>
            <text>
              <textPath href="#badge-ring">VIEW LIVE SITE ✦ VIEW LIVE SITE ✦ </textPath>
            </text>
          </svg>
          <span className={styles.badgeCore}>
            <ArrowUpRight />
          </span>
          <span className="sr-only">Open {p.title} live website (new tab)</span>
        </a>
      </div>
    </section>
  );
}
