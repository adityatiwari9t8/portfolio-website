import React from 'react';
import Headline from './Headline';

interface SectionTitleProps {
  id?: string;
  label?: string;
  before: string;
  accent: string;
  after?: string;
  sub?: string;
}

/** Small eyebrow label ("Work"), the two-tone display heading, and an optional line of intro. */
const SectionTitle: React.FC<SectionTitleProps> = ({ label, before, accent, after, sub }) => {
  return (
    <div className="mx-auto max-w-3xl text-center max-sm:text-left">
      {label && (
        <p className="mb-4 font-mono text-[11.5px] max-sm:mb-3 font-medium uppercase tracking-[0.12em] text-neutral-600 dark:text-neutral-400">
          {label}
        </p>
      )}
      <Headline before={before} accent={accent} after={after} className="text-[2.75rem] max-sm:text-[2.5rem] sm:text-6xl md:text-7xl" />
      {sub && <p className="mx-auto mt-5 max-w-2xl text-[15px] max-sm:mt-3 leading-relaxed text-neutral-600 sm:text-base dark:text-neutral-400">{sub}</p>}
    </div>
  );
};

export default SectionTitle;
