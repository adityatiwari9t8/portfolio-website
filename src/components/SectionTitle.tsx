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
    <div className="max-w-3xl text-left">
      {label && (
        <p className="mb-4 eyebrow">
          {label}
        </p>
      )}
      <Headline before={before} accent={accent} after={after} className="text-4xl sm:text-5xl" />
      {sub && <p className="mt-4 max-w-xl text-[15px] max-sm:mt-3 leading-relaxed text-neutral-600 sm:text-base dark:text-neutral-400">{sub}</p>}
    </div>
  );
};

export default SectionTitle;
