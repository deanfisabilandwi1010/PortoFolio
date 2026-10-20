import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../motion/gsap";
import { useMotion } from "../app/MotionProvider";
import { goToDesktop } from "../desktop/desktopNav";
import { setNavigator } from "./navigate";
import styles from "./NavTransition.module.css";

type Dest = { index: string; title: string; italic: string };

const DESTINATIONS: Record<string, Dest> = {
  "#top": { index: "01", title: "Back to the", italic: "top" },
  "#about": { index: "03", title: "About", italic: "me" },
  "#day-job": { index: "04", title: "Day", italic: "job" },
  "#process": { index: "05", title: "How I", italic: "work" },
  "#stack": { index: "06", title: "My", italic: "toolkit" },
  "#work": { index: "07", title: "Selected", italic: "work" },
  "#desktop": { index: "08", title: "My", italic: "desktop" },
  "#contact": { index: "09", title: "Let’s", italic: "talk" },
};

/**
 * In-page navigation as a curtain transition instead of a jump or a long
 * fast-forward through every scroll scene: a two-tone curtain rises, names the
 * destination, the page moves behind it, and the curtain lifts away.
 */
export function NavTransition() {
  const root = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const [dest, setDest] = useState<Dest>(DESTINATIONS["#top"]);
  const { reduced, scrollTo, lockScroll } = useMotion();

  useEffect(() => {
    const headerH = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 0;

    const jump = (hash: string) => {
      if (hash === "#desktop") {
        goToDesktop(scrollTo, { immediate: true, focus: false });
      } else if (hash === "#top") {
        scrollTo(0, { immediate: true });
      } else {
        const el = document.querySelector<HTMLElement>(hash);
        if (!el) return;
        // Pinned sections: land where the pin starts, not where the pinned element ended up.
        const anchor = el.parentElement?.classList.contains("pin-spacer") ? el.parentElement : el;
        scrollTo(anchor.getBoundingClientRect().top + window.scrollY - headerH(), { immediate: true });
      }
      ScrollTrigger.update();
      if (window.location.hash !== hash) history.pushState(null, "", hash);
    };

    const focusTarget = (hash: string) => {
      const target =
        hash === "#desktop"
          ? document.getElementById("desktop-heading")
          : hash === "#top"
            ? document.querySelector<HTMLElement>("h1")
            : document.querySelector<HTMLElement>(`${hash} h2`);
      if (!target) return;
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };

    const go = (hash: string) => {
      if (busy.current) return;
      if (hash !== "#top" && !document.querySelector(hash)) return;
      if (reduced || !root.current) {
        jump(hash);
        focusTarget(hash);
        return;
      }
      busy.current = true;
      setDest(DESTINATIONS[hash] ?? { index: "··", title: hash.slice(1), italic: "" });
      const q = gsap.utils.selector(root);
      // Wait one frame so the label for this destination is rendered.
      requestAnimationFrame(() => {
        lockScroll(true);
        gsap
          .timeline({
            defaults: { ease: "power4.inOut" },
            onComplete: () => {
              gsap.set(root.current, { autoAlpha: 0 });
              busy.current = false;
              focusTarget(hash);
            },
          })
          .set(root.current, { autoAlpha: 1 })
          .set(q("[data-ch]"), { yPercent: 110 })
          .fromTo(q("[data-layer='a']"), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.55 }, 0)
          .fromTo(q("[data-layer='b']"), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.55 }, 0.08)
          .to(q("[data-ch]"), { yPercent: 0, duration: 0.5, stagger: 0.025, ease: "power3.out" }, 0.32)
          .fromTo(q("[data-bar]"), { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "power2.inOut" }, 0.3)
          .call(
            () => {
              lockScroll(false);
              jump(hash);
              lockScroll(true);
            },
            [],
            0.66,
          )
          .to(q("[data-ch]"), { yPercent: -110, duration: 0.35, stagger: 0.015, ease: "power3.in" }, 0.98)
          .to(q("[data-layer='b']"), { clipPath: "inset(0% 0% 100% 0%)", duration: 0.6 }, 1.1)
          .to(q("[data-layer='a']"), { clipPath: "inset(0% 0% 100% 0%)", duration: 0.6 }, 1.18)
          .call(() => lockScroll(false), [], 1.3);
      });
    };
    setNavigator(go);

    // Every in-page link goes through the curtain (the skip link stays native).
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      const hash = a?.getAttribute("href");
      if (!a || !hash || hash === "#" || hash === "#main") return;
      e.preventDefault();
      go(hash);
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      setNavigator(null);
    };
  }, [reduced, scrollTo, lockScroll]);

  const words = [dest.title, dest.italic].filter(Boolean);

  return (
    <div ref={root} className={styles.curtain} aria-hidden>
      <div className={styles.layerA} data-layer="a" />
      <div className={`${styles.layerB} on-dark`} data-layer="b">
        <div className={styles.label}>
          <span className={`${styles.index} label-mono`}>
            <span className={styles.mask}>
              <span data-ch>({dest.index})</span>
            </span>
          </span>
          <span className={styles.title}>
            {words.map((w, wi) => (
              <span key={wi} className={`${styles.word} ${wi === 1 ? "serif" : ""}`}>
                {[...w].map((ch, i) => (
                  <span key={i} className={styles.mask}>
                    <span data-ch>{ch === " " ? " " : ch}</span>
                  </span>
                ))}
              </span>
            ))}
          </span>
        </div>
        <span className={styles.bar} data-bar />
      </div>
    </div>
  );
}
