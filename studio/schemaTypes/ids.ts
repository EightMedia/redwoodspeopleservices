import { singletonDocumentId } from '@eightmedia/kikker-sanity';

import { siteName } from './sites';

/**
 * Fixed document ids shared by the Studio desk, the initial value templates and the
 * migration script (`scripts/migrate-from-astro.ts`).
 *
 * Own singletons use a bare id; Kikker settings singletons use `singletonDocumentId`.
 */
export const BLOG_LIST_PAGE_ID = 'listPage.blog';

export const ownSingletonIds = {
  tarieven: 'tarieven',
  houdMeVast: 'houdMeVast',
  rouwEnVerlies: 'rouwEnVerlies',
} as const;

export const settingsIds = {
  siteSettings: singletonDocumentId('siteSettings', siteName),
  siteHeader: singletonDocumentId('siteHeader', siteName),
  siteFooter: singletonDocumentId('siteFooter', siteName),
  seoSettings: singletonDocumentId('seoSettings', siteName),
  redirects: singletonDocumentId('redirects', siteName),
  analytics: singletonDocumentId('analytics', siteName),
} as const;

export const pageId = (slug: string) => `page.${slug}`;
export const newsId = (slug: string) => `news.${slug}`;
export const teamMemberId = (slug: string) => `teamMember.${slug}`;
export const dienstId = (slug: string) => `dienst.${slug}`;
