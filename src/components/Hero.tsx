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
  const [first, ...rest] = SITE.name.split(' ');

  return (
    <section id="home" className="relative -mt-24 flex min-h-[100svh] flex-col pt-24">
      {/* full-bleed backdrop, faded into the page at the bottom */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 overflow-hidden">
        <div className="fade-in absolute inset-0 opacity-70 md:opacity-100">
          <DotWave />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#f4f4f2] to-transparent dark:from-[#0b0b0c]" />
      </div>

      <div className="relative flex flex-1 flex-col justify-center px-1 pb-12 pt-6 sm:px-2 sm:pb-16 sm:pt-10">
        <p style={delay(0)} className="halo rise inline-flex items-center gap-2 font-mono text-[11.5px] font-medium uppercase tracking-[0.1em] text-neutral-700 dark:text-neutral-300">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {SITE.status}
        </p>

        <h1 id="hero-name" className="mt-6 font-display text-[clamp(4.25rem,18vw,10.5rem)] font-bold uppercase leading-[0.86] tracking-[-0.015em] text-neutral-950 sm:text-[clamp(4.25rem,11.5vw,10.5rem)] dark:text-white">
          <span className="inline-block overflow-hidden pb-[0.04em] align-bottom">
            <span style={delay(80)} className="line-up inline-block">
              {first}
            </span>
          </span>{' '}
          <span className="inline-block overflow-hidden pb-[0.04em] align-bottom">
            <span style={delay(180)} className="line-up inline-block text-neutral-500">
              {rest.join(' ')}
              <span aria-hidden className="caret ml-[0.05em] inline-block h-[0.78em] w-[0.03em] min-w-[2px] translate-y-[0.02em] bg-neutral-950 dark:bg-white" />
            </span>
          </span>
        </h1>

        <p style={delay(320)} className="halo rise mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-display text-[1.6rem] font-bold uppercase leading-none tracking-[-0.005em] text-neutral-900 sm:text-[2rem] dark:text-neutral-100">
            {HERO.role}
          </span>
          <span className="font-mono text-[12.5px] uppercase tracking-[0.08em] text-neutral-700 dark:text-neutral-300">
            <span className="text-neutral-400 dark:text-neutral-500">/ </span>
            {HERO.focus}
          </span>
        </p>

        {/* the description, directly under the name */}
        <p style={delay(440)} className="halo rise mt-8 max-w-2xl text-balance text-[1.15rem] font-medium leading-[1.4] tracking-[-0.01em] text-neutral-950 sm:mt-10 sm:text-[1.4rem] dark:text-white">
          {HERO.motto} <span className="text-[#666] dark:text-neutral-400">{HERO.body}</span>
        </p>

        <div style={delay(540)} className="rise mt-8 sm:mt-10">
          {/* phones: proper tap targets in one row */}
          <div className="grid max-w-md grid-cols-[1fr_1fr_auto_auto] gap-2 sm:hidden">
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
          <ul className="halo hidden flex-wrap items-center gap-x-6 gap-y-3 sm:flex">
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
        </div>
      </div>
    </section>
  );
};

export default Hero;
