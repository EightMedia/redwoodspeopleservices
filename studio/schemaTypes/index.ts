import { dienst } from './documents/dienst';
import { news } from './documents/news';
import { listPage, page } from './documents/page';
import { teamMember } from './documents/teamMember';
import {
  analytics,
  redirects,
  seoSettings,
  siteFooter,
  siteHeader,
  siteSettings,
} from './settings';
import { houdMeVast } from './singletons/houdMeVast';
import { rouwEnVerlies } from './singletons/rouwEnVerlies';
import { tarieven } from './singletons/tarieven';

export const schemaTypes = [
  // Kikker content documents
  page,
  listPage,
  news,
  // Own documents
  teamMember,
  dienst,
  // Own singletons
  tarieven,
  houdMeVast,
  rouwEnVerlies,
  // Kikker settings singletons
  siteSettings,
  siteHeader,
  siteFooter,
  seoSettings,
  redirects,
  analytics,
];
