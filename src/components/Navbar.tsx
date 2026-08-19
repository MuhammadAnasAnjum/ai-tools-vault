'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import CategoryIcon from './CategoryIcon';
import SearchField from './search/SearchField';
import ThemeToggle from './theme/ThemeToggle';
import { routes, siteConfig } from '@/lib/site';
import type { CategoryMeta } from '@/lib/types';

/**
 * Sticky site header.
 *
 * A client component for the mobile disclosure and the active-link state; the
 * category list is handed down as a prop from the server layout, so the nav
 * needs no data fetching and its links are in the initial HTML for crawlers.
 *
 * The header is translucent with an opaque fallback: a genuinely transparent
 * header over scrolling body text is a contrast failure, and this one is sticky
 * over 2,000-word articles, so the `supports-[backdrop-filter]` fallback matters
 * more here than anywhere else on the site.
 *
 * THERE IS DELIBERATELY NO SEARCH FIELD IN THE BAR. One used to sit between the
 * logo and the nav, and it was removed on request: sharing a row with the logo,
 * six category links and the theme toggle meant it was laid out as `flex-1
 * min-w-0`, so it lost the fight for space and collapsed to roughly icon-width.
 * The placeholder clipped, the input read as a dead button, and the nav labels
 * wrapped to two lines next to it. Search now lives in the two places it has
 * room to be honest: the hero field on the homepage, and the full-width field
 * inside the Browse panel below `lg`. Re-adding a field to this row means
 * solving that space problem first — give it a fixed basis, not `flex-1`.
 */
export default function Navbar({ categories }: { categories: CategoryMeta[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Route changes must dismiss the panel, or it stays open over the new page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (slug: string) => pathname === routes.category(slug);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur-md supports-[backdrop-filter]:bg-bg/75">
      <div className="container-page flex h-16 items-center gap-3 sm:gap-4">
        <Link
          href={routes.home()}
          className="flex shrink-0 items-center gap-2 font-display text-base font-bold tracking-tight text-strong"
        >
          <span
            aria-hidden="true"
            className="grid h-8 w-8 place-items-center rounded-md bg-brand-600 text-sm font-bold text-white"
          >
            AI
          </span>
          <span className="hidden sm:inline">{siteConfig.shortName}</span>
        </Link>

        <nav aria-label="Categories" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={routes.category(category.slug)}
                  aria-current={isActive(category.slug) ? 'page' : undefined}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                    isActive(category.slug)
                      ? 'bg-fill-strong text-strong'
                      : 'text-muted hover:bg-fill hover:text-strong'
                  }`}
                >
                  <CategoryIcon slug={category.slug} />
                  <span className="hidden xl:inline">{category.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Pinned to the right of the nav on desktop, and beside the menu button
            on smaller screens — a reader should not have to open a panel to
            change the theme they are reading in. */}
        <ThemeToggle className="ml-auto lg:ml-2" />

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="flex shrink-0 items-center gap-2 rounded-lg border border-line bg-fill px-3 py-2 text-sm font-medium text-ink transition-colors hover:border-line-strong hover:bg-fill-strong lg:hidden"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            aria-hidden="true"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
          {open ? 'Close' : 'Browse'}
        </button>
      </div>

      {/* Rendered unconditionally and hidden with CSS so the links stay in the
          static HTML for crawlers even while the panel is collapsed. */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-line bg-bg lg:hidden"
      >
        {/* Shown at every width the panel itself exists at (below `lg`). It used
            to be `md:hidden`, because the bar carried its own field from `md`
            up; with that gone, hiding this one would leave tablets with no way
            to search from an article page at all. */}
        <div className="container-page py-3">
          <SearchField variant="compact" navigateHome />
        </div>

        <nav aria-label="Categories" className="container-page pb-3">
          <ul className="grid gap-1 sm:grid-cols-2">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={routes.category(category.slug)}
                  aria-current={isActive(category.slug) ? 'page' : undefined}
                  className="flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-fill hover:text-strong"
                >
                  <span className="flex items-center gap-2">
                    <CategoryIcon slug={category.slug} />
                    {category.label}
                  </span>
                  <span className="text-xs text-muted">{category.toolCount}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
