/** Scroll to a page section, leaving room for the fixed navbar. Instant for reduced motion. */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const top = id === 'home' ? 0 : el.getBoundingClientRect().top + window.scrollY - 88;
  window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
}
