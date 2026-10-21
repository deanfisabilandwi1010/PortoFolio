import type { DesktopApp, DesktopLink } from "../data/desktopApps";
import { FolderIcon, LinkFileIcon, ShieldIcon, TextFileIcon } from "../components/Icons";
import { desktopStore } from "./useWindowStore";
import styles from "./DesktopSurface.module.css";

function Glyph({ app }: { app: DesktopApp }) {
  if (app.thumb && app.kind === "video")
    return (
      <span className={styles.clipThumb}>
        <img className={styles.thumb} src={app.thumb} width={160} height={160} alt="" loading="lazy" />
        <span className={styles.playBadge} aria-hidden />
      </span>
    );
  if (app.thumb) return <img className={styles.thumb} src={app.thumb} width={160} height={160} alt="" loading="lazy" />;
  if (app.kind === "folder") return <FolderIcon className={styles.svgIcon} />;
  if (app.id === "dayjob") return <ShieldIcon className={styles.svgIcon} />;
  return <TextFileIcon className={styles.svgIcon} />;
}

export function DesktopIcon({ app }: { app: DesktopApp }) {
  const triggerId = `icon-${app.id}`;
  return (
    <li>
      <button
        id={triggerId}
        type="button"
        className={styles.icon}
        onClick={() => desktopStore.getState().openWindow(app.id, triggerId)}
        aria-label={`Open ${app.file}`}
      >
        <span className={styles.iconArt}>
          <Glyph app={app} />
        </span>
        <span className={styles.iconLabel}>{app.file}</span>
      </button>
    </li>
  );
}

export function DesktopLinkIcon({ link }: { link: DesktopLink }) {
  return (
    <li>
      <a href={link.href} target="_blank" rel="noreferrer" className={styles.icon}>
        <span className={styles.iconArt}>
          <LinkFileIcon className={styles.svgIcon} />
        </span>
        <span className={styles.iconLabel}>{link.file}</span>
        <span className="sr-only"> (opens GitHub in a new tab)</span>
      </a>
    </li>
  );
}
