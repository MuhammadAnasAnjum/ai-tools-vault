'use client';

import { useEffect, useMemo, useState } from 'react';

import CategoryIcon from './CategoryIcon';
import ToolCard from './ToolCard';
import { useSearch } from './search/SearchProvider';
import type { CategoryMeta, ToolCardData } from '@/lib/types';

/**
 * The results grid: category filtering plus the shared search query.
 *
 * The search input itself no longer lives here — it moved to the hero and the
 * navbar, and this component now reads the query from context instead of owning
 * it. The category pills stayed local, because nothing outside this section has
 * any use for them.
 *
 * Why this is safe for SEO despite being a Client Component: the parent is a
 * Server Component that passes the complete `tools` array in as a prop, and
 * React renders client components to HTML on the server too. Every card and
 * every href is therefore present in the initial document — crawlers see all 77
 * links without executing a line of JavaScript. Filtering only ever hides things
 * that were already delivered; it never fetches.
 *
 * The query is read as `deferredQuery` so the grid re-render is allowed to lag
 * the input by a frame. That is what keeps INP low on a list this size without
 * reaching for a debounce timer, which would make the field feel laggy instead.
 */
export default function ToolExplorer({
  tools,
  categories,
}: {
  tools: ToolCardData[];
  categories: CategoryMeta[];
}) {
  const { deferredQuery, isStale, setResultCount } = useSearch();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  /**
   * Precomputed lowercase haystack per tool. Built once instead of per
   * keystroke, so typing does not re-lowercase 77 records on every character.
   */
  const indexed = useMemo(
    () =>
      tools.map((tool) => ({
        tool,
        haystack: [
          tool.name,
          tool.vendor,
          tool.positioning,
          tool.functionalCategory,
          ...tool.bestFor,
        ]
          .join(' ')
          .toLowerCase(),
      })),
    [tools],
  );

  const visible = useMemo(() => {
    const terms = deferredQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);

    return indexed
      .filter(({ tool }) => !activeCategory || tool.category === activeCategory)
      .filter(({ haystack }) => terms.every((term) => haystack.includes(term)))
      .map(({ tool }) => tool);
  }, [indexed, deferredQuery, activeCategory]);

  /**
   * Publish the count up to the hero, which sits above this section and cannot
   * compute it without being handed the whole tool array.
   *
   * In an effect rather than during render because setting a parent's state
   * mid-render is not allowed. The cleanup resets the count to null on unmount,
   * so the hero on a later visit never shows a stale figure from a grid that is
   * no longer mounted.
   */
  useEffect(() => {
    setResultCount(visible.length);
    return () => setResultCount(null);
  }, [visible.length, setResultCount]);

  return (
    <section id="explore" className="container-page scroll-mt-24 py-16">
      <h2 className="font-display text-3xl font-bold tracking-tight text-strong">
        Find the right tool
      </h2>
      <p className="mt-3 max-w-2xl text-ink">
        Search from the bar above or from the header, then narrow by category. The
        list updates as you type.
      </p>

      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          aria-pressed={activeCategory === null}
          className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            activeCategory === null
              ? 'bg-brand-600 text-white'
              : 'border border-line bg-fill text-ink hover:bg-fill-strong hover:text-strong'
          }`}
        >
          All {tools.length}
        </button>

        {categories.map((category) => {
          const isActiveFilter = activeCategory === category.slug;
          return (
            <button
              key={category.slug}
              type="button"
              onClick={() => setActiveCategory(isActiveFilter ? null : category.slug)}
              aria-pressed={isActiveFilter}
              className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActiveFilter
                  ? 'bg-brand-600 text-white'
                  : 'border border-line bg-fill text-ink hover:bg-fill-strong hover:text-strong'
              }`}
            >
              <CategoryIcon slug={category.slug} />
              {category.label}
              {/* brand-50 rather than brand-100 on the filled pill: at this
                  size it is small text, and 100 lands at 4.23:1 on brand-600
                  where 50 clears AA at 4.75:1. */}
              <span className={isActiveFilter ? 'text-brand-50' : 'text-muted'}>
                {category.toolCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Announces result counts to screen readers as filters change, since the
          visual change alone conveys nothing to a non-sighted user. */}
      <p aria-live="polite" className="mt-6 text-sm text-muted">
        Showing {visible.length} of {tools.length} tools
      </p>

      {visible.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-line-strong bg-fill p-10 text-center text-muted">
          No tools match that search. Try a broader term, or clear the category filter.
        </p>
      ) : (
        <ul
          className={`mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 ${
            isStale ? 'opacity-70 transition-opacity' : 'transition-opacity'
          }`}
        >
          {visible.map((tool, index) => (
            <li key={`${tool.category}/${tool.slug}`}>
              <ToolCard tool={tool} priority={index < 6} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
