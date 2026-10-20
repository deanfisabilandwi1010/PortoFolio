import { projects } from "../data/portfolio";
import { ArrowUpRight, GithubMark } from "../components/Icons";
import styles from "./apps.module.css";

export function ProjectsApp() {
  return (
    <div className={styles.folder}>
      <p className={`${styles.folderPath} label-mono`}>~/dean/projects — {projects.length} items</p>
      <ul className={styles.folderList}>
        {projects.map((p) => (
          <li key={p.id} className={styles.folderItem}>
            <img src={p.previewSmall} width={800} height={500} alt="" loading="lazy" />
            <div className={styles.folderMeta}>
              <p className={styles.folderTitle}>
                <span className="label-mono">{p.index}</span> {p.title}
              </p>
              <p className={styles.folderSub}>
                {p.client}
                {p.year ? ` · ${p.year}` : ""}
              </p>
              <div className={styles.folderActions}>
                <a href={p.liveUrl} target="_blank" rel="noreferrer" className={styles.miniBtn}>
                  Live <ArrowUpRight />
                  <span className="sr-only">: {p.title} (opens in a new tab)</span>
                </a>
                {p.githubUrl && (
                  <a href={p.githubUrl} target="_blank" rel="noreferrer" className={`${styles.miniBtn} ${styles.miniGhost}`}>
                    <GithubMark /> Source
                    <span className="sr-only">: {p.title} on GitHub (opens in a new tab)</span>
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
