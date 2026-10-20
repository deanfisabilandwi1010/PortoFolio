import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "../motion/gsap";
import { MM } from "../motion/useMotionPreference";
import { stack, stackCategories, type StackCategory, type StackItem } from "../data/portfolio";
import { useReveal } from "../motion/useReveal";
import styles from "./TechStack.module.css";

type Filter = StackCategory | "all";

const categoryLabel = (id: StackCategory) => stackCategories.find((c) => c.id === id)?.label ?? id;

/**
 * The toolkit as a periodic table. Cells assemble as the section scrolls in;
 * hovering, focusing or tapping one element opens its card on the right
 * (where it was used, and for what). Filters dim the other disciplines.
 */
export function TechStack() {
  const root = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<StackItem | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  useReveal(root);

  // Elements assemble from scattered positions as the table scrolls in.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MM.motion, () => {
        // Animate the slots, not the cells: the cells' own transform belongs to the CSS hover.
        const cells = gsap.utils.toArray<HTMLElement>("[data-slot]", root.current);
        gsap.from(cells, {
          x: () => gsap.utils.random(-80, 80),
          y: () => gsap.utils.random(40, 140),
          rotate: () => gsap.utils.random(-14, 14),
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: { each: 0.03, from: "random" },
          scrollTrigger: { trigger: root.current?.querySelector("[data-table]"), start: "top 92%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // The detail card rolls its content in whenever the element changes.
  useEffect(() => {
    const el = panel.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(el.querySelectorAll("[data-roll]"), { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.45, stagger: 0.04, ease: "power3.out", overwrite: true });
  }, [active]);

  const counts = stackCategories.map((c) => ({ ...c, n: stack.filter((s) => s.category === c.id).length }));

  return (
    <section ref={root} id="stack" className={`${styles.section} shell`} aria-labelledby="stack-title">
      <div className={styles.head}>
        <p className={`${styles.kicker} label-mono`} data-reveal>
          (06) Toolkit
        </p>
        <h2 id="stack-title" className="section-title" data-reveal-lines>
          <span className="line-mask">
            <span>The tools behind</span>
          </span>
          <span className="line-mask">
            <span className="serif">the work.</span>
          </span>
        </h2>
        <p className={styles.note} data-reveal>
          No skill bars. Every element below links to something real — a live site, an internal system, or this page itself.
        </p>
      </div>

      <div className={styles.filters} role="toolbar" aria-label="Filter by discipline" data-reveal>
        <button type="button" className={styles.chip} aria-pressed={filter === "all"} onClick={() => setFilter("all")}>
          All <span className="label-mono">{stack.length}</span>
        </button>
        {counts.map((c) => (
          <button
            key={c.id}
            type="button"
            className={styles.chip}
            data-cat={c.id}
            aria-pressed={filter === c.id}
            onClick={() => setFilter((f) => (f === c.id ? "all" : c.id))}
          >
            <i className={styles.swatch} aria-hidden />
            {c.label} <span className="label-mono">{c.n}</span>
          </button>
        ))}
      </div>

      <div className={styles.body}>
        <ol className={styles.table} data-table aria-label="Tools">
          {stack.map((item, i) => {
            const dim = filter !== "all" && item.category !== filter;
            return (
              <li key={item.name} className={styles.slot} data-slot>
                <button
                  type="button"
                  className={styles.cell}
                  data-cell
                  data-cat={item.category}
                  data-active={active?.name === item.name || undefined}
                  data-dim={dim || undefined}
                  aria-pressed={active?.name === item.name}
                  aria-label={`${item.name} — ${categoryLabel(item.category)}`}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setActive(item)}
                  onFocus={() => setActive(item)}
                  onClick={() => setActive(item)}
                >
                  <span className={`${styles.num} label-mono`}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={styles.symbol}>{item.symbol}</span>
                  <span className={styles.name}>{item.name}</span>
                </button>
              </li>
            );
          })}
        </ol>

        <aside ref={panel} className={styles.panel} data-cat={active?.category} aria-live="polite">
          {active ? (
            <>
              <div className={styles.panelTop}>
                <span className={styles.bigSymbol} data-cat={active.category} data-roll>
                  {active.symbol}
                </span>
                <span className={`${styles.panelCat} label-mono`} data-roll>
                  {categoryLabel(active.category)}
                </span>
              </div>
              <h3 className={styles.panelName} data-roll>
                {active.name}
              </h3>
              <p className={styles.panelNote} data-roll>
                {active.note}
              </p>
              <p className={`${styles.usedLabel} label-mono`} data-roll>
                Used in
              </p>
              <ul className={styles.used} data-roll>
                {active.usedIn.map((u) => (
                  <li key={u}>{u}</li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <p className={`${styles.panelCat} label-mono`} data-roll>
                At a glance
              </p>
              <p className={styles.panelName} data-roll>
                {stack.length} tools, <span className="serif">{stackCategories.length} disciplines.</span>
              </p>
              <div className={styles.bar} data-roll aria-hidden>
                {counts.map((c) => (
                  <span key={c.id} data-cat={c.id} style={{ flexGrow: c.n }} />
                ))}
              </div>
              <ul className={styles.legend} data-roll>
                {counts.map((c) => (
                  <li key={c.id} data-cat={c.id}>
                    <i className={styles.swatch} aria-hidden />
                    {c.label}
                    <span className="label-mono">{c.n}</span>
                  </li>
                ))}
              </ul>
              <p className={`${styles.hint} label-mono`} data-roll>
                Point at an element to see where I used it
              </p>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}
