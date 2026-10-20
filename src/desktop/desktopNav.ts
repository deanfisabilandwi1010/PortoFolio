// Shared "Open my desktop" behaviour: jump straight to the full-size desktop
// without forcing the visitor through the whole zoom scene.
type ScrollTo = (target: number, opts?: { immediate?: boolean; onComplete?: () => void }) => void;

/** Middle of the "full desktop" phase of the scene (see PHASE in DesktopScene). */
export const DESKTOP_READY_PROGRESS = 0.33;

/** `focus`: move focus into the desktop when the scroll lands (button use, not deep links). */
export function goToDesktop(scrollTo: ScrollTo, opts: { immediate?: boolean; focus?: boolean } = {}) {
  const section = document.getElementById("desktop");
  const track = section?.querySelector<HTMLElement>("[data-desktop-track]");
  const stage = section?.querySelector<HTMLElement>("[data-desktop-stage]");
  if (!section || !track || !stage) return;
  const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 0;
  const trackTop = track.getBoundingClientRect().top + window.scrollY;
  let target: number;
  if (section.dataset.scene) {
    const stickyTop = parseFloat(getComputedStyle(stage).top) || 0;
    target = trackTop - stickyTop + Math.max(0, track.offsetHeight - stage.offsetHeight) * DESKTOP_READY_PROGRESS;
  } else {
    target = trackTop - headerH - 12;
  }
  const startedFrom = document.activeElement;
  const focusDesktop = () => {
    // Never steal focus the visitor has already moved elsewhere during the scroll.
    if (opts.focus === false || document.activeElement !== startedFrom) return;
    document.getElementById("desktop-heading")?.focus({ preventScroll: true });
  };
  scrollTo(target, { immediate: opts.immediate, onComplete: focusDesktop });
}
