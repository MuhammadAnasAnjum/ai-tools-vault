import Link from 'next/link';

import SearchField from './search/SearchField';
import { routes } from '@/lib/site';

/**
 * Above-the-fold hero.
 *
 * The LCP element is the H1, and two rules protect it:
 *
 * 1. It is not animated. Not by Framer Motion, which would hold it at opacity 0
 *    until the bundle hydrates, and not by the CSS `animate-fade-up` utility
 *    either — an element at opacity 0 is ineligible for LCP, so even a pure-CSS
 *    fade delays the measurement. It paints on the first frame.
 * 2. It is two solid fills, no clipped gradient. The heading used to run a
 *    purple→pink→blue clip across its second line; that is a decorative paint on
 *    the single largest text block on the page, and on a review site it also
 *    reads as marketing. The two-tone treatment below — full-strength first
 *    line, quieter second — gets the same hierarchy out of the neutral ramp.
 *
 * Everything around the heading uses the CSS-only `animate-fade-up` utility
 * rather than Framer Motion, so the hero is decorated without shipping a byte of
 * JS above the fold. Staggered delays are inline `animationDelay` values, which
 * keeps them out of Tailwind's class permutations.
 *
 * The search field is a Client Component and therefore hydrates — but it is an
 * `<input>`, which is interactive-by-default in HTML: it accepts focus and
 * keystrokes from the first paint, and hydration only attaches the filtering.
 * A user who starts typing before JS lands does not lose those characters.
 */
export default function Hero({ toolCount, categoryCount }: { toolCount: number; categoryCount: number }) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      {/* A single soft blue wash. Absolutely positioned and fixed-size, so it
          can never contribute to layout shift. */}
      <div aria-hidden="true" className="mesh-glow pointer-events-none absolute inset-0" />

      {/* A faint grid, masked to fade out before it reaches the text. Adds the
          sense of depth that a flat panel lacks.
          Both the line colour and the opacity come from `.hero-grid`, because
          the two themes need different values: a grid tuned for dark is far too
          heavy on white, where the same lines read as dirt on the page. */}
      <div
        aria-hidden="true"
        className="hero-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(50rem_28rem_at_50%_0%,black,transparent_75%)]"
      />

      <div className="container-page relative py-20 sm:py-24 lg:py-28">
        <p className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-line bg-fill px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-muted">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-600" />
          Independent reviews
        </p>

        {/* No animation class: this is the LCP element and must paint at once. */}
        <h1 className="mt-6 max-w-4xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-strong sm:text-5xl lg:text-6xl">
          Honest, verified reviews of{' '}
          <span className="text-muted">the AI tools people actually use</span>
        </h1>

        {/* The primary search, directly beneath the heading. */}
        <div className="animate-fade-up mt-8" style={{ animationDelay: '60ms' }}>
          <SearchField variant="hero" autoFocusTarget />
        </div>

        <p
          className="animate-fade-up mt-8 max-w-2xl text-lg leading-relaxed text-ink"
          style={{ animationDelay: '120ms' }}
        >
          {toolCount} tools across {categoryCount} categories, each reviewed on its own
          terms — real pricing, the caveats vendors bury, and a plain answer on who
          the tool is not for. Every page carries the date its facts were checked.
        </p>

        <div
          className="animate-fade-up mt-8 flex flex-wrap items-center gap-3"
          style={{ animationDelay: '180ms' }}
        >
          <a
            href="#explore"
            className="rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-card transition-colors hover:bg-brand-700 dark:hover:bg-brand-500"
          >
            Browse all {toolCount} tools
          </a>
          <Link
            href={routes.categories()}
            className="rounded-lg border border-line bg-fill px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-line-strong hover:bg-fill-strong"
          >
            Start by category
          </Link>
        </div>

        <dl
          className="animate-fade-up mt-14 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-3"
          style={{ animationDelay: '240ms' }}
        >
          {[
            { label: 'Tools reviewed', value: String(toolCount) },
            { label: 'Categories', value: String(categoryCount) },
          ].map((stat) => (
            <div key={stat.label}>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                {stat.label}
              </dt>
              <dd className="mt-1 font-display text-2xl font-bold text-strong">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
