import type { RefObject } from "react";
import { gsap, useGSAP } from "./gsap";
import { MM } from "./useMotionPreference";

/**
 * Reveals every [data-reveal] inside `scope` once, as it enters the viewport,
 * and masks [data-reveal-lines] headings line by line.
 * Content is fully visible without JS and under reduced motion.
 */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MM.motion, () => {
        gsap.utils.toArray<HTMLElement>("[data-reveal]", scope.current).forEach((el) => {
          gsap.from(el, {
            y: 20,
            autoAlpha: 0,
            duration: 0.5,
            ease: "power3.out",
            delay: Number(el.dataset.revealDelay ?? 0),
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-scrub-words]", scope.current).forEach((el) => {
          gsap.fromTo(
            el.querySelectorAll("[data-word]"),
            { opacity: 0.14 },
            { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: el, start: "top 88%", end: "bottom 52%", scrub: 0.5 } },
          );
        });
        gsap.utils.toArray<HTMLElement>("[data-reveal-lines]", scope.current).forEach((el) => {
          gsap.from(el.querySelectorAll(".line-mask > span"), {
            yPercent: 105,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope },
  );
}
