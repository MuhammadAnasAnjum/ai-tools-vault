import type { MetadataRoute } from 'next';

import { getAllTools, getCategories } from '@/lib/content';
import { absoluteUrl, routes } from '@/lib/site';

/**
 * Generated at build time from the same manifest the pages render from, so the
 * sitemap can never drift out of sync with what actually exists — the usual
 * failure mode of a hand-maintained sitemap.xml.
 *
 * `lastModified` uses each article's own `lastVerified` date rather than the
 * build time. Stamping every URL with today's date on each deploy tells Google
 * the whole site changed when it did not, and crawlers learn to discount the
 * signal.
 *
 * `priority` and `changeFrequency` are included for completeness but Google has
 * publicly said it ignores both; the values that matter here are the URL set
 * and lastModified.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tools, categories] = await Promise.all([getAllTools(), getCategories()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl(routes.home()),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: absoluteUrl(routes.categories()),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    { url: absoluteUrl('/about'), changeFrequency: 'yearly', priority: 0.4 },
    { url: absoluteUrl('/privacy'), changeFrequency: 'yearly', priority: 0.3 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: absoluteUrl(routes.category(category.slug)),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const toolRoutes: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: absoluteUrl(routes.tool(tool.category, tool.slug)),
    lastModified: tool.lastVerified ? new Date(tool.lastVerified) : undefined,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...toolRoutes];
}
