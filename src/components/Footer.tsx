import Link from 'next/link';

import CategoryIcon from './CategoryIcon';
import { routes, siteConfig } from '@/lib/site';
import type { CategoryMeta } from '@/lib/types';

/**
 * Site footer. Server-rendered, no JS.
 *
 * The disclosure line states that rankings are not sold, which is the honest
 * position given none of the reviews were paid for. It no longer claims the
 * pages are ad-supported, because no ad script is loaded — if advertising is
 * added, this line and /privacy both need updating before it ships.
 */
export default function Footer({ categories }: { categories: CategoryMeta[] }) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-line bg-bg-sunken">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-base font-bold text-strong">
              {siteConfig.name}
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink">
              {siteConfig.tagline}. Every review lists the date its pricing and
              feature claims were last checked, because this category changes
              faster than most publishers admit.
            </p>
          </div>

          <nav aria-label="Categories">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">
              Categories
            </h2>
            <ul className="mt-4 space-y-2.5">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={routes.category(category.slug)}
                    className="flex items-center gap-2 text-sm text-ink transition-colors hover:text-link"
                  >
                    <CategoryIcon slug={category.slug} className="h-3.5 w-3.5" />
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Site">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">
              Site
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-ink">
              <li>
                <Link href={routes.home()} className="transition-colors hover:text-link">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href={routes.categories()}
                  className="transition-colors hover:text-link"
                >
                  All categories
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition-colors hover:text-link">
                  How we review
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="transition-colors hover:text-link">
                  Privacy policy
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 border-t border-line pt-6 text-xs leading-relaxed text-muted">
          <p>
            © {year} {siteConfig.name}. Reviews are written independently. No vendor
            pays for a ranking, a rating or a place on this site, and no page here is
            a paid placement.
          </p>
        </div>
      </div>
    </footer>
  );
}
