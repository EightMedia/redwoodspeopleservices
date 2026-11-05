import type { NextConfig } from 'next';

import { legacyRedirects } from './src/data/redirects';

// Set only while kikker-core is linked locally (see kikker-core docs/local-linking.md).
const root = process.env.KIKKER_LINK_ROOT;

const nextConfig: NextConfig = {
  ...(root ? { turbopack: { root }, outputFileTracingRoot: root } : {}),
  trailingSlash: true,
  // Agent instructions live in ../docs/kikker-herbouw.md; do not generate web/AGENTS.md.
  agentRules: false,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },
  async headers() {
    // Dynamic import: next.config is evaluated via CJS require; the main
    // @eightmedia/kikker-next entry also pulls next-sanity (not safe here).
    const { kikkerSecurityHeaders } = await import('@eightmedia/kikker-next/headers');
    return kikkerSecurityHeaders({
      studioOrigins: ['http://localhost:3333', 'https://*.sanity.studio'],
    });
  },
  async redirects() {
    // Old WordPress URLs end in a slash, but links in the wild also exist without one.
    // With `trailingSlash: true` Next only matches the exact source, so list both.
    return legacyRedirects.flatMap(({ source, destination }) => {
      const variants = source.endsWith('*') ? [source] : [source, `${source}/`];
      return variants.map((variant) => ({ source: variant, destination, permanent: true }));
    });
  },
};

export default nextConfig;
