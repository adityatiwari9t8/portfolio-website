import React from 'react';
import { ArrowUp, ArrowUpRight, FileText } from 'lucide-react';
import { NAV, SITE } from '../data/site';
import { PROJECTS } from '../data/projects';
import CopyEmail from './CopyEmail';

const LINKS = [
  ...NAV.filter((n) => (n.id === 'work' ? PROJECTS.length > 0 : n.id === 'building' ? PROJECTS.length === 0 : true)),
  { id: 'contact', label: 'Contact' }
];

const ELSEWHERE = [
  { label: 'GitHub', url: SITE.socials.github },
  { label: 'LinkedIn', url: SITE.socials.linkedin },
  { label: 'LeetCode', url: SITE.socials.leetcode },
  { label: 'Instagram', url: SITE.socials.instagram }
];

const heading = 'text-[11px] font-semibold uppercase tracking-widest text-neutral-600 dark:text-neutral-400';
const link =
  'inline-flex items-center gap-1.5 text-sm text-neutral-700 transition-colors hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white';

interface FooterProps {
  onOpenContact: () => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenContact }) => {
  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <footer className="mx-auto max-w-6xl px-3 pb-28 pt-24 sm:px-6 md:pb-10">
      <div className="border-t border-black/10 pt-12 dark:border-white/10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          <div className="space-y-4">
            <p className="text-2xl font-medium tracking-[-0.03em] text-neutral-950 dark:text-white">
              Aditya <span className="accent text-[1.1em]">Tiwari</span>
            </p>
            <p className="max-w-xs text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              Computer Science student building web apps, dashboards and data-driven tools.
            </p>
            <p className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:border-white/10 dark:text-neutral-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {SITE.status}
            </p>
          </div>

          <nav aria-label="Footer" className="space-y-4">
            <h2 className={heading}>Navigate</h2>
            <ul className="space-y-2.5">
              {LINKS.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} className={link}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-4">
            <h2 className={heading}>Elsewhere</h2>
            <ul className="space-y-2.5">
              {ELSEWHERE.map((s) => (
                <li key={s.label}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className={`${link} group`}>
                    {s.label}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-50 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className={heading}>Get in touch</h2>
            <div className="flex flex-col items-start gap-3">
              <div className="-ml-3">
                <CopyEmail />
              </div>
              <a href={SITE.resume} target="_blank" rel="noopener noreferrer" className={link}>
                <FileText className="h-4 w-4" /> Resume (PDF)
              </a>
              <button
                onClick={onOpenContact}
                className="rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
              >
                Send a message
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-black/5 pt-6 text-xs text-neutral-600 dark:border-white/10 dark:text-neutral-400 sm:flex-row sm:items-center">
          <p>&copy; {new Date().getFullYear()} {SITE.name}</p>
          <p>Designed and built by me with React, TypeScript and Tailwind CSS.</p>
          <button onClick={toTop} className="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-neutral-950 dark:hover:text-white">
            Back to top <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
