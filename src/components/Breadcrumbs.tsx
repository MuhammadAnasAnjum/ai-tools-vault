import Link from 'next/link';

import { routes } from '@/lib/site';

export interface Crumb {
  name: string;
  href: string;
}

/**
 * Visible breadcrumb trail.
 *
 * Deliberately paired with BreadcrumbList JSON-LD on the same pages: Google
 * expects structured data to describe something the user can actually see, and
 * breadcrumb rich results are far more likely to be granted when the markup and
 * the rendered trail agree.
 *
 * The final crumb is plain text with `aria-current`, not a link — linking a page
 * to itself is noise for keyboard and screen-reader users alike.
 */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail: Crumb[] = [{ name: 'Home', href: routes.home() }, ...items];

  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1.5 text-muted">
        {trail.map((crumb, index) => {
          const isLast = index === trail.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-1.5">
              {isLast ? (
                <span aria-current="page" className="text-ink">
                  {crumb.name}
                </span>
              ) : (
                <>
                  <Link href={crumb.href} className="transition-colors hover:text-link">
                    {crumb.name}
                  </Link>
                  {/* ink-300 is a surface step, not a text step — fine for a
                      decorative separator, never for readable text. */}
                  <span aria-hidden="true" className="text-faint">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
