import { withFixedPreview, withSiteNames } from '@eightmedia/kikker-sanity';
import { defineField, defineType } from 'sanity';

import { singletonGroups } from '../helpers';
import { siteNames } from '../sites';

/** Singleton `rouwEnVerlies` (`src/data/rouw-en-verlies.json` on main). Document id: `rouwEnVerlies`. */
export const rouwEnVerlies = withSiteNames(
  withFixedPreview(
    defineType({
      name: 'rouwEnVerlies',
      title: 'Rouw en Verlies: data en prijs',
      type: 'document',
      groups: singletonGroups,
      fields: [
        defineField({
          name: 'wanneer',
          title: 'Wanneer',
          description: 'Bijvoorbeeld: Start 12 maart 2027, of: data volgen binnenkort',
          type: 'text',
          rows: 2,
          group: 'main',
        }),
        defineField({
          name: 'omvang',
          title: 'Omvang',
          type: 'string',
          initialValue: 'Vijf bijeenkomsten van 09:30 tot 12:00 uur, in een kleine groep',
          group: 'main',
        }),
        defineField({
          name: 'prijs',
          title: 'Prijs',
          description: 'Bijvoorbeeld: € 525,-',
          type: 'string',
          group: 'main',
        }),
        defineField({
          name: 'inclusief',
          title: 'Inclusief',
          type: 'string',
          initialValue: 'koffie, thee en versnaperingen',
          group: 'main',
        }),
      ],
    }),
  ),
  { ...siteNames, singleton: true },
);
