import { useShallow } from "zustand/react/shallow";
import { appById, windowIds } from "../data/desktopApps";
import { Clock } from "../components/Clock";
import { desktopStore, useDesktop } from "./useWindowStore";
import styles from "./DesktopSurface.module.css";

export function DesktopTaskbar({ showMotionToggle }: { showMotionToggle: boolean }) {
  const running = useDesktop(useShallow((s) => windowIds.filter((id) => s.windows[id].status !== "closed")));
  const statuses = useDesktop(useShallow((s) => running.map((id) => s.windows[id].status)));
  const focusedId = useDesktop((s) => s.focusedId);
  const motionPaused = useDesktop((s) => s.motionPaused);
  const a = desktopStore.getState();

  const onTask = (id: (typeof windowIds)[number], status: string) => {
    if (status === "minimized") a.restoreWindow(id);
    else if (focusedId === id) a.minimizeWindow(id);
    else a.focusWindow(id);
  };

  return (
    <div className={styles.taskbar} role="toolbar" aria-label="Taskbar">
      <span className={styles.brand} aria-hidden>
        <i />
        dean.os
      </span>
      <ul className={styles.tasks} aria-label="Open windows">
        {running.map((id, i) => {
          const active = statuses[i] === "open" && focusedId === id;
          return (
            <li key={id}>
              <button
                type="button"
                className={`${styles.task} ${active ? styles.taskActive : ""} ${statuses[i] === "minimized" ? styles.taskMin : ""}`}
                aria-pressed={active}
                onClick={() => onTask(id, statuses[i])}
                title={statuses[i] === "minimized" ? `Restore ${appById[id].file}` : appById[id].file}
              >
                {appById[id].file}
                {statuses[i] === "minimized" && <span className="sr-only"> (minimized)</span>}
              </button>
            </li>
          );
        })}
      </ul>
      <div className={styles.tray}>
        {focusedId && (
          <button type="button" className={`${styles.trayBtn} ${styles.centerBtn}`} onClick={() => a.centerWindow(focusedId)}>
            Center window
          </button>
        )}
        <button type="button" className={styles.trayBtn} onClick={() => a.resetDesktop()}>
          Reset desktop
        </button>
        {showMotionToggle && (
          <button type="button" className={styles.trayBtn} aria-pressed={motionPaused} onClick={() => a.toggleMotionPaused()}>
            {motionPaused ? "Play motion" : "Pause motion"}
          </button>
        )}
        <span className={styles.clock}>
          <Clock prefix="" />
        </span>
      </div>
    </div>
  );
}
