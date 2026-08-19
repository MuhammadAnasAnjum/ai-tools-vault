import type { Metadata } from 'next';
import Link from 'next/link';

import Breadcrumbs from '@/components/Breadcrumbs';
import CategoryIcon from '@/components/CategoryIcon';
import JsonLd from '@/components/JsonLd';
import FadeIn from '@/components/motion/FadeIn';
import { getCategories, getToolCount } from '@/lib/content';
import { breadcrumbSchema } from '@/lib/schema';
import { routes } from '@/lib/site';

const TITLE = 'All AI Tool Categories: Browse 6 Reviewed Groups';
const DESCRIPTION =
  'Browse every AI tool category we review — chatbots, writing, marketing and SEO, video and audio, design and art, productivity and coding.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: '/categories' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: '/categories' },
};

export default async function CategoriesPage() {
  const [categories, toolCount] = await Promise.all([getCategories(), getToolCount()]);
  const crumbs = [{ name: 'Categories', href: routes.categories() }];

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <div className="container-page pt-6">
        <Breadcrumbs items={crumbs} />
      </div>

      <header className="container-page border-b border-line py-10">
        <h1 className="max-w-3xl font-display text-3xl font-bold leading-tight tracking-tight text-strong sm:text-4xl">
          Every category of AI tool we review
        </h1>
        <p className="mt-4 max-w-2xl text-ink">
          {toolCount} tools grouped by the job they do. Each category page opens with a
          written guide to how the tools in it actually differ, not just a list.
        </p>
      </header>

      <section className="container-page py-16">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <FadeIn as="li" key={category.slug} delay={Math.min(index, 3) * 0.05}>
              <Link
                href={routes.category(category.slug)}
                className="group flex h-full flex-col gap-3 rounded-xl border border-line bg-surface p-6 shadow-card transition-[box-shadow,border-color,transform] duration-200 hover:-translate-y-1 hover:border-line-strong hover:shadow-lift"
              >
                <span className="grid h-10 w-10 place-items-center rounded-md border border-line bg-fill text-link">
                  <CategoryIcon slug={category.slug} className="h-5 w-5" />
                </span>
                <h2 className="font-display text-lg font-semibold text-strong">
                  {category.label}
                </h2>
                <p className="text-sm text-ink">
                  {category.toolCount} tools reviewed
                </p>
              </Link>
            </FadeIn>
          ))}
        </ul>
      </section>
    </>
  );
}
