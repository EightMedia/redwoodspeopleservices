import type { MetadataRoute } from 'next';

import { staticRoutes } from '@/data/routes';
import { absoluteUrl, withTrailingSlash } from '@/lib/siteUrl';
import { hasSanityProject, siteName } from '@/sanity/client';
import { client } from '@/sanity/live';
import { sitemapSlugsQuery, type SitemapSlugsResult } from '@/sanity/queries';

export const revalidate = 3600;

/**
 * Coded routes from `src/data/routes.ts` plus Sanity-backed detail pages. Kikker's
 * `buildSitemap` is not used: it strips trailing slashes (this site keeps them) and
 * only knows parent-based paths, while diensten and team live under coded routes.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({ url: absoluteUrl(path) }));

  if (!hasSanityProject) return entries;

  try {
    const result = (await client.fetch(sitemapSlugsQuery, { siteName })) as SitemapSlugsResult | null;
    if (!result) return entries;

    for (const item of result.diensten) {
      if (item.slug) entries.push({ url: absoluteUrl(`/diensten/${item.slug}/`), lastModified: item._updatedAt });
    }
    for (const item of result.team) {
      if (item.slug) entries.push({ url: absoluteUrl(`/team/${item.slug}/`), lastModified: item._updatedAt });
    }
    for (const item of [...result.news, ...result.pages]) {
      if (item.path) entries.push({ url: absoluteUrl(withTrailingSlash(item.path)), lastModified: item._updatedAt });
    }
  } catch (error) {
    console.error('[sitemap] Sanity fetch failed; static routes only', error);
  }

  return entries;
}
