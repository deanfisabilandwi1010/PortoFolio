import { useRef } from "react";
import { navLinks, profile } from "../data/portfolio";
import { gsap, useGSAP } from "../motion/gsap";
import { MM } from "../motion/useMotionPreference";
import { Wordmark } from "./Wordmark";
import { Clock } from "./Clock";
import { RollLink } from "./RollLink";
import { ArrowUpRight } from "./Icons";
import styles from "./Footer.module.css";

export function Footer() {
  const socials = [
    profile.githubUrl && { label: "GitHub", href: profile.githubUrl },
    profile.linkedinUrl && { label: "LinkedIn", href: profile.linkedinUrl },
    profile.instagramUrl && { label: "Instagram", href: profile.instagramUrl },
  ].filter(Boolean) as { label: string; href: string }[];
  const root = useRef<HTMLElement>(null);

  // The closing wordmark rises letter by letter as the footer comes into view.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MM.motion, () => {
        gsap.from(root.current!.querySelectorAll("[data-wm-char]"), {
          yPercent: 110,
          rotate: 8,
          stagger: 0.06,
          ease: "none",
          scrollTrigger: { trigger: root.current!.querySelector("[data-footer-mark]"), start: "top bottom", end: "bottom bottom", scrub: 0.6 },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <footer ref={root} className={`${styles.footer} on-dark`}>
      <div className={`${styles.top} shell`}>
        <div className={styles.col}>
          <p className="label-mono">Say hello</p>
          {profile.email ? (
            <a className={`${styles.big} link-underline`} href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          ) : (
            profile.githubUrl && (
              <a className={`${styles.big} link-underline`} href={profile.githubUrl} target="_blank" rel="noreferrer">
                @{profile.githubUrl.split("/").pop()} <span className="sr-only">on GitHub (opens in a new tab)</span>
              </a>
            )
          )}
        </div>
        <div className={styles.col}>
          <p className="label-mono">Elsewhere</p>
          <ul>
            {socials.map((s) => (
              <li key={s.label}>
                <a className="link-underline" href={s.href} target="_blank" rel="noreferrer">
                  {s.label} <ArrowUpRight className={styles.arrow} />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <nav className={styles.col} aria-label="Footer">
          <p className="label-mono">Index</p>
          <ul>
            {navLinks.map((l) => (
              <li key={l.href}>
                <RollLink href={l.href} label={l.label} />
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.col}>
          <p className="label-mono">Local time</p>
          <Clock prefix="" />
        </div>
      </div>

      <div className={`${styles.mark} shell`} data-footer-mark>
        <p className={`${styles.sign} serif`} aria-hidden>
          Dean Fisabil —
        </p>
        <Wordmark text={profile.closingWordmark} ratio={3.16} />
      </div>

      <div className={`${styles.bottom} shell label`}>
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p className={styles.made}>Designed &amp; built by hand — React, GSAP, a lot of care.</p>
        <a href="#top" className="link-underline">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
