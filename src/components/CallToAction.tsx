import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CTA, QUICK_CONTACT } from '../data/content';
import CopyEmail from './CopyEmail';
import Magnetic from './Magnetic';
import Headline from './Headline';
import Tilt from './Tilt';

interface CallToActionProps {
  onOpenContact: () => void;
}

/** Compact closing banner: one line of copy on the left, the ways to reach me on the right. */
const CallToAction: React.FC<CallToActionProps> = ({ onOpenContact }) => (
  <Tilt max={4} scale={1.012} lift={14} glare radius="rounded-3xl">
  <div className="lit preserve-3d relative rounded-3xl border border-black/5 bg-white px-6 py-8 text-neutral-950 sm:px-10 sm:py-10 dark:border-white/10 dark:bg-neutral-900 dark:text-white [&>:not([data-glow])]:relative">
    <div data-glow aria-hidden className="hero-glow pointer-events-none absolute inset-0 rounded-3xl" />
    <div className="preserve-3d flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
      <div className="preserve-3d max-w-xl">
        <Headline
          before={CTA.before}
          accent={CTA.accent}
          after={CTA.after}
          max={2}
          depth={0.25}
          lift={6}
          className="text-balance text-2xl font-medium leading-[1.15] tracking-[-0.03em] sm:text-[2rem]"
        />
        <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-[15px] dark:text-neutral-400">{CTA.body}</p>
      </div>

      <div className="depth-1 preserve-3d flex shrink-0 flex-wrap items-center gap-3 md:flex-col md:items-end">
        <Magnetic>
          <button
            onClick={onOpenContact}
            className="group inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
          >
            Get in touch
            <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </Magnetic>
        {QUICK_CONTACT.map((q) => (
          <a
            key={q.label}
            href={q.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-100 dark:border-white/15 dark:text-white dark:hover:bg-white/10"
          >
            {q.label}
          </a>
        ))}
        <CopyEmail />
      </div>
    </div>
  </div>
  </Tilt>
);

export default CallToAction;
