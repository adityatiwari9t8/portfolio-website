import React, { useEffect, useRef } from 'react';
import { FileText } from 'lucide-react';
import { STORY, STORY_PHOTOS, StoryPhoto } from '../data/content';
import { SITE } from '../data/site';
import Headline from './Headline';

/** `drift` is how far (px) the photo slides against the scroll; opposite signs make the two photos pass each other. */
const Polaroid: React.FC<{ photo: StoryPhoto; className: string; drift: number }> = ({ photo, className, drift }) => (
  <figure
    style={{ translate: `0 calc(var(--drift, 0) * ${drift}px)` }}
    className={`group absolute rounded-[6px] bg-white p-2 pb-9 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.35)] transition duration-300 ease-out hover:z-10 hover:-translate-y-2 hover:scale-[1.04] hover:shadow-[0_28px_50px_-14px_rgba(0,0,0,0.45)] dark:bg-neutral-300 ${className}`}
  >
    <span
      aria-hidden
      className="absolute -top-2 left-1/2 z-10 h-4 w-4 -translate-x-1/2 rounded-full bg-neutral-800 shadow-[0_3px_6px_rgba(0,0,0,0.4)] ring-2 ring-neutral-600"
    />
    <img
      src={photo.src}
      alt={photo.alt}
      loading="lazy"
      width={400}
      height={500}
      className={`aspect-[4/5] w-full rounded-[3px] object-cover dark:brightness-90 ${photo.srcDark ? 'dark:hidden' : ''} ${photo.kind === 'photo' ? 'grayscale' : ''}`}
      style={{ objectPosition: photo.position }}
    />
    {/* dark-mode version, already toned for the dark page, so it skips the brightness dip */}
    {photo.srcDark && (
      <img
        src={photo.srcDark}
        alt={photo.alt}
        loading="lazy"
        width={400}
        height={500}
        className={`hidden aspect-[4/5] w-full rounded-[3px] object-cover dark:block ${photo.kind === 'photo' ? 'grayscale' : ''}`}
        style={{ objectPosition: photo.position }}
      />
    )}
    <figcaption className="accent absolute inset-x-0 bottom-1.5 text-center text-[15px] text-neutral-700 sm:text-base">
      {photo.caption}
    </figcaption>
  </figure>
);

/** Writes how far the photo stack is from the middle of the screen (-1 to 1) into --drift. */
const useDrift = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const p = (window.innerHeight / 2 - (r.top + r.height / 2)) / window.innerHeight;
      el.style.setProperty('--drift', Math.max(-1, Math.min(1, p)).toFixed(3));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return ref;
};

const Story: React.FC = () => {
  const photos = useDrift();
  return (
  <div className="grid items-center gap-12 max-sm:gap-6 md:grid-cols-[1.1fr_1fr] md:gap-10">
    <div>
      <p className="mb-4 font-mono text-[11.5px] font-medium uppercase tracking-[0.12em] max-sm:mb-3 text-neutral-600 dark:text-neutral-400">
        About
      </p>
      <Headline before="About" accent="me" className="text-[2.75rem] max-sm:text-[2.5rem] sm:text-6xl md:text-7xl" />

      <p className="mt-6 text-lg font-medium leading-relaxed max-sm:mt-4 max-sm:text-[17px] text-neutral-900 sm:text-xl dark:text-neutral-100">
        {STORY.lead}
        <span className="text-neutral-600 dark:text-neutral-400">{STORY.fade}</span>
      </p>
      <p className="mt-5 text-[15px] leading-relaxed max-sm:mt-4 text-neutral-600 sm:text-base dark:text-neutral-400">{STORY.more}</p>

      <a
        href={SITE.resume}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-neutral-950 max-sm:mt-6 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 active:scale-[0.98] dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
      >
        <FileText className="h-4 w-4" />
        View my resume
      </a>
    </div>

    <div ref={photos} className="relative mx-auto h-[400px] w-full max-w-[440px] max-sm:h-[330px] max-sm:max-w-[360px] sm:h-[460px]">
      {STORY_PHOTOS.length === 1 ? (
        <Polaroid photo={STORY_PHOTOS[0]} drift={-34} className="left-[20%] top-[6%] w-[60%] -rotate-[5deg]" />
      ) : (
        <>
          <Polaroid photo={STORY_PHOTOS[0]} drift={-38} className="left-[2%] top-[10%] w-[46%] -rotate-[8deg]" />
          <Polaroid photo={STORY_PHOTOS[1]} drift={38} className="right-[2%] top-[26%] w-[46%] rotate-[5deg]" />
        </>
      )}
    </div>
  </div>
  );
};

export default Story;
