import { documentPathQuery } from '@eightmedia/kikker-groq';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

import type { Template } from 'sanity';

import config from './kikker.config';
import { schemaTypes } from './schemaTypes';
import { BLOG_LIST_PAGE_ID } from './schemaTypes/ids';
import { kikker } from './schemaTypes/kikker';
import { structure } from './structure';

/**
 * Kikker's `news-site` template pins new articles to `listPage_news_<site>`; this Studio
 * keeps the blog overview at `listPage.blog` (shared with the migration script), so the
 * template is rewritten to that id. Everything else comes from `kikker.templates`.
 */
const templates = (prev: Template[]): Template[] =>
  kikker.templates(prev).map((template) =>
    template.id === 'news-site'
      ? {
          ...template,
          value: ({ siteName }: { siteName: string }) => ({
            siteNames: [siteName],
            parent: {
              _type: 'reference',
              _ref: BLOG_LIST_PAGE_ID,
              _weak: true,
              _strengthenOnPublish: { type: 'listPage' },
            },
          }),
        }
      : template,
  );

/**
 * Studio reads `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET` from `.env.local`
 * (see README). A placeholder project id is fine for typecheck and build.
 */
export default defineConfig({
  name: 'redwoods',
  title: config.env.production.deskTitle,
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 'placeholder',
  dataset: process.env.SANITY_STUDIO_DATASET ?? config.env.production.dataset,
  plugins: [
    structureTool({ structure }),
    kikker.presentation({
      previewUrl: process.env.SANITY_STUDIO_PREVIEW_URL ?? config.env.development.url,
      pathQuery: documentPathQuery(),
    }),
  ],
  schema: {
    types: schemaTypes,
    templates,
  },
});
