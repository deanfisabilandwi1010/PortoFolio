import { useLayoutEffect, useRef, type CSSProperties } from "react";
import styles from "./Wordmark.module.css";

type Props = {
  text: string;
  /** Rendered width ÷ font-size of the full line — the pre-measure fallback (Manrope 800). */
  ratio: number;
  /** Same, for the longest single word — used when the mark stacks on phones. */
  stackedRatio?: number;
  maxSize?: string;
  className?: string;
};

/**
 * Giant personal wordmark that always spans its container exactly.
 * Container query units size it before paint; once the real font is in,
 * the width ÷ font-size ratio is measured so the fit is exact.
 * Decorative: the accessible name lives in the page's <h1>.
 */
export function Wordmark({ text, ratio, stackedRatio, maxSize, className }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const words = text.split(" ");

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const line = textRef.current;
    if (!wrap || !line) return;
    const measure = () => {
      const fontSize = parseFloat(getComputedStyle(line).fontSize);
      const wordEls = [...line.children] as HTMLElement[];
      if (!fontSize || !wordEls.length) return;
      const widths = wordEls.map((w) => w.getBoundingClientRect().width);
      const gap = parseFloat(getComputedStyle(line).columnGap) || 0;
      const stacked = getComputedStyle(line).flexDirection === "column";
      const full = widths.reduce((a, b) => a + b, 0) + (stacked ? 0.22 * fontSize : gap) * (widths.length - 1);
      wrap.style.setProperty("--wm-ratio", String(full / fontSize));
      wrap.style.setProperty("--wm-ratio-stacked", String(Math.max(...widths) / fontSize));
    };
    measure();
    let cancelled = false;
    document.fonts?.ready.then(() => !cancelled && measure());
    return () => {
      cancelled = true;
    };
  }, [text]);

  const style = {
    "--wm-ratio": ratio,
    "--wm-ratio-stacked": stackedRatio ?? ratio,
    "--wm-max": maxSize ?? "9999px",
  } as CSSProperties;

  return (
    <div ref={wrapRef} className={`${styles.wrap} ${stackedRatio ? styles.canStack : ""} ${className ?? ""}`} aria-hidden="true" style={style}>
      <span ref={textRef} className={styles.text}>
        {words.map((word, w) => (
          <span className={styles.word} key={w}>
            {[...word].map((ch, i) => (
              <span className={styles.mask} key={i} data-wm-mask>
                <span className={styles.char} data-wm-char>
                  {ch}
                </span>
              </span>
            ))}
          </span>
        ))}
      </span>
    </div>
  );
}
