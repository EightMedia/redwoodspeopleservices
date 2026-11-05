/**
 * Public URLs that live in code (fixed Next routes), for the sitemap.
 * Sanity-backed detail pages (diensten, team, blog, page) are added at runtime.
 * `/houd-me-vast/bedankt/` is deliberately absent, as on the Astro site.
 */
export const staticRoutes = [
  '/',
  '/over-ons/',
  '/contact/',
  '/diensten/',
  '/team/',
  '/blog/',
  '/tarieven/',
  '/programmas/',
  '/houd-me-vast/',
  '/rouw-en-verlies/',
  '/greenwoods/',
  '/relatietherapie-arnhem/',
  '/relatietherapie-velp/',
  '/psychotherapie-arnhem/',
  '/therapie-rheden-rozendaal/',
] as const;
