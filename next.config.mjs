/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Don't advertise the framework in response headers.
  poweredByHeader: false,

  // Trailing slashes off keeps one canonical form per URL (avoids duplicate-content
  // signals between /foo and /foo/).
  trailingSlash: false,

  experimental: {
    // Framer Motion ships a large surface area; this lets Next tree-shake the
    // parts we don't import instead of pulling the whole barrel file.
    optimizePackageImports: ['framer-motion'],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Opt out of Google's FLoC/Topics inference on our pages.
          { key: 'Permissions-Policy', value: 'browsing-topics=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
