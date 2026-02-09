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

const App: React.FC = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [activeDemoId, setActiveDemoId] = useState<string | null>(null);

  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);

  return (
    // UPDATED: Added 'dark:bg-slate-950' and 'dark:text-slate-200' for global dark mode
    <div className="relative min-h-screen font-sans text-[#1e293b] dark:text-slate-200 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* BACKGROUND LAYERS */}
      <div className="fixed inset-0 -z-10">
        {/* UPDATED: Added dark gradients (dark:from-slate-950...) so the background dims */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 opacity-100 dark:opacity-50" />
      </div>

      <ContactModal isOpen={isContactModalOpen} onClose={closeContactModal} />
      
      <DemoOverlay 
        activeDemoId={activeDemoId}
        onClose={() => setActiveDemoId(null)} 
      />

      {/* TOP NAVIGATION */}
      <Navbar onOpenContact={openContactModal} />

      {/* MAIN CONTENT */}
      <main className="pt-24 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-24 pb-16">
        
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
        
        <section id="resume">
          <Education />
        </section>
        
        <section id="contact" className="md:hidden">
          <Contact />
        </section>

      </main>

      {/* FOOTER */}
      <footer className="w-full py-6 text-center text-slate-500 dark:text-slate-400 text-sm border-t border-slate-200/50 dark:border-slate-800/50">
        <p>© 2026 Aditya Tiwari. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default App;