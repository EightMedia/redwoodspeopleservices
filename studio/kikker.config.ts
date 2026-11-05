import type { KikkerConfig } from '@eightmedia/kikker-sanity';

/**
 * Kikker config for the Redwoods Studio. One site (`default`); both environments use the
 * `production` dataset for now (see docs/kikker-herbouw.md).
 */
export default {
  site: {
    name: 'default',
  },
  env: {
    development: {
      url: 'http://localhost:3000',
      dataset: 'production',
      deskTitle: 'Redwoods Studio (dev)',
    },
    production: {
      url: 'https://www.redwoodspeopleservices.nl',
      dataset: 'production',
      deskTitle: 'Redwoods Studio',
    },
  },
  cms: {
    // Types that resolve to a public URL through Kikker's parent/slug path model.
    linkableTypes: ['page', 'listPage', 'news'],
  },
} satisfies KikkerConfig;
