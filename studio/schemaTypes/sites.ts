import type { WithSiteNamesOptions } from '@eightmedia/kikker-sanity';

/** Single site. Kikker still stores `siteNames: ['default']` on every document. */
export const sites = [{ name: 'default', title: 'Redwoods People Services' }] as const;

export const siteName = sites[0].name;

export const siteNames: WithSiteNamesOptions = {
  sites: [...sites],
  hideWhenSingle: true,
};
