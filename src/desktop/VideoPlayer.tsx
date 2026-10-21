import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Clip } from "../data/photos";
import type { WindowId } from "../data/desktopApps";
import { useMotion } from "../app/MotionProvider";
import { useDesktop } from "./useWindowStore";
import styles from "./apps.module.css";

const fmt = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

/**
 * Video player for short silent clips. Plays (muted, looping) only while its window is
 * actually on screen; under reduced motion it waits for the play button.
 */
export function VideoPlayer({ id, clip }: { id: WindowId; clip: Clip }) {
  const video = useRef<HTMLVideoElement>(null);
  const { windowed, reduced } = useMotion();
  // In panel mode only the focused window is shown.
  const open = useDesktop((s) => s.windows[id].status === "open" && (windowed || s.focusedId === id));
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(clip.duration);
  // The visitor's own pause wins over autoplay until the window is closed again.
  const userPaused = useRef(false);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    if (!open) {
      userPaused.current = false;
      el.pause();
      return;
    }
    if (inView && !reduced && !userPaused.current) el.play().catch(() => {});
    else el.pause();
  }, [open, inView, reduced]);

  const toggle = () => {
    const el = video.current;
    if (!el) return;
    if (el.paused) {
      userPaused.current = false;
      el.play().catch(() => {});
    } else {
      userPaused.current = true;
      el.pause();
    }
  };

  return (
    <figure className={styles.viewer}>
      <div className={styles.viewerStage}>
        <video
          ref={video}
          className={styles.clip}
          src={clip.src}
          poster={clip.poster}
          width={clip.width}
          height={clip.height}
          muted
          loop
          playsInline
          preload="none"
          aria-label={clip.alt}
          onClick={toggle}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onLoadedMetadata={(e) => Number.isFinite(e.currentTarget.duration) && setDuration(e.currentTarget.duration)}
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        />
        {!playing && (
          <button type="button" className={styles.bigPlay} onClick={toggle} aria-label={`Play ${clip.caption}`}>
            <span aria-hidden />
          </button>
        )}
      </div>
      <div className={styles.player}>
        <button type="button" className={styles.playBtn} onClick={toggle} aria-label={playing ? "Pause" : "Play"} data-playing={playing || undefined}>
          <span aria-hidden />
        </button>
        <input
          className={styles.seek}
          type="range"
          min={0}
          max={duration}
          step={0.05}
          value={time}
          aria-label="Seek"
          aria-valuetext={`${fmt(time)} of ${fmt(duration)}`}
          style={{ "--p": `${(time / duration) * 100}%` } as CSSProperties}
          onChange={(e) => {
            const el = video.current;
            if (!el) return;
            el.currentTime = Number(e.target.value);
            setTime(el.currentTime);
          }}
        />
        <span className={`${styles.time} label-mono`}>
          {fmt(time)} / {fmt(duration)}
        </span>
        <span className={`${styles.loop} label-mono`} title="Loops, no sound">
          Loop · muted
        </span>
      </div>
      <figcaption className={`${styles.viewerCaption} label-mono`}>
        <span>{clip.caption}</span>
        <span>
          {clip.width}×{clip.height} · {clip.duration}s
        </span>
      </figcaption>
    </figure>
  );
}
