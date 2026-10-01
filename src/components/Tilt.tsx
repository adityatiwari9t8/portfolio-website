import React, { useEffect, useRef } from 'react';
import { onScrollFrame, touchOnly, viewportPosition } from '../lib/scrollBus';

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
  /** A shadow under the first child that swings the opposite way to the tilt. */
  shadow?: boolean;
  /** Corner radius of the highlight, so it stays inside rounded cards. */
  radius?: string;
  /** Keep the layer hint (best for cards). Text turns it off so it is re-drawn sharp while enlarged. */
  hint?: boolean;
  /** On touch screens, follow the scroll instead of the mouse. Turn off for fixed or tiny elements. */
  scroll?: boolean;
  /** Strongest lean (degrees) when following the scroll on touch screens. Tall cards need more than the hover angle. */
  scrollMax?: number;
  /** While the pointer is over this card, any tilting card around it settles flat so this one can be seen. */
  lock?: boolean;
  /** For a card that wraps one big flat panel: skip preserve-3d so the panel's contents keep receiving the pointer while it tilts. */
  flat?: boolean;
  role?: string;
}

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * 3D card: follows the mouse with a spring, rises toward you and lets children sit at different
 * depths (see .depth-1/2/3 in index.css). On touch screens the same pose is driven by scroll position:
 * the card leans back as it enters, stands flat and raised when centred, and leans forward as it leaves.
 * Off for reduced motion. Plain CSS transforms.
 */
const Tilt: React.FC<TiltProps> = ({
  children,
  className = '',
  max = 12,
  scale = 1.03,
  lift = 24,
  glare = false,
  shadow = true,
  radius = 'rounded-[1.5rem]',
  hint = true,
  scroll = true,
  scrollMax,
  lock = false,
  flat = false,
  role
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  // Current and target pose; a frame loop eases the first towards the second.
  const pose = useRef({ rx: 0, ry: 0, s: 1, z: 0, px: 0.5, py: 0.5, h: 0 });
  const goal = useRef({ rx: 0, ry: 0, s: 1, z: 0, px: 0.5, py: 0.5, h: 0 });
  const frame = useRef(0);
  const byScroll = useRef(false);
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
    const persp = byScroll.current ? 1800 : 1000;
    el.style.transform = `perspective(${persp}px) translate3d(0,0,${p.z.toFixed(1)}px) rotateX(${p.rx.toFixed(2)}deg) rotateY(${p.ry.toFixed(2)}deg) scale(${p.s.toFixed(4)})`;
    el.style.setProperty('--tx', `${(p.px * 100).toFixed(1)}%`);
    el.style.setProperty('--ty', `${(p.py * 100).toFixed(1)}%`);
    el.style.setProperty('--th', p.h.toFixed(3));
    // Unitless pointer position (-1 to 1) for effects that need maths, such as the text shadow on headings.
    el.style.setProperty('--nx', ((p.px - 0.5) * 2).toFixed(3));
    el.style.setProperty('--ny', ((p.py - 0.5) * 2).toFixed(3));
    // Shadow slides away from the light and gets longer the higher the card is.
    const sx = (0.5 - p.px) * 56 * p.h;
    const sy = 18 + p.h * 34 + (0.5 - p.py) * 40 * p.h;
    el.style.setProperty(
      '--ts',
      byScroll.current
        ? `0 ${(10 + p.h * 14).toFixed(0)}px ${(22 + p.h * 18).toFixed(0)}px -12px rgba(0,0,0,${(0.1 + p.h * 0.14).toFixed(2)})`
        : `${sx.toFixed(1)}px ${sy.toFixed(1)}px ${(30 + p.h * 40).toFixed(0)}px -${(14 - p.h * 4).toFixed(0)}px rgba(0,0,0,${(0.2 + p.h * 0.3).toFixed(2)})`
    );
    if (moving) frame.current = requestAnimationFrame(draw);
    else if (p.h === 0) el.removeAttribute('data-hot');
  };
  const kick = () => {
    if (!frame.current) frame.current = requestAnimationFrame(draw);
  };

  // Touch screens: no hover, so the pose comes from where the card sits in the viewport.
  useEffect(() => {
    if (!scroll || !touchOnly() || reduced()) return;
    byScroll.current = true;
    const measure = () => {
      const el = ref.current;
      if (!el) return;
      const { t, focus, visible } = viewportPosition(el.getBoundingClientRect());
      if (!visible) return;
      // Tall cards would distort badly at full angle, so the tilt shrinks with height.
      const k = Math.min(1, 520 / el.offsetHeight);
      const g = goal.current;
      g.rx = t * (scrollMax ?? max) * 0.8 * k;
      g.ry = 0;
      g.s = 1 + (scale - 1) * focus * 0.5;
      g.z = lift * focus * 0.5;
      g.px = 0.5;
      g.py = 0.5 + t * 0.5;
      g.h = focus * 0.7;
      if (g.h > 0.12) el.dataset.hot = '1';
      else el.removeAttribute('data-hot');
      kick();
    };
    measure();
    const off = onScrollFrame(measure);
    return () => {
      byScroll.current = false;
      off();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    // Over a locked child card: this (outer) card eases back to flat and the child takes over.
    const locked = (e.target as Element).closest('[data-tilt-lock]');
    if (locked && locked !== el && el.contains(locked)) {
      leave();
      return;
    }
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
    if (byScroll.current) return;
    goal.current = { rx: 0, ry: 0, s: 1, z: 0, px: 0.5, py: 0.5, h: 0 };
    kick();
  };

  return (
    <div
      ref={ref}
      role={role}
      data-tilt-lock={lock ? '' : undefined}
      onPointerEnter={() => {
        if (pose.current.h < 0.05) rest.current = null;
      }}
      onPointerMove={move}
      onPointerLeave={leave}
      className={`tilt ${flat ? '' : 'preserve-3d'} relative ${hint ? 'will-change-transform' : ''} ${shadow ? 'tilt-shadow' : ''} ${className}`}
    >
      {children}
      {glare && <span aria-hidden className={`tilt-glare pointer-events-none absolute inset-0 ${radius}`} />}
    </div>
  );
};

export default Tilt;
