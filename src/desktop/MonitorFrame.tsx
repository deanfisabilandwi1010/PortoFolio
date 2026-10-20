import styles from "./DesktopScene.module.css";

/**
 * Original CRT bezel drawn in CSS around the real desktop screen.
 * Its size comes from the measured screen (CSS vars set by DesktopScene),
 * so zoom maths and aperture always line up. Purely decorative.
 */
export function MonitorFrame() {
  return (
    <div className={styles.monitor} aria-hidden data-device>
      <div className={styles.casing}>
        <div className={styles.chin}>
          <span className={styles.vents}>
            {Array.from({ length: 6 }, (_, i) => (
              <i key={i} />
            ))}
          </span>
          <span className={`${styles.badge} label-mono`}>dean.os</span>
          <span className={styles.power}>
            <i />
          </span>
        </div>
      </div>
      <div className={styles.recess} />
      <div className={styles.neck} />
      <div className={styles.base} />
    </div>
  );
}

/** Phone casing for the zoom scene on small screens; same measured-aperture approach. */
export function PhoneFrame() {
  return (
    <div className={styles.phone} aria-hidden data-device>
      <div className={styles.phoneCasing}>
        <span className={styles.phoneSpeaker} />
        <span className={styles.phoneCamera} />
        <span className={styles.phoneHome} />
      </div>
      <span className={`${styles.phoneButton} ${styles.phoneButtonPower}`} />
      <span className={`${styles.phoneButton} ${styles.phoneButtonVolume}`} />
    </div>
  );
}

/** Small static monitor used with reduced motion instead of the zoom scene. */
export function MonitorMini() {
  return (
    <div className={styles.mini} aria-hidden>
      <div className={styles.miniCasing}>
        <div className={styles.miniScreen} />
        <span className={styles.miniPower} />
      </div>
      <div className={styles.miniBase} />
    </div>
  );
}
