import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import ToolCard from '@/components/ToolCard';
import FadeIn from '@/components/motion/FadeIn';
import { getCategories, getCategoryPage } from '@/lib/content';
import { breadcrumbSchema, itemListSchema } from '@/lib/schema';
import { routes, siteConfig } from '@/lib/site';

interface RouteParams {
  category: string;
}

type PageProps = { params: Promise<RouteParams> };

export async function generateStaticParams(): Promise<RouteParams[]> {
  const categories = await getCategories();
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const page = await getCategoryPage(category);

  if (!page) {
    return { title: 'Category not found', robots: { index: false, follow: false } };
  }

  const canonical = routes.category(category);

  return {
    title: { absolute: page.metaTitle },
    description: page.metaDescription,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      url: canonical,
      title: page.metaTitle,
      description: page.metaDescription,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: page.metaTitle,
      description: page.metaDescription,
    },
  };
}

export default async function CategoryRoute({ params }: PageProps) {
  const { category } = await params;
  const page = await getCategoryPage(category);

  if (!page) notFound();

  const crumbs = [{ name: page.meta.label, href: routes.category(category) }];

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <JsonLd data={itemListSchema(category, page.tools)} />

      <div className="container-page pt-6">
        <Breadcrumbs items={crumbs} />
      </div>

      <header className="container-page border-b border-line py-10">
        {/* Single H1, plain server HTML, no JS animation above the fold. */}
        <h1 className="max-w-3xl font-display text-3xl font-bold leading-tight tracking-tight text-strong sm:text-4xl">
          {page.h1}
        </h1>
        <p className="mt-4 text-sm text-muted">
          {page.tools.length} tools reviewed
          {page.lastVerified ? ` · facts checked ${page.lastVerified}` : ''}
        </p>
      </header>

      {/* The category intro is long-form editorial, not a thin list header. It
          gets its own centred reading column so the measure stays comfortable
          rather than running the full width of the card grid below it. */}
      <section className="py-16">
        <div className="container-prose">
          <div
            className="prose prose-ink max-w-none prose-headings:font-display prose-headings:tracking-tight prose-h2:mt-10 prose-h2:text-2xl prose-a:text-link prose-strong:text-strong"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: page.html }}
          />
        </div>
      </section>

      <section className="container-page border-t border-line py-16">
        <h2 className="font-display text-2xl font-bold tracking-tight text-strong">
          Every {page.meta.label.toLowerCase()} tool we have reviewed
        </h2>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {page.tools.map((tool, index) => (
            <FadeIn as="li" key={tool.slug} delay={Math.min(index, 3) * 0.05}>
              <ToolCard tool={tool} priority={index < 6} />
            </FadeIn>
          ))}
        </ul>
      </section>
    </>
  );
}
