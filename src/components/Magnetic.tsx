import React, { useRef } from 'react';

/** Nudges its child a few pixels toward the pointer. Mouse only, skipped for reduced motion. */
const Magnetic: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const still = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || still() || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * 0.22;
    const y = (e.clientY - (r.top + r.height / 2)) * 0.3;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };
  const leave = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <span
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      className="inline-block transition-transform duration-200 ease-out"
    >
      {children}
    </span>
  );
};

export default Magnetic;
