import React, { useEffect, useRef, useState } from 'react';

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Text that starts with a whole number counts up to it once when scrolled into view
 * ("13 subject models" counts 0 to 13). Anything else is shown as it is.
 * The final width is reserved up front so nothing around it moves.
 */
const CountUp: React.FC<{ text: string; ms?: number }> = ({ text, ms = 900 }) => {
  const m = /^(\d{1,4})(.*)$/s.exec(text);
  const target = m ? parseInt(m[1], 10) : 0;
  const ref = useRef<HTMLSpanElement | null>(null);
  const [shown, setShown] = useState(m && !reduced() && typeof IntersectionObserver !== 'undefined' ? 0 : target);

  useEffect(() => {
    const node = ref.current;
    if (!m || !node || shown === target) return;
    let frame = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / ms);
          setShown(Math.round(target * (1 - Math.pow(1 - p, 3))));
          if (p < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );
    io.observe(node);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!m) return <>{text}</>;
  return (
    <span ref={ref} aria-label={text}>
      <span aria-hidden>
        <span className="inline-grid justify-items-end tabular-nums">
          <span className="invisible col-start-1 row-start-1">{target}</span>
          <span className="col-start-1 row-start-1">{shown}</span>
        </span>
        {m[2]}
      </span>
    </span>
  );
};

export default CountUp;
