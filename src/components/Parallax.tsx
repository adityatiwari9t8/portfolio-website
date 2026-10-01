import React, { useEffect, useRef } from 'react';

interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  /** Pixels moved per pixel scrolled. Positive makes the element lag behind the page. */
  speed?: number;
  /** Never move further than this many pixels. */
  max?: number;
}

/** Slides its children slightly slower than the page scrolls. Off for reduced motion. */
const Parallax: React.FC<ParallaxProps> = ({ children, className = '', speed = 0.08, max = 70 }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = Math.min(window.scrollY * speed, max);
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [speed, max]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
};

export default Parallax;
