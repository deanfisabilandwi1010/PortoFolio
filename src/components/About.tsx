import { useRef } from "react";
import { gsap, useGSAP } from "../motion/gsap";
import { MM } from "../motion/useMotionPreference";
import { credentials, profile } from "../data/portfolio";
import { useReveal } from "../motion/useReveal";
import { ScrubWords } from "./ScrubWords";
import styles from "./About.module.css";

export function About() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  // Portrait opens like a shutter while the photo settles inside it.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MM.motion, () => {
        const clip = root.current?.querySelector("[data-portrait-clip]");
        const img = root.current?.querySelector("[data-portrait-clip] img");
        if (!clip || !img) return;
        const st = { trigger: clip, start: "top 90%", end: "top 30%", scrub: 0.8 };
        gsap.fromTo(clip, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: st });
        gsap.fromTo(img, { scale: 1.3, yPercent: 8 }, { scale: 1, yPercent: 0, ease: "none", scrollTrigger: { ...st, end: "bottom 40%" } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" className={`${styles.about} shell grid`} aria-labelledby="about-title">
      <div className={styles.head}>
        <p className={`${styles.kicker} label-mono`} data-reveal>
          (03) About
        </p>
        <h2 id="about-title" className="section-title" data-reveal-lines>
          <span className="line-mask">
            <span>A programmer</span>
          </span>
          <span className="line-mask">
            <span>by trade,</span>
          </span>
          <span className="line-mask">
            <span className="serif">a maker by habit.</span>
          </span>
        </h2>
      </div>

      <figure className={styles.portrait}>
        <div className={styles.photo} data-portrait-clip>
        <img
          src="/assets/photos/portrait-crop.webp"
          srcSet="/assets/photos/portrait-crop-sm.webp 520w, /assets/photos/portrait-crop.webp 900w"
          sizes="(min-width: 1024px) 30vw, 80vw"
          width={900}
          height={1579}
          loading="lazy"
          alt="Studio portrait of Dean in a dark suit and patterned tie, seated on a stool against a grey backdrop"
        />
        </div>
        <figcaption className="label-mono">
          <span>Portrait</span>
          <span>{profile.name}</span>
        </figcaption>
      </figure>

      <div className={styles.text}>
        {profile.bio.map((para, i) => (
          <ScrubWords key={i} text={para} className={i === 0 ? styles.lead : undefined} />
        ))}
        <dl className={styles.facts} data-reveal>
          {credentials.map((c) => (
            <div key={c.id} className={styles.fact}>
              <dt className="label-mono">{c.kind}</dt>
              <dd>
                <span className={styles.factLogo}>
                  <img src={c.logo} alt={c.logoAlt} width={c.logoWidth} height={c.logoHeight} loading="lazy" />
                </span>
                <span>
                  <strong>{c.title}</strong>
                  <span>{c.org}</span>
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
