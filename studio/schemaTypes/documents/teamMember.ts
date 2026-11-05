import { fieldImage, fieldIntro, withSiteNames } from '@eightmedia/kikker-sanity';
import { defineField, defineType } from 'sanity';

import { fieldRichText } from '../fields/richText';
import { siteNames } from '../sites';

const groups = [
  { name: 'main', title: 'Inhoud', default: true },
  { name: 'settings', title: 'Instellingen' },
];

/** Teamlid (`src/content/team/*.md` on main). Public path: `/team/<slug>/` (code route). */
export const teamMember = withSiteNames(
  defineType({
    name: 'teamMember',
    title: 'Teamlid',
    type: 'document',
    groups,
    fields: [
      defineField({
        name: 'name',
        title: 'Naam',
        type: 'string',
        group: 'main',
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'slug',
        title: 'URL-naam',
        description: 'Wordt het adres: /team/url-naam/',
        type: 'slug',
        group: 'settings',
        options: { source: 'name' },
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'role',
        title: 'Functie',
        description: 'Bijvoorbeeld: Integratief therapeut en EFT-relatietherapeut',
        type: 'string',
        group: 'main',
        validation: (rule) => rule.required(),
      }),
      fieldIntro({
        name: 'intro',
        title: 'Korte introductie',
        description: 'Eén of twee zinnen voor de teamkaart.',
        group: 'main',
      }),
      {
        ...fieldImage({
          name: 'photo',
          title: 'Portretfoto',
          description: 'Vierkant of staand, minimaal 800 pixels.',
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
        name: 'specialties',
        title: 'Specialisaties',
        type: 'array',
        group: 'main',
        of: [{ type: 'string', title: 'Specialisatie' }],
      }),
      defineField({
        name: 'registrations',
        title: 'Registraties',
        description: 'Bijvoorbeeld: VIT: lid',
        type: 'array',
        group: 'main',
        of: [{ type: 'string', title: 'Registratie' }],
      }),
      defineField({
        name: 'wachttijd',
        title: 'Wachttijd',
        description:
          'Bijvoorbeeld: Ongeveer twee weken, of: Op dit moment geen plek voor nieuwe cliënten. Leeg laten om niets te tonen.',
        type: 'string',
        group: 'main',
      }),
      fieldRichText({ name: 'body', title: 'Profieltekst', group: 'main' }),
    ],
    preview: {
      select: { title: 'name', subtitle: 'role', media: 'photo' },
    },
  }),
  siteNames,
);
