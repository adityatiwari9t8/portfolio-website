import React, { useCallback, useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Story from './components/Story';
import Background from './components/Background';
import CallToAction from './components/CallToAction';
import ContactModal from './components/ContactModal';
import ChatPanel from './components/ChatPanel';
import DemoOverlay from './components/DemoOverlay';
import CaseStudy from './components/CaseStudy';
import CommandPalette from './components/CommandPalette';
import Building from './components/Building';
import Footer from './components/Footer';
import Reveal from './components/Reveal';
import { useStudyRoute } from './lib/route';
import { useCursorLight } from './lib/useCursorLight';
import { closeStudy } from './lib/transition';
import { PROJECTS, Project } from './data/projects';

// Phones get a tighter rhythm between sections; from sm up the spacing is unchanged.
const section = 'scroll-mt-24 pt-20 max-sm:scroll-mt-20 max-sm:pt-16 sm:pt-28';

const App: React.FC = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [demo, setDemo] = useState<Project | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const openContact = useCallback(() => setContactOpen(true), []);
  const openChat = useCallback(() => setChatOpen(true), []);

  // ⌘K / Ctrl+K opens the command menu from anywhere (and closes it again).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey) {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Cards marked .glow light up under the mouse pointer.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('.glow');
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--gx', `${e.clientX - r.left}px`);
      el.style.setProperty('--gy', `${e.clientY - r.top}px`);
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => document.removeEventListener('pointermove', onMove);
  }, []);

  useCursorLight();

  const study = useStudyRoute();
  const studyProject = PROJECTS.find((p) => p.id === study.id) ?? null;
  // A link to a project that doesn't exist just lands on the home page.
  useEffect(() => {
    if (study.id && !studyProject) study.close();
  }, [study, studyProject]);

  return (
    // overflow-x-clip (not hidden) so the sticky project cards keep working
    <div className="relative min-h-screen overflow-x-clip bg-[#f4f4f2] font-sans text-neutral-950 transition-colors duration-300 dark:bg-[#0b0b0c] dark:text-neutral-100">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
      <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onOpenContact={openContact} onOpenDemo={setDemo} onOpenChat={openChat} />
      <CaseStudy
        project={studyProject}
        onClose={() => closeStudy(study.close, study.id)}
        onOpenDemo={setDemo}
        onOpenContact={openContact}
      />
      <DemoOverlay project={demo} onClose={() => setDemo(null)} />
      <Navbar onOpenContact={openContact} onOpenChat={openChat} />

      <main id="main" tabIndex={-1} className="mx-auto max-w-6xl px-3 pt-24 outline-none sm:px-6">
        <Hero />

        {PROJECTS.length === 0 && (
          <section id="building" className={`${section} px-1 sm:px-0`}>
            <Reveal>
              <Building />
            </Reveal>
          </section>
        )}

        {PROJECTS.length > 0 && (
          <section id="work" className={`${section} px-1 sm:px-0`}>
            <Projects onOpenDemo={setDemo} />
          </section>
        )}

        <section id="story" className={`${section} px-3 max-sm:px-1 sm:px-6`}>
          <Reveal>
            <Story />
          </Reveal>
        </section>

        <section id="background" className={`${section} px-1 sm:px-0`}>
          <Background />
        </section>

        <section id="contact" className={`${section} max-sm:px-1`}>
          <Reveal>
            <CallToAction onOpenContact={openContact} />
          </Reveal>
        </section>
      </main>

      <Footer onOpenContact={openContact} />
    </div>
  );
};

export default App;
