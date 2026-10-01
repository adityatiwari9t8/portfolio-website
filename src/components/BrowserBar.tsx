import React from 'react';

/** Window chrome for a demo preview: three dots and a "Live demo" label. Spans only, so it is valid inside a button or link. */
const BrowserBar: React.FC<{ label: string }> = ({ label }) => (
  <span
    aria-hidden
    className="flex items-center gap-3 border-b border-black/5 bg-neutral-100/90 px-3.5 py-2.5 dark:border-white/10 dark:bg-white/[0.06]"
  >
    <span className="flex gap-1.5">
      <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
      <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
    </span>
    <span className="mx-auto flex min-w-0 max-w-[70%] items-center gap-1.5 truncate rounded-md bg-white px-3 py-1 text-[11px] font-medium text-neutral-600 ring-1 ring-black/5 dark:bg-white/10 dark:text-neutral-300 dark:ring-white/10">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
      <span className="truncate">{label}</span>
    </span>
    <span className="w-[42px] shrink-0" />
  </span>
);

export default BrowserBar;
