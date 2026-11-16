import { useSyncExternalStore } from 'react';
import { changeTheme } from './transition';

const THEME_KEY = 'portfolio-theme';
const THEME_COLORS = { light: '#edf0ef', dark: '#06141b' } as const;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach(listener => listener());
const isDark = () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark);
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[dark ? 'dark' : 'light']);
  document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', dark ? 'dark' : 'light');
  emit();
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', event => {
    if (event.key === THEME_KEY || event.key === null) applyTheme(event.newValue === 'dark');
  });
}

export function toggleTheme(origin?: { x: number; y: number }) {
  const dark = !isDark();
  const theme = dark ? 'dark' : 'light';
  void changeTheme(() => {
    applyTheme(dark);
    try { localStorage.setItem(THEME_KEY, theme); }
    catch { /* The toggle still works if browser storage is unavailable. */ }
  }, THEME_COLORS[theme], origin);
}

export function useTheme() {
  const dark = useSyncExternalStore(
    listener => { listeners.add(listener); return () => listeners.delete(listener); },
    isDark,
    () => false,
  );
  return { dark };
}
