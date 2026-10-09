import React from 'react';

interface HeadlineProps {
  as?: 'h1' | 'h2' | 'p';
  before: string;
  accent: string;
  after?: string;
  className?: string;
}

/**
 * Display heading in the site's type system: condensed, bold, uppercase, with the `accent` word in
 * grey (the same two-tone as the hero). Inside a Reveal, the words flip up into place one after
 * another the first time it scrolls into view; after that it is plain text.
 */
const Headline: React.FC<HeadlineProps> = ({ as: Tag = 'h2', before, accent, after, className = '' }) => {
  let i = 0;
  const words = (text: string, cls = '') =>
    text
      .split(' ')
      .filter(Boolean)
      .map((w) => {
        const n = i++;
        return (
          <React.Fragment key={`${w}-${n}`}>
            <span className={`flip-word inline-block ${cls}`} style={{ '--i': n } as React.CSSProperties}>
              {w}
            </span>{' '}
          </React.Fragment>
        );
      });

  return (
    <Tag className={`font-display font-bold uppercase leading-[0.92] tracking-[-0.01em] text-neutral-950 dark:text-white ${className}`}>
      {words(before)}
      {words(accent, 'text-neutral-500')}
      {after ? words(after) : null}
    </Tag>
  );
};

export default Headline;
