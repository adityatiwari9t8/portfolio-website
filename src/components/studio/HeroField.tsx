import { useEffect, useRef } from 'react';
import { useTheme } from '../../lib/theme';

const phoneWidth = 740;

function drawField(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  phase: number,
  scroll: number,
  pointer: { x: number; y: number; strength: number },
  lineColor: string,
  ridgeColor: string,
) {
  const compact = width <= phoneWidth;
  const lineCount = compact ? 27 : 46;
  const pointCount = compact ? 42 : 76;
  const drift = phase + scroll * 1.9;
  const ridgeCenter = .57 + Math.sin(drift) * .065;

  context.clearRect(0, 0, width, height);

  for (let line = 0; line < lineCount; line++) {
    const depth = line / (lineCount - 1);
    const baseline = -.1 + 1.32 * depth ** 1.18 + scroll * .15;
    const ridgeWidth = .205 + depth * .09;
    const ridgeHeight = .15 + depth * .19;
    const highlight = line % 6 === 0;

    context.beginPath();
    context.strokeStyle = highlight ? ridgeColor : lineColor;
    context.lineWidth = highlight ? 1.15 : .8;
    context.globalAlpha = (highlight ? .54 : .33) + depth * .14;

    for (let point = 0; point <= pointCount; point++) {
      const across = -.18 + 1.36 * point / pointCount;
      const ridge = (across - ridgeCenter - depth * .24) / ridgeWidth;
      const fold = (across - .16 - depth * .23) / .18;
      const ripple = pointer.strength > .001
        ? pointer.strength * Math.exp(-23 * (across - pointer.x) ** 2 - 12 * (depth - pointer.y) ** 2) * .115
        : 0;
      const crest = ridgeHeight * Math.exp(-ridge * ridge);
      const trough = (.045 + depth * .05) * Math.exp(-fold * fold);
      const wave = Math.sin(across * 8.3 - depth * 3.3 - drift) * (.038 + depth * .024);
      const x = width * (across + (depth - .5) * .105);
      const y = height * (baseline + .22 * (across - .5) - crest + trough + wave - ripple);
      if (point === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }

    context.stroke();
  }

  context.globalAlpha = 1;
}

export default function HeroField() {
  const { dark } = useTheme();
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const hero = canvas?.parentElement;
    const context = canvas?.getContext('2d');
    if (!canvas || !hero || !context) return;

    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const styles = getComputedStyle(canvas);
    const lineColor = styles.getPropertyValue('--field-line').trim();
    const ridgeColor = styles.getPropertyValue('--field-ridge').trim();
    const pointer = { x: .6, y: .4, strength: 0 };
    const target = { ...pointer };
    let bounds = hero.getBoundingClientRect();
    let width = 0;
    let height = 0;
    let phase = .6;
    let scroll = 0;
    let frame = 0;
    let lastDraw = 0;
    let onScreen = bounds.bottom > 0 && bounds.top < window.innerHeight;

    const schedule = () => {
      if (!frame && width && onScreen && !document.hidden) frame = requestAnimationFrame(draw);
    };

    const draw = (time: number) => {
      frame = 0;
      if (!onScreen || document.hidden) return;

      const elapsed = lastDraw ? time - lastDraw : 17;
      if (!motion.matches && lastDraw && elapsed < (width <= phoneWidth ? 31 : 15)) {
        schedule();
        return;
      }

      lastDraw = time;
      if (!motion.matches) phase += Math.min(elapsed, 48) * .00031;
      const ease = motion.matches ? 1 : 1 - Math.exp(-Math.min(elapsed, 48) / 125);
      pointer.x += (target.x - pointer.x) * ease;
      pointer.y += (target.y - pointer.y) * ease;
      pointer.strength += (target.strength - pointer.strength) * ease;
      drawField(context, width, height, phase, scroll, pointer, lineColor, ridgeColor);
      if (!motion.matches) schedule();
    };

    const measurePosition = () => {
      bounds = hero.getBoundingClientRect();
      scroll = Math.min(1, Math.max(0, window.scrollY / Math.max(1, bounds.height)));
      schedule();
    };

    const sizeCanvas = () => {
      measurePosition();
      width = bounds.width;
      height = bounds.height;
      const density = Math.min(window.devicePixelRatio || 1, width <= phoneWidth ? 1.25 : 1.5);
      const bufferWidth = Math.round(width * density);
      const bufferHeight = Math.round(height * density);
      if (canvas.width !== bufferWidth || canvas.height !== bufferHeight) {
        canvas.width = bufferWidth;
        canvas.height = bufferHeight;
      }
      context.setTransform(density, 0, 0, density, 0, 0);
      schedule();
    };
    const resize = new ResizeObserver(sizeCanvas);

    const syncPlayback = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lastDraw = 0;
      schedule();
    };

    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) measurePosition();
      syncPlayback();
    });

    const trackScroll = () => {
      if (onScreen) measurePosition();
    };

    const movePointer = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || !width || !height) return;
      target.x = Math.min(1, Math.max(0, (event.clientX - bounds.left) / width));
      target.y = Math.min(1, Math.max(0, (event.clientY - bounds.top) / height));
      target.strength = 1;
      schedule();
    };

    const releasePointer = () => {
      target.strength = 0;
      schedule();
    };

    sizeCanvas();
    resize.observe(hero);
    visibility.observe(hero);
    hero.addEventListener('pointermove', movePointer, { passive: true });
    hero.addEventListener('pointerleave', releasePointer);
    window.addEventListener('scroll', trackScroll, { passive: true });
    document.addEventListener('visibilitychange', syncPlayback);
    motion.addEventListener('change', syncPlayback);

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      visibility.disconnect();
      hero.removeEventListener('pointermove', movePointer);
      hero.removeEventListener('pointerleave', releasePointer);
      window.removeEventListener('scroll', trackScroll);
      document.removeEventListener('visibilitychange', syncPlayback);
      motion.removeEventListener('change', syncPlayback);
    };
  }, [dark]);

  return <canvas ref={ref} className="hero-field" aria-hidden="true" />;
}
