import type { MetadataRoute } from 'next';

import { absoluteUrl, siteUrl } from '@/lib/siteUrl';

export const revalidate = 3600;

/**
 * Same rules as the Astro `public/robots.txt` (allow all, block /api/), with the sitemap
 * on the configured site URL. Kikker's `buildRobots` disallows everything outside Vercel
 * production; the practice's site always allowed indexing, so this stays explicit.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    sitemap: absoluteUrl('/sitemap.xml'),
    host: siteUrl(),
  };
}
