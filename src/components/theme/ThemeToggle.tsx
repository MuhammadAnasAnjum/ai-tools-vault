'use client';

import { useTheme } from './ThemeProvider';

/**
 * The light/dark switch.
 *
 * It is a plain <button>, not a checkbox styled as a switch: this changes a
 * presentation setting immediately rather than staging a value to be submitted,
 * and a button is what assistive technology should announce for that.
 *
 * `aria-pressed` carries the state, and the accessible name says what pressing
 * it will DO ("Switch to dark theme") rather than what the current state is.
 * That phrasing matters — a control labelled "Light theme" is ambiguous about
 * whether it describes the present or the outcome.
 *
 * Both icons are always in the DOM, and visibility is decided by CSS on the
 * root `data-theme` attribute rather than by JavaScript. That is what lets the
 * correct icon paint on the very first frame, before hydration: the inline
 * script has already set the attribute, so the right glyph is showing while the
 * bundle is still downloading. Swapping icons from React state instead would
 * flash the wrong one on every load for dark-mode readers.
 */
export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggle, ready } = useTheme();

  // Before hydration reads the stored value, describe the action generically
  // rather than asserting a direction that may be wrong for this reader.
  const label = !ready
    ? 'Switch between light and dark theme'
    : theme === 'dark'
      ? 'Switch to light theme'
      : 'Switch to dark theme';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      // Only claim a pressed state once the real one is known; an incorrect
      // aria-pressed is worse for a screen-reader user than a missing one.
      {...(ready ? { 'aria-pressed': theme === 'dark' } : {})}
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line-field bg-fill text-muted transition-colors hover:border-line-strong hover:text-strong ${className}`}
    >
      {/* Sun — shown in dark mode, where pressing the button returns to light. */}
      <svg
        className="hidden h-4 w-4 dark:block"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" />
      </svg>

      {/* Moon — shown in light mode. */}
      <svg
        className="h-4 w-4 dark:hidden"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a7 7 0 1 0 10.5 10.5Z" />
      </svg>
    </button>
  );
}
