import React from 'react';
import { STRIP } from '../data/content';

const Marquee: React.FC = () => {
  const loop = [...STRIP, ...STRIP];
  return (
    <div
      className="marquee marquee-fade overflow-hidden border-t border-black/5 py-6 dark:border-white/10"
      aria-label="Tools and topics I work with"
    >
      <div className="marquee-track flex w-max items-center gap-10 pr-10">
        {loop.map((name, i) => (
          <span
            key={`${name}-${i}`}
            aria-hidden={i >= STRIP.length}
            className="flex items-center gap-10 whitespace-nowrap text-sm font-semibold uppercase tracking-[0.18em] text-neutral-600 dark:text-neutral-400"
          >
            {name}
            <span className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
