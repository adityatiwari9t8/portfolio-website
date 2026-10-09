import { useEffect } from 'react';

/**
 * Lights the border of every `.lit` card. Position is written to --lx / --ly (relative to each card)
 * and --lo (on/off) and drawn in CSS.
 * The light sits under the mouse pointer and lights cards near it. Touch screens skip it.
 */
export function useCursorLight() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const root = document.documentElement;

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine) return;
    let frame = 0;
    let x = 0;
    let y = 0;

    const paint = () => {
      frame = 0;
      document.querySelectorAll<HTMLElement>('.lit').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -300 || r.top > window.innerHeight + 300) return;
        el.style.setProperty('--lx', `${x - r.left}px`);
        el.style.setProperty('--ly', `${y - r.top}px`);
      });
      root.style.setProperty('--lo', '1');
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const onLeave = () => root.style.setProperty('--lo', '0');

    document.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      root.style.removeProperty('--lo');
    };
  }, []);
}
