import {
  settingsAnalytics,
  settingsSeo,
  settingsSiteSettings,
} from '@eightmedia/kikker-sanity';

import { relabel } from './helpers';
import { kikker } from './kikker';
import { siteNames } from './sites';

/**
 * Kikker settings singletons. Document ids follow `singletonDocumentId(type, 'default')`:
 * `siteSettings_default`, `siteHeader_default`, `siteFooter_default`, `seoSettings_default`,
 * `redirects_default`, `analytics_default`.
 */
export const siteSettings = relabel(
  settingsSiteSettings({ title: 'Site-instellingen', siteNames }),
  {
    title: { title: 'Naam van de site' },
    favicon: {
      title: 'Favicon',
      description:
        'Vierkante PNG (liefst minimaal 512×512). Hieruit worden favicons, apple-touch-icon en Android-iconen gemaakt.',
    },
    fallbackImage: {
      title: 'Standaard deelafbeelding',
      description: 'Wordt gebruikt als een pagina geen eigen deelafbeelding heeft.',
    },
  },
);

export const siteHeader = relabel(kikker.settingsHeader({ title: 'Menu', siteNames }), {
  logo: { title: 'Logo' },
  primaryMenuItems: {
    title: 'Hoofdmenu',
    description: 'De menu-items bovenaan de site, met eventuele submenu-items.',
  },
  secondaryMenuItems: { title: 'Secundair menu' },
});

export const siteFooter = relabel(kikker.settingsFooter({ title: 'Footer', siteNames }), {
  columns: { title: 'Kolommen', description: 'Linkkolommen en tekstkolommen in de footer.' },
});

export const seoSettings = relabel(settingsSeo({ title: 'SEO', siteNames }), {
  title: { title: 'Standaardtitel' },
  titleSuffix: {
    title: 'Titel-achtervoegsel',
    description: 'Komt achter paginatitels, bijvoorbeeld " | Redwoods People Services".',
  },
  description: { title: 'Standaardomschrijving' },
});

export const redirects = relabel(kikker.settingsRedirects({ title: 'Doorverwijzingen', siteNames }), {
  redirects: {
    title: 'Doorverwijzingen',
    description: 'Oude adressen die naar een nieuwe pagina moeten verwijzen.',
  },
});

export const analytics = relabel(settingsAnalytics({ title: 'Statistieken', siteNames }), {
  cookieScriptId: {
    title: 'CookieScript-ID',
    description: 'CookieScript-ID of script-URL. Leeg laten voor geen cookiemelding.',
  },
  services: { title: 'Diensten' },
});
