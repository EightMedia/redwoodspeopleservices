import { singletonDocumentId } from '@eightmedia/kikker-sanity';
import type { StructureResolver } from 'sanity/structure';

import { BLOG_LIST_PAGE_ID } from './schemaTypes/ids';
import { kikker } from './schemaTypes/kikker';
import { siteName } from './schemaTypes/sites';

type StructureBuilder = Parameters<StructureResolver>[0];

/** Own singletons live at a fixed, site-independent id (`tarieven`, `houdMeVast`, …). */
const ownSingleton = (S: StructureBuilder, title: string, type: string) =>
  S.listItem().title(title).id(type).child(S.document().schemaType(type).documentId(type));

/** Kikker settings singletons use `singletonDocumentId(type, siteName)`. */
const settingsSingleton = (S: StructureBuilder, title: string, type: string) =>
  S.listItem()
    .title(title)
    .id(type)
    .child(S.document().schemaType(type).documentId(singletonDocumentId(type, siteName)));

/** Own document types keep Sanity's default create template (siteNames has an initial value). */
const orderedList = (S: StructureBuilder, type: string, title: string) =>
  S.listItem()
    .title(title)
    .child(
      S.documentTypeList(type)
        .title(title)
        .defaultOrdering([{ field: 'order', direction: 'asc' }]),
    );

/**
 * Kikker types need the `${type}-site` template, because `kikker.templates` replaces
 * Sanity's parameterless defaults for `cms.linkableTypes`.
 */
const siteDocumentTypeList = (S: StructureBuilder, type: string, title: string) =>
  S.listItem()
    .title(title)
    .child(
      S.documentTypeList(type)
        .title(title)
        .initialValueTemplates([S.initialValueTemplateItem(`${type}-site`, { siteName })]),
    );

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Redwoods')
    .items([
      S.divider().title('Content'),
      orderedList(S, 'teamMember', 'Team'),
      orderedList(S, 'dienst', 'Diensten'),
      kikker.structure.news(S, {
        title: 'Blog',
        settings: false,
        // The blog overview lives at a fixed id (see schemaTypes/ids.ts), not Kikker's
        // default `listPage_news_default`; sanity.config.ts pins the news template to it.
        listPageId: BLOG_LIST_PAGE_ID,
        titles: {
          overview: 'Overzichtspagina',
          live: 'Gepubliceerd',
          scheduled: 'Ingepland',
          offline: 'Offline',
          draft: 'Concept',
          all: 'Alle artikelen',
        },
      }),
      siteDocumentTypeList(S, 'page', "Pagina's"),
      S.divider().title('Programma’s en tarieven'),
      ownSingleton(S, 'Tarieven', 'tarieven'),
      ownSingleton(S, 'Houd me Vast', 'houdMeVast'),
      ownSingleton(S, 'Rouw en Verlies', 'rouwEnVerlies'),
      S.divider().title('Instellingen'),
      settingsSingleton(S, 'Site-instellingen', 'siteSettings'),
      settingsSingleton(S, 'Menu', 'siteHeader'),
      settingsSingleton(S, 'Footer', 'siteFooter'),
      settingsSingleton(S, 'SEO', 'seoSettings'),
      settingsSingleton(S, 'Doorverwijzingen', 'redirects'),
      settingsSingleton(S, 'Statistieken', 'analytics'),
    ]);
