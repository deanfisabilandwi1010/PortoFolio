// Single source of truth for every piece of content on the site.
// Fields set to `null` are hidden from the public UI. `npm run check:publish`
// lists anything that still needs the owner's input before going live.

export type Project = {
  id: "kalili" | "tooday" | "dompetqu";
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

/** An internal system, described only in broad strokes: the real names stay private. */
export type InternalApp = {
  /** Public codename, e.g. "SYS-01". */
  code: string;
  /** The broad area it serves — never the system's real name. */
  area: string;
  /** One generic line about what that area is for. */
  short: string;
  /** Which hover illustration the tile plays. */
  art: "modules" | "archive" | "kpi" | "governance";
};

export type DutyArea = {
  index: string;
  title: string;
  italic: string;
  summary: string;
  /** Internal systems, shown as redacted tiles (codename + broad area only). */
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
      { code: "SYS-01", area: "Operations", short: "Keeps everyday processes moving", art: "modules" },
      { code: "SYS-02", area: "Records", short: "Documents, archived and easy to find", art: "archive" },
      { code: "SYS-03", area: "Performance", short: "Progress teams can measure", art: "kpi" },
      { code: "SYS-04", area: "Governance", short: "Reporting that stays accountable", art: "governance" },
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
  {
    id: "dompetqu",
    index: "03",
    title: "DompetQu",
    client: "Kantong — Retro Money Club",
    liveUrl: "https://dompetqu-personal.vercel.app/",
    githubUrl: "https://github.com/deanfisabilandwi1010/DompDigital",
    summary:
      "A personal finance app dressed as a retro desktop. Accounts, transactions, virtual envelopes, budgets, savings goals and reminders — with reports, CSV export and JSON backup. A demo mode runs entirely in the browser.",
    highlights: [
      "Accounts, transactions and transfers with refunds",
      "Virtual envelopes, monthly budgets and savings goals",
      "Cash-flow and category reports with table alternatives",
      "Per-user data on Postgres + GraphQL; demo mode on IndexedDB",
      "CSV export and JSON backup / restore",
    ],
    role: null,
    stack: ["React", "TypeScript", "Vite", "Nhost", "GraphQL", "IndexedDB"],
    year: 2026,
    preview: "/assets/projects/dompetqu-preview.webp",
    previewSmall: "/assets/projects/dompetqu-preview-sm.webp",
    previewMobile: "/assets/projects/dompetqu-mobile.webp",
    previewAlt: "DompetQu dashboard in demo mode: balance, income and spending cards above cash-flow and category charts",
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
  /** What kind of tool it is, in two or three words. */
  role: string;
  /** What it does, in plain language. */
  does: string;
};

export const stackCategories: { id: StackCategory; label: string }[] = [
  { id: "frontend", label: "Frontend" },
  { id: "motion", label: "Motion & 3D" },
  { id: "backend", label: "Backend & data" },
  { id: "delivery", label: "Testing & delivery" },
  { id: "security", label: "Security" },
];

export const stack: StackItem[] = [
  { symbol: "Ts", name: "TypeScript", category: "frontend", role: "Language", does: "JavaScript with types. Catches mistakes before the code runs and keeps large codebases safe to change." },
  { symbol: "Re", name: "React", category: "frontend", role: "UI library", does: "Builds interfaces from reusable components that update themselves whenever the data changes." },
  { symbol: "Nx", name: "Next.js", category: "frontend", role: "React framework", does: "Adds routing, server rendering and image optimisation on top of React — fast pages that search engines can read." },
  { symbol: "Tw", name: "Tailwind CSS", category: "frontend", role: "Styling", does: "Utility classes written right in the markup, so a design system stays consistent without ever-growing CSS files." },
  { symbol: "Zu", name: "Zustand", category: "frontend", role: "State management", does: "A tiny store for app-wide state: shared data between components without the ceremony of bigger libraries." },
  { symbol: "Zd", name: "Zod", category: "frontend", role: "Validation", does: "Describes the exact shape data must have and rejects anything else — on the client and on the server." },
  { symbol: "Gs", name: "GSAP", category: "motion", role: "Animation engine", does: "Timeline-based animation: scroll-driven scenes, pinning, morphing and precisely tuned easing." },
  { symbol: "Th", name: "Three.js", category: "motion", role: "3D graphics", does: "Renders real-time 3D in the browser with WebGL — models, lighting and interaction." },
  { symbol: "Ln", name: "Lenis", category: "motion", role: "Smooth scroll", does: "Smooths native scrolling and keeps it perfectly in sync with scroll-driven animation." },
  { symbol: "Lv", name: "Laravel", category: "backend", role: "PHP framework", does: "Routing, authentication, database access and queues out of the box — the backbone of business applications." },
  { symbol: "Ph", name: "PHP", category: "backend", role: "Server language", does: "Runs the server-side logic behind web applications: requests, rules and data." },
  { symbol: "Sb", name: "Supabase", category: "backend", role: "Backend platform", does: "A hosted Postgres database with authentication, storage and APIs ready to use." },
  { symbol: "Nh", name: "Nhost", category: "backend", role: "Backend platform", does: "Postgres, authentication and a GraphQL API as a service — each user only ever reads their own rows." },
  { symbol: "Gq", name: "GraphQL", category: "backend", role: "API query language", does: "Lets the app ask the server for exactly the fields it needs, in one request." },
  { symbol: "Dx", name: "Dexie", category: "backend", role: "Browser database", does: "A friendly wrapper around IndexedDB for storing data on the device — offline demos included." },
  { symbol: "Pg", name: "PostgreSQL", category: "backend", role: "Database", does: "A relational database for structured data, with transactions that keep every record consistent." },
  { symbol: "Vi", name: "Vite", category: "delivery", role: "Build tool", does: "An instant dev server and optimised production builds, split into small files that load only when needed." },
  { symbol: "Pw", name: "Playwright", category: "delivery", role: "End-to-end testing", does: "Drives real browsers to test whole user journeys — clicks, keyboard and mobile included." },
  { symbol: "Vt", name: "Vitest", category: "delivery", role: "Unit testing", does: "Fast tests for individual functions and logic, run on every change." },
  { symbol: "Gh", name: "Git & GitHub", category: "delivery", role: "Version control", does: "Tracks every change, makes code review possible and keeps a safe history to roll back to." },
  { symbol: "Vc", name: "Vercel", category: "delivery", role: "Hosting", does: "Deploys a site straight from its repository, with a preview link for every change." },
  { symbol: "Nf", name: "Netlify", category: "delivery", role: "Hosting", does: "Builds and serves sites from a global CDN, automatically on every push." },
  { symbol: "Sc", name: "SecurityScorecard", category: "security", role: "Security rating", does: "Rates an organisation's public-facing security posture and lists the findings that need fixing." },
  { symbol: "Tl", name: "TLS & headers", category: "security", role: "Web hardening", does: "Encrypted connections plus browser security headers that block attacks like clickjacking and protocol downgrades." },
];

export type Interest = {
  code: string;
  title: string;
  /** Why it pulls me in. Words wrapped in *asterisks* render as italic serif. */
  why: string;
  focus: string[];
  /** Short line printed on the ticket stub. */
  stamp: string;
};

export const interests: Interest[] = [
  {
    code: "DFA/INT.01-WD",
    title: "Web Development",
    why: "I like turning a messy process into a *system people rely on* — from the database schema to the *last button*.",
    focus: ["Full-stack: Laravel, Next.js, Supabase", "Typed code, clean data, tested flows", "Internal tools teams use every day"],
    stamp: "Shipped, not just designed",
  },
  {
    code: "DFA/INT.02-UX",
    title: "UI/UX Design",
    why: "Good software is invisible until it isn't. I care about layouts that *explain themselves* and flows that *never make you guess*.",
    focus: ["Clear hierarchy and typography", "Accessible by default — keyboard, contrast", "Designed in the browser, tested on phones"],
    stamp: "No guesswork for users",
  },
  {
    code: "DFA/INT.03-IX",
    title: "Interactive Website",
    why: "A website can be *remembered*, not just read. Motion, 3D and play — used where they make the story *clearer*.",
    focus: ["Scroll-driven scenes with GSAP", "Real-time 3D with Three.js", "Playful details that stay fast"],
    stamp: "Made to be remembered",
  },
];
