import { Fragment, useMemo, useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "../motion/gsap";
import { MM } from "../motion/useMotionPreference";
import { interests, type Interest } from "../data/portfolio";
import styles from "./Interests.module.css";

/** "*word*" → italic serif span. */
function rich(text: string): ReactNode {
  return text.split(/(\*[^*]+\*)/).map((part, i) =>
    part.startsWith("*") ? (
      <em key={i} className="serif">
        {part.slice(1, -1)}
      </em>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

/** A deterministic barcode from the ticket code. */
function Barcode({ seed }: { seed: string }) {
  const bars = useMemo(() => {
    let h = 2166136261;
    for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
    const out: { x: number; w: number }[] = [];
    let x = 0;
    while (x < 200) {
      h = Math.imul(h ^ (h >>> 13), 1274126177);
      const w = 1 + (Math.abs(h) % 4);
      const gap = 1 + (Math.abs(h >> 4) % 3);
      if (x + w > 200) break;
      out.push({ x, w });
      x += w + gap;
    }
    return out;
  }, [seed]);
  return (
    <svg className={styles.barcode} viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden>
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y="0" width={b.w} height="40" />
      ))}
    </svg>
  );
}

function Ticket({ item, index }: { item: Interest; index: number }) {
  return (
    <li className={styles.slot} data-ticket-slot>
      <article className={styles.ticket} data-ticket aria-labelledby={`interest-${index}`} tabIndex={0}>
        <div className={styles.body}>
          <h3 id={`interest-${index}`} className={`${styles.title} serif`}>
            {item.title}
          </h3>
          <p className={styles.why}>{rich(item.why)}</p>
          <ul className={styles.focus}>
            {item.focus.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
        <div className={styles.stub} data-stub>
          <p className={`${styles.stubRow} label-mono`}>
            <span>Interest no.</span>
            <span className={styles.stubNum}>{String(index + 1).padStart(2, "0")}</span>
          </p>
          <Barcode seed={item.code} />
          <p className={`${styles.stubRow} label-mono`}>
            <span>{item.stamp}</span>
            <span className={styles.code}>{item.code}</span>
          </p>
        </div>
      </article>
    </li>
  );
}

/**
 * What I'm into, as three tickets. On desktop the section pins: a soft bloom rises,
 * a statement sharpens out of blur, then the tickets are dealt onto the table.
 * Hovering a ticket tilts it toward the cursor and tears its stub a little.
 */
export function Interests() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      // Desktop: one pinned scene.
      mm.add(MM.scenes, () => {
        const [track] = q("[data-track]") as HTMLElement[];
        const slots = q("[data-ticket-slot]") as HTMLElement[];
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: track, start: "top top+=64", end: "bottom bottom", scrub: 0.8, invalidateOnRefresh: true },
        });
        tl.fromTo(q("[data-bloom]"), { scale: 0.15, yPercent: 40, autoAlpha: 0.4 }, { scale: 1, yPercent: 0, autoAlpha: 1, duration: 0.3, ease: "power2.out" }, 0)
          .fromTo(q("[data-word]"), { autoAlpha: 0, filter: "blur(16px)", yPercent: 30 }, { autoAlpha: 1, filter: "blur(0px)", yPercent: 0, duration: 0.14, stagger: 0.025, ease: "power2.out" }, 0.04)
          .to(q("[data-statement]"), { autoAlpha: 0, filter: "blur(12px)", scale: 1.08, duration: 0.1, ease: "power1.in" }, 0.32)
          .fromTo(q("[data-deck-head]"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.08, ease: "power2.out" }, 0.38);
        slots.forEach((slot, i) => {
          const side = i - (slots.length - 1) / 2;
          tl.fromTo(
            slot,
            { yPercent: 230, xPercent: -side * 40, rotate: side * 18 + (i % 2 ? 8 : -8), autoAlpha: 1 },
            { yPercent: 0, xPercent: 0, rotate: 0, duration: 0.18, ease: "power3.out" },
            0.42 + i * 0.08,
          );
        });
        tl.fromTo(q("[data-footnote]"), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.08 }, 0.72).to({}, { duration: 0.2 });
      });

      // Phones & tablets: no pin — the statement sharpens, each ticket lands as it scrolls in.
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          q("[data-word]"),
          { autoAlpha: 0, filter: "blur(10px)", yPercent: 30 },
          { autoAlpha: 1, filter: "blur(0px)", yPercent: 0, stagger: 0.06, ease: "power2.out", scrollTrigger: { trigger: q("[data-statement]")[0], start: "top 85%", end: "top 45%", scrub: 0.6 } },
        );
        (q("[data-ticket-slot]") as HTMLElement[]).forEach((slot, i) => {
          gsap.fromTo(
            slot,
            { y: 120, rotate: i % 2 ? 7 : -7, autoAlpha: 0 },
            { y: 0, rotate: 0, autoAlpha: 1, ease: "power3.out", scrollTrigger: { trigger: slot, start: "top 98%", end: "top 60%", scrub: 0.6 } },
          );
        });
      });

      // Pointer: tilt toward the cursor (the stub tear is CSS).
      mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const tickets = q("[data-ticket]") as HTMLElement[];
        const off = tickets.map((t) => {
          const rx = gsap.quickTo(t, "rotationX", { duration: 0.5, ease: "power3.out" });
          const ry = gsap.quickTo(t, "rotationY", { duration: 0.5, ease: "power3.out" });
          const move = (e: PointerEvent) => {
            const r = t.getBoundingClientRect();
            ry(((e.clientX - r.left) / r.width - 0.5) * 12);
            rx(-((e.clientY - r.top) / r.height - 0.5) * 9);
          };
          const leave = () => {
            rx(0);
            ry(0);
          };
          t.addEventListener("pointermove", move);
          t.addEventListener("pointerleave", leave);
          return () => {
            t.removeEventListener("pointermove", move);
            t.removeEventListener("pointerleave", leave);
          };
        });
        return () => off.forEach((f) => f());
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const statement = ["Three", "things", "I", "could", "build"];

  return (
    <section ref={root} id="interests" className={styles.section} aria-labelledby="interests-title">
      <div className={styles.track} data-track>
        <div className={styles.stage}>
          <div className={styles.bloom} data-bloom aria-hidden />

          <div className={styles.statement} data-statement>
            <p className={`${styles.kicker} label-mono`}>(07) Interests</p>
            <p className={styles.statementText} aria-hidden>
              {statement.map((w) => (
                <span key={w} className={styles.word} data-word>
                  {w}
                </span>
              ))}
              <span className={`${styles.word} serif`} data-word>
                all day.
              </span>
            </p>
          </div>

          <div className={styles.deck}>
            <div className={styles.deckHead} data-deck-head>
              <h2 id="interests-title" className={`${styles.pill} serif`}>
                Interested in
              </h2>
              <span className="sr-only">: three things I could build all day.</span>
            </div>
            <ol className={styles.tickets}>
              {interests.map((item, i) => (
                <Ticket key={item.code} item={item} index={i} />
              ))}
            </ol>
            <p className={styles.footnote} data-footnote>
              <em className="serif">One standard for all three.</em>
              <br />
              Whatever I build is responsive, accessible, fast and tested on real devices — and written so the next person can read it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
