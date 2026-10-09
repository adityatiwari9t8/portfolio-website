import React from 'react';
import { ArrowUp, ArrowUpRight, FileText, Send } from 'lucide-react';
import { SITE } from '../data/site';
import { SECTIONS } from '../lib/sections';
import CopyEmail from './CopyEmail';

const LINKS = SECTIONS;

const ELSEWHERE = [
  { label: 'GitHub', url: SITE.socials.github },
  { label: 'LinkedIn', url: SITE.socials.linkedin },
  { label: 'LeetCode', url: SITE.socials.leetcode }
];

const heading = 'font-mono text-[11.5px] font-medium uppercase tracking-[0.12em] text-[#666] dark:text-neutral-400';
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
    <footer className="mx-auto max-w-6xl px-4 pb-24 pt-12 sm:px-6 sm:pt-16 md:pb-6">
      <div className="border-t border-black/10 pt-8 dark:border-white/10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-7 lg:grid-cols-[1.6fr_0.8fr_0.8fr_1.2fr]">
          <div className="col-span-2 space-y-2 lg:col-span-1">
            <p className="font-display text-2xl font-bold uppercase tracking-[-0.01em] text-neutral-950 dark:text-white">
              {SITE.firstName} <span className="text-neutral-500">{SITE.name.split(' ').slice(1).join(' ')}</span>
            </p>
            <p className="max-w-xs text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              Software developer and CS student building reliable software, from the database schema to the deployed product.
            </p>
          </div>

          <nav aria-label="Footer" className="space-y-3">
            <h2 className={heading}>Navigate</h2>
            <ul className="space-y-1.5">
              {LINKS.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} className={link}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-3">
            <h2 className={heading}>Elsewhere</h2>
            <ul className="space-y-1.5">
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

          <div className="col-span-2 space-y-3 lg:col-span-1">
            <h2 className={heading}>Get in touch</h2>
            <div className="flex flex-col items-start gap-1.5">
              <div className="-my-1.5 -ml-4">
                <CopyEmail />
              </div>
              <a href={SITE.resume} target="_blank" rel="noopener noreferrer" className={link}>
                <FileText className="h-4 w-4" /> Resume (PDF)
              </a>
              <button onClick={onOpenContact} className={`${link} group`}>
                <Send className="h-4 w-4" /> Send a message
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-black/5 pt-4 text-xs text-neutral-600 dark:border-white/10 dark:text-neutral-400">
          <p>&copy; {new Date().getFullYear()} {SITE.name}</p>
          <p className="order-last w-full sm:order-none sm:w-auto">Designed and built by me with React, TypeScript and Tailwind CSS.</p>
          <button onClick={toTop} className="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-neutral-950 dark:hover:text-white">
            Back to top <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
