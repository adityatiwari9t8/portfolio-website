import { useEffect } from 'react';
import { onScrollFrame, touchOnly, viewportPosition } from './scrollBus';

/**
 * Lights the border of every `.lit` card. Position is written to --lx / --ly (relative to each card)
 * and --lo (on/off) and drawn in CSS.
 *  - Mouse: the light sits under the pointer and lights cards near it.
 *  - Touch: no pointer, so the light travels across each card as it scrolls through the screen,
 *    brightest when the card is centred.
 */
export function useCursorLight() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const root = document.documentElement;

    if (touchOnly()) {
      const paint = () => {
        document.querySelectorAll<HTMLElement>('.lit').forEach((el) => {
          const r = el.getBoundingClientRect();
          const { t, focus, visible } = viewportPosition(r);
          if (!visible) return;
          // The light slides down-to-up and left-to-right over the card edge as it passes.
          el.style.setProperty('--lx', `${r.width * (0.5 - t * 0.5)}px`);
          el.style.setProperty('--ly', `${r.height * (0.5 + t * 0.6)}px`);
          el.style.setProperty('--lo', String(Math.min(1, focus * 1.4).toFixed(2)));
        });
      };
      paint();
      const off = onScrollFrame(paint);
      return () => {
        off();
        document.querySelectorAll<HTMLElement>('.lit').forEach((el) => el.style.removeProperty('--lo'));
      };
    }

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
