import type { MetadataRoute } from 'next';

import { absoluteUrl } from '@/lib/site';

/**
 * Nothing here is disallowed: every route is public editorial content that we
 * want indexed. `/api/` is pre-emptively excluded so that adding an endpoint
 * later cannot accidentally expose one to crawlers.
 *
 * The sitemap reference is absolute because the robots.txt spec requires it —
 * a relative path there is ignored.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  };
}
