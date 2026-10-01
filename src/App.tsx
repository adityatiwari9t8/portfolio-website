import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Story from './components/Story';
import Background from './components/Background';
import CallToAction from './components/CallToAction';
import ContactModal from './components/ContactModal';
import DemoOverlay from './components/DemoOverlay';
import CaseStudy from './components/CaseStudy';
import ScrollProgress from './components/ScrollProgress';
import Glance from './components/Glance';
import Building from './components/Building';
import MobileBar from './components/MobileBar';
import Footer from './components/Footer';
import Reveal from './components/Reveal';
import SectionLift from './components/SectionLift';
import { useStudyRoute } from './lib/route';
import { useCursorLight } from './lib/useCursorLight';
import { closeStudy } from './lib/transition';
import { PROJECTS, Project } from './data/projects';

const App: React.FC = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const [demo, setDemo] = useState<Project | null>(null);
  const openContact = () => setContactOpen(true);

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
      <ScrollProgress />
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
      <CaseStudy
        project={studyProject}
        onClose={() => closeStudy(study.close, study.id)}
        onOpenDemo={setDemo}
        onOpenContact={openContact}
      />
      <DemoOverlay project={demo} onClose={() => setDemo(null)} />
      <Navbar onOpenContact={openContact} />

      <main id="main" tabIndex={-1} className="mx-auto max-w-6xl px-3 pt-24 outline-none sm:px-6">
        <Hero onOpenContact={openContact} />
        <Glance />

        {PROJECTS.length === 0 && (
          <SectionLift as="section" id="building" className="scroll-mt-24 px-1 pt-24 sm:px-0 sm:pt-28">
            <Reveal>
              <Building />
            </Reveal>
          </SectionLift>
        )}

        {PROJECTS.length > 0 && (
          <section id="work" className="scroll-mt-24 px-1 pt-24 sm:px-0 sm:pt-28">
            <Projects onOpenDemo={setDemo} />
          </section>
        )}

        <SectionLift as="section" id="story" className="scroll-mt-24 px-3 pt-24 sm:px-6 sm:pt-28">
          <Reveal>
            <Story />
          </Reveal>
        </SectionLift>

        <SectionLift as="section" id="background" className="scroll-mt-24 px-1 pt-24 sm:px-0 sm:pt-28">
          <Background />
        </SectionLift>

        <SectionLift as="section" id="contact" settle className="scroll-mt-24 pt-24 sm:pt-28">
          <Reveal>
            <CallToAction onOpenContact={openContact} />
          </Reveal>
        </SectionLift>
      </main>

      <MobileBar onOpenContact={openContact} />

      <Footer onOpenContact={openContact} />
    </div>
  );
};

export default App;
