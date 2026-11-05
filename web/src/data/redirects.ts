/**
 * Old WordPress URLs that must keep working (301). Ported from the Astro site's
 * `astro.config.mjs` plus the archive rules from `scripts/fix-redirects.mjs`.
 *
 * Kept in a plain module (no Next imports) so `next.config.ts` can read it.
 * Every entry is matched with and without a trailing slash by `next.config.ts`.
 */
export type LegacyRedirect = {
  /** Path without trailing slash. May contain Next path params (`:path*`). */
  source: string;
  destination: string;
};

export const legacyRedirects: LegacyRedirect[] = [
  { source: '/nieuwe-home', destination: '/' },
  { source: '/feed', destination: '/blog/' },
  // The Astro build published the sitemap at /sitemap-index.xml; Next serves /sitemap.xml.
  { source: '/sitemap-index.xml', destination: '/sitemap.xml' },
  { source: '/vergoeding', destination: '/tarieven/' },
  { source: '/vergoedingen', destination: '/tarieven/' },
  { source: '/webshop', destination: '/over-ons/' },
  { source: '/winkelmand', destination: '/' },
  { source: '/afrekenen', destination: '/' },
  { source: '/mijn-account', destination: '/' },
  { source: '/natuurcoaching', destination: '/greenwoods/' },
  { source: '/verbinden-met-verlies', destination: '/rouw-en-verlies/' },
  { source: '/programmas-retreats', destination: '/greenwoods/' },
  { source: '/blog-goed-voelen', destination: '/blog/' },
  { source: '/een-fragiel-evenwicht', destination: '/blog/' },
  {
    source: '/verhaal-over-de-vier-verbindingen',
    destination: '/blog/verhaal-over-de-vier-verbindingen/',
  },
  { source: '/e-l-k-a-a-r-vasthouden', destination: '/blog/e-l-k-a-a-r-vasthouden/' },
  { source: '/samen-sterker-in-de-storm', destination: '/blog/samen-sterker-in-de-storm/' },
  { source: '/elementor-9304', destination: '/blog/samen-door-de-modder/' },
  {
    source: '/schaamte-van-overleving-naar-verbondenheid',
    destination: '/blog/schaamte-van-overleving-naar-verbondenheid/',
  },
  {
    source: '/de-leegte-over-gemis-verbinding-en-de-weg-naar-heling',
    destination: '/blog/de-leegte-over-gemis-verbinding-en-de-weg-naar-heling/',
  },
  // Old webshop product pages (/product/<name>/) go to Over ons.
  { source: '/product', destination: '/over-ons/' },
  { source: '/product/:path*', destination: '/over-ons/' },
  // WordPress archives (/tag/, /author/, /category/, /2025/08/) go to the blog.
  { source: '/:archive(tag|author|category|20\\d{2})', destination: '/blog/' },
  { source: '/:archive(tag|author|category|20\\d{2})/:path*', destination: '/blog/' },
];
