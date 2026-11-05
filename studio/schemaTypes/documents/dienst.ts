import { fieldIntro, fieldText, withSiteNames } from '@eightmedia/kikker-sanity';
import { defineArrayMember, defineField, defineType } from 'sanity';

import { fieldRichText } from '../fields/richText';
import { siteNames } from '../sites';

const groups = [
  { name: 'main', title: 'Inhoud', default: true },
  { name: 'settings', title: 'Instellingen' },
];

/** Dienst (`src/content/diensten/*.md` on main). Public path: `/diensten/<slug>/` (code route). */
export const dienst = withSiteNames(
  defineType({
    name: 'dienst',
    title: 'Dienst',
    type: 'document',
    groups,
    fields: [
      defineField({
        name: 'title',
        title: 'Naam van de dienst',
        type: 'string',
        group: 'main',
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'slug',
        title: 'URL-naam',
        description: 'Wordt het adres: /diensten/url-naam/',
        type: 'slug',
        group: 'settings',
        options: { source: 'title' },
        validation: (rule) => rule.required(),
      }),
      {
        ...fieldText({
          name: 'description',
          title: 'Omschrijving voor Google',
          description: 'Maximaal 160 tekens, noem de plaats.',
          group: 'main',
        }),
        validation: (rule) => rule.required(),
      },
      {
        ...fieldIntro({
          name: 'intro',
          title: 'Intro',
          description: 'Twee zinnen bovenaan de pagina.',
          group: 'main',
        }),
        validation: (rule) => rule.required(),
      },
      defineField({
        name: 'order',
        title: 'Volgorde',
        type: 'number',
        group: 'settings',
        initialValue: 99,
        validation: (rule) => rule.integer(),
      }),
      defineField({
        name: 'faq',
        title: 'Veelgestelde vragen',
        type: 'array',
        group: 'main',
        of: [
          defineArrayMember({
            type: 'object',
            name: 'faqItem',
            title: 'Vraag en antwoord',
            fields: [
              defineField({
                name: 'q',
                title: 'Vraag',
                type: 'string',
                validation: (rule) => rule.required(),
              }),
              fieldRichText({
                name: 'a',
                title: 'Antwoord',
                description: 'Een link maak je via de linkknop, bijvoorbeeld naar /tarieven/ of mailto:adres.',
              }),
            ],
            preview: {
              select: { title: 'q' },
            },
          }),
        ],
      }),
      fieldRichText({ name: 'body', title: 'Tekst', group: 'main' }),
    ],
    preview: {
      select: { title: 'title', subtitle: 'slug.current' },
    },
  }),
  siteNames,
);
