/** Cartoon Dean: 8 frames side by side, built by scripts/build-pusher-sheet.mjs. Used by the loader and Contact. */
export const PUSHER = {
  src: "/assets/loader/pusher.webp",
  frames: 8,
  /** frames 0-5 are the push cycle */
  cycle: 6,
  brace: 6,
  done: 7,
  /** where the palms sit in a cell (fraction of its width) */
  palms: 0.97,
  /** where the soles sit (fraction of its height) */
  soles: 0.98,
} as const;

/** background-position-x that shows frame `f` of the sheet. */
export const pusherFrame = (f: number) => `${(f / (PUSHER.frames - 1)) * 100}%`;
