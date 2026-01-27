import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MobileHeader from './components/MobileHeader';
import Hero from './components/Hero';
import WhatIDo from './components/WhatIDo';
import TechnicalArsenal from './components/TechnicalArsenal';
import Portfolio from './components/Portfolio';
import Education from './components/Education';
import Contact from './components/Contact';
import ContactModal from './components/ContactModal';
import DemoOverlay from './components/DemoOverlay';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [activeDemoId, setActiveDemoId] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'portfolio', 'resume', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 300) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);

  return (
    <div className="relative">
      {/* Full-bleed responsive background layer (behind content) */}
      <div className="absolute inset-0 -z-10">
        {/* base soft gradient (more subtle to avoid visible center band) */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(90deg, #eef2f6 0%, #f5f7fb 100%)'
          }}
        />

        {/* subtle left accent to blend with sidebar on wider screens */}
        <div
          className="hidden md:block absolute left-0 top-0 bottom-0 w-[240px] lg:w-[280px] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(180deg, rgba(15,23,36,0.12) 0%, rgba(30,41,59,0.08) 40%, rgba(59,130,246,0.00) 100%)'
          }}
        />


        {/* soft vignette on the right for depth on very wide screens (show only on 2xl) */}
        <div className="hidden 2xl:block absolute right-0 top-0 bottom-0 w-48 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(226,232,240,0.45) 100%)' }} />
      </div>

      {/* LOCKED TO LIGHT MODE STYLES */}
      <div className="flex min-h-screen transition-colors duration-500 text-[#1e293b]">
        
        <ContactModal isOpen={isContactModalOpen} onClose={closeContactModal} />
        
        <DemoOverlay 
          activeDemoId={activeDemoId}
          onClose={() => setActiveDemoId(null)} 
        />

        <div className="hidden md:block w-[240px] lg:w-[280px] fixed h-screen z-50">
          <Sidebar 
            activeSection={activeSection}
            onOpenContact={openContactModal} 
          />
        </div>

        {isSidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-[60]"
            onClick={toggleSidebar}
          />
        )}

        <div className={`
          md:hidden fixed top-0 left-0 bottom-0 w-[85vw] max-w-[280px] z-[70] transform transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar 
            activeSection={activeSection}
            isMobile
            onNavClick={() => setIsSidebarOpen(false)}
            onOpenContact={openContactModal} 
          />
        </div>

        <div className="flex-1 md:ml-[240px] lg:ml-[280px] md:pl-6 lg:pl-8">
          <MobileHeader onToggleSidebar={toggleSidebar} />

          <main className="pt-16 md:pt-0 px-4 sm:px-6 py-8 md:px-12 lg:px-16 md:pl-8 lg:pl-12 md:pr-8 lg:pr-12 max-w-7xl mx-auto space-y-24" style={{ paddingLeft: 'env(safe-area-inset-left)', paddingRight: 'env(safe-area-inset-right)' }}>
            <section id="about">
              <Hero />
            </section>
            
            <WhatIDo />
            
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
        </div>
      </div>
    </div>
  );
};

export default App;