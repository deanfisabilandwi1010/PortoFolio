import type { Photo } from "../data/photos";
import styles from "./apps.module.css";

/** Image viewer: always `contain`, never upscaled past the source, original colours. */
export function PhotoViewer({ photo }: { photo: Photo }) {
  return (
    <figure className={styles.viewer}>
      <div className={styles.viewerStage}>
        <img src={photo.src} width={photo.width} height={photo.height} alt={photo.alt} loading="lazy" decoding="async" />
      </div>
      <figcaption className={`${styles.viewerCaption} label-mono`}>
        <span>{photo.caption}</span>
        <span>
          {photo.width}×{photo.height}
        </span>
      </figcaption>
    </figure>
  );
}
