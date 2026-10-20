import { useRef } from "react";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { gsap, useGSAP } from "../motion/gsap";
import { MM } from "../motion/useMotionPreference";
import { processSteps } from "../data/portfolio";
import { useReveal } from "../motion/useReveal";
import styles from "./Process.module.css";

gsap.registerPlugin(MorphSVGPlugin);

const SHAPES = ["circle", "diamond", "square", "half"] as const;

/** A rough hexagon that rolls itself round. */
const HEXAGON = "M50 2 L91.6 26 L91.6 74 L50 98 L8.4 74 L8.4 26 Z";
const CIRCLE = "M50 2 A48 48 0 1 1 49.99 2 Z";
/** The road under each card: bumpy, then flattened once the wheel has passed. */
const BUMPY = "M0 10 C 12.5 1, 37.5 1, 50 10 S 87.5 19, 100 10 S 137.5 1, 150 10 S 187.5 19, 200 10";
const FLAT = "M0 10 C 12.5 10, 37.5 10, 50 10 S 87.5 10, 100 10 S 137.5 10, 150 10 S 187.5 10, 200 10";

export function Process() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop: the section pins. Cards rise like a bar chart while a rough hexagon
      // rolls across them, bumping along, and gradually becomes a smooth wheel.
      // Each card's road flattens once the wheel has passed over it.
      mm.add(MM.scenes, () => {
        const q = gsap.utils.selector(root);
        const [grid] = q("[data-process-grid]") as HTMLElement[];
        const [wheel] = q("[data-wheel]") as HTMLElement[];
        const cards = q("[data-process-card]") as HTMLElement[];
        if (!grid || !wheel) return;
        const n = cards.length;
        const roll = { p: 0 };

        const placeWheel = () => {
          const size = wheel.offsetWidth;
          const x = roll.p * (grid.offsetWidth - size);
          const turn = x / (size / 2); // radians rolled
          const bump = (size / 2) * 0.134 * (1 - roll.p) * Math.abs(Math.sin(turn * 3));
          gsap.set(wheel, { x, y: -bump, rotate: (turn * 180) / Math.PI });
        };

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "bottom bottom-=24",
            end: "+=170%",
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
        tl.to(roll, { p: 1, duration: 1, onUpdate: placeWheel }, 0).to(q("[data-wheel-shape]"), { morphSVG: CIRCLE, duration: 0.9 }, 0);
        cards.forEach((card, i) => {
          const reach = (i + 0.5) / n;
          tl.fromTo(card, { yPercent: 34 + i * 11 }, { yPercent: 0, duration: 0.2, ease: "power2.out" }, Math.max(0, reach - 0.24))
            .to(card.querySelector("[data-road]"), { attr: { d: FLAT }, duration: 0.12, ease: "power1.out" }, reach - 0.02)
            .fromTo(card.querySelector("[data-process-shape]"), { rotate: 0, scale: 1 }, { rotate: 180, scale: 1.35, duration: 0.08, ease: "power2.out" }, reach - 0.04)
            .to(card.querySelector("[data-process-shape]"), { scale: 1, duration: 0.06 }, ">");
        });
        placeWheel();
      });

      // Phones & tablets: the section pins and the cards slide sideways as you scroll,
      // with the same wheel rolling (and rounding) across the screen.
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        const [stage] = q("[data-process-stage]") as HTMLElement[];
        const [grid] = q("[data-process-grid]") as HTMLElement[];
        const [wheel] = q("[data-wheel]") as HTMLElement[];
        const cards = q("[data-process-card]") as HTMLElement[];
        if (!stage || !grid || !wheel) return;
        const n = cards.length;
        const roll = { p: 0 };
        // The wheel rides inside the visible card area: from just inside the first card's
        // left edge to just inside the right edge of the screen (never in the gutter).
        const placeWheel = () => {
          const size = wheel.offsetWidth;
          const pad = parseFloat(getComputedStyle(stage).paddingLeft) || 0;
          const start = pad + 18;
          const end = stage.offsetWidth - pad - size - 18;
          const x = start + roll.p * (end - start);
          const turn = (x - start) / (size / 2);
          const bump = (size / 2) * 0.134 * (1 - roll.p) * Math.abs(Math.sin(turn * 3));
          gsap.set(wheel, { x, y: -bump, rotate: (turn * 180) / Math.PI });
        };
        const travel = () => -(grid.scrollWidth - stage.offsetWidth);
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            // Only the card row pins (the heading scrolls away normally), centred under the header.
            trigger: stage,
            pin: stage,
            start: "center center+=32",
            end: () => `+=${Math.abs(travel()) + window.innerHeight * 0.4}`,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        // It only appears once the row has locked in place: pops in, then starts rolling.
        tl.fromTo(wheel, { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1, duration: 0.06, ease: "back.out(2)" }, 0)
          .to(grid, { x: travel, duration: 1 }, 0)
          .to(roll, { p: 1, duration: 1, onUpdate: placeWheel }, 0)
          .to(q("[data-wheel-shape]"), { morphSVG: CIRCLE, duration: 0.95 }, 0);
        cards.forEach((card, i) => {
          const reach = n > 1 ? i / (n - 1) : 0;
          tl.to(card.querySelector("[data-road]"), { attr: { d: FLAT }, duration: 0.12, ease: "power1.out" }, Math.max(0, reach - 0.06))
            .fromTo(card.querySelector("[data-process-shape]"), { rotate: 0, scale: 1 }, { rotate: 180, scale: 1.35, duration: 0.08, ease: "power2.out" }, Math.max(0, reach - 0.08))
            .to(card.querySelector("[data-process-shape]"), { scale: 1, duration: 0.06 }, ">");
        });
        placeWheel();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="process" className={`${styles.process} shell`} aria-labelledby="process-title">
      <div className={styles.head}>
        <p className={`${styles.kicker} label-mono`} data-reveal>
          (05) How I work
        </p>
        <h2 id="process-title" className="section-title" data-reveal-lines>
          <span className="line-mask">
            <span>Four steps,</span>
          </span>
          <span className="line-mask">
            <span className="serif">no shortcuts.</span>
          </span>
        </h2>
        <p className={styles.note} data-reveal>
          Every project starts a little <em className="serif">rough</em>. The process is what makes it <em className="serif">roll</em> — whether it is an
          internal tool or a landing page for a café.
        </p>
      </div>
      <div className={styles.stage} data-process-stage>
        <div className={styles.wheel} data-wheel aria-hidden>
          <svg viewBox="0 0 100 100">
            <path className={styles.rimUnder} d={HEXAGON} data-wheel-shape />
            <path className={styles.rim} d={HEXAGON} data-wheel-shape />
            <path className={styles.spokes} d="M50 8v84M8 50h84M20 20l60 60M80 20 20 80" />
            <circle cx="50" cy="50" r="4.5" className={styles.hub} />
          </svg>
        </div>
        <ol className={styles.cards} data-process-grid>
          {processSteps.map((s, i) => (
            <li key={s.index} className={`${styles.card} on-dark`} data-process-card>
              <span className={styles.track} aria-hidden />
              <svg className={styles.road} viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden>
                <path d={BUMPY} data-road />
              </svg>
              <div className={styles.cardTop}>
                <span className="label-mono">{s.index}</span>
                <span className={`${styles.shape} ${styles[SHAPES[i]]}`} data-process-shape aria-hidden />
              </div>
              <h3 className={styles.cardTitle}>
                {s.title} <span className="serif">{s.italic}</span>
              </h3>
              <p className={styles.cardBody}>{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
