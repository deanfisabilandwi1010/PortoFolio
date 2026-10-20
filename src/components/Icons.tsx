import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

export const ArrowUpRight = (p: P) => (
  <svg viewBox="0 0 16 16" {...base} {...p}>
    <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" />
  </svg>
);

export const ArrowDown = (p: P) => (
  <svg viewBox="0 0 16 16" {...base} {...p}>
    <path d="M8 3v10M3.5 8.5 8 13l4.5-4.5" />
  </svg>
);

export const ArrowRight = (p: P) => (
  <svg viewBox="0 0 16 16" {...base} {...p}>
    <path d="M3 8h10M8.5 3.5 13 8l-4.5 4.5" />
  </svg>
);

export const ArrowLeft = (p: P) => (
  <svg viewBox="0 0 16 16" {...base} {...p}>
    <path d="M13 8H3M7.5 3.5 3 8l4.5 4.5" />
  </svg>
);

export const Plus = (p: P) => (
  <svg viewBox="0 0 16 16" {...base} {...p}>
    <path d="M8 3v10M3 8h10" />
  </svg>
);

export const GithubMark = (p: P) => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden {...p}>
    <path d="M8 .2a8 8 0 0 0-2.53 15.6c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.72 1.22 1.88.87 2.33.66.07-.52.28-.87.5-1.07-1.77-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 8 .2Z" />
  </svg>
);

/* Desktop file icons — drawn in the palette, original shapes. */
export const FolderIcon = (p: P) => (
  <svg viewBox="0 0 48 40" aria-hidden {...p}>
    <path d="M2 6a3 3 0 0 1 3-3h13l4 5h21a3 3 0 0 1 3 3v24a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3Z" fill="#557373" />
    <path d="M2 13a3 3 0 0 1 3-3h38a3 3 0 0 1 3 3v22a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3Z" fill="#DFE5F3" stroke="#272401" strokeWidth="1.5" />
    <path d="M9 19h14" stroke="#557373" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const TextFileIcon = (p: P) => (
  <svg viewBox="0 0 40 48" aria-hidden {...p}>
    <path d="M4 3h22l10 10v31a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" fill="#F2EFEA" stroke="#272401" strokeWidth="1.5" />
    <path d="M26 3v10h10" fill="#DFE5F3" stroke="#272401" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M9 21h20M9 27h20M9 33h14" stroke="#557373" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const LinkFileIcon = (p: P) => (
  <svg viewBox="0 0 40 48" aria-hidden {...p}>
    <path d="M4 3h22l10 10v31a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" fill="#DFE5F3" stroke="#272401" strokeWidth="1.5" />
    <path d="M26 3v10h10" fill="#F2EFEA" stroke="#272401" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="19" cy="29" r="9" fill="#272401" />
    <path d="M15.5 32.5 22.5 25.5M17.5 25.5h5v5" stroke="#F2EFEA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export const ShieldIcon = (p: P) => (
  <svg viewBox="0 0 40 48" aria-hidden {...p}>
    <path d="M4 3h22l10 10v31a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" fill="#F2EFEA" stroke="#272401" strokeWidth="1.5" />
    <path d="M26 3v10h10" fill="#DFE5F3" stroke="#272401" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M19 19l8 3v6c0 5-3.6 8-8 9.5-4.4-1.5-8-4.5-8-9.5v-6Z" fill="#557373" />
    <path d="m15.5 28.5 2.5 2.5 5-5" stroke="#F2EFEA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);
