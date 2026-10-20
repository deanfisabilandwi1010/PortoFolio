import { useLayoutEffect, useRef, type ReactNode, type RefObject } from "react";
import { gsap } from "gsap";
import { appById, desktopApps, type WindowId } from "../data/desktopApps";
import { ArrowLeft, ArrowRight } from "../components/Icons";
import { desktopStore, useDesktop, type WindowStatus } from "./useWindowStore";
import { useDraggableWindow } from "./useDraggableWindow";
import styles from "./RetroWindow.module.css";

type Props = {
  id: WindowId;
  boundsRef: RefObject<HTMLElement | null>;
  /** Overlapping draggable windows (>= 768px). Otherwise one full panel at a time. */
  windowed: boolean;
  reduced: boolean;
  children: ReactNode;
};

/** Close a window and hand focus back to whatever opened it. */
// eslint-disable-next-line react-refresh/only-export-components
export function closeWithFocus(id: WindowId) {
  const { windows, closeWindow } = desktopStore.getState();
  const trigger = windows[id].triggerId;
  closeWindow(id);
  const el = trigger ? document.getElementById(trigger) : null;
  (el ?? document.getElementById("desktop-heading"))?.focus({ preventScroll: true });
}

export function RetroWindow({ id, boundsRef, windowed, reduced, children }: Props) {
  const app = appById[id];
  const w = useDesktop((s) => s.windows[id]);
  const focused = useDesktop((s) => s.focusedId === id);
  const actions = desktopStore.getState();

  const positionRef = useRef<HTMLDivElement>(null);
  const transitionRef = useRef<HTMLDivElement>(null);
  const titleBarRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const prevStatus = useRef<WindowStatus | null>(null);

  // In panel mode only the focused window is shown.
  const visible = w.status === "open" && (windowed || focused);

  useDraggableWindow({
    id,
    target: positionRef,
    handle: titleBarRef,
    bounds: boundsRef,
    x: w.rect.x,
    y: w.rect.y,
    enabled: windowed && !w.maximized && visible,
  });

  // WindowTransition owns opacity/scale only; WindowPosition (x/y) is untouched.
  useLayoutEffect(() => {
    const el = transitionRef.current;
    if (!el) return;
    const prev = prevStatus.current;
    prevStatus.current = visible ? "open" : w.status;
    const wasVisible = prev === "open";
    if (prev === null) {
      gsap.set(el, { autoAlpha: visible ? 1 : 0, scale: 1 });
      return;
    }
    if (visible && !wasVisible) {
      // Visible immediately so focus can move in while the fade runs.
      gsap.set(el, { visibility: "visible" });
      gsap.fromTo(
        el,
        { opacity: 0, scale: 0.97, transformOrigin: "50% 50%" },
        { opacity: 1, scale: 1, duration: reduced ? 0 : 0.22, ease: "power2.out", overwrite: true },
      );
      const title = titleRef.current;
      title?.focus({ preventScroll: true });
      // WebKit can refuse focus in the same frame the window stops being hidden.
      requestAnimationFrame(() => {
        if (title && !el.contains(document.activeElement)) title.focus({ preventScroll: true });
      });
    } else if (!visible && wasVisible) {
      const minimizing = w.status === "minimized";
      gsap.to(el, {
        autoAlpha: 0,
        scale: minimizing ? 0.92 : 0.98,
        transformOrigin: minimizing ? "50% 100%" : "50% 50%",
        duration: reduced ? 0 : minimizing ? 0.18 : 0.15,
        ease: "power2.in",
        overwrite: true,
      });
    }
  }, [visible, w.status, reduced]);

  const index = desktopApps.findIndex((a) => a.id === id);
  const nextApp = desktopApps[(index + 1) % desktopApps.length];

  return (
    <div
      ref={positionRef}
      className={`${styles.position} ${windowed ? "" : styles.panel}`}
      style={{ width: w.rect.width, height: w.rect.height, zIndex: w.z }}
      onPointerDownCapture={() => actions.focusWindow(id)}
      onFocusCapture={() => {
        if (!focused) actions.focusWindow(id);
      }}
    >
      <div ref={transitionRef} className={styles.transition}>
        <section
          className={`${styles.surface} ${focused ? styles.focused : ""}`}
          role="dialog"
          aria-modal="false"
          aria-labelledby={`win-title-${id}`}
          data-window={id}
          data-maximized={w.maximized || undefined}
        >
          <div ref={titleBarRef} className={styles.titleBar} onDoubleClick={() => windowed && actions.toggleMaximize(id)}>
            {!windowed && (
              <button type="button" className={styles.navBtn} onClick={() => closeWithFocus(id)} aria-label="Back to files">
                <ArrowLeft />
              </button>
            )}
            <h3 ref={titleRef} id={`win-title-${id}`} className={styles.title} tabIndex={-1}>
              {app.title}
            </h3>
            <div className={styles.controls}>
              {windowed ? (
                <>
                  <button type="button" className={styles.ctrl} onClick={() => actions.minimizeWindow(id)} aria-label={`Minimize ${app.file}`} title="Minimize">
                    <span className={`${styles.glyph} ${styles.min}`} aria-hidden />
                  </button>
                  <button
                    type="button"
                    className={styles.ctrl}
                    onClick={() => actions.toggleMaximize(id)}
                    aria-label={`${w.maximized ? "Restore" : "Maximize"} ${app.file}`}
                    title={w.maximized ? "Restore" : "Maximize"}
                  >
                    <span className={`${styles.glyph} ${w.maximized ? styles.restore : styles.max}`} aria-hidden />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className={styles.navBtn}
                  onClick={() => {
                    actions.closeWindow(id);
                    actions.openWindow(nextApp.id, w.triggerId);
                  }}
                  aria-label={`Next file: ${nextApp.file}`}
                >
                  <ArrowRight />
                </button>
              )}
              <button type="button" className={styles.ctrl} onClick={() => closeWithFocus(id)} aria-label={`Close ${app.file}`} title="Close">
                <span className={`${styles.glyph} ${styles.close}`} aria-hidden />
              </button>
            </div>
          </div>
          <div className={styles.body} data-lenis-prevent>
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}
