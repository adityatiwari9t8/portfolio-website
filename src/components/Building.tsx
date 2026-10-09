import React from 'react';
import { Cpu, FileSearch, Ticket } from 'lucide-react';
import { BUILDING } from '../data/content';
import SectionTitle from './SectionTitle';
import Reveal from './Reveal';

const ICONS = { ticket: Ticket, cpu: Cpu, search: FileSearch } as const;

/**
 * Shown only while PROJECTS is empty, so the page never has a hole where the work should be.
 * Once the first case study is added to projects.ts this section disappears on its own.
 */
const Building: React.FC = () => (
  <div>
    <SectionTitle
      id="building"
      label="Building"
      before="What I'm"
      accent="building"
      sub="Projects in progress, each built end to end with a public repository. The case study for each one appears here when it ships."
    />
    <ul className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-3">
      {BUILDING.map((b, i) => {
        const Icon = ICONS[b.icon];
        const live = b.status === 'In progress';
        return (
          <li key={b.id}>
            <Reveal delay={i * 90} className="h-full">
              <article className="glow flex h-full flex-col rounded-[1.5rem] border border-black/5 bg-white p-7 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.15)] transition hover:-translate-y-1 dark:border-white/10 dark:bg-neutral-900">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                      live
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                        : 'bg-neutral-100 text-neutral-600 dark:bg-white/10 dark:text-neutral-300'
                    }`}
                  >
                    {live && <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                    {b.status}
                  </span>
                </div>
                <p className="mt-6 font-mono text-[11.5px] font-medium uppercase tracking-[0.12em] text-[#666] dark:text-neutral-400">
                  {b.kind}
                </p>
                <h3 className="mt-1.5 text-2xl font-medium tracking-[-0.02em] text-neutral-950 dark:text-white">{b.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">{b.summary}</p>
                <ul className="mt-5 space-y-2 border-t border-black/5 pt-5 dark:border-white/10">
                  {b.aims.map((a) => (
                    <li key={a} className="flex items-start gap-2.5 text-sm text-neutral-700 dark:text-neutral-300">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-neutral-400" />
                      {a}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          </li>
        );
      })}
    </ul>
  </div>
);

export default Building;
