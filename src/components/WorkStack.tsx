import { useId, useRef, useState } from "react";
import { gsap, useGSAP } from "../motion/gsap";
import { projects, type Project } from "../data/portfolio";
import { useReveal } from "../motion/useReveal";
import { ArrowUpRight, GithubMark, Plus } from "./Icons";
import styles from "./WorkStack.module.css";

/**
 * Phones & tablets: project cards stack as you scroll — each new card slides up
 * over the last, which sinks back. Inside, a Desktop / Phone switch flips the preview.
 */
export function WorkStack() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-stack-card]", root.current);

      // A card taller than the screen sticks by its bottom edge, so all of it can be
      // read before the next card slides over; shorter cards stick under the header.
      const placeSticky = () => {
        const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 64;
        cards.forEach((card, i) => {
          const fit = window.innerHeight - card.offsetHeight - 16;
          card.style.top = `${Math.min(header + 12 + i * 14, fit)}px`;
        });
      };
      placeSticky();
      const ro = new ResizeObserver(placeSticky);
      cards.forEach((c) => ro.observe(c));
      window.addEventListener("resize", placeSticky);

      cards.forEach((card, i) => {
        const next = cards[i + 1];
        const inner = card.querySelector("[data-card-inner]");
        // Arriving: the card rises like a page turning flat.
        gsap.fromTo(
          inner,
          { rotationX: 24, y: 80, transformPerspective: 1200, transformOrigin: "50% 100%" },
          { rotationX: 0, y: 0, ease: "power2.out", scrollTrigger: { trigger: card, start: "top bottom", end: "top 40%", scrub: 0.6 } },
        );
        // Being covered: the card tips back and steps away — no darkening.
        if (next) {
          gsap.to(inner, {
            rotationX: 8,
            scale: 0.88,
            y: -24,
            transformOrigin: "50% 0%",
            ease: "none",
            immediateRender: false,
            scrollTrigger: { trigger: next, start: "top bottom", end: "top top+=120", scrub: 0.5 },
          });
        }
        // Contents settle in one after another.
        const bits = card.querySelectorAll("[data-bit]");
        gsap.from(bits, { y: 24, autoAlpha: 0, duration: 0.6, stagger: 0.07, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 70%", once: true } });
        gsap.from(card.querySelectorAll("[data-chip]"), {
          scale: 0.4,
          autoAlpha: 0,
          duration: 0.45,
          stagger: 0.05,
          ease: "back.out(2.4)",
          scrollTrigger: { trigger: card.querySelector("[data-chips]"), start: "top 90%", once: true },
        });
        // the preview opens and drifts as the card arrives
        const frame = card.querySelector("[data-frame]");
        gsap.fromTo(frame, { clipPath: "inset(18% 10% 18% 10% round 14px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "top 30%", scrub: 0.6 } });
        gsap.fromTo(card.querySelector("[data-shot]"), { yPercent: -6 }, { yPercent: 4, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: 0.6 } });
      });
      return () => {
        ro.disconnect();
        window.removeEventListener("resize", placeSticky);
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} id="work" className={`${styles.section} shell`} aria-labelledby="work-title">
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
        <p className={styles.intro} data-reveal>
          {projects.length === 2 ? "Two" : projects.length === 3 ? "Three" : projects.length} live projects — designed, built and shipped. Flip each preview between desktop and phone.
        </p>
      </div>
      <div className={styles.cards}>
        {projects.map((p) => (
          <StackCard key={p.id} project={p} />
        ))}
      </div>
    </section>
  );
}

function StackCard({ project: p }: { project: Project }) {
  const card = useRef<HTMLElement>(null);
  const [view, setView] = useState<"desktop" | "phone">("desktop");
  const [open, setOpen] = useState(false);
  const detailsId = useId();

  // The card is found from the clicked button, so no ref is read outside an event.
  const flip = (to: "desktop" | "phone", from: HTMLElement) => {
    if (to === view) return;
    setView(to);
    const el = from.closest("[data-stack-card]");
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const incoming = el.querySelector(to === "phone" ? "[data-phone]" : "[data-shot-wrap]");
    const outgoing = el.querySelector(to === "phone" ? "[data-shot-wrap]" : "[data-phone]");
    gsap.fromTo(outgoing, { autoAlpha: 1, scale: 1, y: 0 }, { autoAlpha: 0, scale: 0.92, y: to === "phone" ? -20 : 20, duration: 0.35, ease: "power2.in" });
    gsap.fromTo(incoming, { autoAlpha: 0, scale: 0.9, y: to === "phone" ? 60 : -30 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.65, ease: "back.out(1.4)", delay: 0.15 });
  };

  return (
    <article
      ref={card}
      id={`project-${p.id}`}
      className={styles.card}
      data-stack-card
      aria-labelledby={`${p.id}-title`}
    >
      <div className={styles.inner} data-card-inner>
        <header className={styles.top}>
          <span className={`${styles.index} serif`}>{p.index}</span>
          <div>
            <h3 id={`${p.id}-title`} className={styles.title}>
              {p.title}
            </h3>
            <p className={`${styles.client} label-mono`}>{p.client}</p>
          </div>
        </header>

        <div className={styles.frame} data-frame data-view={view}>
          <div className={styles.shotWrap} data-shot-wrap>
            <img
              className={styles.shot}
              data-shot
              src={p.previewSmall}
              srcSet={`${p.previewSmall} 800w, ${p.preview} 1600w`}
              sizes="92vw"
              width={1600}
              height={1000}
              loading="lazy"
              alt={p.previewAlt}
            />
          </div>
          <div className={styles.phoneWrap} data-phone>
            <img className={styles.phone} src={p.previewMobile} width={430} height={932} loading="lazy" alt={`${p.title} on a phone`} />
          </div>
          <div className={styles.switch} role="group" aria-label="Preview">
            <span className={styles.pill} data-side={view} aria-hidden />
            <button type="button" aria-pressed={view === "desktop"} onClick={(e) => flip("desktop", e.currentTarget)}>
              Desktop
            </button>
            <button type="button" aria-pressed={view === "phone"} onClick={(e) => flip("phone", e.currentTarget)}>
              Phone
            </button>
          </div>
        </div>

        <p className={styles.summary} data-bit>
          {p.summary}
        </p>
        <ul className={styles.stack} aria-label="Built with" data-chips>
          {p.stack.map((s) => (
            <li key={s} data-chip>
              {s}
            </li>
          ))}
        </ul>
        <div className={styles.actions} data-bit>
          <a href={p.liveUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
            Live website <ArrowUpRight />
            <span className="sr-only">: {p.title} (opens in a new tab)</span>
          </a>
          {p.githubUrl && (
            <a href={p.githubUrl} target="_blank" rel="noreferrer" className="btn btn-secondary">
              <GithubMark /> Source
              <span className="sr-only">: {p.title} on GitHub (opens in a new tab)</span>
            </a>
          )}
        </div>
        <button type="button" className={styles.disclosure} aria-expanded={open} aria-controls={detailsId} onClick={() => setOpen((o) => !o)}>
          <span className="label">{open ? "Hide details" : "Project details"}</span>
          <Plus className={styles.plus} />
        </button>
        <ul id={detailsId} className={styles.details} hidden={!open}>
          {p.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
