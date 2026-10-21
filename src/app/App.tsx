import { useEffect, useState } from "react";
import { MotionProvider, useMotion } from "./MotionProvider";
import { Intro, shouldPlayIntro } from "../components/Intro";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { ProjectMontage } from "../components/ProjectMontage";
import { About } from "../components/About";
import { DayJob } from "../components/DayJob";
import { Process } from "../components/Process";
import { TechStack } from "../components/TechStack";
import { Interests } from "../components/Interests";
import { SelectedWork } from "../components/SelectedWork";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import { Marquee } from "../components/Marquee";
import { Cursor } from "../components/Cursor";
import { NavTransition } from "../components/NavTransition";
import { DesktopScene } from "../desktop/DesktopScene";
import { goToDesktop } from "../desktop/desktopNav";
import { ScrollTrigger } from "../motion/gsap";

function Page() {
  const [playIntro] = useState(shouldPlayIntro);
  const [introVisible, setIntroVisible] = useState(playIntro);
  // Hero entrance starts the moment the loader splits open (or right away without it).
  const [revealed, setRevealed] = useState(!playIntro);
  const { scrollTo, finePointer, reduced } = useMotion();

  // Deep links go straight to their section; #desktop lands on the usable
  // desktop, not the start of the zoom.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash === "#top") return;
    const id = window.setTimeout(() => {
      ScrollTrigger.refresh();
      if (hash === "#desktop") {
        goToDesktop(scrollTo, { immediate: true, focus: false });
        return;
      }
      const el = document.querySelector<HTMLElement>(hash);
      if (!el) return;
      const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 0;
      const anchor = el.parentElement?.classList.contains("pin-spacer") ? el.parentElement : el;
      scrollTo(anchor.getBoundingClientRect().top + window.scrollY - headerH, { immediate: true });
      ScrollTrigger.update();
    }, 150);
    return () => window.clearTimeout(id);
    // Only on first load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {introVisible && <Intro onReveal={() => setRevealed(true)} onDone={() => setIntroVisible(false)} />}
      {finePointer && !reduced && <Cursor />}
      <NavTransition />
      <Header />
      <Hero play={revealed} markInPlace={playIntro} />
      <main id="main" tabIndex={-1}>
        <ProjectMontage play={revealed} />
        <Marquee
          label="Internal systems, web security, websites with character"
          rows={[
            ["Internal systems", "web security", "Websites with character", "built to last"],
            ["Laravel", "React", "Next.js", "GSAP", "TypeScript", "Three.js"],
          ]}
        />
        <About />
        <DayJob />
        <Process />
        <TechStack />
        <Interests />
        <SelectedWork />
        <Marquee label="Let's build something worth remembering" rows={[["Let's build", "something", "worth remembering", "together"]]} />
        <DesktopScene />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export function App() {
  return (
    <MotionProvider>
      <Page />
    </MotionProvider>
  );
}
