import { useRef, useState, type ReactNode } from "react";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { gsap, useGSAP } from "../motion/gsap";
import { MM } from "../motion/useMotionPreference";
import { profile } from "../data/portfolio";
import { useReveal } from "../motion/useReveal";
import { useClock } from "./useClock";
import { ArrowUpRight, GithubMark } from "./Icons";
import { PUSHER, pusherFrame } from "./pusherSprite";
import styles from "./Contact.module.css";

gsap.registerPlugin(DrawSVGPlugin);

const SCRIBBLE = "M6 22 C 70 6, 150 8, 212 15 S 340 26, 396 9";
const TOPICS = ["Internal tool", "Landing page", "Security check", "Something else"];

type Sent = "gmail" | "app" | "copied" | null;
const STATUS: Record<Exclude<Sent, null>, string> = {
  gmail: "Opened in Gmail ✓",
  app: "Handed to your mail app ✓",
  copied: "Copied — paste it anywhere ✓",
};

const enc = encodeURIComponent;

const MailIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden>
    <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <path d="M8 10v6M8 7.5v.01M12 16v-6m0 2.5c0-1.5 1-2.5 2.3-2.5S16 11 16 12.5V16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

/**
 * Contact: a "dean.os Mail" composer that cartoon Dean pushes in along the rail (the
 * loader's character, closing the page). Visitors pick a topic, write, and send through
 * Gmail, their mail app, or the clipboard — so it works without a default mail client.
 */
