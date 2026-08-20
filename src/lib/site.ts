export const siteConfig = {
  name: "AI Tools Vault",
  description: "Discover, compare, and explore the best AI tools and resources.",
  url: "https://aitoolsvault.app",
  ogImage: "https://aitoolsvault.app/og.png",
  links: {
    twitter: "https://twitter.com",
    github: "https://github.com",
  },
};

export type SiteConfig = typeof siteConfig;

export function absoluteUrl(path: string) {
  return `${siteConfig.url}${path.startsWith('/') ? path : `/${path}`}`;
}

export const routes = {
  home: '/',
  categories: '/categories',
  category: (slug: string) => `/category/${slug}`,
  tool: (categorySlug: string, toolSlug: string) => `/tools/${categorySlug}/${toolSlug}`,
  search: '/search',
};

export const FALLBACK_ICON = 'Wrench';

export const categoryIcons: Record<string, string> = {
  writing: 'PenTool',
  productivity: 'Zap',
  image: 'Image',
  video: 'Video',
  coding: 'Code',
  chatbots: 'MessageSquare',
};
