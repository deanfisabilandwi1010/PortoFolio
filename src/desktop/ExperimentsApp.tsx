import { experiments } from "../data/portfolio";
import { ArrowUpRight, GithubMark } from "../components/Icons";
import styles from "./apps.module.css";

/** The Experiments folder: same file list as Projects, one row per experiment. */
export function ExperimentsApp() {
  return (
    <div className={styles.folder}>
      <p className={`${styles.folderPath} label-mono`}>
        ~/dean/experiments — {experiments.length} {experiments.length === 1 ? "item" : "items"}
      </p>
      <ul className={styles.folderList}>
        {experiments.map((e) => (
          <li key={e.id} className={styles.folderItem}>
            <img src={e.frames[0].sm} width={640} height={400} alt="" loading="lazy" />
            <div className={styles.folderMeta}>
              <p className={styles.folderTitle}>
                <span className="label-mono">{e.code}</span> {e.title}
              </p>
              <p className={styles.folderSub}>
                {e.tagline}
                {e.year ? ` · ${e.year}` : ""}
              </p>
              <div className={styles.folderActions}>
                <a href={e.liveUrl} target="_blank" rel="noreferrer" className={styles.miniBtn}>
                  Live <ArrowUpRight />
                  <span className="sr-only">: {e.title} (opens in a new tab)</span>
                </a>
                {e.githubUrl && (
                  <a href={e.githubUrl} target="_blank" rel="noreferrer" className={`${styles.miniBtn} ${styles.miniGhost}`}>
                    <GithubMark /> Source
                    <span className="sr-only">: {e.title} on GitHub (opens in a new tab)</span>
                  </a>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
