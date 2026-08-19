import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import ToolCard from '@/components/ToolCard';
import FadeIn from '@/components/motion/FadeIn';
import {
  getAllToolParams,
  getCategoryMeta,
  getRelatedTools,
  getToolPage,
} from '@/lib/content';
import { articleSchema, breadcrumbSchema, faqSchema } from '@/lib/schema';
import { routes, siteConfig } from '@/lib/site';

interface RouteParams {
  category: string;
  tool: string;
}

/**
 * Params are a Promise in Next 15 — they must be awaited before use, in both
 * `generateMetadata` and the page component.
 */
type PageProps = { params: Promise<RouteParams> };

/**
 * Prerenders all 77 tool pages at build time. Combined with the default
 * `dynamicParams` behaviour, any URL not in this list falls through to
 * `notFound()`, so we never serve a soft 404 for an invented slug — which is
 * what would otherwise pollute the index with empty pages.
 */
export async function generateStaticParams(): Promise<RouteParams[]> {
  return getAllToolParams();
}

/**
 * Per-page metadata from the article's own frontmatter.
 *
 * `metaTitle` and `metaDescription` were hand-written per article and checked
 * for length (45–57 and 142–159 characters), so they are used verbatim rather
 * than generated from a template. `title.absolute` bypasses the layout's
 * `%s | Site name` template, which would otherwise push these past the SERP
 * truncation point they were tuned to sit inside.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, tool } = await params;
  const page = await getToolPage(category, tool);

  if (!page) {
    return { title: 'Tool not found', robots: { index: false, follow: false } };
  }

  const canonical = routes.tool(category, tool);
  const { frontmatter } = page;

  return {
    title: { absolute: frontmatter.metaTitle },
    description: frontmatter.metaDescription,
    keywords: [frontmatter.primaryKeyword, ...frontmatter.secondaryKeywords],
    alternates: { canonical },
    openGraph: {
      type: 'article',
      url: canonical,
      title: frontmatter.metaTitle,
      description: frontmatter.metaDescription,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      publishedTime: frontmatter.lastVerified,
      modifiedTime: frontmatter.lastVerified,
    },
    twitter: {
      card: 'summary_large_image',
      title: frontmatter.metaTitle,
      description: frontmatter.metaDescription,
    },
  };
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export default async function ToolPageRoute({ params }: PageProps) {
  const { category, tool } = await params;

  const [page, categoryMeta] = await Promise.all([
    getToolPage(category, tool),
    getCategoryMeta(category),
  ]);

  if (!page || !categoryMeta) notFound();

  const related = await getRelatedTools(category, tool);
  const { entry, frontmatter, faqs, html, readingMinutes, verificationNote } = page;

  const crumbs = [
    { name: categoryMeta.label, href: routes.category(category) },
    { name: entry.name, href: routes.tool(category, tool) },
  ];

  const faqJson = faqSchema(faqs);

  return (
    <>
      <JsonLd data={articleSchema(page)} />
      <JsonLd data={breadcrumbSchema(crumbs)} />
      {faqJson ? <JsonLd data={faqJson} /> : null}

      {/* Same column as the article below, so the breadcrumb shares its left
          edge instead of floating against a wider container. */}
      <div className="container-prose pt-8">
        <Breadcrumbs items={crumbs} />
      </div>

      {/* One centred reading column for the whole article. There is no longer a
          second grid track: the layout is driven by the comfortable measure of
          the body text rather than by anything sitting beside it. */}
      <div className="container-prose py-10">
        <article>
          <header className="border-b border-line pb-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-link">
              {entry.functionalCategory}
            </p>

            {/* The page's only H1, and its LCP element. Rendered as plain
                server HTML with no JS-driven animation so it paints on the
                first frame. Solid fill rather than a clipped gradient: on an
                article page the heading is the content, not the decoration. */}
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-strong sm:text-4xl">
              {frontmatter.h1}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
              <span>{readingMinutes} min read</span>
              <span aria-hidden="true">·</span>
              <span>
                Facts checked{' '}
                <time dateTime={frontmatter.lastVerified}>
                  {formatDate(frontmatter.lastVerified)}
                </time>
              </span>
              {entry.vendor ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span>By {entry.vendor}</span>
                </>
              ) : null}
            </div>

            <dl className="mt-6 grid gap-4 rounded-lg border border-line bg-surface p-5 sm:grid-cols-3">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                  Starting price
                </dt>
                <dd className="mt-1 text-sm font-semibold text-strong">
                  {entry.startingPrice}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                  Free tier
                </dt>
                <dd className="mt-1 text-sm font-semibold">
                  {/* Same emerald/amber pairing as the cards, so "has a free
                      tier" reads identically in the grid and on the page. */}
                  <span
                    className={
                      entry.freeTier
                        ? 'rounded border border-positive-line bg-positive-fill px-2 py-0.5 text-positive'
                        : 'rounded border border-line bg-fill px-2 py-0.5 text-ink'
                    }
                  >
                    {entry.freeTier ? 'Yes' : 'No'}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                  Best for
                </dt>
                <dd className="mt-1 text-sm font-semibold text-strong">
                  {entry.bestFor.slice(0, 2).join(', ')}
                </dd>
              </div>
            </dl>

            {entry.website ? (
              <p className="mt-5 text-sm text-muted">
                Official site:{' '}
                {/* rel="nofollow" on every outbound vendor link: these are not
                    editorial endorsements and passing PageRank to 77 vendors
                    would be treated as a link scheme. */}
                <a
                  href={entry.website}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="font-medium text-link hover:underline"
                >
                  {entry.website.replace(/^https?:\/\//, '')}
                </a>
              </p>
            ) : null}
          </header>

          {/* Body HTML comes from our own markdown files, rendered at build time
              by a pipeline with raw HTML pass-through disabled. `max-w-none`
              hands width control to the column wrapper above, so the prose fills
              the reading measure instead of imposing a second, narrower cap. */}
          <div
            className="prose prose-ink mt-12 max-w-none prose-headings:font-display prose-headings:tracking-tight prose-h2:mt-12 prose-h2:text-2xl prose-h3:text-lg prose-a:text-link prose-strong:text-strong"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {/* Pulled out of the body markdown so the verification note reads as a
              citation rather than as a trailing paragraph. This is the page's
              main trust signal — what was checked, and when. */}
          {verificationNote ? (
            <aside className="mt-12 rounded-lg border-l-2 border-brand-500 bg-surface-raised py-5 pl-6 pr-6">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-link">
                Verification
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink">
                {verificationNote}
              </p>
            </aside>
          ) : null}

          {related.length > 0 ? (
            <section className="mt-16 border-t border-line pt-12">
              <h2 className="font-display text-2xl font-bold tracking-tight text-strong">
                Others in {categoryMeta.label}
              </h2>
              <ul className="mt-8 grid gap-5 sm:grid-cols-2">
                {related.map((item) => (
                  <FadeIn as="li" key={item.slug}>
                    <ToolCard tool={item} />
                  </FadeIn>
                ))}
              </ul>
              <p className="mt-8 text-sm">
                <Link
                  href={routes.category(category)}
                  className="font-semibold text-link hover:underline"
                >
                  See all {categoryMeta.toolCount} {categoryMeta.label.toLowerCase()} tools
                  →
                </Link>
              </p>
            </section>
          ) : null}
        </article>
      </div>
    </>
  );
}
