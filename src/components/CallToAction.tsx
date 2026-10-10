import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CTA, QUICK_CONTACT } from '../data/content';
import CopyEmail from './CopyEmail';
import Headline from './Headline';

interface CallToActionProps {
  onOpenContact: () => void;
}

/** Compact closing banner: one line of copy on the left, the ways to reach me on the right. */
const CallToAction: React.FC<CallToActionProps> = ({ onOpenContact }) => (
  <div className="lit relative rounded-3xl border border-black/5 bg-white px-6 py-8 text-neutral-950 max-sm:px-5 max-sm:py-7 sm:px-10 sm:py-10 dark:border-white/10 dark:bg-neutral-900 dark:text-white [&>:not([data-glow])]:relative">
    <div data-glow aria-hidden className="hero-glow pointer-events-none absolute inset-0 rounded-3xl" />
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
      <div className="max-w-xl">
        <Headline
          before={CTA.before}
          accent={CTA.accent}
          after={CTA.after}
          className="text-balance text-[2rem] max-sm:text-[1.75rem] sm:text-[2.6rem]"
        />
        <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-[15px] dark:text-neutral-400">{CTA.body}</p>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-3 max-sm:flex-col max-sm:items-stretch max-sm:gap-1 md:flex-col md:items-end">
          <button
            onClick={onOpenContact}
            className="group inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3 max-sm:justify-center max-sm:py-3.5 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
          >
            Get in touch
            <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
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
        <CopyEmail className="max-sm:justify-center" />
      </div>
    </div>
  </div>
);

export default CallToAction;
