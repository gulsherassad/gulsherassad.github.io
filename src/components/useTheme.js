import { useState } from 'react';

const STORAGE_KEY = 'theme';
// <meta name="theme-color"> per theme; matches --bg and index.html's script.
const THEME_COLOR = { light: '#F4F2EE', dark: '#0E0F11' };

const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', THEME_COLOR[theme]);
};

/**
 * Current theme and a toggle. The site is light unless the visitor chooses
 * dark; index.html has already set data-theme before first paint. This reads
 * it and saves their choice.
 */
export function useTheme() {
  const [theme, setTheme] = useState(() =>
    document.documentElement.getAttribute('data-theme') === 'dark'
      ? 'dark'
      : 'light',
  );

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    setTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage blocked: the choice lasts for this visit only.
    }
  };

  return [theme, toggle];
}
