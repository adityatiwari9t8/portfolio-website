import type React from 'react';
import { flushSync } from 'react-dom';

/**
 * Shared view transitions for the theme switch and project pages.
 */
interface ViewTransition {
  ready: Promise<void>;
  finished: Promise<void>;
}
type VTDocument = Document & { startViewTransition?: (cb: () => void | Promise<void>) => ViewTransition };

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const supportsViewTransition = () =>
  typeof document !== 'undefined' && typeof (document as VTDocument).startViewTransition === 'function';
export const canTransition = () => supportsViewTransition() && !reduced();
const start = (cb: () => void | Promise<void>) => (document as VTDocument).startViewTransition!(cb);

const setName = (el: HTMLElement | null, name: string) => el?.style.setProperty('view-transition-name', name);
const frame = (id: string) => document.querySelector<HTMLElement>(`[data-vt="${id}"]`);
// While a view transition prepares its update the page is not painted, so animation frames never fire: use a timer.
const settle = () => new Promise<void>((res) => window.setTimeout(res, 60));

/** Shared name for the preview that grows from a project card into its case-study page and back. */
export const CASE_MEDIA = 'case-media';

let themeChanging = false;

/** Reveal the new theme outward from the switch. */
export async function changeTheme(apply: () => void, canvasColor: string, origin?: { x: number; y: number }) {
  if (themeChanging) return;
  themeChanging = true;
  const root = document.documentElement;
  const width = window.innerWidth;
  const height = window.innerHeight;
  const toggle = origin ? null : document.querySelector('.theme-toggle')?.getBoundingClientRect();
  const x = origin?.x ?? (toggle ? toggle.left + toggle.width / 2 : width / 2);
  const y = origin?.y ?? (toggle ? toggle.top + toggle.height / 2 : height / 2);
  const center = `${x}px ${y}px`;
  const radius = Math.ceil(Math.hypot(Math.max(x, width - x), Math.max(y, height - y))) + 1;
  let applied = false;
  let cover: HTMLDivElement | undefined;
  const commit = () => {
    if (applied) return;
    apply();
    applied = true;
  };

  try {
    if (supportsViewTransition()) {
      root.style.setProperty('--theme-origin', center);
      root.style.setProperty('--theme-radius', `${radius}px`);
      root.classList.add('vt-theme');
      const transition = start(() => flushSync(commit));
      void transition.ready.catch(() => undefined);
      await transition.finished;
    } else if (typeof document.body.animate === 'function') {
      cover = document.createElement('div');
      cover.className = 'theme-transition-cover';
      cover.setAttribute('aria-hidden', 'true');
      cover.style.backgroundColor = canvasColor;
      document.body.append(cover);

      const fade = reduced();
      const coverFrames = fade ? { opacity: [0, 1] } : { clipPath: [`circle(0px at ${center})`, `circle(${radius}px at ${center})`] };
      await cover.animate(coverFrames, { duration: fade ? 75 : 490, easing: 'cubic-bezier(.3,.05,.25,1)', fill: 'forwards' }).finished;
      flushSync(commit);
      await cover.animate({ opacity: [1, 0] }, { duration: fade ? 100 : 150, easing: 'ease-out', fill: 'forwards' }).finished;
    }
  } catch {
    // Complete the preference change even if capturing or animating the page fails.
  } finally {
    root.classList.remove('vt-theme');
    root.style.removeProperty('--theme-origin');
    root.style.removeProperty('--theme-radius');
    cover?.remove();
    themeChanging = false;
    commit();
  }
}

/** Open a case study: the card's preview window grows into the page. */
export function openStudy(id: string, href: string) {
  const from = frame(id);
  if (!canTransition() || !from || window.location.hash === href) {
    window.location.hash = href;
    return;
  }
  setName(from, CASE_MEDIA);
  start(
    () =>
      new Promise<void>((resolve) => {
        setName(from, '');
        const done = () => {
          window.removeEventListener('hashchange', done);
          settle().then(resolve);
        };
        window.addEventListener('hashchange', done);
        window.location.hash = href;
        window.setTimeout(done, 400);
      })
  ).finished.finally(() => setName(from, ''));
}

/** Close a case study: the page shrinks back into the card it came from. */
export function closeStudy(close: () => void, id: string | null) {
  if (!canTransition() || !id) {
    close();
    return;
  }
  start(() => {
    flushSync(close);
    setName(frame(id), CASE_MEDIA);
  }).finished.finally(() => setName(frame(id), ''));
}

/** Click handler for links to a case study; plain clicks morph, modified clicks behave as usual. */
export const studyLinkClick =
  (id: string, href: string) => (e: React.MouseEvent<HTMLElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (!canTransition()) return;
    e.preventDefault();
    openStudy(id, href);
  };
