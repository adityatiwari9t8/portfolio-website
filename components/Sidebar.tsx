import React from 'react';
import { 
  User, 
  Briefcase, 
  FileText, 
  Mail, 
  Instagram, 
  Linkedin, 
  Github, 
  Code2, 
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  isMobile?: boolean;
  onNavClick?: () => void;
  onOpenContact: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection, 
  isMobile, 
  onNavClick, 
  onOpenContact 
}) => {
  const navItems = [
    { id: 'about', label: 'About Me', icon: <User className="w-5 h-5" /> },
    { id: 'portfolio', label: 'Portfolio', icon: <Briefcase className="w-5 h-5" /> },
    { id: 'resume', label: 'Resume', icon: <FileText className="w-5 h-5" /> },
    { id: 'contact', label: 'Contact', icon: <Mail className="w-5 h-5" /> },
  ];

  const socialLinks = [
    { icon: Instagram, url: 'https://www.instagram.com/adityatiwari_98?igsh=MWprcHhuM2NxbWIycA%3D%3D&utm_source=qr' },
    { icon: Linkedin, url: 'https://www.linkedin.com/in/adityatiwari9t8' },
    { icon: Github, url: 'https://github.com/adityatiwari9t8' },
    { icon: Code2, url: 'https://leetcode.com/Aditya_Tiwari_98/' },
  ];

  const handleNavClick = (id: string) => {
    if (id === 'contact' && !isMobile) {
      onOpenContact();
      return;
    }

    if (id === 'resume') {
      // Open resume PDF in a new tab (use anchor to ensure rel attributes)
      const a = document.createElement('a');
      a.href = '/resume.pdf';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      // Append to body, click, then remove to trigger navigation
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      onNavClick?.();
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      onNavClick?.();
    }
  };

  return (
    <div className="h-full w-full flex flex-col transition-all duration-1000 bg-gradient-to-b from-slate-800 via-slate-600 to-slate-400 text-white shadow-2xl border-r border-white/10">
      {/* 1. Header: Intro (Fixed) */}
      <div className="flex-none p-6 pt-12 text-center">
          <div className="flex flex-col items-center mb-6">
          <p className="text-xs leading-relaxed transition-colors duration-500 max-w-xs sm:max-w-[220px] text-slate-200 font-medium">
            Hi, my name is Aditya Tiwari and I’m a Computer Science undergraduate focused on building scalable systems and 
            learning how technology shapes strategic business decisions.
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center space-x-3 mb-2">
          {socialLinks.map((social, i) => (
            <a 
              key={i} 
              href={social.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-lg transition-all duration-300 bg-white/10 hover:bg-white/20 text-white"
            >
              <social.icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>

      {/* 2. Body: Navigation (Scrollable) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4">
        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300
                ${activeSection === item.id 
                  ? 'bg-white/10 text-white font-bold border border-white/10' 
                  : 'text-slate-300 hover:text-white hover:bg-white/5'}
              `}
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="text-sm md:text-base">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* 3. Footer: Actions (Sticky at bottom) */}
      <div className="flex-none p-6 space-y-4 border-t transition-colors duration-500 border-white/10">
        <button 
          onClick={onOpenContact}
          className="w-full flex items-center justify-center space-x-2 py-3 rounded-lg font-bold transition-all duration-300 transform hover:-translate-y-1 shadow-lg bg-slate-900 hover:bg-black text-white shadow-black/30 border border-white/5"
        >
          <Mail className="w-4 h-4" />
          <span>Let’s Connect</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;