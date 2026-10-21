import { useEffect, useRef, useState, type FocusEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { gsap } from "../motion/gsap";
import { useMotion } from "../app/MotionProvider";
import { credentials, dutyAreas, profile, projects } from "../data/portfolio";
import { useClock } from "./useClock";
import { ArrowUpRight, Plus } from "./Icons";
import styles from "./HeroIndex.module.css";

const job = credentials.find((c) => c.id === "pln") ?? credentials[0];
const school = credentials.find((c) => c.id === "unand") ?? credentials[1];
const apps = dutyAreas[0]?.apps ?? [];
const security = dutyAreas[1];

/* ---- Panels: the detail behind each row (hover card on desktop, drawer on touch) ---- */

function NowPanel() {
  const time = useClock(profile.timezone);
  return (
    <div className={styles.panel}>
      <img className={styles.logo} src={job.logo} alt="" width={job.logoWidth} height={job.logoHeight} />
      <p className={`${styles.kicker} label-mono`}>{job.kind}</p>
      <p className={styles.title}>{job.title}</p>
      <p className={styles.sub}>{job.org}</p>
      <p className={`${styles.live} label-mono`}>
        <i className={styles.pulse} aria-hidden /> Local time {time} {profile.timezoneLabel}
      </p>
    </div>
  );
}

function AppsPanel() {
  return (
    <div className={styles.panel}>
      <p className={`${styles.kicker} label-mono`}>Manages · names withheld</p>
      <ul className={styles.tiles}>
        {apps.map((a) => (
          <li key={a.code} className={styles.tile}>
            <span className="label-mono">{a.code}</span>
            <b>{a.area}</b>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SecurityPanel() {
  return (
    <div className={styles.panel}>
      <p className={`${styles.kicker} label-mono`}>
        Secures <span className={styles.meter} aria-hidden><i /></span>
      </p>
      <p className={styles.title}>
        {security?.title} <span className="serif">{security?.italic}</span>
      </p>
      <ul className={styles.checks}>
        {security?.points.map((p) => <li key={p}>{p}</li>)}
      </ul>
    </div>
  );
}

function StudyPanel() {
  return (
    <div className={`${styles.panel} ${styles.study}`}>
      <img className={styles.emblem} src={school.logo} alt="" width={school.logoWidth} height={school.logoHeight} />
      <div>
        <p className={`${styles.kicker} label-mono`}>{school.kind}</p>
        <p className={styles.title}>{school.title}</p>
        <p className={styles.sub}>{school.org}</p>
      </div>
    </div>
  );
}

function ShippedPanel() {
  return (
    <div className={styles.panel}>
      <p className={`${styles.kicker} label-mono`}>Shipped · {projects.length} live sites</p>
      <div className={styles.shots}>
        {projects.map((p) => (
          <figure key={p.id}>
            <img src={p.previewSmall} alt="" loading="lazy" />
            <figcaption>{p.title}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

/* ---- Glyphs: the small always-on visual at the end of each row ---- */

const shield = (
  <span className={styles.shield} aria-hidden>
    <svg viewBox="0 0 20 24">
      <path d="M10 1.5 18 4.5v7c0 5.6-3.7 9.2-8 11-4.3-1.8-8-5.4-8-11v-7Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="m6.5 12 2.5 2.5 4.5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
);

type Row = { key: string; label: string; value: string; href: string; glyph: ReactNode; panel: ReactNode };

const ROWS: Row[] = [
  {
    key: "now",
    label: "Now",
    value: `${profile.role}, ${profile.company}`,
    href: "#about",
    glyph: (
      <span className={styles.chip} aria-hidden>
        <i className={styles.pulse} />
        <img src={job.logo} alt="" />
      </span>
    ),
    panel: <NowPanel />,
  },
  {
    key: "manages",
    label: "Manages",
    value: `${apps.length} internal systems, in daily use`,
    href: "#day-job",
    glyph: (
      <span className={styles.redacted} aria-hidden>
        {apps.map((a) => (
          <i key={a.code} />
        ))}
      </span>
    ),
    panel: <AppsPanel />,
  },
  { key: "secures", label: "Secures", value: "SecurityScorecard web posture", href: "#day-job", glyph: shield, panel: <SecurityPanel /> },
  {
    key: "studied",
    label: "Studied",
    value: "Information Systems, Universitas Andalas",
    href: "#about",
    glyph: (
      <span className={styles.chip} aria-hidden>
        <img className={styles.tall} src={school.logo} alt="" />
      </span>
    ),
    panel: <StudyPanel />,
  },
  {
    key: "shipped",
    label: "Shipped",
    value: projects.map((p) => p.title).join(" · "),
    href: "#work",
    glyph: (
      <span className={styles.thumbs} aria-hidden>
        {projects.map((p) => (
          <img key={p.id} src={p.previewSmall} alt="" />
        ))}
      </span>
    ),
    panel: <ShippedPanel />,
  },
];

const count = String(ROWS.length).padStart(2, "0");
const num = (i: number) => String(i + 1).padStart(2, "0");

function Head() {
  return (
    <p className={`${styles.head} label-mono`}>
      <span>Index</span>
      <span>{count}</span>
    </p>
  );
}

function RowText({ row, i }: { row: Row; i: number }) {
  return (
    <>
      <span className={`${styles.num} label-mono`}>{num(i)}</span>
      <span className={styles.text}>
        <span className={`${styles.label} label-mono`}>{row.label}</span>
        <span className={styles.value}>{row.value}</span>
      </span>
      <span className={styles.glyph}>{row.glyph}</span>
    </>
  );
}

/* ---- Desktop: rows are links; a window-like card follows the cursor and rolls to the hovered row's panel ---- */

const CARD_W = 320;
const BAR_H = 30;
const PANEL_H = 220;
const GAP = 28;

function HoverIndex({ className, reduced }: { className: string; reduced: boolean }) {
  const card = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  // Filled in by the effect below once the card exists.
  const noop = () => {};
  const api = useRef<{ show: (i: number, x: number, y: number) => void; move: (x: number, y: number) => void; hide: () => void }>({
    show: noop,
    move: noop,
    hide: noop,
  });

  useEffect(() => {
    const el = card.current;
    const tr = track.current;
    if (!el || !tr) return;
    const H = BAR_H + PANEL_H;
    // Card sits left of the pointer (the index is the rightmost column); flips right if there is no room.
    const place = (px: number, py: number) => {
      const x = px - CARD_W - GAP < 16 ? px + GAP : px - CARD_W - GAP;
      const y = Math.min(Math.max(16, py - H / 2), window.innerHeight - H - 16);
      return { x, y };
    };
    const xTo = gsap.quickTo(el, "x", { duration: reduced ? 0.01 : 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: reduced ? 0.01 : 0.5, ease: "power3.out" });
    let visible = false;
    let current = -1;
    gsap.set(el, { autoAlpha: 0, scale: 0.92 });

    api.current = {
      show(i, px, py) {
        const { x, y } = place(px, py);
        if (!visible) {
          // Appear where the pointer is, already on the right panel.
          gsap.set(el, { x, y });
          xTo(x, x);
          yTo(y, y);
          gsap.set(tr, { y: -i * PANEL_H });
          gsap.to(el, { autoAlpha: 1, scale: 1, duration: reduced ? 0.01 : 0.35, ease: "power3.out", overwrite: "auto" });
          visible = true;
        } else {
          xTo(x);
          yTo(y);
          if (i !== current) gsap.to(tr, { y: -i * PANEL_H, duration: reduced ? 0.01 : 0.55, ease: "power3.inOut", overwrite: true });
        }
        current = i;
        if (counter.current) counter.current.textContent = `${num(i)} / ${count}`;
      },
      move(px, py) {
        if (!visible) return;
        const { x, y } = place(px, py);
        xTo(x);
        yTo(y);
      },
      hide() {
        if (!visible) return;
        visible = false;
        gsap.to(el, { autoAlpha: 0, scale: 0.92, duration: reduced ? 0.01 : 0.25, ease: "power2.in", overwrite: "auto" });
      },
    };
    // The page moving under a still pointer would leave the card stranded.
    const onScroll = () => api.current.hide();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      gsap.killTweensOf([el, tr]);
    };
  }, [reduced]);

  const onBlur = (e: FocusEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) api.current.hide();
  };

  return (
    <nav
      className={`${className} ${styles.index}`}
      aria-label="At a glance"
      data-hero-rise
      onPointerMove={(e) => api.current.move(e.clientX, e.clientY)}
      onPointerLeave={() => api.current.hide()}
      onBlur={onBlur}
    >
      <Head />
      <ol>
        {ROWS.map((row, i) => (
          <li key={row.key}>
            <a
              href={row.href}
              className={`${styles.row} ${styles.hoverRow}`}
              onPointerEnter={(e) => api.current.show(i, e.clientX, e.clientY)}
              onFocus={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                api.current.show(i, r.left, r.top + r.height / 2);
              }}
            >
              <RowText row={row} i={i} />
            </a>
          </li>
        ))}
      </ol>
      {createPortal(
        <div ref={card} className={styles.card} aria-hidden>
          <div className={`${styles.bar} label-mono`}>
            <span className={styles.dots}>
              <i />
              <i />
              <i />
            </span>
            <span>dean.os — index</span>
            <span ref={counter}>01 / {count}</span>
          </div>
          <div className={styles.viewport}>
            <div ref={track} className={styles.track}>
              {ROWS.map((row) => (
                <div key={row.key} className={styles.cardPanel}>
                  {row.panel}
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.body,
      )}
    </nav>
  );
}

/* ---- Touch: each row opens a drawer with the same panel and a link to its section ---- */

function TapIndex({ className }: { className: string }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <nav className={`${className} ${styles.index}`} aria-label="At a glance" data-hero-rise>
      <Head />
      <ol>
        {ROWS.map((row, i) => {
          const isOpen = open === i;
          const id = `hero-index-${row.key}`;
          return (
            <li key={row.key} className={styles.item} data-open={isOpen || undefined}>
              <button type="button" className={`${styles.row} ${styles.tapRow}`} aria-expanded={isOpen} aria-controls={id} onClick={() => setOpen(isOpen ? null : i)}>
                <RowText row={row} i={i} />
                <Plus className={styles.toggle} />
              </button>
              <div id={id} className={styles.drawer} inert={!isOpen}>
                <div className={styles.drawerInner}>
                  <div className={styles.drawerBody}>
                    {row.panel}
                    <a href={row.href} className={`${styles.go} link-underline label`}>
                      Go to section <ArrowUpRight />
                    </a>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Hero "at a glance" index: hover preview on desktop, drawers on touch. */
export function HeroIndex({ className = "" }: { className?: string }) {
  const { finePointer, reduced } = useMotion();
  return finePointer ? <HoverIndex className={className} reduced={reduced} /> : <TapIndex className={className} />;
}
