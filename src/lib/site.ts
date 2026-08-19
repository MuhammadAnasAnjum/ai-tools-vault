/** Single source of truth for site-wide constants and URL construction. */

function normaliseOrigin(value: string | undefined): string {
  const fallback = 'http://localhost:3000';
  const raw = (value ?? '').trim();
  if (!raw) return fallback;
  return raw.replace(/\/+$/, '');
}

export const siteConfig = {
  name: 'AI Tools Hub',
  shortName: 'AI Tools Hub',
  tagline: 'Honest, verified reviews of the AI tools people actually use',
  description:
    'Independent reviews of AI tools across chatbots, writing, marketing, video, design and coding. Verified facts, real pricing caveats and balanced pros and cons.',
  url: normaliseOrigin(process.env.NEXT_PUBLIC_SITE_URL),
  locale: 'en_GB',
  language: 'en',
} as const;

/** Absolute URL for a site-relative path. */
export function absoluteUrl(path = '/'): string {
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${siteConfig.url}${suffix === '/' ? '' : suffix}`;
}

export const routes = {
  home: () => '/',
  categories: () => '/categories',
  category: (categorySlug: string) => `/category/${categorySlug}`,
  tool: (categorySlug: string, toolSlug: string) => `/tools/${categorySlug}/${toolSlug}`,
} as const;

/**
 * Inline SVG path data per category, keyed by the tools.json category slug.
 * Kept as raw paths rather than an icon package so the navbar ships no extra JS.
 */
export const categoryIcons: Record<string, string> = {
  chatbots:
    'M8 10.5h8M8 14h5M21 12a8.5 8.5 0 0 1-8.5 8.5H7l-4 3v-5.2A8.5 8.5 0 0 1 12.5 3.5 8.5 8.5 0 0 1 21 12Z',
  'writing-research':
    'M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z',
  'marketing-seo':
    'M3 3v18h18M7 15l3-4 3 3 5-7M18 7h3v3',
  'video-audio':
    'M15 10.5 21 7v10l-6-3.5M3 8.5A2.5 2.5 0 0 1 5.5 6h7A2.5 2.5 0 0 1 15 8.5v7A2.5 2.5 0 0 1 12.5 18h-7A2.5 2.5 0 0 1 3 15.5Z',
  'design-art':
    'M12 3a9 9 0 0 0 0 18c1.1 0 2-.9 2-2v-1a2 2 0 0 1 2-2h1c1.1 0 2-.9 2-2a9 9 0 0 0-9-9Zm-4.5 9a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm2-4a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm5 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z',
  'productivity-coding':
    'M8 18l-5-6 5-6M16 6l5 6-5 6M13.5 4.5l-3 15',
};

export const FALLBACK_ICON =
  'M12 3.5 21 8v8l-9 4.5L3 16V8ZM3 8l9 4.5L21 8M12 12.5V21';
