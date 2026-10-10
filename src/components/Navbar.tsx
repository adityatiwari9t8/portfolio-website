import React, { useEffect, useRef, useState } from 'react';
import { Sun, Moon, ArrowUpRight, Menu, X } from 'lucide-react';
import { SITE } from '../data/site';
import { toggleTheme, useTheme } from '../lib/theme';
import { scrollToSection } from '../lib/scroll';
import { SECTIONS } from '../lib/sections';
import { useActiveSection } from '../lib/useActiveSection';

interface NavbarProps {
  onOpenContact: () => void;
}

/**
 * Theme toggle button switching between dark and light modes.
 */
const ThemeButton: React.FC<{ className: string }> = ({ className }) => {
  const { dark } = useTheme();

  const onClick = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };

  return (
    <button
      onClick={onClick}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={className}
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
};

const Navbar: React.FC<NavbarProps> = ({ onOpenContact }) => {
  const active = useActiveSection();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement | null>(null);
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

  // The phone menu closes on Escape (handing focus back to its button), and by itself at desktop width.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      toggle.current?.focus();
    };
    const wide = window.matchMedia('(min-width: 1024px)');
    const onWide = () => wide.matches && setOpen(false);
    document.addEventListener('keydown', onKey);
    wide.addEventListener('change', onWide);
    return () => {
      document.removeEventListener('keydown', onKey);
      wide.removeEventListener('change', onWide);
    };
  }, [open]);

  const compact = heroName && !open;
  const initials = SITE.name.split(' ').map((w) => w[0]);

  const goTo = (id: string) => {
    setOpen(false);
    scrollToSection(id);
  };

  const icon =
    'relative flex h-9 w-9 items-center justify-center rounded-full text-neutral-900 transition hover:bg-black/5 dark:text-neutral-100 dark:hover:bg-white/10';

  const row =
    'flex h-10 w-full items-center justify-between rounded-xl px-3 text-[15px] font-medium transition-colors';

  return (
    <>
    {/* invisible layer: a tap anywhere outside the open menu closes it */}
    {open && <div aria-hidden className="fixed inset-0 z-[35] lg:hidden" onClick={() => setOpen(false)} />}
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled
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
          <button
            ref={toggle}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="phone-menu"
            className={`${icon} lg:hidden ${open ? 'bg-black/5 dark:bg-white/10' : ''}`}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* phone menu: a small card under the menu button, so the page stays visible beside it */}
      {open && (
        <div
          id="phone-menu"
          className="fade-up absolute right-3 top-[calc(100%+0.5rem)] w-56 rounded-2xl border border-black/10 bg-white p-1.5 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.35)] sm:right-5 lg:hidden dark:border-white/10 dark:bg-neutral-900"
        >
          <ul>
            {SECTIONS.map((n) => (
              <li key={n.id}>
                <button
                  onClick={() => goTo(n.id)}
                  aria-current={active === n.id ? 'true' : undefined}
                  className={`${row} ${
                    active === n.id
                      ? 'bg-black/[0.06] text-neutral-950 dark:bg-white/10 dark:text-white'
                      : 'text-neutral-700 hover:bg-black/[0.04] dark:text-neutral-300 dark:hover:bg-white/[0.06]'
                  }`}
                >
                  {n.label}
                  {active === n.id && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => {
              setOpen(false);
              onOpenContact();
            }}
            className="mt-1.5 flex h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-neutral-950 text-sm font-semibold text-white transition hover:bg-neutral-800 sm:hidden dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
          >
            Get in touch
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      )}
    </header>
    </>
  );
};

export default Navbar;
