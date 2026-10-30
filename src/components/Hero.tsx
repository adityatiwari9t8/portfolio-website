import React from 'react';
import { ArrowDown, ArrowUpRight, FileText } from 'lucide-react';
import { EDUCATION, HERO } from '../data/content';
import { SITE } from '../data/site';
import { PROJECTS } from '../data/projects';
import DotWave from './DotWave';

const Hero: React.FC = () => (
  <section id="home" className="hero-section relative isolate">
    <div aria-hidden className="hero-art pointer-events-none absolute -right-12 top-0 -z-10 h-full w-2/3 overflow-hidden">
      <DotWave cx={0.6} cy={0.42} />
    </div>
    <p className="eyebrow inline-flex items-center gap-2.5">
      <span className="h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400" aria-hidden />
      Open to software engineering internships
    </p>
    <h1 id="hero-name" className="mt-7 font-display text-[clamp(3.75rem,11vw,6.75rem)] font-bold uppercase leading-[0.95] tracking-[-0.035em]">
      {SITE.firstName} <span className="text-neutral-500 dark:text-neutral-400">{SITE.name.split(' ').slice(1).join(' ')}</span>
    </h1>
    <p className="mt-5 max-w-2xl text-[clamp(1.4rem,3vw,2rem)] font-medium leading-tight tracking-[-0.035em]">{HERO.role}</p>
    <p className="mt-5 max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg dark:text-neutral-300">{HERO.body}</p>
    <div className="mt-8 flex flex-wrap gap-3">
      <a href={PROJECTS.length ? '#work' : '#building'} className="button-primary">View projects <ArrowDown size={16} aria-hidden /></a>
      <a href={SITE.resume} target="_blank" rel="noopener noreferrer" className="button-secondary">Resume <FileText size={16} aria-hidden /></a>
    </div>
    <div className="mt-3 flex items-center gap-5">
      <a href={SITE.socials.github} target="_blank" rel="noopener noreferrer" className="text-link">GitHub <ArrowUpRight size={14} aria-hidden /></a>
      <a href={SITE.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-link">LinkedIn <ArrowUpRight size={14} aria-hidden /></a>
    </div>
    <div className="mt-6 flex flex-wrap gap-x-7 gap-y-2 border-t border-black/10 pt-5 text-xs leading-relaxed text-neutral-600 sm:mt-8 sm:text-sm dark:border-white/10 dark:text-neutral-400">
      <span>{SITE.location}</span>
      <span>IILM University · Class of 2029</span>
      <span>CGPA {EDUCATION.gpa}</span>
    </div>
  </section>
);

export default Hero;
