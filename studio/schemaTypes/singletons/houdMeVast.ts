import { withFixedPreview, withSiteNames } from '@eightmedia/kikker-sanity';
import { defineArrayMember, defineField, defineType } from 'sanity';

import { singletonGroups } from '../helpers';
import { siteNames } from '../sites';

/** Singleton `houdMeVast` (`src/data/houd-me-vast.json` on main). Document id: `houdMeVast`. */
export const houdMeVast = withSiteNames(
  withFixedPreview(
    defineType({
      name: 'houdMeVast',
      title: 'Houd me Vast: data en prijs',
      type: 'document',
      groups: singletonGroups,
      fields: [
        defineField({
          name: 'prijs',
          title: 'Prijs per stel',
          description: 'Bijvoorbeeld: € 1.395,-',
          type: 'string',
          group: 'main',
        }),
        defineField({
          name: 'aanbetaling',
          title: 'Aanbetaling (tekst)',
          description: 'Bijvoorbeeld: € 697,50',
          type: 'string',
          group: 'main',
        }),
        defineField({
          name: 'aanbetalingBedrag',
          title: 'Aanbetaling (bedrag voor Mollie)',
          description: 'Bedrag in euro met maximaal twee decimalen, bijvoorbeeld 697.50',
          type: 'number',
          group: 'main',
          validation: (rule) =>
            rule
              .required()
              .positive()
              .custom((value) =>
                typeof value === 'number' && Math.round(value * 100) !== value * 100
                  ? 'Gebruik maximaal twee decimalen, bijvoorbeeld 697.50'
                  : true,
              ),
        }),
        defineField({
          name: 'data',
          title: 'Weekenden',
          type: 'array',
          group: 'main',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'weekend',
              title: 'Weekend',
              fields: [
                defineField({
                  name: 'datum',
                  title: 'Datum',
                  description: 'Bijvoorbeeld: 22 – 24 januari 2027',
                  type: 'string',
                }),
                defineField({ name: 'vol', title: 'Vol', type: 'boolean', initialValue: false }),
              ],
              preview: {
                select: { datum: 'datum', vol: 'vol' },
                prepare: ({ datum, vol }) => ({ title: datum, subtitle: vol ? 'Vol' : undefined }),
              },
            }),
          ],
        }),
      ],
    }),
  ),
  { ...siteNames, singleton: true },
);
