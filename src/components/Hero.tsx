import React from 'react';
import { ArrowUpRight, Code2, FileText, Github, Linkedin } from 'lucide-react';
import { HERO } from '../data/content';
import { SITE } from '../data/site';
import Magnetic from './Magnetic';
import Tilt from './Tilt';
import Parallax from './Parallax';

const delay = (ms: number) => ({ '--d': `${ms}ms` }) as React.CSSProperties;

interface HeroProps {
  onOpenContact: () => void;
}

/** Small "L" registration mark, like the corner marks framing the reference shot. */
const Corner: React.FC<{ className: string }> = ({ className }) => (
  <span
    aria-hidden
    className={`pointer-events-none absolute hidden h-3.5 w-3.5 border-neutral-400/70 sm:block dark:border-neutral-500 ${className}`}
  />
);

/**
 * Fluted-glass look over the back half of the portrait: narrow vertical bands, each a blurred copy of the photo,
 * blur easing from heavy at the left edge down to nearly none beside the face (which stays sharp).
 * A faint highlight and shade on every band makes them read as ribs of glass. Always on; nothing animates.
 */
const BAND_COUNT = 10;
const BAND_START = 0; // % from the left edge of the card: the blur begins right at the edge
const BAND_WIDTH = 4.8; // % each
const BANDS = Array.from({ length: BAND_COUNT }, (_, i) => {
  const from = BAND_START + i * BAND_WIDTH;
  const to = from + BAND_WIDTH + 0.35; // tiny overlap so no sharp hairline shows between bands
  const clip = `inset(0 ${(100 - to).toFixed(2)}% 0 ${from.toFixed(2)}%)`;
  return {
    blur: +(12 * Math.pow(1 - i / BAND_COUNT, 2)).toFixed(2),
    clip,
    rib: +(0.95 * (1 - i / BAND_COUNT)).toFixed(2)
  };
});

const PROOF = [
  { icon: Github, label: 'GitHub', url: SITE.socials.github },
  { icon: Linkedin, label: 'LinkedIn', url: SITE.socials.linkedin },
  { icon: Code2, label: 'LeetCode', url: SITE.socials.leetcode }
];

