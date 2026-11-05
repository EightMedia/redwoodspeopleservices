import { documentNews } from '@eightmedia/kikker-sanity';
import { defineArrayMember, defineField, type FieldDefinition } from 'sanity';

import { fieldRichText } from '../fields/richText';
import { insertFieldAfter, kikkerFieldLabels, relabel, replaceField, withoutFields } from '../helpers';
import { siteNames } from '../sites';

type ArrayField = FieldDefinition & { of?: unknown[] };

/**
 * Blog article body: Kikker block content plus an inline image block. The Astro articles
 * contain images between paragraphs (`![](...)`), which Kikker's `fieldBlockContent` has no
 * member for.
 */
export function fieldArticleBody(): FieldDefinition {
  const base = fieldRichText({ name: 'body', title: 'Artikel', group: 'main' }) as ArrayField;
  return {
    ...base,
    of: [
      ...(base.of ?? []),
      defineArrayMember({
        type: 'image',
        name: 'image',
        title: 'Afbeelding',
        options: { hotspot: true },
        fields: [
          defineField({
            name: 'alt',
            title: 'Alternatieve tekst',
            description: 'Korte beschrijving van de afbeelding voor schermlezers en Google.',
            type: 'string',
          }),
        ],
      }),
    ],
  } as FieldDefinition;
}

const authorField = defineField({
  name: 'author',
  title: 'Auteur',
  type: 'string',
  group: 'main',
  initialValue: 'Redwoods People Services',
});

/**
 * Kikker `news` = blogartikel. Tags and categories are not part of the Redwoods content
 * model, so those Kikker fields are dropped (and the `tag` / `newsSettings` types are not
 * registered).
 */
export const news = relabel(
  insertFieldAfter(
    replaceField(
      withoutFields(
        documentNews({
          title: 'Blogartikel',
          siteNames,
        }),
        ['tags', 'category'],
      ),
      'body',
      fieldArticleBody(),
    ),
    'title',
    authorField,
  ),
  {
    ...kikkerFieldLabels,
    title: { title: 'Titel' },
    slug: { title: 'URL-naam', description: 'Wordt het adres: /blog/url-naam/' },
    parent: { title: 'Overzichtspagina', description: 'Het blogoverzicht waar dit artikel onder valt.' },
    publicationDate: { title: 'Datum' },
    listDisplay: {
      ...kikkerFieldLabels.listDisplay,
      fields: {
        ...kikkerFieldLabels.listDisplay?.fields,
        text: {
          title: 'Korte samenvatting',
          description: 'Twee zinnen. Verschijnt in overzichten en in Google.',
        },
        image: {
          title: 'Omslagfoto',
          description: 'Liggend, minimaal 1200 pixels breed, kleiner dan 2 MB.',
        },
      },
    },
  },
);
