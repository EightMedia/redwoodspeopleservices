import { documentPathQuery, seoQuery } from '@eightmedia/kikker-groq';
import type { SeoResult } from '@eightmedia/kikker-groq';
import type { PortableTextBlock } from '@portabletext/types';

import { siteName } from './client';

/** Body projection for a Kikker `page` document (privacybeleid, algemene-voorwaarden). */
export type PageData = {
  title: string;
  seo: SeoResult;
  body?: PortableTextBlock[];
};

// Kikker's `fetchPage` runs the body projection with only `$id`, while `seoQuery` filters the
// settings documents on `$siteName`. Inline the site name so the projection is self-contained.
const seo = seoQuery({ siteName }).replaceAll('$siteName', JSON.stringify(siteName));

const page = `{
  title,
  "path": ${documentPathQuery()},
  "seo": ${seo},
  body
}`;

/**
 * `_type` → body projection for the catch-all route. Only `page` renders there;
 * blog, diensten and team have their own coded routes.
 */
export const queries = {
  page,
};

/** Params: $slug, $siteName. Same shape as `fetchPage` returns, for the local stand. */
export const localPageQuery = `*[_type == "page" && $siteName in siteNames && slug.current == $slug && !(_id in path("drafts.**"))][0]{
  _id, _type, "path": ${documentPathQuery()}, "data": ${page}
}`;

/** Params: $siteName. Slugs of coded detail routes, for the sitemap. */
export const sitemapSlugsQuery = `{
  "diensten": *[_type == "dienst" && !(_id in path("drafts.**"))]{ "slug": slug.current, _updatedAt },
  "team": *[_type == "teamMember" && !(_id in path("drafts.**"))]{ "slug": slug.current, _updatedAt },
  "news": *[_type == "news" && $siteName in siteNames && !(_id in path("drafts.**")) && seo.searchable != false]{
    "path": ${documentPathQuery()}, _updatedAt
  },
  "pages": *[_type == "page" && $siteName in siteNames && !(_id in path("drafts.**")) && seo.searchable != false]{
    "path": ${documentPathQuery()}, _updatedAt
  }
}`;

export type SitemapSlugsResult = {
  diensten: { slug: string | null; _updatedAt: string }[];
  team: { slug: string | null; _updatedAt: string }[];
  news: { path: string; _updatedAt: string }[];
  pages: { path: string; _updatedAt: string }[];
};
