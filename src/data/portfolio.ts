// Single source of truth for every piece of content on the site.
// Fields set to `null` are hidden from the public UI. `npm run check:publish`
// lists anything that still needs the owner's input before going live.

export type Project = {
  id: "kalili" | "tooday";
  index: string;
  title: string;
  client: string;
  liveUrl: string;
  githubUrl: string | null;
  summary: string;
  highlights: string[];
  role: string | null;
  stack: string[];
  year: number | null;
  preview: string;
  previewSmall: string;
  previewMobile: string;
  previewAlt: string;
};

export type Credential = {
  id: "unand" | "pln";
  kind: string;
  title: string;
  org: string;
  logo: string;
  logoAlt: string;
  logoWidth: number;
  logoHeight: number;
};

export type InternalApp = {
  name: string;
  /** Which hover illustration the tile plays. */
  art: "modules" | "archive" | "kpi" | "governance";
  /** Two-word label for tight spots (the ID card's back). */
  short: string;
  /** Short qualifier shown next to the name, e.g. "KPI" */
  tag?: string;
  description: string;
};

export type DutyArea = {
  index: string;
  title: string;
  italic: string;
  summary: string;
  /** Named systems, shown as tiles. */
  apps?: InternalApp[];
  points: string[];
  tags: string[];
};

export type Profile = {
  name: string;
  wordmark: string;
  closingWordmark: string;
  role: string;
  company: string;
  bio: string[];
  email: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  instagramUrl: string | null;
  timezone: string;
  timezoneLabel: string;
  availability: string | null;
};

export const profile: Profile = {
  name: "Dean Fisabil Andwi",
  wordmark: "DEAN FISABIL ANDWI",
  closingWordmark: "ANDWI",
  role: "Programmer",
  company: "PLN Nusa Daya",
  bio: [
    "I'm Dean — a programmer at PLN Nusa Daya and an Information Systems graduate of Universitas Andalas.",
    "By day I keep internal applications running and the company's public web surface secure. Outside of that, I design and build expressive websites for local brands — the kind people remember after they close the tab.",
  ],
  email: "deanfisabilandwi@gmail.com",
  githubUrl: "https://github.com/deanfisabilandwi1010",
  linkedinUrl: "https://www.linkedin.com/in/deanfisabilandwi/",
  instagramUrl: null,
  timezone: "Asia/Jakarta",
  timezoneLabel: "WIB",
  // Only set this if the owner confirms they are taking new work.
  availability: null,
};

export const credentials: Credential[] = [
  {
    id: "pln",
    kind: "Currently",
    title: "Programmer",
    org: "PLN Nusa Daya",
    logo: "/assets/logos/pln-nusa-daya.webp",
    logoAlt: "PLN Nusa Daya logo",
    logoWidth: 538,
    logoHeight: 160,
  },
  {
    id: "unand",
    kind: "Graduated",
    title: "Bachelor of Information Systems",
    org: "Universitas Andalas",
    logo: "/assets/logos/unand.webp",
    logoAlt: "Universitas Andalas emblem",
    logoWidth: 198,
    logoHeight: 240,
  },
];

export const dutyAreas: DutyArea[] = [
  {
    index: "A",
    title: "Internal",
    italic: "applications",
    summary:
      "I manage the internal web applications teams at PLN Nusa Daya rely on every day — keeping them running, fixing what breaks, and shipping the improvements people ask for.",
    apps: [
      { name: "ERP", art: "modules", short: "Business processes", description: "The system behind the company's day-to-day business processes" },
      { name: "E-Arsip", art: "archive", short: "Document archive", description: "A digital archive for company documents" },
      { name: "Kinerja", tag: "KPI", art: "kpi", short: "Performance · KPI", description: "Performance and KPI tracking for teams and staff" },
      { name: "GCG", tag: "Good Corporate Governance", art: "governance", short: "Corporate governance", description: "Good Corporate Governance assessment and reporting" },
    ],
    points: ["Maintenance, bug fixing and feature requests, with deployments, data and access kept tidy"],
    tags: ["Laravel", "PHP", "Blade", "JavaScript"],
  },
  {
    index: "B",
    title: "SecurityScorecard",
    italic: "web posture",
    summary:
      "I handle the company's web findings on SecurityScorecard — reading each issue, tracing it to the asset behind it, fixing it, and confirming the fix is picked up.",
    points: [
      "Triage findings on public-facing web assets",
      "Remediate configuration issues such as TLS and security headers",
      "Re-check and document each fix until the finding is resolved",
    ],
    tags: ["Web security", "TLS", "HTTP headers", "Remediation"],
  },
];

