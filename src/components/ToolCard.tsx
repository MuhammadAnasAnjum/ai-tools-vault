'use client';

import Link from 'next/link';
import { m } from 'framer-motion';

import { routes } from '@/lib/site';
import type { ToolCardData, ToolStatus } from '@/lib/types';

const STATUS_LABELS: Record<ToolStatus, string> = {
  sunset: 'Being retired',
  'product-discontinued': 'Discontinued',
  maintenance: 'Maintenance only',
  'uncertain-status': 'Status unclear',
};

/**
 * One tool in the grid.
 *
 * The hover elevation animates `y` only. Box shadow and border are handled by
 * CSS transitions on the same element rather than by Framer Motion, because
 * animating `box-shadow` through JS forces a repaint on every frame; `transform`
 * is composited and costs nothing. The visual result is identical.
 *
 * Heading level is `h3` by design: cards always sit beneath a section `h2`,
 * which itself sits beneath the page's single `h1`. Keeping that chain intact is
 * what lets crawlers read the page outline correctly.
 *
 * The whole card is one link rather than a card with a nested "Read more" link.
 * Nested interactive elements inside a link are invalid HTML and confuse
 * keyboard navigation.
 *
 * On the badges: free/paid and the "being retired" flag are the only things on
 * the card allowed to carry colour, because they are the only things that mean
 * something at a glance. Everything else — price, use cases — is a neutral chip.
 * All three also carry text labels, so colour never carries the distinction on
 * its own; that is a WCAG 1.4.1 requirement, not a preference.
 */
export default function ToolCard({
  tool,
  priority = false,
}: {
  tool: ToolCardData;
  /** Skips the hover lift for long lists where the extra listeners aren't worth it. */
  priority?: boolean;
}) {
  const statusLabel = tool.status ? STATUS_LABELS[tool.status] : null;

  const inner = (
    <Link
      href={routes.tool(tool.category, tool.slug)}
      className="group flex h-full flex-col gap-3 rounded-xl border border-line bg-surface p-5 shadow-card transition-[box-shadow,border-color,background-color] duration-200 hover:border-line-strong hover:bg-surface-raised hover:shadow-lift"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-semibold leading-snug text-strong transition-colors group-hover:text-link">
          {tool.name}
        </h3>
        {tool.freeTier ? (
          <span className="shrink-0 rounded border border-positive-line bg-positive-fill px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-positive">
            Free
          </span>
        ) : (
          <span className="shrink-0 rounded border border-line bg-fill px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-ink">
            Paid
          </span>
        )}
      </div>

      <p className="text-sm leading-relaxed text-ink">{tool.positioning}</p>

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
        <span className="rounded border border-line bg-fill px-2 py-1 text-xs font-medium text-ink">
          {tool.startingPrice}
        </span>
        {tool.bestFor.slice(0, 2).map((use) => (
          <span
            key={use}
            className="rounded border border-line bg-surface-raised px-2 py-1 text-xs font-medium text-muted"
          >
            {use}
          </span>
        ))}
        {statusLabel ? (
          <span className="rounded border border-caution-line bg-caution-fill px-2 py-1 text-xs font-medium text-caution">
            {statusLabel}
          </span>
        ) : null}
      </div>
    </Link>
  );

  /**
   * The first cards in a grid skip Framer entirely and lift with a plain CSS
   * transform. The travel is 4px rather than the old 8px: a smaller move reads
   * as a considered response to the cursor instead of a bouncy one, which is the
   * difference between a review site and a product page.
   */
  if (priority) {
    return (
      <article className="h-full transition-transform duration-200 ease-out hover:-translate-y-1">
        {inner}
      </article>
    );
  }

  return (
    <m.article
      className="h-full"
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 340, damping: 30 }}
    >
      {inner}
    </m.article>
  );
}
