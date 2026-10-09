import React from 'react';
import { Briefcase, FolderGit2, GraduationCap, Wrench } from 'lucide-react';
import { GLANCE } from '../data/content';
import Tilt from './Tilt';
import Reveal from './Reveal';

const ICONS = { role: FolderGit2, build: Wrench, grad: GraduationCap, exp: Briefcase } as const;

/** Ten-second scan for recruiters: what, where, when, with what. */
const Glance: React.FC = () => (
  // auto-fit: three, four or five cards all share the row evenly instead of leaving gaps
  <div role="list" className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-[repeat(auto-fit,minmax(11rem,1fr))]">
    {GLANCE.map(({ key, label, value }, i) => {
      const Icon = ICONS[key];
      return (
        <Reveal key={key} role="listitem" variant="scale" delay={i * 90} className="h-full">
        <Tilt max={14} scale={1.06} lift={28} className="h-full">
        <div
          className="glow lit preserve-3d h-full rounded-[1.25rem] border border-black/5 bg-white px-4 py-4 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.2)] transition hover:-translate-y-0.5 sm:px-5 dark:border-white/10 dark:bg-neutral-900"
        >
          <p className="depth-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-600 dark:text-neutral-400">
            <Icon className="h-3.5 w-3.5" aria-hidden />
            {label}
          </p>
          <p className="depth-3 mt-2 text-[15px] font-medium leading-snug text-neutral-950 dark:text-white">{value}</p>
        </div>
        </Tilt>
        </Reveal>
      );
    })}
  </div>
);

export default Glance;
