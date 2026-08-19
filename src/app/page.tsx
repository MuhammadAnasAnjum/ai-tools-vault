import type { Metadata } from 'next';
import Link from 'next/link';

import CategoryIcon from '@/components/CategoryIcon';
import Hero from '@/components/Hero';
import ToolExplorer from '@/components/ToolExplorer';
import FadeIn from '@/components/motion/FadeIn';
import { getAllToolCards, getCategories } from '@/lib/content';
import { routes, siteConfig } from '@/lib/site';

/**
 * The homepage is a Server Component and renders statically. There is no
 * `dynamic` or `revalidate` export, and every data source is a file on disk, so
 * Next prerenders this at build time: the HTML is served from the edge with no
 * server work per request, which is the fastest TTFB available and the version
 * of the page Googlebot sees on first pass.
 */
export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  alternates: { canonical: '/' },
};

export default async function HomePage() {
  // `getAllToolCards` rather than `getAllTools`: this list is passed straight
  // into a Client Component, so it must not carry server-only fields.
  const [tools, categories] = await Promise.all([
    getAllToolCards(),
    getCategories(),
  ]);

  return (
    <>
      <Hero toolCount={tools.length} categoryCount={categories.length} />

      <section className="container-page py-20">
        <FadeIn>
          <h2 className="font-display text-3xl font-bold tracking-tight text-strong">
            Start with what you are trying to do
          </h2>
          <p className="mt-3 max-w-2xl text-ink">
            Categories are organised by the job, not by vendor marketing. A few tools
            sit slightly outside their category — where that happens, the review says
            so in its opening lines rather than pretending otherwise.
          </p>
        </FadeIn>

        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <FadeIn
              as="li"
              key={category.slug}
              // Capped so later cards are not left waiting behind a long stagger.
              delay={Math.min(index, 3) * 0.05}
            >
              <Link
                href={routes.category(category.slug)}
                className="group flex h-full flex-col gap-3 rounded-xl border border-line bg-surface p-6 shadow-card transition-[box-shadow,border-color,transform] duration-200 hover:-translate-y-1 hover:border-line-strong hover:shadow-lift"
              >
                <span className="grid h-10 w-10 place-items-center rounded-md border border-line bg-fill text-link">
                  <CategoryIcon slug={category.slug} className="h-5 w-5" />
                </span>
                <h3 className="font-display text-lg font-semibold text-strong">
                  {category.label}
                </h3>
                <p className="text-sm text-ink">
                  {category.toolCount} tools reviewed
                </p>
                <span className="mt-auto pt-2 text-sm font-semibold text-link">
                  Browse {category.label.toLowerCase()}
                  <span aria-hidden="true" className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </Link>
            </FadeIn>
          ))}
        </ul>
      </section>

      {/* Client Component: search and category filters re-render the grid in
          place. The full list is server-rendered inside it first, so all 77
          links exist in the initial HTML. */}
      <ToolExplorer tools={tools} categories={categories} />

      <section className="relative border-t border-line bg-bg-sunken">
        {/* A single very soft wash so the closing section is not a flat slab.
            Absolutely positioned, so it cannot shift layout. The tint is a
            theme variable — the blue that lifts a dark panel turns the same
            area grubby on white. */}
        <div
          aria-hidden="true"
          className="section-wash pointer-events-none absolute inset-0"
        />
        <div className="container-page relative py-20">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold tracking-tight text-strong">
              How these reviews are written
            </h2>
            <div className="mt-4 max-w-[72ch] space-y-4 text-ink">
              <p>
                Every tool gets the same treatment: what it actually is, what it does
                well, where it falls down, and who should not buy it. Pricing is quoted
                with the date it was checked, because vendors in this category change
                tiers often and quietly, and a stale price is worse than no price.
              </p>
              <p>
                Where a claim could not be verified, the review says so instead of
                repeating it. Where a product has been discontinued or is drifting
                towards it, that is stated plainly on the page rather than buried. No
                vendor pays for a listing, a position or a favourable line.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
