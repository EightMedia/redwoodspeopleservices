import type { PortableTextBlock } from '@portabletext/types';

/**
 * Sanity document shapes as the GROQ queries in `./queries/` project them. Field names
 * follow the content model in `docs/kikker-herbouw.md`; `slug` is already `slug.current`.
 */

/** Image as projected by `imageProjection`: hotspot/crop plus the resolved asset. */
export type SanityImage = {
  _type?: 'image';
  alt?: string;
  hotspot?: { x: number; y: number; width: number; height: number } | null;
  crop?: { top: number; bottom: number; left: number; right: number } | null;
  asset?: {
    _id: string;
    url: string;
    metadata?: {
      dimensions?: { width: number; height: number; aspectRatio: number };
    };
  } | null;
};

export type TeamMember = {
  _id: string;
  name: string;
  slug: string;
  role: string;
  intro: string;
  photo: SanityImage;
  order: number;
  registrations: string[];
  specialties: string[];
  wachttijd?: string | null;
  body?: PortableTextBlock[] | null;
};

export type FaqItem = {
  q: string;
  a: PortableTextBlock[];
};

export type Dienst = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  intro: string;
  order: number;
  faq: FaqItem[];
  body?: PortableTextBlock[] | null;
};

/** Kikker `news` document: `description` = `listDisplay.text`, `cover` = `listDisplay.image`. */
export type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  /** ISO date (`publicationDate`). */
  date: string;
  description: string;
  cover?: SanityImage | null;
  author: string;
  body?: PortableTextBlock[] | null;
};

export type Tarief = {
  naam: string;
  prijs: string;
  btw?: string | null;
  info?: string | null;
};

export type Tarieven = {
  geldigVanaf: string;
  tarieven: Tarief[];
  noShow?: { titel?: string | null; tekst?: string | null } | null;
};

export type HoudMeVast = {
  prijs: string;
  aanbetaling: string;
  aanbetalingBedrag: number;
  data: { datum: string; vol: boolean }[];
};

export type RouwEnVerlies = {
  wanneer: string;
  omvang: string;
  prijs: string;
  inclusief: string;
};
