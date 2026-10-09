import { useSyncExternalStore } from 'react';
import { changeTheme } from './transition';

/**
 * One source of truth for light/dark. Dark is the default; a visitor's choice is remembered in
 * localStorage (the inline script in index.html applies it before first paint, so there is no flash).
 * The navbar toggle and the command palette both go through here, so they never disagree.
 */
const THEME_KEY = 'theme';

const subs = new Set<() => void>();
const emit = () => subs.forEach((fn) => fn());
const subscribe = (fn: () => void) => {
  subs.add(fn);
  return () => {
    subs.delete(fn);
  };
};

const write = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable: the choice still applies for this visit */
  }
};

const isDark = () => {
  if (typeof document === 'undefined') return true;
  return document.documentElement.classList.contains('dark');
};

/** Switch theme. Pass the point the switch came from to spread the new theme out from there. */
export function toggleTheme(origin?: { x: number; y: number }) {
  const next = !isDark();
  const apply = () => {
    document.documentElement.classList.toggle('dark', next);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next ? '#0b0b0c' : '#f4f4f2');
    write(THEME_KEY, next ? 'dark' : 'light');
    emit();
  };
  const x = origin?.x ?? window.innerWidth / 2;
  const y = origin?.y ?? 0;
  changeTheme(apply, x, y);
}

export function useTheme() {
  const dark = useSyncExternalStore(subscribe, isDark, () => true);
  return { dark };
}
