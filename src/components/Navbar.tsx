import React, { useEffect, useRef, useState } from 'react';
import { Sun, Moon, ArrowUpRight, Menu, X, Sparkles } from 'lucide-react';
import { SITE } from '../data/site';
import { toggleTheme, useTheme } from '../lib/theme';
import { SECTIONS } from '../lib/sections';
import { useActiveSection } from '../lib/useActiveSection';

interface NavbarProps { onOpenContact: () => void; onOpenChat: () => void; }
const Navbar: React.FC<NavbarProps> = ({ onOpenContact, onOpenChat }) => {
  const active = useActiveSection();
  const { dark } = useTheme();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement | null>(null);
  const menu = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
    };
    const onFocus = (e: FocusEvent) => {
      if (!menu.current?.contains(e.target as Node) && !toggle.current?.contains(e.target as Node)) setOpen(false);
    };
    const wide = window.matchMedia('(min-width: 1024px)');
    const onWide = () => { if (wide.matches) setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('focusin', onFocus);
    wide.addEventListener('change', onWide);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('focusin', onFocus);
      wide.removeEventListener('change', onWide);
    };
  }, [open]);
  return (
    <>
      {open && <div aria-hidden className="fixed inset-0 z-[35] lg:hidden" onClick={() => setOpen(false)} />}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-black/10 bg-[#f4f4f2]/95 backdrop-blur-md dark:border-white/10 dark:bg-[#0b0b0c]/95">
        <nav aria-label="Primary" className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-3 px-5 sm:px-8">
          <a href="#home" onClick={() => setOpen(false)} aria-label={`${SITE.name}, back to top`} className="flex min-h-11 items-center font-display text-xl font-bold uppercase tracking-tight">
            <span className="sm:hidden">AT<span className="text-emerald-700 dark:text-emerald-400">.</span></span>
            <span className="hidden sm:inline">{SITE.name}<span className="text-emerald-700 dark:text-emerald-400">.</span></span>
          </a>
          <ul className="hidden items-center gap-6 lg:flex">
            {SECTIONS.filter((n) => n.id !== 'contact').map((n) => <li key={n.id}>
              <a href={`#${n.id}`} aria-current={active === n.id ? 'location' : undefined} className={`nav-link text-link ${active === n.id ? 'nav-active' : ''}`}>{n.label}</a>
            </li>)}
          </ul>
          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={onOpenChat} className="text-link mr-2 hidden text-xs lg:inline-flex"><Sparkles size={15} aria-hidden /> Ask AI</button>
            <button onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 }); }} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} className="icon-button">{dark ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}</button>
            <button onClick={onOpenContact} className="button-primary button-compact">Contact <ArrowUpRight size={14} aria-hidden /></button>
            <button ref={toggle} onClick={() => setOpen((v) => !v)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="phone-menu" className="icon-button lg:hidden">{open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}</button>
          </div>
          {open && <div ref={menu} id="phone-menu" className="surface absolute right-5 top-[80px] w-64 max-w-[calc(100vw-40px)] p-2 shadow-xl lg:hidden">
            <ul>{SECTIONS.map((n) => <li key={n.id}><a href={`#${n.id}`} onClick={() => setOpen(false)} aria-current={active === n.id ? 'location' : undefined} className={`menu-link ${active === n.id ? 'nav-active' : ''}`}>{n.label}</a></li>)}</ul>
            <div className="mt-2 border-t border-black/10 pt-2 dark:border-white/10">
              <a href={SITE.resume} target="_blank" rel="noopener noreferrer" className="menu-link" onClick={() => setOpen(false)}>Resume (PDF) <ArrowUpRight size={16} aria-hidden /></a>
              <button className="menu-link w-full" onClick={() => { toggle.current?.focus(); setOpen(false); onOpenChat(); }}>Ask about my work <Sparkles size={16} aria-hidden /></button>
            </div>
          </div>}
        </nav>
      </header>
    </>
  );
};
export default Navbar;
