import type { AnchorHTMLAttributes, CSSProperties } from "react";
import styles from "./RollLink.module.css";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { label: string };

/** Link whose letters roll up to an identical twin on hover/focus. */
export function RollLink({ label, className, ...rest }: Props) {
  const chars = [...label];
  return (
    // Letters are split for the animation, so the accessible name comes from aria-label.
    <a aria-label={label} {...rest} className={`${styles.link} ${className ?? ""}`}>
      <span className={styles.roll} aria-hidden>
        {[0, 1].map((copy) => (
          <span key={copy} className={styles.line}>
            {chars.map((ch, i) => (
              <span key={i} className={styles.ch} style={{ "--i": i } as CSSProperties}>
                {ch === " " ? "\u00a0" : ch}
              </span>
            ))}
          </span>
        ))}
      </span>
    </a>
  );
}
