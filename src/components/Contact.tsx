import { useRef } from "react";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { gsap, useGSAP } from "../motion/gsap";
import { MM } from "../motion/useMotionPreference";
import { primaryContactHref, profile } from "../data/portfolio";
import { useReveal } from "../motion/useReveal";
import { ArrowUpRight } from "./Icons";
import styles from "./Contact.module.css";

gsap.registerPlugin(MorphSVGPlugin);

const DIAMOND = "M50 2 L98 50 L50 98 L2 50 Z";
const ARCH = "M2 98 L2 50 A48 48 0 0 1 98 50 L98 98 Z";

export function Contact() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  const external = !profile.email;

  // The CTA rolls in along the dashed rail as a spinning diamond and lands, centred, as an arch.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MM.motion, () => {
        const q = gsap.utils.selector(root);
        const [rail] = q("[data-rail]") as HTMLElement[];
        const [cta] = q("[data-cta]") as HTMLElement[];
        if (!rail || !cta) return;
        const st = { trigger: rail, start: "top 95%", end: "top 45%", scrub: 0.8, invalidateOnRefresh: true };
        gsap.fromTo(cta, { x: () => -(rail.offsetWidth / 2 - cta.offsetWidth / 2) }, { x: 0, ease: "power2.out", scrollTrigger: st });
        gsap.fromTo(q("[data-cta-shape]"), { rotate: -270 }, { rotate: 0, ease: "power2.out", scrollTrigger: st });
        gsap.fromTo(q("[data-cta-path]"), { morphSVG: DIAMOND }, { morphSVG: ARCH, ease: "power2.inOut", scrollTrigger: { ...st, start: "top 75%" } });
        gsap.fromTo(q("[data-rail-done]"), { scaleX: 0 }, { scaleX: 0.5, ease: "power2.out", scrollTrigger: st });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="contact" className={styles.contact} aria-labelledby="contact-title">
      <div className={`${styles.head} shell`}>
        <p className={`${styles.kicker} label-mono`} data-reveal>
          (09) Contact
        </p>
        <h2 id="contact-title" className="section-title" data-reveal-lines>
          <span className="line-mask">
            <span>Have something</span>
          </span>
          <span className="line-mask">
            <span className="serif">worth building?</span>
          </span>
        </h2>
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
              <span className={styles.ctaLabel}>
                Let’s build
                <br />
                something.
                <ArrowUpRight />
              </span>
            </span>
            <span className="sr-only">{external ? " — message me on GitHub (opens in a new tab)" : ` — email ${profile.email}`}</span>
          </a>
        </div>
      )}
    </section>
  );
}
