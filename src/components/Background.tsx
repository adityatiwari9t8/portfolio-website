import React from 'react';
import { Award, Calendar, GraduationCap, Check, Github } from 'lucide-react';
import { EDUCATION, NOW, OPEN_TO, TOOLKIT } from '../data/content';
import { SITE } from '../data/site';
import SectionTitle from './SectionTitle';
import Tilt from './Tilt';
import Reveal from './Reveal';

const Chip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="rounded-full bg-neutral-100 px-3.5 py-1.5 text-sm font-medium text-neutral-700 dark:bg-white/10 dark:text-neutral-200">
    {children}
  </span>
);

const card =
  'glow lit preserve-3d transition duration-300 hover:-translate-y-0.5 rounded-[1.5rem] border border-black/5 bg-white p-7 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.15)] dark:border-white/10 dark:bg-neutral-900';
const label = 'text-xs font-medium uppercase tracking-[0.18em] text-neutral-600 dark:text-neutral-400';

/** Education, toolkit and availability in one place, for recruiters and clients. */
const Background: React.FC = () => (
  <div>
    <Reveal>
      <SectionTitle
        before="A bit of"
        accent="background"
        sub="The foundations behind the work, and what I'm open to right now."
      />
    </Reveal>

    <div className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-[1.4fr_1fr]">
      {/* education */}
      <Reveal variant="left" className="h-full">
      <Tilt max={8} scale={1.025} lift={18} className="h-full">
      <div className={`${card} h-full`}>
        <p className={`${label} depth-1`}>Education</p>
        <h3 className="depth-2 mt-4 text-xl font-medium tracking-[-0.01em] text-neutral-950 sm:text-2xl dark:text-white">
          {EDUCATION.degree}
        </h3>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-neutral-600 dark:text-neutral-400">
          <span className="inline-flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            {EDUCATION.school}
          </span>
          <span className="inline-flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {EDUCATION.period}
          </span>
          <span className="inline-flex items-center gap-2">
            <Award className="h-4 w-4" />
            CGPA {EDUCATION.gpa}
          </span>
        </div>
        <p className={`${label} mt-7`}>Key coursework</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {EDUCATION.coursework.map((c) => (
            <Chip key={c}>{c}</Chip>
          ))}
        </div>
      </div>
      </Tilt>
      </Reveal>

      {/* availability */}
      <Reveal variant="right" delay={120} className="h-full">
      <Tilt max={8} scale={1.025} lift={18} className="h-full">
      <div className="lit preserve-3d h-full rounded-[1.5rem] transition duration-300 hover:-translate-y-0.5 border border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-white p-7 text-neutral-950 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.15)] dark:border-emerald-400/15 dark:from-emerald-500/10 dark:to-neutral-900 dark:text-white">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-600 dark:text-neutral-400">
          Open to
        </p>
        <ul className="mt-5 space-y-3">
          {OPEN_TO.map((o) => (
            <li key={o} className="flex items-center gap-2.5 text-[15px] font-medium">
              <Check className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              {o}
            </li>
          ))}
        </ul>
        <a
          href={SITE.socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
        >
          <Github className="h-4 w-4" />
          See my code on GitHub
        </a>
      </div>
      </Tilt>
      </Reveal>

      {/* right now */}
      <Reveal variant="scale" className="md:col-span-2">
      <Tilt max={4} scale={1.012} lift={12}>
      <div className={card}>
        <p className={label}>Right now</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {NOW.map((n) => (
            <li key={n} className="flex items-start gap-2.5 text-[15px] text-neutral-700 dark:text-neutral-300">
              <span className="pulse-dot mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              {n}
            </li>
          ))}
        </ul>
      </div>
      </Tilt>
      </Reveal>

      {/* toolkit */}
      <Reveal variant="scale" delay={100} className="md:col-span-2">
      <Tilt max={4} scale={1.012} lift={12}>
      <div className={card}>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className={label}>Core languages</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {TOOLKIT.core.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
            <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">TypeScript is in all three projects above.</p>
          </div>
          <div>
            <p className={label}>I build with</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {TOOLKIT.build.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
            <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
              React, Tailwind CSS and Vite are in all three too. All three have their source on GitHub.
            </p>
          </div>
        </div>
      </div>
      </Tilt>
      </Reveal>
    </div>
  </div>
);

export default Background;
