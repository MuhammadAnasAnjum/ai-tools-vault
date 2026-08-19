import type { Metadata } from 'next';
import Link from 'next/link';

import { routes } from '@/lib/site';

/**
 * `noindex` matters here. Without it a 404 that returns HTML can be indexed as
 * a real page, and thin near-duplicate error pages in the index are a genuine
 * content-quality problem.
 */
export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-6xl font-bold text-muted">404</p>
      <h1 className="mt-6 font-display text-2xl font-bold tracking-tight text-strong sm:text-3xl">
        We could not find that page
      </h1>
      <p className="mt-4 max-w-md text-ink">
        The tool may have been renamed, or the link may be out of date. Browsing by
        category is usually the quickest way to find what you were after.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href={routes.home()}
          className="rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-card transition-colors hover:bg-brand-700 dark:hover:bg-brand-500"
        >
          Back to home
        </Link>
        <Link
          href={routes.categories()}
          className="rounded-lg border border-line bg-fill px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-line-strong hover:bg-fill-strong"
        >
          Browse categories
        </Link>
      </div>
    </div>
  );
}
