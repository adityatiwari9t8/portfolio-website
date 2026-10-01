import React, { useEffect, useRef } from 'react';
import { onScrollFrame, viewportPosition } from '../lib/scrollBus';

interface SectionLiftProps {
  children: React.ReactNode;
  as?: 'section' | 'div';
  id?: string;
  className?: string;
  /** Strongest lean in degrees, at the moment the section enters or leaves the screen. */
  max?: number;
  /** For the last section on the page, which can never reach the middle of the screen: ease flat as the page ends. */
  settle?: boolean;
}

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Lifts a whole section as you scroll through it: it leans back and sits a little smaller while it
 * arrives, stands flat and full size in the middle of the screen, then leans forward as it leaves.
 * The outer element never moves (so anchors and the nav highlight stay exact); only the inner one does.
 */
const SectionLift: React.FC<SectionLiftProps> = ({
  children,
  as = 'div',
  id,
  className = '',
  max = 7.5,
  settle = false,
}) => {
  const outer = useRef<HTMLElement | null>(null);
  const inner = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = outer.current;
    const el = inner.current;
    if (!host || !el || reduced()) return;

    const measure = () => {
      const r = host.getBoundingClientRect();
      const p = viewportPosition(r);
      if (!p.visible) return;

      let t = p.t;
      if (settle) {
        const left = document.documentElement.scrollHeight - window.innerHeight - window.scrollY;
        t *= Math.max(0, Math.min(1, left / (window.innerHeight * 0.5)));
      }

      // Tall sections swing their far edge a long way, so lean them less.
      const k = Math.min(1, 950 / Math.max(r.height, 1));
      if (Math.abs(t) < 0.012) {
        el.style.transform = '';
        return;
      }
      const rx = t * max * k;
      const s = 1 - 0.085 * t * t;
      const y = t * 16;
      el.style.transform = `perspective(1800px) translate3d(0, ${y.toFixed(1)}px, 0) rotateX(${rx.toFixed(3)}deg) scale(${s.toFixed(4)})`;
    };

    measure();
    const off = onScrollFrame(measure);
    return () => {
      off();
      el.style.transform = '';
    };
  }, [max, settle]);

  const Tag = as as 'section';
  return (
    <Tag ref={outer as React.RefObject<HTMLElement>} id={id} className={className}>
      <div ref={inner} style={{ transformOrigin: '50% 50%' }}>
        {children}
      </div>
    </Tag>
  );
};

export default SectionLift;
