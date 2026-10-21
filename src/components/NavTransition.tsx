import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../motion/gsap";
import { useMotion } from "../app/MotionProvider";
import { goToDesktop } from "../desktop/desktopNav";
import { setNavigator } from "./navigate";
import { PULLER, pullerFrame } from "./pusherSprite";
import styles from "./NavTransition.module.css";

type Dest = { index: string; title: string; italic: string };

const DESTINATIONS: Record<string, Dest> = {
  "#top": { index: "01", title: "Back to the", italic: "top" },
  "#about": { index: "03", title: "About", italic: "me" },
  "#day-job": { index: "04", title: "Day", italic: "job" },
  "#process": { index: "05", title: "How I", italic: "work" },
  "#stack": { index: "06", title: "My", italic: "toolkit" },
  "#interests": { index: "07", title: "Interested", italic: "in" },
  "#work": { index: "08", title: "Selected", italic: "work" },
  "#experiments": { index: "09", title: "Small", italic: "experiments" },
  "#desktop": { index: "10", title: "My", italic: "desktop" },
  "#contact": { index: "11", title: "Let’s", italic: "talk" },
};

/**
 * In-page navigation as a roller shade instead of a jump or a long fast-forward
 * through every scroll scene: cartoon Dean drops from the top hanging on the shade's
 * grab-bar and drags it down over the page, the destination is named, the page moves
 * behind it, then he tugs and the shade snaps back up — carrying him off the top.
 */
export function NavTransition() {
  const root = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const [dest, setDest] = useState<Dest>(DESTINATIONS["#top"]);
  const { reduced, scrollTo, lockScroll } = useMotion();

  useEffect(() => {
    const headerH = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 0;
    // Warm the sprite so Dean is there on the first click.
    if (!reduced) new Image().src = PULLER.src;

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
      const [shade] = q("[data-shade]") as HTMLElement[];
      const [rig] = q("[data-rig]") as HTMLElement[];
      const [sprite] = q("[data-sprite]") as HTMLElement[];
      // Wait one frame so the label for this destination is rendered.
      requestAnimationFrame(() => {
        lockScroll(true);
        // Geometry, all from the grab-bar's y (h). Dean's grip sits on the bar; while he hangs,
        // his feet ride the shade's bottom edge, so the bar is fixed `reach` px above that edge.
        const vh = window.innerHeight;
        const cell = sprite.offsetHeight;
        const grip = PULLER.grip[1] * cell;
        const feet = (f: number) => PULLER.soles[f] * cell - grip; // grip → soles, per frame
        const reach = feet(0);
        const landed = (f: number) => vh - feet(f); // bar height that puts frame f's feet on the floor
        let covered = false;
        let frame = -1;
        const show = (f: number) => {
          if (f === frame) return;
          frame = f;
          sprite.style.backgroundPositionX = pullerFrame(f);
        };
        const bar = { h: -reach };
        const curtain = root.current!;
        const place = () => {
          // While the page swaps behind it, the shade never lifts off the floor, whatever the pose —
          // measured live: on phones the viewport height can change mid-transition.
          const edge = covered ? Math.max(bar.h + reach, curtain.clientHeight + 4) : bar.h + reach;
          gsap.set(shade, { y: edge - shade.offsetHeight });
          gsap.set(rig, { y: bar.h });
        };
        // Legs kick once per stretch of fall; h starts negative, so wrap the index both ways.
        const kick = () => show((((Math.floor(bar.h / (cell * 0.18)) % PULLER.cycle) + PULLER.cycle) % PULLER.cycle));
        show(0);
        place();
        gsap.ticker.add(place);

        gsap
          .timeline({
            onComplete: () => {
              gsap.ticker.remove(place);
              gsap.set(root.current, { autoAlpha: 0 });
              busy.current = false;
              focusTarget(hash);
            },
          })
          .set(root.current, { autoAlpha: 1 })
          .set(q("[data-ch]"), { yPercent: 110 })
          // 1. He drops in from the top, legs kicking, dragging the shade down with him.
          .to(bar, { h: landed(0), duration: 0.55, ease: "power2.in", onUpdate: kick }, 0)
          // 2. Lands: knees give, the shade settles on the floor; the destination rises in.
          .call(() => ((covered = true), show(PULLER.land)), [], 0.55)
          .to(bar, { h: landed(PULLER.land), duration: 0.12, ease: "power2.out" }, 0.55)
          .to(q("[data-ch]"), { yPercent: 0, duration: 0.45, stagger: 0.02, ease: "power3.out" }, 0.6)
          .call(() => show(PULLER.hold), [], 0.72)
          .to(bar, { h: landed(PULLER.hold), duration: 0.2, ease: "power2.out" }, 0.72)
          // 3. The page moves behind the closed shade.
          .call(
            () => {
              lockScroll(false);
              jump(hash);
              lockScroll(true);
            },
            [],
            0.8,
          )
          .to(q("[data-ch]"), { yPercent: -110, duration: 0.3, stagger: 0.01, ease: "power3.in" }, 1.22)
          // 4. One hard tug, then the shade snaps up and carries him off the top.
          .call(() => show(PULLER.tug), [], 1.3)
          .to(bar, { h: landed(PULLER.tug), duration: 0.14, ease: "power2.in" }, 1.3)
          .call(() => ((covered = false), show(PULLER.wave)), [], 1.44)
          .to(bar, { h: -(PULLER.soles[PULLER.wave] * cell) - 24, duration: 0.6, ease: "power3.in" }, 1.44)
          .call(() => lockScroll(false), [], 1.85);
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
      <div className={`${styles.shade} on-dark`} data-shade>
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
                    <span data-ch>{ch === " " ? " " : ch}</span>
                  </span>
                ))}
              </span>
            ))}
          </span>
        </div>
        <span className={styles.rail} />
      </div>
      <div className={styles.rig} data-rig>
        <span className={styles.handle} />
        <div
          className={styles.sprite}
          data-sprite
          style={{ backgroundImage: `url(${PULLER.src})`, aspectRatio: `${PULLER.cellW} / ${PULLER.cellH}`, translate: `0 ${-PULLER.grip[1] * 100}%` }}
        />
      </div>
    </div>
  );
}
