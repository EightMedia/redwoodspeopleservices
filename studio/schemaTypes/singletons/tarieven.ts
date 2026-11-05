import { withFixedPreview, withSiteNames } from '@eightmedia/kikker-sanity';
import { defineArrayMember, defineField, defineType } from 'sanity';

import { singletonGroups } from '../helpers';
import { siteNames } from '../sites';

/** Singleton `tarieven` (`src/data/tarieven.json` on main). Document id: `tarieven`. */
export const tarieven = withSiteNames(
  withFixedPreview(
    defineType({
      name: 'tarieven',
      title: 'Tarieven',
      type: 'document',
      groups: singletonGroups,
      fields: [
        defineField({
          name: 'geldigVanaf',
          title: 'Geldig vanaf',
          description: 'Bijvoorbeeld: 1 januari 2026',
          type: 'string',
          group: 'main',
        }),
        defineField({
          name: 'tarieven',
          title: 'Tarieven',
          type: 'array',
          group: 'main',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'tarief',
              title: 'Tarief',
              fields: [
                defineField({ name: 'naam', title: 'Dienst', type: 'string' }),
                defineField({
                  name: 'prijs',
                  title: 'Prijs',
                  description: 'Bijvoorbeeld: € 115,-',
                  type: 'string',
                }),
                defineField({
                  name: 'btw',
                  title: 'Btw',
                  description: 'btw-vrij of incl. 21% btw',
                  type: 'string',
                }),
                defineField({ name: 'info', title: 'Toelichting', type: 'text', rows: 3 }),
              ],
              preview: {
                select: { naam: 'naam', prijs: 'prijs' },
                prepare: ({ naam, prijs }) => ({ title: `${naam ?? ''} – ${prijs ?? ''}` }),
              },
            }),
          ],
        }),
        defineField({
          name: 'noShow',
          title: 'No-show-beleid',
          description:
            'Staat onder de tarievenlijst. Dezelfde tekst staat ook in de algemene voorwaarden.',
          type: 'object',
          group: 'main',
          fields: [
            defineField({ name: 'titel', title: 'Kop', type: 'string', initialValue: 'No-show-beleid' }),
            defineField({
              name: 'tekst',
              title: 'Tekst',
              description: 'Elke regel wordt een aparte alinea.',
              type: 'text',
              rows: 5,
            }),
          ],
        }),
      ],
    }),
  ),
  { ...siteNames, singleton: true },
);
