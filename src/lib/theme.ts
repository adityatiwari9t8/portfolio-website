import { useSyncExternalStore } from 'react';

const THEME_KEY = 'portfolio-theme';
const listeners = new Set<() => void>();
const emit = () => listeners.forEach(listener => listener());
const isDark = () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark);
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#151a17' : '#f8f9f6');
  document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', dark ? 'dark' : 'light');
  emit();
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', event => {
    if (event.key === THEME_KEY || event.key === null) applyTheme(event.newValue === 'dark');
  });
}

// The optional origin keeps older callers compatible; switching is deliberately quiet.
export function toggleTheme(_origin?: { x: number; y: number }) {
  const dark = !isDark();
  applyTheme(dark);
  try { localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light'); }
  catch { /* The toggle still works if browser storage is unavailable. */ }
}

export function useTheme() {
  const dark = useSyncExternalStore(
    listener => { listeners.add(listener); return () => listeners.delete(listener); },
    isDark,
    () => false,
  );
  return { dark };
}
