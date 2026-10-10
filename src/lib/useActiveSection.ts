import { useEffect, useState } from 'react';
import { SECTIONS } from './sections';

/** The id of the section in the middle of the screen ('home' over the hero), for highlighting nav links. */
export function useActiveSection() {
  const [active, setActive] = useState('home');

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-40% 0px -50% 0px' }
    );
    ['home', ...SECTIONS.map((n) => n.id)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return active;
}
