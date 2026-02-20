import React, { useState, useEffect, useRef } from 'react';
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

const Navbar: React.FC<NavbarProps> = ({ onOpenContact }) => {

  /* ================= STATE ================= */
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* badge logic */
  const [showDarkModeHint, setShowDarkModeHint] = useState(false);
  const [fadeBadge, setFadeBadge] = useState(false);

  const badgeRef = useRef<HTMLDivElement | null>(null);
  const sessionHintDisabled = useRef(false);
  const scrollTimer = useRef<any>(null);

  /* ================= DARK MODE INIT ================= */
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  }, []);

  /* ================= NAV SCROLL SHADOW ================= */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ================= BADGE TIMER ================= */
  useEffect(() => {
    if (sessionHintDisabled.current) return;

    const timer = setTimeout(() => {
      if (!isDarkMode) {
        setShowDarkModeHint(true);

        setTimeout(() => {
          setShowDarkModeHint(false);
          sessionHintDisabled.current = true;
        }, 8000);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  /* ================= AUTO FADE ================= */
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!badgeRef.current) return;

      const rect = badgeRef.current.getBoundingClientRect();
      const pad = 120;

      const near =
        e.clientX > rect.left - pad &&
        e.clientX < rect.right + pad &&
        e.clientY > rect.top - pad &&
        e.clientY < rect.bottom + pad;

      setFadeBadge(near);
    };

    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  /* ================= THEME TOGGLE ================= */
  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);

      sessionHintDisabled.current = true;
      setShowDarkModeHint(false);
    }
  };

  /* ================= NAV ITEMS ================= */
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'portfolio', label: 'Projects' },
    { id: 'exploration', label: 'Exploration' },
    { id: 'insights', label: 'Insights' },
    { id: 'contact', label: 'Contact' }
  ];

  /* ================= ACTIVE SECTION ================= */
  useEffect(() => {
    const sections = navItems.map(item =>
      document.getElementById(item.id)
    );

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });

    sections.forEach(sec => sec && observer.observe(sec));

    return () => observer.disconnect();
  }, []);

  /* ================= SCROLL ================= */
  const handleNavClick = (id: string) => {
    setIsMobileMenuOpen(false);

    if (id === 'contact') {
      onOpenContact();
      return;
    }

    const element = document.getElementById(id);
    if (!element) return;

    const y =
      element.getBoundingClientRect().top +
      window.pageYOffset -
      90;

    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  /* ================= LOCK BODY SCROLL ================= */
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className={`
        fixed top-0 left-0 right-0 z-40 py-4
        bg-gradient-to-b
        from-white/85 to-white/60
        dark:from-slate-950/85 dark:to-slate-950/60
        backdrop-blur-2xl
        border-b border-[#3d4977]/10 dark:border-blue-400/10
        transition-all duration-300
        ${scrolled ? "shadow-lg shadow-black/5 dark:shadow-black/30" : ""}
      `}>

        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">

          {/* EYE-CATCHING LOGO */}
          <div
            onClick={() => handleNavClick('home')}
            className="cursor-pointer group flex items-center relative"
          >
            {/* Background Glow Effect on Hover */}
            <div className="absolute -inset-3 bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-[#3d4977]/0 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white relative z-10 transition-colors">
              Aditya
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3d4977] to-blue-500 ml-1.5">
                Tiwari
              </span>
            </span>
          </div>

          {/* NAV ITEMS */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative py-1 text-sm font-medium transition ${
                  activeSection === item.id
                    ? 'text-[#3d4977] dark:text-blue-400'
                    : 'text-slate-500 hover:text-[#3d4977] dark:text-slate-400 dark:hover:text-blue-400'
                }`}
              >
                {item.label}
                
                {/* Active Slider Underline */}
                {activeSection === item.id && (
                  <span className="absolute -bottom-1.5 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#3d4977] to-blue-400 rounded-full transition-all duration-300" />
                )}
              </button>
            ))}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center space-x-3">

            {/* THEME + PREMIUM BADGE */}
            <div className="relative flex items-center justify-center">

              <button
                onClick={toggleTheme}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-[#3d4977] dark:hover:text-blue-400 transition"
              >
                {isDarkMode ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}
              </button>

              {/* PINGING GLOW DOT */}
              {showDarkModeHint && !isDarkMode && (
                <span className="absolute top-[38px] left-1/2 -translate-x-1/2 flex h-2.5 w-2.5 z-50">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#3d4977]"></span>
                </span>
              )}

              {/* PREMIUM GLASS BADGE */}
              {showDarkModeHint && !isDarkMode && (
                <div
                  ref={badgeRef}
                  className={`
                    absolute top-16 left-1/2 -translate-x-1/2
                    backdrop-blur-2xl
                    bg-white/90 dark:bg-slate-900/90
                    p-1.5 rounded-2xl
                    ring-2 ring-blue-400/60
                    shadow-[0_0_25px_rgba(59,130,246,0.5)] dark:shadow-[0_0_25px_rgba(59,130,246,0.3)]
                    transition-all duration-500
                    ${fadeBadge ? 'opacity-30 scale-95 translate-y-2' : 'opacity-100 scale-100 translate-y-0'}
                    animate-[badgeEnter_.5s_cubic-bezier(0.34,1.56,0.64,1),float_4s_ease-in-out_infinite]
                  `}
                >
                  {/* Arrow Pointer */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-slate-800 rounded-tl-sm border-l border-t border-slate-200/60 dark:border-slate-700/60 rotate-45 z-0" />

                  {/* Inner Card Content */}
                  <div className="relative z-10 flex items-center gap-4 px-5 py-3 rounded-xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900/80 border border-slate-100/50 dark:border-slate-700/50">
                    
                    {/* Icon Container with Wiggle */}
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/40 shadow-inner">
                      <Moon className="w-5 h-5 text-[#3d4977] dark:text-blue-400 animate-[wiggle_2.5s_ease-in-out_infinite]" />
                      <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white dark:border-slate-800" />
                    </div>

                    {/* Text Container */}
                    <div className="flex flex-col pr-2 text-left whitespace-nowrap">
                      <span className="text-sm font-extrabold bg-gradient-to-r from-[#3d4977] to-blue-500 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
                        Try Dark Mode
                      </span>
                      <span className="text-[13px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                        For a stunning experience ✨
                      </span>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* Social Icons - Hidden on mobile, visible on desktop */}
            <a href="https://github.com/adityatiwari9t8" target="_blank" rel="noopener noreferrer" className="hidden sm:block text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://www.linkedin.com/in/adityatiwari9t8" target="_blank" rel="noopener noreferrer" className="hidden sm:block text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="https://leetcode.com/Aditya_Tiwari_98/" target="_blank" rel="noopener noreferrer" className="hidden sm:block text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer">
              <Code2 className="w-5 h-5" />
            </a>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-slate-700 dark:text-slate-300 hover:text-[#3d4977] dark:hover:text-blue-400 transition"
            >
              <Menu className="w-6 h-6"/>
            </button>
          </div>
        </div>
      </nav>

      {/* ================= MOBILE MENU OVERLAY ================= */}
      <div
        className={`
          fixed inset-0 z-[45] bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 md:hidden
          ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* ================= MOBILE MENU DRAWER ================= */}
      <div
        className={`
          fixed top-0 right-0 bottom-0 w-[280px] z-50
          bg-white dark:bg-slate-950 shadow-2xl
          border-l border-slate-200 dark:border-slate-800
          transition-transform duration-300 ease-in-out md:hidden
          flex flex-col
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <span className="text-lg font-extrabold text-slate-900 dark:text-white">
            Navigation
          </span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition bg-slate-50 dark:bg-slate-900 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Links */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`
                w-full text-left px-4 py-3.5 rounded-xl font-semibold transition flex items-center justify-between
                ${activeSection === item.id
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-[#3d4977] dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                }
              `}
            >
              {item.label}
              <ChevronRight className={`w-4 h-4 ${activeSection === item.id ? 'opacity-100' : 'opacity-0'}`} />
            </button>
          ))}
        </div>

        {/* Drawer Footer (Social Icons) */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-center space-x-6">
          <a href="https://github.com/adityatiwari9t8" target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer">
            <Github className="w-6 h-6" />
          </a>
          <a href="https://www.linkedin.com/in/adityatiwari9t8" target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer">
            <Linkedin className="w-6 h-6" />
          </a>
          <a href="https://leetcode.com/Aditya_Tiwari_98/" target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer">
            <Code2 className="w-6 h-6" />
          </a>
        </div>
      </div>

      {/* ANIMATIONS */}
      <style>{`
        @keyframes float {
          0% { transform: translate(-50%,0); }
          50% { transform: translate(-50%,-6px); }
          100% { transform: translate(-50%,0); }
        }

        @keyframes badgeEnter {
          0% { opacity:0; transform:translate(-50%,-10px) scale(.90); }
          100% { opacity:1; transform:translate(-50%,0) scale(1); }
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(-8deg); }
          50% { transform: rotate(8deg); }
        }
      `}</style>
    </>
  );
};

export default Navbar;