import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhatIDo from './components/WhatIDo';
import TechnicalArsenal from './components/TechnicalArsenal';
import Portfolio from './components/Portfolio';
import Education from './components/Education';
import Contact from './components/Contact';
import ContactModal from './components/ContactModal';
import DemoOverlay from './components/DemoOverlay';
import Insights from './components/Insights';
import Exploration from './components/Exploration';

const App: React.FC = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [activeDemoId, setActiveDemoId] = useState<string | null>(null);

  return (
    <div className="
      relative min-h-screen font-sans
      text-[#1e293b] dark:text-slate-200
      bg-slate-50 dark:bg-slate-950
      transition-colors duration-300
      overflow-x-hidden
    ">

      {/* ================= BACKGROUND SYSTEM ================= */}
      <div className="fixed inset-0 -z-10 overflow-hidden">

        {/* Base gradient */}
        <div className="
          absolute inset-0
          bg-gradient-to-br
          from-indigo-50 via-purple-50 to-pink-50
          dark:from-slate-950 dark:via-slate-900 dark:to-slate-950
          opacity-90 dark:opacity-50
        " />

        {/* Soft glow layer (depth effect) */}
        <div className="
          absolute top-[-20%] left-[-10%]
          w-[700px] h-[700px]
          bg-[#3d4977]/10
          blur-[140px]
          rounded-full
        " />

        <div className="
          absolute bottom-[-20%] right-[-10%]
          w-[700px] h-[700px]
          bg-blue-400/10
          blur-[140px]
          rounded-full
        " />
      </div>

      {/* ================= MODALS ================= */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      <DemoOverlay
        activeDemoId={activeDemoId}
        onClose={() => setActiveDemoId(null)}
      />

      {/* ================= NAVBAR ================= */}
      <Navbar onOpenContact={() => setIsContactModalOpen(true)} />

      {/* ================= MAIN CONTENT ================= */}
      <main
        className="
          pt-28
          px-4 sm:px-6 md:px-8
          max-w-6xl
          mx-auto
          space-y-32
          pb-28
          relative
        "
      >

        <section id="home">
          <Hero />
        </section>

        <section id="about">
          <WhatIDo />
        </section>

        <TechnicalArsenal />

        <section id="portfolio">
          <Portfolio onLaunchDemo={(id) => setActiveDemoId(id)} />
        </section>

        <section id="exploration">
          <Exploration />
        </section>

        <section id="insights">
          <Insights />
        </section>

        <section id="resume">
          <Education />
        </section>

        {/* Mobile-only contact */}
        <section id="contact" className="md:hidden">
          <Contact />
        </section>

      </main>

      {/* ================= FOOTER ================= */}
      <footer className="
        relative
        py-10
        text-center
        text-sm
        text-slate-500 dark:text-slate-400
        border-t border-slate-200/50 dark:border-slate-800/50
        backdrop-blur-sm
      ">
        <p className="font-medium tracking-wide">
          © 2026 Aditya Tiwari · Built with React & Systems Thinking
        </p>
      </footer>

    </div>
  );
};

export default App;
