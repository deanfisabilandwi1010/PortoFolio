import { useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "../motion/gsap";
import { navLinks, profile } from "../data/portfolio";
import { useMotion } from "../app/MotionProvider";
import { Clock } from "./Clock";
import { RollLink } from "./RollLink";
import styles from "./Header.module.css";

/** Compact header that takes over once the giant wordmark has scrolled away. */
export function Header() {
  const ref = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const { reduced } = useMotion();

  // Which section is being read: each nav section spans until the next one starts (page order).
  useGSAP(
    () => {
      const ids = ["#about", "#stack", "#work", "#experiments", "#desktop", "#contact"];
      const els = ids.map((id) => document.querySelector<HTMLElement>(id));
      const footer = document.querySelector("footer");
      els.forEach((el, i) => {
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top center",
          endTrigger: els[i + 1] ?? footer ?? el,
          end: els[i + 1] ? "top center" : "bottom bottom",
          // Created before the pinned sections: measure after them so pin spacing is counted.
          refreshPriority: -10,
          onToggle: (self) => {
            if (self.isActive) setActive(ids[i]);
            else setActive((cur) => (cur === ids[i] ? null : cur));
          },
        });
      });
    },
    { dependencies: [] },
  );

  // The olive pill slides to the active link.
  useLayoutEffect(() => {
    const nav = navRef.current;
    const pill = nav?.querySelector<HTMLElement>("[data-pill]");
    if (!nav || !pill) return;
    const link = active ? nav.querySelector<HTMLElement>(`a[href="${active}"]`) : null;
    if (!link) {
      gsap.to(pill, { autoAlpha: 0, scale: 0.8, duration: reduced ? 0 : 0.25 });
      return;
    }
    const wasHidden = Number(gsap.getProperty(pill, "opacity")) === 0;
    // The pill hugs the link but never reaches into its neighbours, however tight the row is.
    const pad = Math.min(12, (parseFloat(getComputedStyle(nav).columnGap) || 24) - 3);
    const box = { x: link.offsetLeft - pad, width: link.offsetWidth + pad * 2 };
    if (wasHidden) gsap.set(pill, box);
    gsap.to(pill, { ...box, autoAlpha: 1, scale: 1, duration: reduced ? 0 : 0.55, ease: "elastic.out(1, 0.75)" });
  }, [active, reduced]);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      gsap.set(el, { autoAlpha: 0, y: -8 });
      const show = (on: boolean) =>
        gsap.to(el, { autoAlpha: on ? 1 : 0, y: on ? 0 : -8, duration: reduced ? 0 : 0.22, ease: "power2.out", overwrite: true });
      const st = ScrollTrigger.create({
        trigger: document.querySelector("[data-hero-wordmark]"),
        start: "bottom top+=24",
        end: "max",
        onToggle: (self) => show(self.isActive),
      });
      // Thin line under the header tracks reading progress through the whole page.
      gsap.fromTo(
        el.querySelector("[data-progress]"),
        { scaleX: 0 },
        { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: reduced ? true : 0.3 } },
      );
      // Deep links and reloads can start mid-page: sync immediately.
      gsap.set(el, { autoAlpha: st.isActive ? 1 : 0, y: st.isActive ? 0 : -8 });
    },
    { scope: ref, dependencies: [reduced] },
  );

  return (
    <div ref={ref} className={styles.header}>
      <div className={`${styles.inner} shell`}>
        <a href="#top" className={styles.mark}>
          <span className={styles.dot} aria-hidden />
          {profile.name}
        </a>
        <nav ref={navRef} aria-label="Sections (compact)" className={styles.nav}>
          <span className={styles.pill} data-pill aria-hidden />
          {navLinks.map((l) => (
            <RollLink
              key={l.href}
              href={l.href}
              label={l.label}
              className={`${styles.navLink} label`}
              data-active={active === l.href || undefined}
              aria-current={active === l.href ? "location" : undefined}
            />
          ))}
        </nav>
        <div className={styles.end}>
          <Clock prefix="" />
        </div>
      </div>
      <span className={styles.progress} data-progress aria-hidden />
    </div>
  );
}