export function Contact() {
  const root = useRef<HTMLElement>(null);
  const [topics, setTopics] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState<Sent>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const time = useClock(profile.timezone);
  useReveal(root);

  const email = profile.email;
  const subject = `${topics.length ? topics.join(" + ") : "Hello"}${name.trim() ? ` — from ${name.trim()}` : ""}`;
  const body = [message.trim() || "Hi Dean,", name.trim() && `— ${name.trim()}`].filter(Boolean).join("\n\n");
  const gmailHref = email ? `https://mail.google.com/mail/?view=cm&fs=1&to=${enc(email)}&su=${enc(subject)}&body=${enc(body)}` : "";
  const mailHref = email ? `mailto:${email}?subject=${enc(subject)}&body=${enc(body)}` : "";

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);
      mm.add(MM.motion, () => {
        // A hand-drawn underline writes itself under "worth building?".
        gsap.fromTo(q("[data-scribble]"), { drawSVG: "0%" }, { drawSVG: "100%", ease: "power1.inOut", scrollTrigger: { trigger: q("[data-title]")[0], start: "top 75%", end: "bottom 45%", scrub: 0.6 } });
        gsap.from(q("[data-card]"), { y: 30, autoAlpha: 0, duration: 0.6, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: q("[data-cards]")[0], start: "top 90%", once: true } });
      });

      // Desktop: Dean pushes the composer in from the left along the rail, then turns round with a thumbs up.
      mm.add(MM.scenes, () => {
        const [mover] = q("[data-mover]") as HTMLElement[];
        const [sprite] = q("[data-sprite]") as HTMLElement[];
        const [pusher] = q("[data-pusher]") as HTMLElement[];
        if (!mover || !sprite || !pusher) return;
        let frame = -1;
        const show = (f: number) => {
          if (f === frame) return;
          frame = f;
          sprite.style.backgroundPositionX = pusherFrame(f);
        };
        const start = () => -(mover.offsetLeft + mover.offsetWidth);
        gsap
          .timeline({
            scrollTrigger: { trigger: q("[data-stage]")[0], start: "top 92%", end: "top 28%", scrub: 0.7, invalidateOnRefresh: true },
          })
          .fromTo(
            mover,
            { x: start },
            {
              x: 0,
              ease: "power2.out",
              duration: 1,
              onUpdate() {
                const x = Number(gsap.getProperty(mover, "x"));
                if (this.progress() > 0.985) return show(PUSHER.done);
                const travelled = x - start();
                show(Math.floor(travelled / (pusher.offsetWidth * 0.11)) % PUSHER.cycle);
              },
            },
          )
          .fromTo(q("[data-rail-done]"), { scaleX: 0 }, { scaleX: 1, ease: "power2.out", duration: 1 }, 0);
      });

      // Smaller screens: the composer simply rises in.
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.from(q("[data-mover]"), { y: 40, autoAlpha: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: q("[data-stage]")[0], start: "top 85%", once: true } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // Sending: a paper plane leaves the button, and Dean hops.
  const celebrate = (from: HTMLElement | null, kind: Exclude<Sent, null>) => {
    setSent(kind);
    const stage = root.current?.querySelector<HTMLElement>("[data-stage]");
    const plane = root.current?.querySelector<HTMLElement>("[data-plane]");
    if (window.matchMedia(MM.reduced).matches || !stage || !plane || !from) return;
    const s = stage.getBoundingClientRect();
    const b = from.getBoundingClientRect();
    gsap.killTweensOf(plane);
    gsap.set(plane, { left: b.left - s.left + b.width / 2, top: b.top - s.top, x: 0, y: 0, rotate: -8, scale: 0.6, autoAlpha: 1 });
    gsap.to(plane, {
      keyframes: [
        { x: 90, y: -50, rotate: -18, scale: 1, duration: 0.35, ease: "power2.out" },
        { x: 260, y: -150, rotate: -4, duration: 0.4, ease: "none" },
        { x: 520, y: -300, rotate: 10, autoAlpha: 0, duration: 0.45, ease: "power2.in" },
      ],
    });
    const pusher = root.current?.querySelector<HTMLElement>("[data-pusher]");
    if (pusher && pusher.offsetParent) gsap.fromTo(pusher, { yPercent: 0 }, { yPercent: -7, duration: 0.18, ease: "power2.out", yoyo: true, repeat: 1 });
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false; // clipboard blocked — the other buttons still work
    }
  };
  const copyEmail = async () => {
    if (email && (await copy(email))) {
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 1800);
    }
  };
  const copyDraft = async (el: HTMLElement) => {
    if (email && (await copy(`To: ${email}\nSubject: ${subject}\n\n${body}`))) celebrate(el, "copied");
  };
  const toggle = (t: string) => {
    setSent(null);
    setTopics((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  };

  const cards = [
    email && { key: "email", label: "Email", value: email, icon: <MailIcon />, action: copiedEmail ? "Copied ✓" : "Copy" },
    profile.linkedinUrl && { key: "linkedin", label: "LinkedIn", value: "in/deanfisabilandwi", href: profile.linkedinUrl, icon: <LinkedInIcon /> },
    profile.githubUrl && { key: "github", label: "GitHub", value: `@${profile.githubUrl.split("/").pop()}`, href: profile.githubUrl, icon: <GithubMark /> },
  ].filter(Boolean) as { key: string; label: string; value: string; href?: string; icon: ReactNode; action?: string }[];

  return (
    <section ref={root} id="contact" className={styles.contact} aria-labelledby="contact-title">
      <div className={`${styles.head} shell`}>
        <p className={`${styles.kicker} label-mono`} data-reveal>
          (11) Contact
        </p>
        <div className={styles.titleWrap} data-title>
          <h2 id="contact-title" className="section-title" data-reveal-lines>
            <span className="line-mask">
              <span>Have something</span>
            </span>
            <span className="line-mask">
              <span className="serif">worth building?</span>
            </span>
          </h2>
          <svg className={styles.scribble} viewBox="0 0 400 30" preserveAspectRatio="none" aria-hidden>
            <path d={SCRIBBLE} data-scribble />
          </svg>
        </div>
        <p className={styles.sub} data-reveal>
          Internal tools, landing pages, or something in between. Write it below — it lands in my inbox.
        </p>
        <p className={`${styles.clock} label-mono`} data-reveal>
          <i className={styles.pulse} aria-hidden /> It’s {time} {profile.timezoneLabel} for me right now
        </p>
      </div>

      {email && (
        <div className={styles.stage} data-stage>
          <span className={styles.rail} aria-hidden>
            <span className={styles.railDone} data-rail-done />
          </span>
          <div className={styles.mover} data-mover>
            <div className={styles.pusher} data-pusher aria-hidden>
              <div className={styles.sprite} data-sprite style={{ backgroundImage: `url(${PUSHER.src})`, backgroundPositionX: pusherFrame(PUSHER.done) }} />
            </div>

            <div className={styles.window}>
              <div className={`${styles.bar} label-mono`}>
                <span className={styles.dots} aria-hidden>
                  <i />
                  <i />
                  <i />
                </span>
                <span className={styles.barTitle}>New message — dean.os Mail</span>
                <span className={styles.status} aria-live="polite">
                  {sent ? STATUS[sent] : "Draft"}
                </span>
              </div>

              <form className={styles.form} onSubmit={(e) => e.preventDefault()} aria-label="Write to Dean">
                <div className={styles.field}>
                  <span className={`${styles.fieldLabel} label-mono`}>To</span>
                  <span className={styles.to}>
                    <span className={styles.toChip}>
                      <i aria-hidden>D</i>
                      {profile.name}
                    </span>
                    <span className={styles.toMail}>{email}</span>
                  </span>
                  <button type="button" className={styles.mini} onClick={copyEmail}>
                    <span aria-live="polite">{copiedEmail ? "Copied ✓" : "Copy"}</span>
                  </button>
                </div>

                <fieldset className={`${styles.field} ${styles.topics}`}>
                  <legend className={`${styles.fieldLabel} label-mono`}>About</legend>
                  <div className={styles.chips}>
                    {TOPICS.map((t) => (
                      <button key={t} type="button" className={styles.chip} aria-pressed={topics.includes(t)} onClick={() => toggle(t)}>
                        <span className={styles.chipMark} aria-hidden />
                        {t}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <label className={styles.field}>
                  <span className={`${styles.fieldLabel} label-mono`}>From</span>
                  <input
                    className={styles.input}
                    type="text"
                    name="name"
                    autoComplete="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => {
                      setSent(null);
                      setName(e.target.value);
                    }}
                  />
                </label>

                <label className={styles.message}>
                  <span className="sr-only">Message</span>
                  <textarea
                    className={styles.textarea}
                    name="message"
                    rows={5}
                    placeholder="Tell me a little about it — what it is, who it’s for, and when you’d like it."
                    value={message}
                    onChange={(e) => {
                      setSent(null);
                      setMessage(e.target.value);
                    }}
                  />
                </label>

                <div className={styles.foot}>
                  <p className={`${styles.subject} label-mono`}>
                    <span>Subject</span> {subject}
                  </p>
                  <div className={styles.actions}>
                    <a className={`${styles.send} on-dark`} href={gmailHref} target="_blank" rel="noreferrer" onClick={(e) => celebrate(e.currentTarget, "gmail")}>
                      Send via Gmail <ArrowUpRight />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                    <a className={styles.alt} href={mailHref} onClick={(e) => celebrate(e.currentTarget, "app")}>
                      Mail app
                    </a>
                    <button type="button" className={styles.alt} onClick={(e) => copyDraft(e.currentTarget)}>
                      Copy
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <svg className={styles.plane} data-plane viewBox="0 0 48 40" aria-hidden>
            <path d="M2 18 46 2 32 38 22 24Z" fill="var(--color-ivory)" stroke="var(--color-olive)" strokeWidth="2" strokeLinejoin="round" />
            <path d="M46 2 22 24l-2 12 6-9" fill="var(--color-mist)" stroke="var(--color-olive)" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      <ul className={`${styles.cards} shell`} data-cards aria-label="Other ways to reach me">
        {cards.map((c) => {
          const inner = (
            <>
              <span className={styles.cardIcon}>{c.icon}</span>
              <span className={`${styles.cardLabel} label-mono`}>{c.label}</span>
              <span className={styles.cardValue}>{c.value}</span>
              <span className={styles.cardAction}>{c.action ?? <ArrowUpRight />}</span>
            </>
          );
          return (
            <li key={c.key} data-card>
              {c.href ? (
                <a className={styles.card} href={c.href} target="_blank" rel="noreferrer">
                  {inner}
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ) : (
                <button type="button" className={styles.card} onClick={copyEmail} aria-label={`Copy email address ${c.value}`}>
                  {inner}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
