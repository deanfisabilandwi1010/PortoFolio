import { useRef, useState } from "react";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { gsap, ScrollTrigger, useGSAP } from "../motion/gsap";
import { MM } from "../motion/useMotionPreference";
import { primaryContactHref, profile } from "../data/portfolio";
import { useReveal } from "../motion/useReveal";
import { ArrowUpRight } from "./Icons";
import { RollLink } from "./RollLink";
import styles from "./Contact.module.css";

gsap.registerPlugin(MorphSVGPlugin, DrawSVGPlugin);

const DIAMOND = "M50 2 L98 50 L50 98 L2 50 Z";
const ARCH = "M2 98 L2 50 A48 48 0 0 1 98 50 L98 98 Z";
const SCRIBBLE = "M6 22 C 70 6, 150 8, 212 15 S 340 26, 396 9";

export function Contact() {
  const root = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  useReveal(root);
  const external = !profile.email;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MM.motion, () => {
        const q = gsap.utils.selector(root);
        const [rail] = q("[data-rail]") as HTMLElement[];
        const [cta] = q("[data-cta]") as HTMLElement[];

        // A hand-drawn underline writes itself under "worth building?".
        gsap.fromTo(q("[data-scribble]"), { drawSVG: "0%" }, { drawSVG: "100%", ease: "power1.inOut", scrollTrigger: { trigger: q("[data-title]")[0], start: "top 75%", end: "bottom 45%", scrub: 0.6 } });

        if (!rail || !cta) return;
        // The CTA rolls in along the dashed rail as a spinning diamond, lands as an arch,
        // and becomes a two-leaf door.
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: rail, start: "top 95%", end: "top 45%", scrub: 0.8, invalidateOnRefresh: true },
        });
        tl.fromTo(cta, { x: () => -(rail.offsetWidth / 2 - cta.offsetWidth / 2) }, { x: 0, ease: "power2.out", duration: 1 }, 0)
          .fromTo(q("[data-cta-shape]"), { rotate: -270 }, { rotate: 0, ease: "power2.out", duration: 1 }, 0)
          .fromTo(q("[data-cta-path]"), { morphSVG: DIAMOND }, { morphSVG: ARCH, ease: "power2.inOut", duration: 0.6 }, 0.3)
          .fromTo(q("[data-rail-done]"), { scaleX: 0 }, { scaleX: 0.5, ease: "power2.out", duration: 1 }, 0)
          .fromTo(q("[data-door]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.08 }, 0.9)
          .to(q("[data-cta-shape]"), { autoAlpha: 0, duration: 0.05 }, 0.97);

        // Contact rows slide in.
        gsap.from(q("[data-link-row]"), { y: 30, autoAlpha: 0, duration: 0.6, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: q("[data-links]")[0], start: "top 90%", once: true } });
      });

      // Touch screens can't hover: the door swings open as it reaches the middle of the screen.
      mm.add("(hover: none) and (prefers-reduced-motion: no-preference)", () => {
        const cta = root.current?.querySelector<HTMLElement>("[data-cta]");
        if (!cta) return;
        ScrollTrigger.create({ trigger: cta, start: "center 62%", end: "center 18%", onToggle: (self) => cta.toggleAttribute("data-open", self.isActive) });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const copyEmail = async () => {
    if (!profile.email) return;
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — the mailto link still works */
    }
  };

  const links = [
    profile.email && { label: "Email", value: profile.email, href: `mailto:${profile.email}`, external: false },
    profile.linkedinUrl && { label: "LinkedIn", value: "in/deanfisabilandwi", href: profile.linkedinUrl, external: true },
    profile.githubUrl && { label: "GitHub", value: `@${profile.githubUrl.split("/").pop()}`, href: profile.githubUrl, external: true },
  ].filter(Boolean) as { label: string; value: string; href: string; external: boolean }[];

  return (
    <section ref={root} id="contact" className={styles.contact} aria-labelledby="contact-title">
      <div className={`${styles.head} shell`}>
        <p className={`${styles.kicker} label-mono`} data-reveal>
          (09) Contact
        </p>
        <div className={styles.titleWrap} data-title>
          <h2 id="contact-title" className="section-title" data-reveal-lines>
            <span className="line-mask">
              <span>Have something</span>
            </span>
            <span className="line-mask">
              <span className="serif">worth building?</span>
            </span>
          </h2>
          <svg className={styles.scribble} viewBox="0 0 400 30" preserveAspectRatio="none" aria-hidden>
            <path d={SCRIBBLE} data-scribble />
          </svg>
        </div>
        <p className={styles.sub} data-reveal>
          Internal tools, landing pages, or something in between.
        </p>
      </div>

      {primaryContactHref && (
        <div className={styles.rail} data-rail>
          <span className={styles.railDone} data-rail-done aria-hidden />
          <a href={primaryContactHref} className={`${styles.cta} on-dark`} data-cta {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
            <span className={styles.inner} data-magnetic="0.25">
              <svg className={styles.shape} viewBox="0 0 100 100" aria-hidden data-cta-shape>
                <path d={ARCH} data-cta-path />
              </svg>
              <span className={styles.door} data-door aria-hidden>
                <span className={styles.interior}>
                  <span className="label-mono">Say hello</span>
                  <span className={`${styles.mail} serif`}>{profile.email ?? "GitHub"}</span>
                  <span className={styles.enter}>
                    Write to me <ArrowUpRight />
                  </span>
                </span>
                <span className={`${styles.leaf} ${styles.leafL}`}>
                  <i className={styles.knob} />
                </span>
                <span className={`${styles.leaf} ${styles.leafR}`}>
                  <i className={styles.knob} />
                </span>
                <span className={styles.ctaLabel}>
                  Let’s build
                  <br />
                  something.
                </span>
              </span>
            </span>
            <span className="sr-only">Let’s build something{external ? " — message me on GitHub (opens in a new tab)" : ` — email ${profile.email}`}</span>
          </a>
        </div>
      )}

      <ul className={`${styles.links} shell`} data-links aria-label="Other ways to reach me">
        {links.map((l) => (
          <li key={l.label} className={styles.linkRow} data-link-row>
            <span className={`${styles.linkLabel} label-mono`}>{l.label}</span>
            <RollLink
              href={l.href}
              label={l.value}
              className={styles.linkValue}
              {...(l.external ? { target: "_blank", rel: "noreferrer" } : {})}
            />
            {l.label === "Email" ? (
              <button type="button" className={styles.copy} onClick={copyEmail} data-copied={copied || undefined}>
                <span aria-live="polite">{copied ? "Copied ✓" : "Copy"}</span>
              </button>
            ) : (
              <ArrowUpRight className={styles.linkArrow} />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
