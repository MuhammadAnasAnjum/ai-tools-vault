import { absoluteUrl, routes, siteConfig } from './site';
import type { Faq, ToolPage } from './types';

/**
 * Structured data builders.
 *
 * One rule governs everything here: schema may only describe what is actually on
 * the page. Notably absent is `aggregateRating` — we publish no scores and have
 * no reviewer ratings to aggregate, and emitting invented star ratings to farm
 * rich results is structured-data spam. Google penalises it, and it would make
 * the reviews dishonest.
 */

export function organisationSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
  };
}

export function websiteSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: siteConfig.language,
    publisher: { '@id': `${siteConfig.url}/#organization` },
  };
}

export function breadcrumbSchema(
  items: Array<{ name: string; href: string }>,
): Record<string, unknown> {
  const trail = [{ name: 'Home', href: routes.home() }, ...items];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

/**
 * FAQPage built from the article's real FAQ section.
 *
 * `extractFaqs` reads the visible copy, so the answers here are byte-identical
 * to what a reader sees. Google requires that; hidden or divergent FAQ answers
 * are a manual-action risk. Returns null when a page has no FAQs rather than
 * emitting an empty list.
 */
export function faqSchema(faqs: Faq[]): Record<string, unknown> | null {
  if (faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

/**
 * Article schema for a tool review.
 *
 * `dateModified` uses the article's own `lastVerified` date, which is the date
 * the facts were actually re-checked — not the build timestamp. Stamping every
 * page with "modified today" on each deploy is a freshness signal that isn't
 * true.
 */
export function articleSchema(page: ToolPage): Record<string, unknown> {
  const url = absoluteUrl(routes.tool(page.entry.category, page.entry.slug));

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: page.frontmatter.h1,
    description: page.frontmatter.metaDescription,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    inLanguage: siteConfig.language,
    datePublished: page.frontmatter.lastVerified,
    dateModified: page.frontmatter.lastVerified,
    author: { '@type': 'Organization', name: siteConfig.name, url: siteConfig.url },
    publisher: { '@id': `${siteConfig.url}/#organization` },
    about: {
      '@type': 'SoftwareApplication',
      name: page.entry.name,
      applicationCategory: 'BusinessApplication',
      url: page.entry.website,
      ...(page.entry.vendor
        ? { author: { '@type': 'Organization', name: page.entry.vendor } }
        : {}),
    },
  };
}

/** ItemList for a category page, describing the tools it links to in order. */
export function itemListSchema(
  categorySlug: string,
  tools: Array<{ name: string; slug: string }>,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: tools.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: tool.name,
      url: absoluteUrl(routes.tool(categorySlug, tool.slug)),
    })),
  };
}
