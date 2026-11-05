import { documentListPage, documentPage, fieldParent } from '@eightmedia/kikker-sanity';

import { fieldRichText } from '../fields/richText';
import { kikkerFieldLabels, relabel, replaceField } from '../helpers';
import { siteNames } from '../sites';

/**
 * Kikker `page`: privacyverklaring and algemene voorwaarden. Parent targets are limited to
 * the types this Studio registers (Kikker's default also lists `landingPage`).
 */
const parentField = fieldParent({
  to: ['page', 'listPage'],
  title: kikkerFieldLabels.parent?.title,
  description: kikkerFieldLabels.parent?.description,
});

export const page = relabel(
  replaceField(
    replaceField(
      documentPage({
        title: 'Pagina',
        titleField: { title: 'Titel' },
        siteNames,
      }),
      'parent',
      parentField,
    ),
    'body',
    fieldRichText({ name: 'body', title: 'Tekst', group: 'main' }),
  ),
  kikkerFieldLabels,
);

/** Kikker `listPage`: the single blog overview (slug `blog`, parent of every `news`). */
export const listPage = relabel(
  replaceField(
    documentListPage({
      title: 'Overzichtspagina',
      siteNames,
      contentTypes: [{ title: 'Blog', value: 'news' }],
    }),
    'parent',
    parentField,
  ),
  {
    ...kikkerFieldLabels,
    title: { title: 'Titel' },
    contentType: { title: 'Soort inhoud' },
    sort: { title: 'Sortering' },
    pageSize: { title: 'Aantal per pagina' },
  },
);
