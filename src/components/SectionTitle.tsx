import React from 'react';
import Headline from './Headline';
import { sectionNumber } from '../lib/sections';

interface SectionTitleProps {
  /** The section's id: its number in the nav is shown above the heading. */
  id?: string;
  label?: string;
  before: string;
  accent: string;
  after?: string;
  sub?: string;
}

/** Numbered eyebrow ("01 / Work"), the two-tone display heading, and an optional line of intro. */
const SectionTitle: React.FC<SectionTitleProps> = ({ id, label, before, accent, after, sub }) => {
  const n = id ? sectionNumber(id) : '';
  return (
    <div className="mx-auto max-w-3xl text-center">
      {(n || label) && (
        <p className="mb-4 font-mono text-[11.5px] font-medium uppercase tracking-[0.12em] text-neutral-600 dark:text-neutral-400">
          {n && <span>{n} / </span>}
          {label}
        </p>
      )}
      <Headline before={before} accent={accent} after={after} className="text-[2.75rem] sm:text-6xl md:text-7xl" />
      {sub && <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-neutral-600 sm:text-base dark:text-neutral-400">{sub}</p>}
    </div>
  );
};

export default SectionTitle;
