import type { Metadata, Viewport } from 'next';
import { Inter, Manrope } from 'next/font/google';

import './globals.css';

import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import Navbar from '@/components/Navbar';
import MotionProvider from '@/components/motion/MotionProvider';
import SearchProvider from '@/components/search/SearchProvider';
import ThemeProvider from '@/components/theme/ThemeProvider';
import { themeScript } from '@/components/theme/theme-script';
import { getCategories, getToolSearchIndex } from '@/lib/content';
import { organisationSchema, websiteSchema } from '@/lib/schema';
import { siteConfig } from '@/lib/site';

/**
 * Fonts are self-hosted by next/font at build time: no request to Google's CDN,
 * no render-blocking stylesheet, and the CSS `size-adjust` descriptors it emits
 * make the fallback font match the real one closely enough that swapping them
 * causes no layout shift. `display: swap` keeps text visible during load, which
 * is what FCP is measured against.
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

/**
 * `metadataBase` is what lets every page below express canonical and Open Graph
 * URLs as relative paths and still emit absolute ones. Without it Next warns and
 * social cards resolve against the wrong origin in preview deployments.
 *
 * The title template appends the site name to child titles automatically, so
 * individual pages set only their own specific title — and `default` covers
 * pages that set none.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    url: '/',
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  formatDetection: { telephone: false, address: false },
};

/**
 * Split out from `metadata` because Next 15 requires it: returning
 * `themeColor`/`viewport` from the metadata export is deprecated and logs a
 * warning on every render.
 *
 * `themeColor` is the LIGHT canvas, because light is the default theme and this
 * value ships in the static HTML. `ThemeProvider` rewrites the tag on the client
 * when a dark preference is applied — it has to be done there rather than here,
 * since the choice lives in localStorage and the server cannot see it.
 *
 * `colorScheme: 'light dark'` advertises that both are supported; the actual
 * one in force is pinned by the `color-scheme` property in globals.css.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FFFFFF',
  colorScheme: 'light dark',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side reads at build time; nav links and the search index land in
  // static HTML rather than being fetched.
  const [categories, toolIndex] = await Promise.all([
    getCategories(),
    getToolSearchIndex(),
  ]);

  return (
    /**
     * `suppressHydrationWarning` is required, and is scoped to this one element
     * on purpose. The inline script below sets `data-theme` on <html> before
     * React hydrates, so the client DOM legitimately differs from the server
     * HTML for that one attribute. Suppressing it here silences exactly that
     * known difference without hiding real mismatches anywhere else in the tree.
     */
    <html
      lang={siteConfig.language}
      className={`${inter.variable} ${manrope.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Must be in <head> and must be inline. Anywhere later — or loaded as an
          external file — and the browser has already painted the default theme,
          which is the white flash this exists to prevent.
        */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-screen flex-col bg-bg font-sans text-ink antialiased">
        {/* Skip link: the first tab stop on every page, for keyboard users who
            would otherwise traverse the whole nav on each navigation. Inverted
            against the canvas so it stays legible in both themes. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-strong focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-bg"
        >
          Skip to content
        </a>

        <JsonLd data={organisationSchema()} />
        <JsonLd data={websiteSchema()} />

        {/* SearchProvider wraps the whole shell because the query is shared by
            the navbar (inside it) and the results grid (inside `children`).
            Being in the layout is also what lets a search survive client-side
            navigation — layouts are not remounted between routes. */}
        <ThemeProvider>
          <SearchProvider toolIndex={toolIndex}>
            <MotionProvider>
              <Navbar categories={categories} />
              <main id="main" className="flex-1">
                {children}
              </main>
              <Footer categories={categories} />
            </MotionProvider>
          </SearchProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
