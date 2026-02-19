import React, { useState, useEffect } from 'react';
import { Menu, X, Github, Linkedin, Mail, Code2, ChevronRight, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  onOpenContact: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenContact }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Initialize Dark Mode
  useEffect(() => {
    if (localStorage.theme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDarkMode(true);
    }
  };

  // ⭐ UPDATED NAV FLOW (Narrative-Based)
const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'portfolio', label: 'Projects' },
  { id: 'about', label: 'About' },
  { id: 'insights', label: 'Insights' },
  { id: 'exploration', label: 'Exploration' },
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
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-40 py-4 bg-slate-900 dark:bg-slate-950 shadow-lg border-b border-white/10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-white">

          {/* Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="cursor-pointer text-2xl font-extrabold tracking-tight text-slate-100 hover:text-white transition-colors"
          >
            Aditya Tiwari
          </div>

          {/* Desktop Nav */}
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

          {/* Right Icons */}
          <div className="hidden md:flex items-center space-x-4">

            <button
              onClick={toggleTheme}
              className="p-2 text-slate-300 hover:text-yellow-400 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="h-4 w-px bg-white/20 mx-2"></div>

            <a href="https://github.com/adityatiwari9t8" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white"><Github className="w-5 h-5" /></a>
            <a href="https://linkedin.com/in/adityatiwari9t8" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white"><Linkedin className="w-5 h-5" /></a>
            <a href="https://leetcode.com/Aditya_Tiwari_98/" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white"><Code2 className="w-5 h-5" /></a>
            <button onClick={onOpenContact} className="text-slate-300 hover:text-white"><Mail className="w-5 h-5" /></button>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleTheme} className="text-slate-300 hover:text-yellow-400">
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -mr-2 text-white hover:bg-white/10 rounded-full"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 md:hidden backdrop-blur-sm ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-72 bg-slate-900 dark:bg-slate-950 z-50 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden border-r border-white/10 flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <span className="text-xl font-bold text-slate-100">Menu</span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="group w-full flex items-center justify-between px-4 py-3 rounded-xl text-slate-400 font-medium hover:bg-white/10 hover:text-white transition-all"
            >
              <span>{item.label}</span>
              <ChevronRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;
