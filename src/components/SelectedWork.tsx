import { useId, useRef, useState } from "react";
import { gsap, useGSAP } from "../motion/gsap";
import { MM } from "../motion/useMotionPreference";
import { projects, type Project } from "../data/portfolio";
import { useReveal } from "../motion/useReveal";
import { ArrowUpRight, GithubMark, Plus } from "./Icons";
import { useMotion } from "../app/MotionProvider";
import { WorkShowcase } from "./WorkShowcase";
import styles from "./SelectedWork.module.css";

/**
 * Desktop with motion: a pinned showcase (list + wiping images).
 * Phones and reduced motion: two large editorial blocks in normal flow.
 */
export function SelectedWork() {
  const { scenes } = useMotion();
  return scenes ? <WorkShowcase /> : <WorkEditorial />;
}

function WorkEditorial() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  // Screenshots drift inside their frames; the phone moves faster for depth.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MM.motion, () => {
        gsap.utils.toArray<HTMLElement>("[data-work-media]", root.current).forEach((media) => {
          const st = { trigger: media, start: "top bottom", end: "bottom top", scrub: 0.7 };
          gsap.fromTo(media.querySelector("[data-shot]"), { yPercent: -6, scale: 1.14 }, { yPercent: 6, scale: 1.14, ease: "none", scrollTrigger: st });
          gsap.fromTo(media.querySelector("[data-phone]"), { y: 90 }, { y: -70, ease: "none", scrollTrigger: st });
          gsap.fromTo(media, { clipPath: "inset(12% 6% 12% 6%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { ...st, end: "top 35%" } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="work" className={`${styles.work} shell`} aria-labelledby="work-title">
      <div className={styles.head}>
        <p className={`${styles.kicker} label-mono`} data-reveal>
          (07) Selected work
        </p>
        <h2 id="work-title" className="section-title" data-reveal-lines>
          <span className="line-mask">
            <span>
              Selected <span className="serif">work</span>
            </span>
          </span>
        </h2>
        <p className={`${styles.count} label-mono`} data-reveal>
          ({String(projects.length).padStart(2, "0")})
        </p>
      </div>
      {projects.map((p, i) => (
        <ProjectBlock key={p.id} project={p} flip={i % 2 === 1} />
      ))}
    </section>
  );
}

function ProjectBlock({ project: p, flip }: { project: Project; flip: boolean }) {
  const [open, setOpen] = useState(false);
  const detailsId = useId();

  return (
    <article id={`project-${p.id}`} className={`${styles.block} ${flip ? styles.flip : ""}`} aria-labelledby={`${p.id}-title`}>
      <div className={styles.titleRow} data-reveal>
        <span className={styles.index}>{p.index}</span>
        <h3 id={`${p.id}-title`} className={styles.title}>
          {p.title}
        </h3>
        <span className={`${styles.client} label`}>{p.client}</span>
      </div>

      <a href={p.liveUrl} target="_blank" rel="noreferrer" className={styles.media} data-work-media data-cursor="view" tabIndex={-1} aria-hidden>
        <span className={styles.shotFrame}>
        <img
          className={styles.desktopShot}
          data-shot
          src={p.preview}
          srcSet={`${p.previewSmall} 800w, ${p.preview} 1600w`}
          sizes="(min-width: 1024px) 64vw, 92vw"
          width={1600}
          height={1000}
          loading="lazy"
          alt=""
        />
        </span>
        <img className={styles.phoneShot} data-phone src={p.previewMobile} width={430} height={932} loading="lazy" alt="" />
      </a>

      <div className={styles.info} data-reveal>
        <p className={styles.summary}>{p.summary}</p>
        <dl className={styles.meta}>
          {p.year && (
            <div>
              <dt className="label-mono">Year</dt>
              <dd>{p.year}</dd>
            </div>
          )}
          {p.role && (
            <div>
              <dt className="label-mono">Role</dt>
              <dd>{p.role}</dd>
            </div>
          )}
          <div>
            <dt className="label-mono">Built with</dt>
            <dd>{p.stack.join(", ")}</dd>
          </div>
        </dl>
        <p className="sr-only">{p.previewAlt}</p>
        <div className={styles.actions}>
          <a href={p.liveUrl} target="_blank" rel="noreferrer" className="btn btn-primary" data-magnetic="0.3">
            Live website <ArrowUpRight />
            <span className="sr-only">: {p.title} (opens in a new tab)</span>
          </a>
          {p.githubUrl && (
            <a href={p.githubUrl} target="_blank" rel="noreferrer" className="btn btn-secondary" data-magnetic="0.3">
              <GithubMark /> View source
              <span className="sr-only">: {p.title} on GitHub (opens in a new tab)</span>
            </a>
          )}
        </div>
        <button
          type="button"
          className={styles.disclosure}
          aria-expanded={open}
          aria-controls={detailsId}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="label">{open ? "Hide details" : "Project details"}</span>
          <Plus className={styles.plus} />
        </button>
        <div id={detailsId} className={styles.details} hidden={!open}>
          <ul>
            {p.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
