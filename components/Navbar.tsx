import React, { useState } from 'react';
import { Menu, X, Github, Linkedin, Mail, Code2, ChevronRight } from 'lucide-react';

interface NavbarProps {
  onOpenContact: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenContact }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'resume', label: 'Resume' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    setIsMobileMenuOpen(false);
    setActiveSection(id);
    
    if (id === 'contact') {
        onOpenContact();
        return; 
    }

    if (id === 'resume') {
      const a = document.createElement('a');
      a.href = '/resume.pdf';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* MAIN NAVBAR */}
      {/* Uses bg-slate-900 (Solid Navy Blue) */}
      <nav className="fixed top-0 left-0 right-0 z-40 py-4 bg-slate-900 shadow-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-white">
          
          {/* LEFT: Logo / Name */}
          <div 
              onClick={() => handleNavClick('home')}
              className="cursor-pointer font-serif italic text-2xl font-bold tracking-tight text-slate-100"
          >
            Aditya Tiwari
          </div>

          {/* CENTER: Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm font-medium transition-colors ${
                  activeSection === item.id 
                    ? 'text-white font-bold' 
                    : 'text-slate-300 hover:text-white' 
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* RIGHT: Social Icons (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="https://github.com/adityatiwari9t8" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white"><Github className="w-5 h-5" /></a>
            <a href="https://linkedin.com/in/adityatiwari9t8" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white"><Linkedin className="w-5 h-5" /></a>
            <a href="https://leetcode.com/Aditya_Tiwari_98/" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white"><Code2 className="w-5 h-5" /></a>
            <button onClick={onOpenContact} className="text-slate-300 hover:text-white"><Mail className="w-5 h-5" /></button>
          </div>

          {/* MOBILE MENU TOGGLE (Hamburger) */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="p-2 -mr-2 text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* --- MOBILE SIDEBAR DRAWER --- */}
      
      {/* 1. Backdrop Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 md:hidden backdrop-blur-sm ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* 2. Sliding Sidebar Panel */}
      <div 
        // UPDATED: bg-slate-900 creates the SOLID NAVY BLUE background (matches Navbar)
        className={`fixed top-0 left-0 bottom-0 w-72 bg-slate-900 z-50 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden border-r border-white/10 flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <span className="font-serif italic text-xl font-bold text-slate-100">Menu</span>
          <button 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="p-2 -mr-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="group w-full flex items-center justify-between px-4 py-3 rounded-xl 
                         text-slate-400 font-medium border border-transparent
                         hover:bg-white/10 hover:text-white hover:border-white/10 hover:shadow-lg
                         transition-all duration-200"
            >
              <span>{item.label}</span>
              <ChevronRight 
                className="w-4 h-4 text-slate-600 opacity-50 
                           group-hover:opacity-100 group-hover:text-white group-hover:translate-x-1 
                           transition-all duration-200" 
              />
            </button>
          ))}
        </div>

        {/* Mobile Social Icons Footer */}
        <div className="p-6 border-t border-white/10">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Let's Connect</p>
          <div className="flex items-center gap-4">
            <a href="https://github.com/adityatiwari9t8" target="_blank" rel="noopener noreferrer" className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"><Github className="w-5 h-5" /></a>
            <a href="https://linkedin.com/in/adityatiwari9t8" target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"><Linkedin className="w-5 h-5" /></a>
            <a href="https://leetcode.com/Aditya_Tiwari_98/" target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"><Code2 className="w-5 h-5" /></a>
            <button onClick={onOpenContact} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"><Mail className="w-5 h-5" /></button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;