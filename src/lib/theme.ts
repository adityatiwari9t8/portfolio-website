import { useSyncExternalStore } from 'react';
import { changeTheme } from './transition';

/** Theme is held only in the current document. Every load starts light. */
const subs = new Set<() => void>();
const emit = () => subs.forEach((fn) => fn());
if (typeof window !== 'undefined') window.addEventListener('theme-reset', emit);
const subscribe = (fn: () => void) => {
  subs.add(fn);
  return () => {
    subs.delete(fn);
  };
};

const isDark = () => {
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
};

/** Switch theme. Pass the point the switch came from to spread the new theme out from there. */
export function toggleTheme(origin?: { x: number; y: number }) {
  const next = !isDark();
  const apply = () => {
    document.documentElement.classList.toggle('dark', next);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next ? '#0b0b0c' : '#f4f4f2');
    emit();
  };
  const x = origin?.x ?? window.innerWidth / 2;
  const y = origin?.y ?? 0;
  changeTheme(apply, x, y);
}

export function useTheme() {
  const dark = useSyncExternalStore(subscribe, isDark, () => false);
  return { dark };
}
