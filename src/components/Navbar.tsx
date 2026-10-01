import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Menu, X, Github, Linkedin, Instagram, Sun, Moon, Home, ArrowUpRight } from 'lucide-react';
import { NAV, SITE } from '../data/site';
import { PROJECTS } from '../data/projects';
import Tilt from './Tilt';
import { changeTheme } from '../lib/transition';

// "Work" appears once there is at least one project; until then "Building" stands in for it.
const LINKS = NAV.filter((n) => (n.id === 'work' ? PROJECTS.length > 0 : n.id === 'building' ? PROJECTS.length === 0 : true));

interface NavbarProps {
  onOpenContact: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenContact }) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = (e: React.MouseEvent<HTMLElement>) => {
    const next = !dark;
    const r = e.currentTarget.getBoundingClientRect();
    changeTheme(
      () => {
        setDark(next);
        document.documentElement.classList.toggle('dark', next);
        try {
          sessionStorage.setItem('theme', next ? 'dark' : 'light');
        } catch {
          /* storage unavailable: theme still applies for this visit */
        }
      },
      r.left + r.width / 2,
      r.top + r.height / 2
    );
  };

  // Sliding highlight: sits behind the hovered link, or the link for the section on screen.
  const list = useRef<HTMLUListElement | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [pill, setPill] = useState({ x: 0, w: 0, show: false });
  const target = hover ?? active;
  useLayoutEffect(() => {
    const place = () => {
      const el = list.current?.querySelector<HTMLElement>(`[data-nav="${target}"]`);
      setPill((p) => (el ? { x: el.offsetLeft, w: el.offsetWidth, show: true } : { ...p, show: false }));
    };
    place();
    window.addEventListener('resize', place);
    document.fonts?.ready.then(place);
    return () => window.removeEventListener('resize', place);
  }, [target]);

  useEffect(() => {
    const ids = ['home', ...LINKS.map((n) => n.id)];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-40% 0px -50% 0px' }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const goTo = (id: string) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 96, behavior: 'smooth' });
  };

  const icon =
    'flex h-9 w-9 items-center justify-center rounded-full text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white';
  const activeChip = 'bg-neutral-100 text-neutral-900 dark:bg-white/10 dark:text-white';

  return (
    <header className="fixed inset-x-0 top-4 z-40 flex justify-center px-4">
      <Tilt scroll={false} max={4} scale={1.02} lift={18} glare radius="rounded-full" className="w-full max-w-[700px]">
      <nav
        aria-label="Primary"
        className="preserve-3d relative flex items-center justify-between rounded-full border border-black/5 p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:border-white/10"
      >
        {/* frosted background sits in its own layer so the buttons above it can float forward in 3D */}
        <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full bg-white/85 backdrop-blur-xl dark:bg-neutral-900/80" />
        <div className="depth-1 preserve-3d flex items-center gap-0.5">
          <button onClick={() => goTo('home')} aria-label="Home" className={`${icon} ${active === 'home' ? activeChip : ''}`}>
            <Home className="h-4 w-4" />
          </button>

          <ul
            ref={list}
            onMouseLeave={() => setHover(null)}
            className="relative ml-1 hidden items-center gap-0.5 lg:flex"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-0 left-0 top-0 -z-10 rounded-full bg-neutral-100 transition-[transform,width,opacity] duration-[350ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] dark:bg-white/10"
              style={{ width: pill.w, transform: `translateX(${pill.x}px)`, opacity: pill.show ? 1 : 0, translate: '0 0 -2px' }}
            />
            {LINKS.map((n) => (
              <li key={n.id}>
                <button
                  data-nav={n.id}
                  onClick={() => goTo(n.id)}
                  onMouseEnter={() => setHover(n.id)}
                  onFocus={() => setHover(n.id)}
                  onBlur={() => setHover(null)}
                  className={`rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
                    target === n.id || active === n.id
                      ? 'text-neutral-900 dark:text-white'
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  {n.label}
                </button>
              </li>
            ))}
          </ul>

          <span className="mx-1 hidden h-5 w-px bg-black/10 sm:block dark:bg-white/10" />

          <a href={SITE.socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={`${icon} hidden sm:flex`}>
            <Github className="h-4 w-4" />
          </a>
          <a href={SITE.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={`${icon} hidden sm:flex`}>
            <Linkedin className="h-4 w-4" />
          </a>
          <a href={SITE.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={`${icon} hidden sm:flex`}>
            <Instagram className="h-4 w-4" />
          </a>
        </div>

        <div className="depth-1 preserve-3d flex items-center gap-0.5">
          <button
            onClick={toggleTheme}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={icon}
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            onClick={onOpenContact}
            className="ml-1 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-neutral-950 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
          >
            Get in touch
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className={`${icon} lg:hidden`}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>
      </Tilt>

      {open && (
        <div className="fade-up absolute inset-x-4 top-[60px] rounded-3xl border border-black/5 bg-white p-2 shadow-[0_20px_50px_rgba(0,0,0,0.12)] dark:border-white/10 dark:bg-neutral-900 lg:hidden">
          {LINKS.map((n) => (
            <button
              key={n.id}
              onClick={() => goTo(n.id)}
              className={`block w-full rounded-2xl px-4 py-3 text-left text-[15px] font-medium transition ${
                active === n.id
                  ? activeChip
                  : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-white/5'
              }`}
            >
              {n.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
