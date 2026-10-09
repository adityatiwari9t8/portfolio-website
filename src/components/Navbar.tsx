import React, { useEffect, useState } from 'react';
import { Menu, X, Sun, Moon, ArrowUpRight } from 'lucide-react';
import { SITE } from '../data/site';
import { dismissThemeHint, toggleTheme, useTheme } from '../lib/theme';
import { scrollToSection } from '../lib/scroll';
import { SECTIONS, sectionNumber } from '../lib/sections';

interface NavbarProps {
  onOpenContact: () => void;
}

/**
 * Moon button for the light theme, with a bouncing dot and a small "Try dark mode" note
 * until the visitor has switched once (remembered, so it never nags twice).
 */
const ThemeButton: React.FC<{ className: string }> = ({ className }) => {
  const { dark, showHint } = useTheme();
  const [bubble, setBubble] = useState(false);

  // The note slides in a moment after load, so it doesn't compete with the hero, then tucks itself away.
  useEffect(() => {
    if (!showHint) {
      setBubble(false);
      return;
    }
    const show = window.setTimeout(() => setBubble(true), 2200);
    const hide = window.setTimeout(() => setBubble(false), 11000);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, [showHint]);

  const onClick = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };

  return (
    <div className="relative">
      <button
        onClick={onClick}
        aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-describedby={showHint ? 'theme-hint' : undefined}
        className={className}
      >
        {dark ? <Sun className="h-4 w-4" /> : <Moon className={`h-4 w-4 ${showHint ? 'moon-wiggle' : ''}`} />}
        {showHint && (
          <span aria-hidden className="pointer-events-none absolute right-1 top-1 flex h-2.5 w-2.5">
            <span className="hint-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500/60" />
            <span className="hint-bounce relative inline-flex h-2.5 w-2.5 rounded-full bg-indigo-500 ring-2 ring-white" />
          </span>
        )}
      </button>

      {showHint && (
        <div
          id="theme-hint"
          role="status"
          className={`absolute right-0 top-[calc(100%+12px)] z-50 w-max max-w-[15rem] transition duration-300 ${
            bubble ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-1 opacity-0'
          }`}
        >
          <div className="relative flex items-center gap-2 rounded-2xl bg-neutral-950 py-2 pl-3.5 pr-2 text-[13px] font-medium text-white shadow-[0_12px_30px_-10px_rgba(0,0,0,0.45)]">
            <span aria-hidden className="absolute -top-1 right-3.5 h-2.5 w-2.5 rotate-45 bg-neutral-950" />
            <Moon className="h-3.5 w-3.5 shrink-0 text-indigo-300" aria-hidden />
            <span>Try dark mode for the best experience</span>
            <button
              onClick={dismissThemeHint}
              aria-label="Dismiss dark mode tip"
              tabIndex={bubble ? 0 : -1}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-neutral-400 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Navbar: React.FC<NavbarProps> = ({ onOpenContact }) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  // On phones the big name in the hero already says who this is, so the bar shows a monogram until it scrolls away.
  const [heroName, setHeroName] = useState(true);

  useEffect(() => {
    const el = document.getElementById('hero-name');
    if (!el) {
      setHeroName(false);
      return;
    }
    const io = new IntersectionObserver(([e]) => setHeroName(e.isIntersecting), { rootMargin: '-64px 0px 0px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight the link for the section in the middle of the screen.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-40% 0px -50% 0px' }
    );
    ['home', ...SECTIONS.map((n) => n.id)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const compact = heroName && !open;
  const initials = SITE.name.split(' ').map((w) => w[0]);

  const goTo = (id: string) => {
    setOpen(false);
    scrollToSection(id);
  };

  const icon =
    'relative flex h-9 w-9 items-center justify-center rounded-full text-neutral-900 transition hover:bg-black/5 dark:text-neutral-100 dark:hover:bg-white/10';
  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        open
          ? 'border-b border-black/10 bg-[#f4f4f2] shadow-[0_20px_40px_-20px_rgba(0,0,0,0.25)] dark:border-white/10 dark:bg-[#0b0b0c]'
          : solid
            ? 'border-b border-black/10 bg-[#f4f4f2]/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#0b0b0c]/85'
            : // over the hero: still frosted, so the dotted background never runs through the links
              'border-b border-transparent bg-[#f4f4f2]/75 backdrop-blur-md dark:bg-[#0b0b0c]/70'
      }`}
    >
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <button
          onClick={() => goTo('home')}
          aria-label={`${SITE.name}, back to top`}
          className="whitespace-nowrap font-display text-[19px] font-bold uppercase tracking-[0.01em] text-neutral-950 dark:text-white"
        >
          <span aria-hidden className={`${compact ? 'fade-up flex md:hidden' : 'hidden'} h-9 w-9 items-center justify-center rounded-[10px] bg-neutral-950 text-[15px] tracking-[-0.02em] text-white dark:bg-white dark:text-neutral-950`}>
            {initials[0]}
            <span className="text-neutral-400 dark:text-neutral-500">{initials[1]}</span>
          </span>
          <span className={compact ? 'fade-up max-md:hidden' : 'fade-up'}>{SITE.name}</span>
        </button>

        <ul className="hidden items-center gap-7 lg:flex">
          {SECTIONS.map((n) => (
            <li key={n.id}>
              <button
                onClick={() => goTo(n.id)}
                aria-current={active === n.id ? 'true' : undefined}
                className={`font-mono text-[12.5px] font-semibold uppercase tracking-[0.06em] transition-colors ${
                  active === n.id ? 'text-neutral-950 dark:text-white' : 'text-neutral-800 hover:text-neutral-950 dark:text-neutral-200 dark:hover:text-white'
                }`}
              >
                <span aria-hidden className="font-medium text-neutral-500 dark:text-neutral-400">{sectionNumber(n.id)}/</span>
                {n.label}
                <span
                  aria-hidden
                  className={`mt-1 block h-px origin-left bg-current transition-transform duration-300 ${active === n.id ? 'scale-x-100' : 'scale-x-0'}`}
                />
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <ThemeButton className={icon} />
          <button
            onClick={onOpenContact}
            className="ml-2 hidden items-center gap-1.5 whitespace-nowrap rounded-full bg-neutral-950 px-4 py-2 font-mono text-[11.5px] font-semibold uppercase tracking-[0.06em] text-white transition hover:bg-neutral-800 sm:inline-flex dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
          >
            Get in touch
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => setOpen((v) => !v)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} className={`${icon} lg:hidden`}>
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="fade-up mx-auto max-w-6xl px-4 pb-5 sm:px-6 lg:hidden">
          <ul className="divide-y divide-black/10 border-t border-black/10 dark:divide-white/10 dark:border-white/10">
            {SECTIONS.map((n) => (
              <li key={n.id}>
                <button
                  onClick={() => goTo(n.id)}
                  className={`flex w-full items-baseline gap-3 py-3.5 text-left font-display text-2xl font-bold uppercase ${
                    active === n.id ? 'text-neutral-950 dark:text-white' : 'text-neutral-500 dark:text-neutral-400'
                  }`}
                >
                  <span aria-hidden className="font-mono text-xs font-medium text-neutral-400">{sectionNumber(n.id)}/</span>
                  {n.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[12px] font-medium uppercase tracking-[0.08em]">
            <a href={SITE.resume} target="_blank" rel="noopener noreferrer">Resume ↗</a>
            <a href={SITE.socials.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            <a href={SITE.socials.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
          </div>
          <button
            onClick={() => {
              setOpen(false);
              onOpenContact();
            }}
            className="mt-5 flex w-full items-center justify-between rounded-full bg-neutral-950 px-5 py-3 font-mono text-[12px] font-semibold uppercase tracking-[0.06em] text-white sm:hidden dark:bg-white dark:text-neutral-950"
          >
            Get in touch
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
