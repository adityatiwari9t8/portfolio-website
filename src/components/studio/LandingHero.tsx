import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { SITE } from '../../data/site';

export default function LandingHero() {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let onScreen = false;
    function syncPlayback() {
      if (!el) return;
      if (document.hidden || motion.matches || !onScreen) {
        el.pause();
        return;
      }
      if (!el.hasAttribute('src')) {
        el.src = matchMedia('(max-aspect-ratio: 3/4)').matches
          ? '/motion/circuit-study-mobile.mp4' : '/motion/circuit-study.mp4';
      }
      void el.play().catch(() => { /* The poster covers browsers that block autoplay. */ });
    }
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      syncPlayback();
    });
    observer.observe(el);
    motion.addEventListener('change', syncPlayback);
    document.addEventListener('visibilitychange', syncPlayback);
    return () => {
      observer.disconnect();
      motion.removeEventListener('change', syncPlayback);
      document.removeEventListener('visibilitychange', syncPlayback);
      el.pause();
    };
  }, []);

  return (
    <section id="home" className="alpine-cover" aria-labelledby="cover-title">
      <video ref={video} className="cover-film" muted loop playsInline aria-hidden="true"
        poster={matchMedia('(max-aspect-ratio: 3/4)').matches ? '/motion/circuit-study-mobile.jpg' : '/motion/circuit-study.jpg'}
        preload="none" />
      <div className="alpine-content">
        <p className="availability">{SITE.status}</p>
        <h1 id="cover-title">{SITE.name}</h1>
        <p className="alpine-description">Computer science student in Gurugram, India. Open a project to run the demo, inspect the code, and see the trade-offs I made.</p>
        <div className="alpine-actions">
          <a className="solid-link" href="#work">View projects <ArrowDown aria-hidden="true" /></a>
          <a className="resume-link" href={SITE.resume} target="_blank" rel="noreferrer">Résumé <ArrowUpRight aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}