export const projects: Project[] = [
  {
    id: "kalili",
    index: "01",
    title: "Kalili Steam Club",
    client: "Dimsum by Kalili",
    liveUrl: "https://kalilidimsum.netlify.app/",
    githubUrl: "https://github.com/deanfisabilandwi1010/kaliliDimsum",
    summary:
      "An interactive landing page for a dimsum outlet. Press and hold to lift the steamer lid, turn a 3D dumpling to see its layers, and let the menu unfold as you scroll.",
    highlights: [
      "Hold-to-open steamer intro",
      "Rotatable 3D dumpling cross-section",
      "Scroll-driven menu with a Black Series spotlight",
      "“Pilihanmu” — a personal picks list",
    ],
    role: null,
    stack: ["Next.js", "React", "Three.js", "GSAP", "TypeScript"],
    year: 2026,
    preview: "/assets/projects/kalili-preview.webp",
    previewSmall: "/assets/projects/kalili-preview-sm.webp",
    previewMobile: "/assets/projects/kalili-mobile.webp",
    previewAlt: "Kalili Steam Club homepage: a cream serif headline on deep red above a bamboo steamer",
  },
  {
    id: "tooday",
    index: "02",
    title: "Tooday",
    client: "Tooday House",
    liveUrl: "https://toodaycafee.vercel.app/",
    githubUrl: "https://github.com/deanfisabilandwi1010/t00day",
    summary:
      "A website for a coffee, matcha and ButterTteok outlet. A filterable, swipeable menu, pairing suggestions, a picks list, and an in-store order flow: pick, send, pay at the cashier.",
    highlights: [
      "Category-filtered, swipeable menu cards",
      "Drink-and-snack pairing suggestions",
      "“Pilihanku” saved picks",
      "Order flow — pick, send, pay at the cashier",
    ],
    role: null,
    stack: ["Next.js", "React", "GSAP", "Lenis", "Supabase", "TypeScript"],
    year: 2026,
    preview: "/assets/projects/tooday-preview.webp",
    previewSmall: "/assets/projects/tooday-preview-sm.webp",
    previewMobile: "/assets/projects/tooday-mobile.webp",
    previewAlt: "Tooday homepage: “Make every day, tooday!” beside iced coffee, matcha and ButterTteok",
  },
];

export const processSteps = [
  { index: "01", title: "Understand", italic: "the people", body: "Who is this for, and what should they walk away with? I start with the people and the problem, not the pixels." },
  { index: "02", title: "Design", italic: "with intent", body: "Composition, type and motion get decided together, so the site has a point of view before a line of code exists." },
  { index: "03", title: "Build", italic: "it properly", body: "Typed, componentised and fast. Interactions are wired to real content, tested on real phones." },
  { index: "04", title: "Refine", italic: "the details", body: "Timing, spacing, edge cases, accessibility. The last ten percent is where a site starts to feel crafted." },
] as const;

export const navLinks = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#stack", label: "Stack" },
  { href: "#desktop", label: "Desktop" },
  { href: "#contact", label: "Contact" },
] as const;

export const primaryContactHref = profile.email ? `mailto:${profile.email}` : profile.githubUrl;

export type StackCategory = "frontend" | "motion" | "backend" | "delivery" | "security";

