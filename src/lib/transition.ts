import type React from 'react';
import { flushSync } from 'react-dom';

/**
 * Small wrappers around the View Transitions API (Chrome, Edge, Safari 18+). Where it is missing,
 * or the visitor prefers reduced motion, every function falls back to the plain, instant behaviour.
 */
interface ViewTransition {
  ready: Promise<void>;
  finished: Promise<void>;
}
type VTDocument = Document & { startViewTransition?: (cb: () => void | Promise<void>) => ViewTransition };

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const canTransition = () =>
  typeof document !== 'undefined' && typeof (document as VTDocument).startViewTransition === 'function' && !reduced();
const start = (cb: () => void | Promise<void>) => (document as VTDocument).startViewTransition!(cb);

const setName = (el: HTMLElement | null, name: string) => el?.style.setProperty('view-transition-name', name);
const frame = (id: string) => document.querySelector<HTMLElement>(`[data-vt="${id}"]`);
// While a view transition prepares its update the page is not painted, so animation frames never fire: use a timer.
const settle = () => new Promise<void>((res) => window.setTimeout(res, 60));

/** Shared name for the preview that grows from a project card into its case-study page and back. */
export const CASE_MEDIA = 'case-media';

/** Light/dark switch that spreads outward from the toggle button like a ripple. */
export function changeTheme(apply: () => void, x: number, y: number) {
  if (!canTransition()) {
    apply();
    return;
  }
  const root = document.documentElement;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  root.classList.add('vt-theme');
  const t = start(() => flushSync(apply));
  t.ready
    .then(() => {
      const options = {
        duration: 700,
        easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
        pseudoElement: '::view-transition-new(root)'
      };
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        options as KeyframeAnimationOptions
      );
    })
    .catch(() => undefined);
  t.finished.finally(() => root.classList.remove('vt-theme'));
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
