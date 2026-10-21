import { credentials, dutyAreas, profile } from "../data/portfolio";
import styles from "./apps.module.css";

export function AboutApp() {
  return (
    <article className={styles.doc}>
      <p className={styles.docLine}>
        <b>name</b> {profile.name}
      </p>
      {credentials.map((c) => (
        <p key={c.id} className={styles.docLine}>
          <b>{c.kind.toLowerCase()}</b> {c.title}, {c.org}
        </p>
      ))}
      <hr />
      {profile.bio.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </article>
  );
}

export function DayJobApp() {
  return (
    <article className={styles.doc}>
      <p className={styles.docLine}>
        <b>role</b> {profile.role}, {profile.company}
      </p>
      {dutyAreas.map((d) => (
        <section key={d.index} className={styles.docSection}>
          <h4>
            [{d.index}] {d.title} {d.italic}
          </h4>
          <p>{d.summary}</p>
          <ul>
            {d.apps?.map((app) => (
              <li key={app.code}>
                <b>{app.code}</b> {app.area} — {app.short.toLowerCase()} <i>(name withheld)</i>
              </li>
            ))}
            {d.points.map((pt) => (
              <li key={pt}>{pt}</li>
            ))}
          </ul>
        </section>
      ))}
    </article>
  );
}

export function ContactApp() {
  return (
    <article className={styles.doc}>
      <p>The fastest ways to reach me:</p>
      <ul className={styles.contactList}>
        {profile.email && (
          <li>
            <b>email</b> <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </li>
        )}
        {profile.githubUrl && (
          <li>
            <b>github</b>{" "}
            <a href={profile.githubUrl} target="_blank" rel="noreferrer">
              {profile.githubUrl.replace("https://", "")}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        )}
        {profile.linkedinUrl && (
          <li>
            <b>linkedin</b>{" "}
            <a href={profile.linkedinUrl} target="_blank" rel="noreferrer">
              {profile.linkedinUrl.replace("https://", "")}
            </a>
          </li>
        )}
      </ul>
    </article>
  );
}
