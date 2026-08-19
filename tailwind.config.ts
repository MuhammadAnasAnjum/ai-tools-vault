import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

/**
 * Dual-theme editorial palette. Light is the default; dark is opt-in.
 *
 * WHY THIS FILE LOOKS THE WAY IT DOES: the previous version hard-coded an
 * *inverted* ink scale, where `ink-950` was near-white because the theme was
 * dark-only. That cannot serve two themes at once — `text-ink-950` is unable to
 * mean "near-white" and "near-black" in the same stylesheet. So the palette is
 * now semantic and indirect: every colour below resolves to a CSS custom
 * property, and `globals.css` gives those properties one set of values on
 * `:root` (light) and another under `[data-theme='dark']`.
 *
 * The names say what a colour is FOR, not what it looks like:
 *
 *   bg / bg-sunken / surface / surface-raised   page and panel backgrounds
 *   line / line-strong                          hairline borders, resting/hover
 *   fill / fill-strong                          tinted chips and ghost buttons
 *   strong / ink / muted / faint                 text, strongest to weakest
 *
 * `faint` is decorative only — it is the one step that does not clear AA for
 * body copy in both themes. Use it for separators and aria-hidden glyphs.
 *
 * The `<alpha-value>` placeholder in each definition is what keeps Tailwind's
 * opacity modifiers working through the indirection: `bg-surface/60` still
 * compiles, because the variables hold bare `R G B` channels rather than
 * finished colours.
 *
 * `brand` stays a conventional light-to-dark ramp of literal hex, because it is
 * used as a background (`bg-brand-600` under white text) as well as a
 * foreground, and an editorial blue reads correctly on both canvases. Only its
 * *usage* differs by theme, and that is what the `link` token handles.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  darkMode: ['class', "[data-theme='dark']"],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--bg) / <alpha-value>)',
        'bg-sunken': 'rgb(var(--bg-sunken) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-raised': 'rgb(var(--surface-raised) / <alpha-value>)',
        field: 'rgb(var(--field) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        'line-strong': 'rgb(var(--line-strong) / <alpha-value>)',
        /**
         * Form-control borders ONLY — never dividers or card edges.
         *
         * WCAG 1.4.11 asks for 3:1 on the boundary of an interactive control,
         * while a decorative hairline has no such floor. Those two jobs need
         * genuinely different colours: `--line` at 3:1 would put a hard grey box
         * around every card on the page, which is exactly the heavy, templated
         * look this palette is avoiding. Splitting the token lets the input have
         * a real, perceivable edge while cards keep their soft one.
         */
        'line-field': 'rgb(var(--line-field) / <alpha-value>)',
        fill: 'rgb(var(--fill) / <alpha-value>)',
        'fill-strong': 'rgb(var(--fill-strong) / <alpha-value>)',

        /** Text ramp. `ink` is the default body tone. */
        ink: 'rgb(var(--text) / <alpha-value>)',
        strong: 'rgb(var(--text-strong) / <alpha-value>)',
        muted: 'rgb(var(--text-muted) / <alpha-value>)',
        faint: 'rgb(var(--text-faint) / <alpha-value>)',

        /** Accent text — brand-700 on light, brand-300 on dark. */
        link: 'rgb(var(--link) / <alpha-value>)',

        /** Semantic badges: free tier and status warnings, nothing else. */
        positive: 'rgb(var(--positive) / <alpha-value>)',
        'positive-fill': 'rgb(var(--positive-fill) / <alpha-value>)',
        'positive-line': 'rgb(var(--positive-line) / <alpha-value>)',
        caution: 'rgb(var(--caution) / <alpha-value>)',
        'caution-fill': 'rgb(var(--caution-fill) / <alpha-value>)',
        'caution-line': 'rgb(var(--caution-line) / <alpha-value>)',

        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#9ec5fe',
          400: '#6ea8fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
      },
      fontFamily: {
        // Wired to the next/font CSS variables set in layout.tsx.
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'ui-sans-serif', 'sans-serif'],
      },
      maxWidth: {
        content: '72rem',
        prose: '68ch',
      },
      boxShadow: {
        /**
         * Elevation is theme-dependent, which is why these are variables too. A
         * shadow tuned for a dark canvas is nearly invisible on a light one: on
         * light, elevation is a soft grey drop; on dark it has to be a deeper
         * black plus a faint top highlight to read as "raised" at all. Neither
         * is tinted — a coloured shadow reads as a glow, which is wrong here.
         */
        card: 'var(--shadow-card)',
        lift: 'var(--shadow-lift)',
        field: 'var(--shadow-field)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        // CSS-only fallback used for above-the-fold elements so the hero never
        // waits on JS hydration to become visible.
        'fade-up': 'fade-up 0.4s ease-out both',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '68ch',
            'code::before': { content: '""' },
            'code::after': { content: '""' },
          },
        },
        /**
         * The `prose-ink` modifier. This is the most important block in the file
         * for readability: it styles all 77 long-form reviews, 2,000+ words each.
         *
         * Every value is a variable, so switching theme restyles the article body
         * without the markup knowing. The dark values back body copy off pure
         * white deliberately — white on near-black at this length produces
         * halation, where glyphs bloom and lines get harder to track. The light
         * values do the mirror-image thing and avoid pure black on white.
         */
        ink: {
          css: {
            '--tw-prose-body': 'rgb(var(--text))',
            '--tw-prose-headings': 'rgb(var(--text-strong))',
            '--tw-prose-lead': 'rgb(var(--text))',
            '--tw-prose-links': 'rgb(var(--link))',
            '--tw-prose-bold': 'rgb(var(--text-strong))',
            '--tw-prose-counters': 'rgb(var(--text-muted))',
            '--tw-prose-bullets': 'rgb(var(--line-strong))',
            '--tw-prose-hr': 'rgb(var(--line))',
            '--tw-prose-quotes': 'rgb(var(--text-strong))',
            '--tw-prose-quote-borders': 'rgb(var(--line-strong))',
            '--tw-prose-captions': 'rgb(var(--text-muted))',
            '--tw-prose-code': 'rgb(var(--text-strong))',
            '--tw-prose-pre-code': 'rgb(var(--pre-code))',
            '--tw-prose-pre-bg': 'rgb(var(--pre-bg))',
            '--tw-prose-th-borders': 'rgb(var(--line-strong))',
            '--tw-prose-td-borders': 'rgb(var(--line))',
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