export type StackItem = {
  symbol: string;
  name: string;
  category: StackCategory;
  /** Where it was actually used — every entry is backed by a repo or the day job. */
  usedIn: string[];
  note: string;
};

export const stackCategories: { id: StackCategory; label: string }[] = [
  { id: "frontend", label: "Frontend" },
  { id: "motion", label: "Motion & 3D" },
  { id: "backend", label: "Backend & data" },
  { id: "delivery", label: "Testing & delivery" },
  { id: "security", label: "Security" },
];

export const stack: StackItem[] = [
  { symbol: "Ts", name: "TypeScript", category: "frontend", usedIn: ["Kalili", "Tooday", "This site"], note: "Typed from the UI down to the data layer." },
  { symbol: "Re", name: "React", category: "frontend", usedIn: ["Kalili", "Tooday", "This site"], note: "Component-driven interfaces with real state." },
  { symbol: "Nx", name: "Next.js", category: "frontend", usedIn: ["Kalili", "Tooday"], note: "App Router sites with server-rendered pages." },
  { symbol: "Tw", name: "Tailwind CSS", category: "frontend", usedIn: ["Tooday"], note: "Utility-first styling for a fast-moving brand." },
  { symbol: "Zu", name: "Zustand", category: "frontend", usedIn: ["Tooday", "This site"], note: "Small, predictable stores — like this site's window manager." },
  { symbol: "Zd", name: "Zod", category: "frontend", usedIn: ["Tooday"], note: "Validated order data before it ever hits the database." },
  { symbol: "Gs", name: "GSAP", category: "motion", usedIn: ["Kalili", "Tooday", "This site"], note: "Scroll scenes, pins, morphs and every timeline here." },
  { symbol: "Th", name: "Three.js", category: "motion", usedIn: ["Kalili"], note: "The rotatable 3D dumpling cross-section." },
  { symbol: "Ln", name: "Lenis", category: "motion", usedIn: ["Tooday", "This site"], note: "Smooth scroll wired into one animation clock." },
  { symbol: "Lv", name: "Laravel", category: "backend", usedIn: ["E-Arsip", "Internal apps"], note: "Laravel 12 behind PLN Nusa Daya's internal tools." },
  { symbol: "Ph", name: "PHP", category: "backend", usedIn: ["E-Arsip", "Internal apps"], note: "Server-side logic for the company's day-to-day systems." },
  { symbol: "Sb", name: "Supabase", category: "backend", usedIn: ["Tooday"], note: "Auth and data for the in-store order flow." },
  { symbol: "Pg", name: "PostgreSQL", category: "backend", usedIn: ["Tooday"], note: "Migrations and SQL functions for orders." },
  { symbol: "Vi", name: "Vite", category: "delivery", usedIn: ["This site"], note: "Fast builds and lazy-loaded chunks." },
  { symbol: "Pw", name: "Playwright", category: "delivery", usedIn: ["This site"], note: "End-to-end tests on Chromium, WebKit and mobile." },
  { symbol: "Vt", name: "Vitest", category: "delivery", usedIn: ["Tooday", "This site"], note: "Unit tests for the logic that must not break." },
  { symbol: "Gh", name: "Git & GitHub", category: "delivery", usedIn: ["Every project"], note: "Versioned, reviewable, shipped from a repo." },
  { symbol: "Vc", name: "Vercel", category: "delivery", usedIn: ["Tooday"], note: "Production hosting for Tooday." },
  { symbol: "Nf", name: "Netlify", category: "delivery", usedIn: ["Kalili"], note: "Production hosting for Kalili Steam Club." },
  { symbol: "Sc", name: "SecurityScorecard", category: "security", usedIn: ["PLN Nusa Daya"], note: "Triage and remediation of public web findings." },
  { symbol: "Tl", name: "TLS & headers", category: "security", usedIn: ["PLN Nusa Daya"], note: "Hardening configuration on public-facing assets." },
];
