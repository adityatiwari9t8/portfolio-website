/**
 * One shared scroll/resize listener for every scroll-driven effect (card tilt, lit borders).
 * Callbacks run once per animation frame, so twenty cards cost one listener, not twenty.
 */
const subs = new Set<() => void>();
let ticking = false;
let bound = false;

const run = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    subs.forEach((fn) => fn());
  });
};

export function onScrollFrame(fn: () => void) {
  subs.add(fn);
  if (!bound) {
    window.addEventListener('scroll', run, { passive: true });
    window.addEventListener('resize', run);
    bound = true;
  }
  return () => {
    subs.delete(fn);
  };
}

/** Phones and tablets: no hover, so mouse effects are replaced by scroll-driven ones. */
export const touchOnly = () => typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

/**
 * Where an element is in the viewport: t runs from +1 (just entering at the bottom) through 0
 * (centred) to -1 (leaving at the top); focus is 1 when centred and falls to 0 at the edges.
 */
export function viewportPosition(r: DOMRect) {
  const vh = window.innerHeight;
  const centre = r.top + r.height / 2;
  const t = Math.max(-1, Math.min(1, (centre - vh / 2) / (vh / 2 + Math.min(r.height, vh) * 0.25)));
  return { t, focus: 1 - Math.abs(t), visible: r.bottom > -150 && r.top < vh + 150 };
}
