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
  
  // ADDED: Real Dark Mode State
  const [darkMode, setDarkMode] = useState(false);

  // ADDED: Toggle Function
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

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
    <div>
      <div className={`flex min-h-screen transition-colors duration-500 ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-100 text-[#1e293b]'}`}>
        
        <ContactModal isOpen={isContactModalOpen} onClose={closeContactModal} />
        
        <DemoOverlay 
          activeDemoId={activeDemoId}
          onClose={() => setActiveDemoId(null)}
          // Removed unused props passing to fix build error in DemoOverlay
        />

        <div className="hidden md:block w-[280px] fixed h-screen z-50">
          <Sidebar 
            activeSection={activeSection}
            onOpenContact={openContactModal} 
            darkMode={darkMode} 
            onToggleDarkMode={toggleDarkMode}
          />
        </div>

        {isSidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-[60]"
            onClick={toggleSidebar}
          />
        )}

        <div className={`
          md:hidden fixed top-0 left-0 bottom-0 w-[280px] z-[70] transform transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar 
            activeSection={activeSection}
            isMobile
            onNavClick={() => setIsSidebarOpen(false)}
            onOpenContact={openContactModal} 
            darkMode={darkMode} 
            onToggleDarkMode={toggleDarkMode}
          />
        </div>

        <div className="flex-1 md:ml-[280px]">
          <MobileHeader onToggleSidebar={toggleSidebar} />
          
          <main className="px-6 py-8 md:px-12 lg:px-16 max-w-7xl mx-auto space-y-24">
            <section id="about" className="pt-16 md:pt-0">
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

            <footer className="pt-12 pb-8 border-t border-slate-200 text-center text-slate-400 text-sm">
              &copy; {new Date().getFullYear()} Aditya Tiwari. All rights reserved.
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;