const Hero: React.FC<HeroProps> = ({ onOpenContact }) => {
  const [before, accent, after] = HERO.headline;
  const headline = `${before} ${accent} ${after}`;

  // Soft light that follows the pointer (fine pointers only; it is decoration, not information).
  const follow = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  // Headline words rise in one after another.
  let k = 0;
  const words = (text: string, cls = '', z?: number) =>
    text
      .split(' ')
      .filter(Boolean)
      .map((w) => {
        const n = k++;
        return (
          <React.Fragment key={`${w}-${n}`}>
            <span
              aria-hidden
              style={{ ...delay(120 + 70 * n), '--z': z ?? [10, 18, 14][n % 3] } as React.CSSProperties}
              className={`word w3d ${cls}`}
            >
              {w}
            </span>{' '}
          </React.Fragment>
        );
      });

  return (
    // The whole card leans toward the pointer (or with the scroll on touch screens) like every other card on the page.
    <Tilt flat hint={false} max={3.2} scrollMax={9} scale={1.01} lift={14} radius="rounded-[2rem]">
    <section
      id="home"
      onPointerMove={follow}
      className="spotlight relative overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-[0_30px_80px_-40px_rgba(0,0,0,0.25)] dark:border-white/10 dark:bg-neutral-900"
    >
      <div aria-hidden className="hero-glow pointer-events-none absolute inset-0" />
      <Corner className="left-4 top-4 border-l border-t" />
      <Corner className="right-4 top-4 border-r border-t" />

      <div className="relative grid items-center gap-10 px-6 pb-9 pt-8 sm:px-12 sm:pb-12 sm:pt-12 md:grid-cols-[1.15fr_1fr] md:gap-12 md:px-16 md:py-16">
        {/* text: name, one headline, two sentences, two buttons. Everything else lives further down the page. */}
        <div>
          <span style={delay(0)} className="rise inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {SITE.status}
          </span>

          <div style={delay(60)} className="rise mt-6 flex items-center gap-3">
            {/* on phones a small avatar stands in for the big portrait, so the hero fits on one screen */}
            <img
              src="/img.webp"
              width={662}
              height={886}
              alt=""
              aria-hidden
              className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-black/10 md:hidden dark:ring-white/15"
              style={{ objectPosition: 'center 20%' }}
            />
            <p className="text-base font-medium text-neutral-700 sm:text-lg dark:text-neutral-300">{HERO.intro}</p>
          </div>

          <Tilt shadow={false} hint={false} max={5} scale={1.02} lift={34} className="mt-3">
            <h1
              aria-label={headline}
              className="preserve-3d text-[2.4rem] font-medium leading-[1.05] tracking-[-0.03em] text-neutral-950 sm:text-5xl lg:text-[3.6rem] dark:text-white"
            >
              {words(before)}
              {words(accent, 'accent text-[1.08em]', 36)}
              {words(after)}
            </h1>
          </Tilt>

          <p style={delay(650)} className="rise mt-5 max-w-md text-[15px] leading-relaxed text-neutral-600 sm:text-base dark:text-neutral-400">
            {HERO.body}
          </p>

          <div style={delay(760)} className="rise mt-8 flex flex-wrap items-center gap-2">
            <Magnetic>
              <button
                onClick={onOpenContact}
                className="group inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
              >
                Get in touch
                <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
            </Magnetic>
            <Tilt scroll={false} max={10} scale={1.06} lift={18} glare radius="rounded-full">
              <a
                href={SITE.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="preserve-3d inline-flex items-center gap-2 rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-100 dark:border-white/15 dark:text-neutral-200 dark:hover:bg-white/10"
              >
                <FileText className="depth-1 h-4 w-4" />
                <span className="depth-1">Resume</span>
              </a>
            </Tilt>
          </div>

          <ul style={delay(860)} className="rise mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-neutral-600 dark:text-neutral-400">
            {PROOF.map(({ icon: Icon, label, url }) => (
              <li key={label}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 py-1 font-medium transition hover:text-neutral-950 dark:hover:text-white"
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* portrait */}
        <div style={delay(120)} className="rise hidden md:block">
          <Parallax speed={0.07} max={60}>
          <Tilt lock max={13} scale={1.04} lift={36} glare radius="rounded-[1.75rem]" className="w-full">
            <div className="float relative aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] bg-white shadow-[0_30px_60px_-20px_rgba(0,0,0,0.3)] ring-1 ring-black/5 dark:ring-white/10">
              <img
                src="/img.webp"
                width={662}
                height={886}
                alt={`${SITE.name} portrait`}
                loading="eager"
                fetchPriority="high"
                className="h-full w-full object-cover dark:brightness-[0.8]"
                style={{ objectPosition: 'center 20%' }}
              />
              {BANDS.map((band, i) => (
                <React.Fragment key={i}>
                  <img
                    src="/img.webp"
                    alt=""
                    aria-hidden
                    decoding="async"
                    className="pband pointer-events-none absolute inset-0 h-full w-full object-cover"
                    style={
                      {
                        objectPosition: 'center 20%',
                        clipPath: band.clip,
                        '--b': band.blur
                      } as React.CSSProperties
                    }
                  />
                  <span
                    aria-hidden
                    className="prib pointer-events-none absolute inset-0"
                    style={{ clipPath: band.clip, opacity: band.rib }}
                  />
                </React.Fragment>
              ))}
              {/* in dark mode the white studio background is dimmed and faded into the card */}
              <div aria-hidden className="pointer-events-none absolute inset-0 hidden bg-gradient-to-t from-black/45 via-transparent to-neutral-900/25 dark:block" />
            </div>
          </Tilt>
          </Parallax>
        </div>
      </div>

    </section>
    </Tilt>
  );
};

export default Hero;
