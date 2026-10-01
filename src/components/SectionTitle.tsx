import React from 'react';
import Headline from './Headline';

interface SectionTitleProps {
  before: string;
  accent: string;
  after?: string;
  sub?: string;
}

/** Centered section heading with the italic serif accent word. */
const SectionTitle: React.FC<SectionTitleProps> = ({ before, accent, after, sub }) => (
  <div className="mx-auto max-w-2xl text-center">
    <Headline
      before={before}
      accent={accent}
      after={after}
      className="text-3xl font-medium tracking-[-0.03em] text-neutral-950 sm:text-4xl md:text-5xl dark:text-white"
    />
    {sub && (
      <p className="mt-4 text-[15px] leading-relaxed text-neutral-600 sm:text-base dark:text-neutral-400">{sub}</p>
    )}
  </div>
);

export default SectionTitle;
