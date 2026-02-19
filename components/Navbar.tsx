import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Github,
  Linkedin,
  Code2,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';

interface NavbarProps {
  onOpenContact: () => void;
}

const Navbar: React.FC<NavbarProps> = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(true);

  /* ================= DARK MODE INIT ================= */
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

  /* ================= NAV ITEMS ================= */
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'portfolio', label: 'Projects' },
    { id: 'about', label: 'About' },
    { id: 'exploration', label: 'Exploration' },
    { id: 'insights', label: 'Insights' },
    { id: 'resume', label: 'Education' }
  ];

  /* ================= ACTIVE SECTION TRACKING ================= */
  useEffect(() => {
    const sections = navItems.map(item =>
      document.getElementById(item.id)
    );

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-40% 0px -50% 0px',
        threshold: 0
      }
    );

    sections.forEach(sec => {
      if (sec) observer.observe(sec);
    });

    return () => observer.disconnect();
  }, []);

  /* ================= SCROLL HANDLER ================= */
  const handleNavClick = (id: string) => {
    setIsMobileMenuOpen(false);

    const element = document.getElementById(id);
    if (!element) return;

    const offset = 90;
    const y =
      element.getBoundingClientRect().top +
      window.pageYOffset -
      offset;

    window.scrollTo({
      top: y,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="
        fixed top-0 left-0 right-0 z-40
        py-4
        bg-white/70 dark:bg-slate-950/70
        backdrop-blur-xl
        border-b border-slate-200/40 dark:border-white/10
        shadow-[0_8px_30px_rgba(0,0,0,0.06)]
      ">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">

          {/* LOGO */}
          <div
            onClick={() => handleNavClick('home')}
            className="cursor-pointer text-xl font-extrabold tracking-tight text-slate-900 dark:text-white"
          >
            Aditya Tiwari
          </div>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`
                  relative text-sm font-medium transition-all
                  ${
                    activeSection === item.id
                      ? 'text-[#3d4977] dark:text-blue-400'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }
                `}
              >
                {item.label}

                {/* Active underline */}
                {activeSection === item.id && (
                  <span className="
                    absolute -bottom-2 left-0 right-0
                    h-[2px]
                    bg-gradient-to-r from-[#3d4977] to-blue-400
                    rounded-full
                  " />
                )}
              </button>
            ))}
          </div>

          {/* RIGHT ICONS */}
          <div className="hidden md:flex items-center space-x-4">

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-yellow-400 transition-colors"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <div className="h-4 w-px bg-slate-300 dark:bg-white/20 mx-2" />

            <a href="https://github.com/adityatiwari9t8" target="_blank">
              <Github className="w-5 h-5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white" />
            </a>

            <a href="https://linkedin.com/in/adityatiwari9t8" target="_blank">
              <Linkedin className="w-5 h-5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white" />
            </a>

            <a href="https://leetcode.com/Aditya_Tiwari_98/" target="_blank">
              <Code2 className="w-5 h-5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white" />
            </a>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden text-slate-700 dark:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* ================= MOBILE DRAWER ================= */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-72 bg-white dark:bg-slate-950 z-50 shadow-2xl transform transition-transform duration-300 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b dark:border-white/10">
          <span className="font-bold">Menu</span>
          <button onClick={() => setIsMobileMenuOpen(false)}>
            <X />
          </button>
        </div>

        <div className="p-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="w-full flex justify-between px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {item.label}
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;
