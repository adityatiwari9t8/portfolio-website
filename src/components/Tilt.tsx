import React, { useEffect, useRef } from 'react';

interface TiltProps {
  children: React.ReactNode;
  className?: string;
  /** Maximum tilt in degrees. */
  max?: number;
  /** Grow a little while hovered. */
  scale?: number;
  /** How far (px) the whole card rises toward you while hovered. */
  lift?: number;
  /** A soft highlight that slides across the surface with the pointer. */
  glare?: boolean;
  /** Corner radius of the highlight, so it stays inside rounded cards. */
  radius?: string;
}

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Gentle 3D hover for the few surfaces that earn it (the project cards): follows the
 * mouse with a spring and rises toward you. Mouse only; touch screens and reduced motion get a
 * still card. Children can sit at different depths (see .depth-1/2/3 in index.css).
 */
const Tilt: React.FC<TiltProps> = ({ children, className = '', max = 6, scale = 1.015, lift = 12, glare = false, radius = 'rounded-[1.5rem]' }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  // Current and target pose; a frame loop eases the first towards the second.
  const pose = useRef({ rx: 0, ry: 0, s: 1, z: 0, px: 0.5, py: 0.5, h: 0 });
  const goal = useRef({ rx: 0, ry: 0, s: 1, z: 0, px: 0.5, py: 0.5, h: 0 });
  const frame = useRef(0);
  // Card rectangle measured while it is at rest; reused so the tilt never feeds back into the pointer maths.
  const rest = useRef<DOMRect | null>(null);

  const draw = () => {
    frame.current = 0;
    const el = ref.current;
    if (!el) return;
    const p = pose.current;
    const g = goal.current;
    let moving = false;
    (['rx', 'ry', 's', 'z', 'px', 'py', 'h'] as const).forEach((k) => {
      const d = g[k] - p[k];
      if (Math.abs(d) > 0.002) {
        p[k] += d * 0.14;
        moving = true;
      } else p[k] = g[k];
    });
    el.style.transform =
      p.h === 0
        ? ''
        : `perspective(1200px) translate3d(0,0,${p.z.toFixed(1)}px) rotateX(${p.rx.toFixed(2)}deg) rotateY(${p.ry.toFixed(2)}deg) scale(${p.s.toFixed(4)})`;
    el.style.setProperty('--tx', `${(p.px * 100).toFixed(1)}%`);
    el.style.setProperty('--ty', `${(p.py * 100).toFixed(1)}%`);
    el.style.setProperty('--th', p.h.toFixed(3));
    el.style.setProperty('--nx', ((p.px - 0.5) * 2).toFixed(3));
    el.style.setProperty('--ny', ((p.py - 0.5) * 2).toFixed(3));
    if (moving) frame.current = requestAnimationFrame(draw);
    else if (p.h === 0) el.removeAttribute('data-hot');
  };
  const kick = () => {
    if (!frame.current) frame.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    const stale = () => {
      rest.current = null;
    };
    window.addEventListener('scroll', stale, { passive: true });
    window.addEventListener('resize', stale);
    return () => {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
      window.removeEventListener('scroll', stale);
      window.removeEventListener('resize', stale);
    };
  }, []);

  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (e.pointerType !== 'mouse' || !el || reduced()) return;
    const r = rest.current ?? (rest.current = el.getBoundingClientRect());
    const px = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    const py = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height));
    const g = goal.current;
    g.ry = (px - 0.5) * 2 * max;
    g.rx = -(py - 0.5) * 2 * max;
    g.s = scale;
    g.z = lift;
    g.px = px;
    g.py = py;
    g.h = 1;
    el.dataset.hot = '1';
    kick();
  };
  const leave = () => {
    goal.current = { rx: 0, ry: 0, s: 1, z: 0, px: 0.5, py: 0.5, h: 0 };
    kick();
  };

  return (
    <div
      ref={ref}
      onPointerEnter={() => {
        if (pose.current.h < 0.05) rest.current = null;
      }}
      onPointerMove={move}
      onPointerLeave={leave}
      className={`tilt preserve-3d relative ${className}`}
    >
      {children}
      {glare && <span aria-hidden className={`tilt-glare pointer-events-none absolute inset-0 ${radius}`} />}
    </div>
  );
};

export default Tilt;
