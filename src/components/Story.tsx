import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { STORY, STORY_PHOTOS } from '../data/content';
import { SITE } from '../data/site';

const Story: React.FC = () => (
  <div className="grid items-center gap-8 md:grid-cols-[0.7fr_1.3fr] md:gap-16">
    <figure className="order-2 mx-auto w-full max-w-[320px] md:order-1">
      <div className="overflow-hidden rounded-2xl bg-neutral-200">
        <img src={STORY_PHOTOS[0].src} alt={STORY_PHOTOS[0].alt} loading="lazy" decoding="async" width={662} height={886} className="portrait aspect-[4/5] w-full object-cover object-top" />
      </div>
      <figcaption className="mt-3 flex justify-between text-xs text-neutral-600 dark:text-neutral-400"><span>{SITE.name}</span><span>{SITE.location}</span></figcaption>
    </figure>
    <div className="order-1 md:order-2">
      <p className="eyebrow">02 / About</p>
      <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-none tracking-tight sm:text-5xl">Curious by nature.<br /><span className="text-neutral-500 dark:text-neutral-400">Precise by practice.</span></h2>
      <p className="mt-6 text-lg leading-relaxed">{STORY.lead}</p>
      <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">{STORY.more}</p>
      <a href={SITE.socials.github} target="_blank" rel="noopener noreferrer" className="text-link mt-5">Explore my code <ArrowUpRight size={16} aria-hidden /></a>
    </div>
  </div>
);

export default Story;
