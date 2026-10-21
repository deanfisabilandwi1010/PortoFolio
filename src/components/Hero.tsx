import { useEffect, useRef } from "react";
import { gsap, useGSAP } from "../motion/gsap";
import { MM } from "../motion/useMotionPreference";
import { navLinks, profile } from "../data/portfolio";
import { navigate } from "./navigate";
import { PortraitArch } from "./PortraitArch";
import { HeroIndex } from "./HeroIndex";
import { Wordmark } from "./Wordmark";
import { Clock } from "./Clock";
import { RollLink } from "./RollLink";
import { ArrowDown, ArrowUpRight } from "./Icons";
import styles from "./Hero.module.css";

const PHRASES = ["and looks the part.", "and stays secure.", "and feels crafted.", "and lasts."];

/** `markInPlace`: the loader already placed the wordmark, so it does not animate in again. */
export function Hero({ play, markInPlace }: { play: boolean; markInPlace: boolean }) {
  const root = useRef<HTMLElement>(null);
  const reveal = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MM.motion, () => {
        const q = gsap.utils.selector(root);
        // Entrance: built paused, played when the loader splits open.
        const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
        if (!markInPlace) tl.from(q("[data-wm-char]"), { yPercent: 105, rotate: 6, duration: 0.9, stagger: 0.035 }, 0);
        reveal.current = tl
          .from(q("[data-hero-meta] > *"), { y: 10, autoAlpha: 0, duration: 0.5, stagger: 0.065 }, 0.25)
          .from(q("[data-hero-line]"), { yPercent: 105, duration: 0.7, stagger: 0.09 }, 0.4)
          .from(q("[data-hero-rise]"), { y: 14, autoAlpha: 0, duration: 0.55, stagger: 0.08 }, 0.65);

        // Third headline line cycles through phrases.
        const phrases = q("[data-phrase]");
        if (phrases.length > 1) {
          const HOLD = 3;
          gsap.set(phrases.slice(1), { yPercent: 110 });
          // Held until the entrance, so it cannot lift a phrase out of its still-hidden line.
          const loop = gsap.timeline({ repeat: -1, paused: true });
          tl.call(() => loop.play(), undefined, 0.4);
          phrases.forEach((ph, i) => {
            const next = phrases[(i + 1) % phrases.length];
            const t = (i + 1) * HOLD;
            loop
              .to(ph, { yPercent: -110, duration: 0.55, ease: "power3.in" }, t)
              .fromTo(next, { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: "power3.out", immediateRender: false }, t + 0.3);
          });
        }

        gsap.to(q("[data-hero-parallax]"), {
          y: -70,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 },
        });
        return () => {
          reveal.current = null;
        };
      });
      // Desktop only: as the hero scrolls away, the name's letters lift off at slightly different speeds.
      mm.add(MM.scenes, () => {
        const masks = gsap.utils.toArray<HTMLElement>("[data-wm-mask]", root.current?.querySelector("[data-hero-wordmark]"));
        gsap.to(masks, {
          y: (i) => -(24 + ((i * 37) % 5) * 12),
          rotate: (i) => (i % 2 ? 1 : -1) * (1 + (i % 3)),
          ease: "none",
          scrollTrigger: { trigger: root.current?.querySelector("[data-hero-wordmark]"), start: "top 80%", end: "bottom top", scrub: 0.8 },
        });
      });

      // Pointer play: wordmark letters lift like keys under the cursor; a dot grid lights up around it.
      mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const hero = root.current;
        const mark = hero?.querySelector<HTMLElement>("[data-hero-wordmark] [aria-hidden='true']");
        if (!hero || !mark) return;
        // Letters may only leave their masks once the entrance is over.
        const live = gsap.delayedCall(markInPlace ? 0 : 2.4, () => mark.setAttribute("data-live", ""));
        const chars = gsap.utils.toArray<HTMLElement>("[data-wm-char]", mark);
        const yTo = chars.map((c) => gsap.quickTo(c, "y", { duration: 0.5, ease: "power3.out" }));
        const rTo = chars.map((c) => gsap.quickTo(c, "rotation", { duration: 0.6, ease: "power3.out" }));
        let centers: number[] = [];
        const measure = () => (centers = chars.map((c) => {
          const r = c.getBoundingClientRect();
          return r.left + r.width / 2;
        }));
        const onMarkMove = (e: PointerEvent) => {
          if (!centers.length) measure();
          const radius = mark.offsetWidth * 0.12;
          chars.forEach((_, i) => {
            const d = e.clientX - centers[i];
            const t = Math.max(0, 1 - Math.abs(d) / radius);
            yTo[i](-t * t * mark.offsetHeight * 0.16);
            rTo[i](t * (d > 0 ? -1 : 1) * 6);
          });
        };
        const onMarkLeave = () => {
          centers = [];
          chars.forEach((c) => gsap.to(c, { y: 0, rotation: 0, duration: 1.1, ease: "elastic.out(1, 0.35)", overwrite: "auto" }));
        };
        let frame = 0;
        const onHeroMove = (e: PointerEvent) => {
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(() => {
            const r = hero.getBoundingClientRect();
            hero.style.setProperty("--mx", `${e.clientX - r.left}px`);
            hero.style.setProperty("--my", `${e.clientY - r.top}px`);
          });
        };
        mark.addEventListener("pointermove", onMarkMove);
        mark.addEventListener("pointerleave", onMarkLeave);
        hero.addEventListener("pointermove", onHeroMove);
        window.addEventListener("resize", measure);
        return () => {
          cancelAnimationFrame(frame);
          live.kill();
          mark.removeAttribute("data-live");
          mark.removeEventListener("pointermove", onMarkMove);
          mark.removeEventListener("pointerleave", onMarkLeave);
          hero.removeEventListener("pointermove", onHeroMove);
          window.removeEventListener("resize", measure);
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  useEffect(() => {
    if (play) reveal.current?.play();
  }, [play]);


  return (
    <header ref={root} id="top" className={styles.hero}>
      <div className={`${styles.topbar} shell`} data-hero-meta>
        <p className="label">
          {profile.role} <span className={styles.muted}>at</span> {profile.company}
        </p>
        <nav aria-label="Primary" className={styles.nav}>
          {navLinks.map((l) => (
            <RollLink key={l.href} href={l.href} label={l.label} className="label" />
          ))}
        </nav>
        <div className={styles.topEnd}>
          {profile.email ? (
            <a className="link-underline label" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          ) : (
            profile.githubUrl && (
              <a className="link-underline label" href={profile.githubUrl} target="_blank" rel="noreferrer">
                GitHub <span className="sr-only">(opens in a new tab)</span>
              </a>
            )
          )}
          <Clock prefix="" />
        </div>
      </div>



      <div className={`${styles.stage} shell grid`}>
        <div className={styles.copy} data-hero-parallax>
          <p className={`${styles.kicker} label-mono`} data-hero-rise>
            <span className={styles.liveDot} aria-hidden /> (01) Hello — I’m Dean
          </p>
          <p className={styles.headline}>
            <span className="line-mask">
              <span data-hero-line>I build software</span>
            </span>
            <span className="line-mask">
              <span data-hero-line>that works hard</span>
            </span>
            <span className="line-mask">
              <span data-hero-line className={`${styles.rotator} serif`}>
                {PHRASES.map((ph, i) => (
                  <span key={ph} data-phrase aria-hidden={i > 0 || undefined}>
                    {ph}
                  </span>
                ))}
              </span>
            </span>
          </p>
          <p className={styles.lead} data-hero-rise>
            Internal systems that teams depend on by day. Websites with character for the brands I believe in, the rest of the time.
          </p>
          <div className={styles.ctas} data-hero-rise>
            <a href="#work" className="btn btn-primary" data-arrow="down" data-magnetic="0.35">
              View selected work <ArrowDown />
            </a>
            <button type="button" className="btn btn-secondary" onClick={() => navigate("#desktop")} data-magnetic="0.35">
              Open my desktop <ArrowUpRight />
            </button>
          </div>
        </div>

        <div className={styles.portrait}>
          <PortraitArch play={play} />
        </div>

        <HeroIndex className={styles.index} />
      </div>

      <div className={`${styles.wordmark} shell`} data-hero-wordmark>
        <h1 className="sr-only">
          {profile.name} — {profile.role} at {profile.company}
        </h1>
        <Wordmark text={profile.wordmark} ratio={9.5} stackedRatio={3.35} maxSize="360px" />
      </div>
      <div className={styles.spot} aria-hidden />
    </header>
  );
}
