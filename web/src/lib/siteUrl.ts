import { site } from '@/data/site';

/**
 * Public site origin without trailing slash. `NEXT_PUBLIC_SITE_URL` wins; the practice's
 * domain is the fallback so metadata never points at localhost by accident.
 */
export function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  return (configured && configured !== '' ? configured : site.url).replace(/\/$/, '');
}

/** Absolute URL for a site path. Paths keep their trailing slash (`trailingSlash: true`). */
export function absoluteUrl(path: string): string {
  const withLeadingSlash = path.startsWith('/') ? path : `/${path}`;
  return `${siteUrl()}${withLeadingSlash}`;
}

/** `/over-ons` → `/over-ons/`; `/` stays `/`. */
export function withTrailingSlash(path: string): string {
  if (path === '' || path === '/') return '/';
  return path.endsWith('/') ? path : `${path}/`;
}
