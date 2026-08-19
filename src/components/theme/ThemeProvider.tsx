'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { THEME_STORAGE_KEY } from './theme-script';

export type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
  /**
   * False until the client has read the stored preference.
   *
   * The toggle needs this. The server renders the default theme, so a control
   * that showed the *current* theme's icon immediately would render "light" on
   * the server for a reader whose stored choice is dark, and then swap after
   * hydration — a visible flicker in the one component whose job is to be
   * honest about the current state. Until this is true, the button renders in a
   * neutral, non-committal state instead.
   */
  ready: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be called inside <ThemeProvider>.');
  }
  return context;
}

/**
 * Owns the light/dark choice, persists it, and keeps the DOM in step.
 *
 * The source of truth is the `data-theme` attribute on <html>, not this state:
 * the inline script in `layout.tsx` sets that attribute before first paint, and
 * this provider reads it on mount rather than assuming a value. That ordering is
 * what makes the two agree instead of racing.
 *
 * Nothing here is passed down as a styling prop. Components style themselves
 * with the semantic Tailwind tokens (`bg-surface`, `text-strong`), which resolve
 * to CSS variables that flip with the attribute — so a theme change is a single
 * attribute write and one repaint, and it does NOT re-render the tree. Only this
 * provider and the toggle re-render at all.
 */
export default function ThemeProvider({ children }: { children: ReactNode }) {
  // Matches the server-rendered default. Corrected on mount if the reader has
  // a stored preference, which the inline script has already applied to the DOM.
  const [theme, setTheme] = useState<Theme>('light');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const applied = document.documentElement.dataset.theme;
    setTheme(applied === 'dark' ? 'dark' : 'light');
    setReady(true);
  }, []);

  /**
   * Keep the browser-chrome colour in step with the page.
   *
   * `themeColor` in the Next viewport export is static, so on its own it would
   * leave a reader in dark mode with a white status bar on mobile — the one
   * piece of the UI the CSS variables cannot reach. Read from the canvas
   * variable rather than hard-coded, so the two can never drift apart.
   */
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!(meta instanceof HTMLMetaElement)) return;

    const canvas = getComputedStyle(document.documentElement)
      .getPropertyValue('--bg')
      .trim();

    if (canvas) meta.content = `rgb(${canvas})`;
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === 'dark' ? 'light' : 'dark';
      const root = document.documentElement;

      /**
       * The colour transition is enabled only around the switch itself. Leaving
       * a global `transition: background-color` on every element would make
       * every hover and every route change fade, and would hand the compositor
       * needless work on scroll. Removing it on the next frame is enough: the
       * class only has to outlive the attribute write that triggers the repaint.
       */
      root.classList.add('theme-transition');
      root.dataset.theme = next;

      window.setTimeout(() => root.classList.remove('theme-transition'), 220);

      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // Storage can be unavailable (private mode, blocked by policy). The
        // theme still applies for this page view; it just will not persist.
      }

      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle, ready }}>
      {children}
    </ThemeContext.Provider>
  );
}
