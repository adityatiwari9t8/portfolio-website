import React, { useEffect, useRef } from 'react';
import { useTheme } from '../lib/theme';

interface DotWaveProps {
  className?: string;
  /** Centre of the shape as a fraction of the canvas, so it can sit off to one side of the text. */
  cx?: number;
  cy?: number;
}

const RINGS = 54;
const BUCKETS = 10;
const TAU = Math.PI * 2;

/**
 * A rippling, dotted 3D surface (the hero backdrop). Points sit on concentric rings, are lifted by a
 * few travelling sine waves, then tilted, slowly turned and perspective-projected onto a 2D canvas.
 * Dots are batched into a handful of opacity buckets so ~10k points draw in a couple of milliseconds.
 * Pauses off screen and in background tabs; one still frame for reduced motion.
 */
const DotWave: React.FC<DotWaveProps> = ({ className = '', cx = 0.68, cy = 0.5 }) => {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const { dark } = useTheme();
  const darkRef = useRef(dark);
  const redraw = useRef<() => void>(() => undefined);

  useEffect(() => {
    darkRef.current = dark;
    redraw.current();
  }, [dark]);

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext('2d');
    if (!el || !ctx) return;

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Precompute ring geometry once: radius, angle and per-point constants.
    const pts: { r: number; a: number; edge: number }[] = [];
    for (let i = 0; i < RINGS; i++) {
      const r = (i + 1) / RINGS;
      const n = Math.round(10 + i * 7.2);
      const edge = Math.min(1, (1 - r) / 0.18 + 0.15); // outer rings fade out
      for (let j = 0; j < n; j++) pts.push({ r, a: (j / n) * TAU + i * 0.13, edge });
    }
    const xs: number[][] = Array.from({ length: BUCKETS }, () => []);

    let w = 0;
    let h = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = el.clientWidth;
      h = el.clientHeight;
      el.width = Math.round(w * dpr);
      el.height = Math.round(h * dpr);
    };

    // Pointer nudges the camera a little (mouse only).
    const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      tilt.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      tilt.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const draw = (t: number) => {
      if (!w || !h) return;
      tilt.x += (tilt.tx - tilt.x) * 0.04;
      tilt.y += (tilt.ty - tilt.y) * 0.04;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (const b of xs) b.length = 0;

      const narrow = w < 768;
      const scale = Math.min(w, h * 1.25) * (narrow ? 0.62 : 0.5);
      const ox = w * (narrow ? 0.62 : cx);
      const oy = h * (narrow ? 0.34 : cy);
      const rotX = 1.02 + tilt.y * 0.08; // looking down at the surface
      const rotZ = t * 0.045 + tilt.x * 0.25;
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosZ = Math.cos(rotZ);
      const sinZ = Math.sin(rotZ);
      const D = 3.2;

      for (let k = 0; k < pts.length; k++) {
        const { r, a, edge } = pts[k];
        // Height: a ripple travelling outward, plus two slow lobes that make the rim wobble.
        const z =
          0.24 * Math.sin(7 * r - 1.15 * t) * (1 - 0.5 * r) +
          0.16 * r * Math.sin(3 * a + 2.2 * r - 0.32 * t) +
          0.07 * Math.cos(2 * a - 5 * r + 0.55 * t);
        const warp = 1 + 0.1 * Math.sin(2 * a + 0.25 * t);
        const x0 = r * warp * Math.cos(a);
        const y0 = r * Math.sin(a);
        // turn, then tilt
        const x1 = x0 * cosZ - y0 * sinZ;
        const y1 = x0 * sinZ + y0 * cosZ;
        const y2 = y1 * cosX - z * sinX;
        const z2 = y1 * sinX + z * cosX;
        const p = D / (D + z2);
        const sx = ox + x1 * scale * p;
        const sy = oy + y2 * scale * p;
        if (sx < -4 || sy < -4 || sx > w + 4 || sy > h + 4) continue;
        // Nearer and higher points are brighter.
        const light = Math.max(0, Math.min(1, (0.55 + z * 1.4 - z2 * 0.35) * edge));
        const bucket = Math.min(BUCKETS - 1, Math.floor(light * BUCKETS));
        xs[bucket].push(sx, sy, p);
      }

      ctx.fillStyle = darkRef.current ? '#ffffff' : '#141418';
      const maxAlpha = darkRef.current ? 0.85 : 0.6;
      for (let b = 1; b < BUCKETS; b++) {
        const list = xs[b];
        if (!list.length) continue;
        ctx.globalAlpha = (b / (BUCKETS - 1)) * maxAlpha;
        for (let i = 0; i < list.length; i += 3) {
          const s = 1.1 * list[i + 2];
          ctx.fillRect(list[i] - s / 2, list[i + 1] - s / 2, s, s);
        }
      }
      ctx.globalAlpha = 1;
    };

    let frame = 0;
    let running = false;
    let visible = true;
    const t0 = performance.now();
    const loop = (now: number) => {
      draw((now - t0) / 1000);
      frame = requestAnimationFrame(loop);
    };
    const startLoop = () => {
      if (running || still || !visible || document.hidden) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };
    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    redraw.current = () => {
      if (!running) draw(still ? 6 : (performance.now() - t0) / 1000);
    };

    const ro = new ResizeObserver(() => {
      resize();
      redraw.current();
    });
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) startLoop();
      else stopLoop();
    });
    io.observe(el);
    const onVis = () => (document.hidden ? stopLoop() : startLoop());
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('pointermove', onMove, { passive: true });

    resize();
    redraw.current();
    startLoop();

    return () => {
      stopLoop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pointermove', onMove);
      redraw.current = () => undefined;
    };
  }, [cx, cy]);

  return <canvas ref={canvas} aria-hidden className={`block h-full w-full ${className}`} />;
};

export default DotWave;
