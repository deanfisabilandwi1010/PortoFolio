import { useEffect, useRef, type KeyboardEvent, type ReactNode } from "react";
import { desktopApps, desktopLinks, type WindowId } from "../data/desktopApps";
import { desktopStore } from "./useWindowStore";
import { DesktopIcon, DesktopLinkIcon } from "./DesktopIcon";
import { DesktopTaskbar } from "./DesktopTaskbar";
import { DesktopBuddy } from "./DesktopBuddy";
import { RetroWindow, closeWithFocus } from "./RetroWindow";
import { PhotoViewer } from "./PhotoViewer";
import { clips, photos } from "../data/photos";
import { VideoPlayer } from "./VideoPlayer";
import { ProjectsApp } from "./ProjectsApp";
import { AboutApp, ContactApp, DayJobApp } from "./TextApps";
import styles from "./DesktopSurface.module.css";

const content: Record<WindowId, () => ReactNode> = {
  projects: () => <ProjectsApp />,
  about: () => <AboutApp />,
  dayjob: () => <DayJobApp />,
  contact: () => <ContactApp />,
  portrait: () => <PhotoViewer photo={photos.portrait} />,
  photobooth: () => <PhotoViewer photo={photos.photobooth} />,
  photoboothClip: () => <VideoPlayer id="photoboothClip" clip={clips.photobooth} />,
  memories: () => <PhotoViewer photo={photos.memories} />,
  afterHours: () => <PhotoViewer photo={photos.afterHours} />,
};

type Props = {
  windowed: boolean;
  reduced: boolean;
};

/** The one functional desktop: icons, windows, taskbar. */
export default function DesktopSurface({ windowed, reduced }: Props) {
  const areaRef = useRef<HTMLDivElement>(null);

  // Bounds = the area above the taskbar. Measured, then every window is re-clamped.
  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        desktopStore.getState().setBounds({ width: el.clientWidth, height: el.clientHeight }, { windowed });
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [windowed]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "Escape") return;
    const { focusedId, windows } = desktopStore.getState();
    if (focusedId && windows[focusedId].status === "open") {
      e.preventDefault();
      closeWithFocus(focusedId);
    }
  };

  return (
    <div className={`${styles.surface} ${windowed ? styles.windowed : styles.compact}`} onKeyDown={onKeyDown}>
      <div className={styles.wallpaper} aria-hidden />
      <div ref={areaRef} className={styles.area}>
        <h3 id="desktop-heading" className={styles.hint} tabIndex={-1}>
          <span className={styles.hintDot} aria-hidden />
          Open a file
          <span className={styles.hintSub}> — {windowed ? "click an icon, drag a title bar" : "tap an icon"}</span>
        </h3>
        <ul className={styles.icons} aria-label="Files">
          {desktopApps.map((app) => (
            <DesktopIcon key={app.id} app={app} />
          ))}
          {desktopLinks.map((l) => (
            <DesktopLinkIcon key={l.id} link={l} />
          ))}
        </ul>
        {windowed && <DesktopBuddy reduced={reduced} />}
        {desktopApps.map((app) => (
          <RetroWindow key={app.id} id={app.id} boundsRef={areaRef} windowed={windowed} reduced={reduced}>
            {content[app.id]()}
          </RetroWindow>
        ))}
      </div>
      <DesktopTaskbar showMotionToggle={windowed && !reduced} />
    </div>
  );
}
