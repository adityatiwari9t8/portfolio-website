import React from 'react';
import { Github, Linkedin } from 'lucide-react';
import { HERO } from '../data/content';
import { SITE } from '../data/site';
import { scrollToSection } from '../lib/scroll';
import DotWave from './DotWave';

const delay = (ms: number) => ({ '--d': `${ms}ms` }) as React.CSSProperties;

const link =
  'group inline-flex items-center gap-1.5 font-mono text-[12px] font-medium uppercase tracking-[0.08em] text-neutral-900 underline-offset-[6px] transition hover:underline dark:text-neutral-100';

const tap =
  'inline-flex h-11 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-2 font-mono text-[12px] font-semibold uppercase tracking-[0.04em] transition active:scale-[0.97]';
const outline = 'border border-black/15 bg-white/70 text-neutral-900 dark:border-white/20 dark:bg-white/5 dark:text-white';

/**
 * Landing screen: who I am and how I work, in big type over a moving dotted surface.
 * Deliberately says nothing about individual projects (that is what "Work" is for),
 * so it stays right however many projects the site grows to.
 */
const Hero: React.FC = () => {
  const [first, second] = HERO.title;

  return (
    <section id="home" className="relative -mt-24 flex min-h-[100svh] flex-col pt-24">
      {/* full-bleed backdrop, faded into the page at the bottom */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 overflow-hidden">
        <div className="fade-in absolute inset-0 opacity-70 md:opacity-100">
          <DotWave />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#f4f4f2] to-transparent dark:from-[#0b0b0c]" />
      </div>

      <div className="relative flex flex-1 flex-col justify-between px-1 pb-8 pt-8 sm:px-2 sm:pt-14">
        <div>
          <p style={delay(0)} className="rise inline-flex items-center gap-2 font-mono text-[11.5px] font-medium uppercase tracking-[0.1em] text-neutral-600 dark:text-neutral-400">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {SITE.status}
          </p>

          <div className="mt-6 inline-block max-w-full">
            <h1 className="font-display text-[clamp(4.1rem,19vw,13.5rem)] font-bold uppercase leading-[0.86] tracking-[-0.015em] text-neutral-950 dark:text-white">
              <span className="sr-only">{SITE.name}, </span>
              <span className="block overflow-hidden pb-[0.04em]">
                <span style={delay(80)} className="line-up block">
                  {first}
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.04em]">
                <span style={delay(200)} className="line-up block text-neutral-500">
                  <span aria-hidden className="caret mr-[0.05em] inline-block h-[0.8em] w-[0.03em] min-w-[2px] translate-y-[0.03em] bg-neutral-950 dark:bg-white" />
                  {second}
                </span>
              </span>
            </h1>
            <p style={delay(420)} className="rise mt-4 font-mono text-[12.5px] text-neutral-700 sm:text-right dark:text-neutral-300">
              {HERO.byline}
            </p>
          </div>
        </div>

        <div style={delay(520)} className="rise mt-14">
          <div className="border-t border-black/10 dark:border-white/10" />
          <p className="mt-6 font-mono text-[13px] font-medium uppercase tracking-[0.06em] text-neutral-800 dark:text-neutral-200">
            <span className="mr-2 text-neutral-400 dark:text-neutral-500">//</span>
            {HERO.motto}
          </p>

          <div className="mt-10 grid items-end gap-8 md:grid-cols-2">
            {/* phones: proper tap targets in one row */}
            <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 sm:hidden">
              <button onClick={() => scrollToSection('work')} className={`${tap} bg-neutral-950 text-white dark:bg-white dark:text-neutral-950`}>
                View work <span aria-hidden>↓</span>
              </button>
              <a href={SITE.resume} target="_blank" rel="noopener noreferrer" className={`${tap} ${outline}`}>
                Resume <span aria-hidden>↗</span>
              </a>
              <a href={SITE.socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={`${tap} ${outline} w-11`}>
                <Github className="h-[18px] w-[18px]" />
              </a>
              <a href={SITE.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={`${tap} ${outline} w-11`}>
                <Linkedin className="h-[18px] w-[18px]" />
              </a>
            </div>

            {/* larger screens: quiet mono links */}
            <ul className="hidden flex-wrap items-center gap-x-6 gap-y-3 sm:flex">
              <li>
                <button onClick={() => scrollToSection('work')} className={link}>
                  Explore my work
                  <span aria-hidden className="transition group-hover:translate-y-0.5">↓</span>
                </button>
              </li>
              <li>
                <a href={SITE.resume} target="_blank" rel="noopener noreferrer" className={link}>
                  Resume <span aria-hidden>↗</span>
                </a>
              </li>
              <li>
                <a href={SITE.socials.github} target="_blank" rel="noopener noreferrer" className={link}>
                  GitHub <span aria-hidden>↗</span>
                </a>
              </li>
              <li>
                <a href={SITE.socials.linkedin} target="_blank" rel="noopener noreferrer" className={link}>
                  LinkedIn <span aria-hidden>↗</span>
                </a>
              </li>
            </ul>
            <p className="max-w-md font-mono text-[12.5px] leading-[1.75] text-neutral-600 md:justify-self-end dark:text-neutral-400">{HERO.body}</p>
          </div>
          <div className="mt-8 border-t border-black/10 dark:border-white/10" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
