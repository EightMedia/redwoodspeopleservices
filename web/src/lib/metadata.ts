import type { Metadata } from 'next';
import type { StaticImageData } from 'next/image';

import ogDefault from '@/assets/redwoods-illustratie.jpg';
import { site } from '@/data/site';
import { absoluteUrl, withTrailingSlash } from './siteUrl';

export type PageMetadataOptions = {
  title: string;
  description: string;
  /** Site path, e.g. `/over-ons/`. A trailing slash is added when missing. */
  path: string;
  /** Static image import for Open Graph; defaults to the Redwoods illustration. */
  image?: StaticImageData;
  type?: 'website' | 'article';
  noindex?: boolean;
  /** Page title without the site name after it. */
  bareTitle?: boolean;
};

/**
 * Google cuts titles around 60 characters: full site name when it fits, otherwise the
 * short name, otherwise only the page title (same rule as the Astro `Base.astro`).
 */
export function fullTitle(title: string, bareTitle = false): string {
  if (bareTitle) return title;
  const withFull = `${title} | ${site.name}`;
  if (withFull.length <= 60) return withFull;
  const withShort = `${title} | ${site.shortName}`;
  if (withShort.length <= 60) return withShort;
  return title;
}

/** Absolute URL of the default Open Graph image (also used in the organisation JSON-LD). */
export function defaultOgImageUrl(): string {
  return absoluteUrl(ogDefault.src);
}

/** Next `Metadata` for a page: title rule, canonical, Open Graph (nl_NL) and Twitter card. */
export function pageMetadata({
  title,
  description,
  path,
  image = ogDefault,
  type = 'website',
  noindex = false,
  bareTitle = false,
}: PageMetadataOptions): Metadata {
  const resolvedTitle = fullTitle(title, bareTitle);
  const canonical = absoluteUrl(withTrailingSlash(path));
  const ogImage = {
    url: absoluteUrl(image.src),
    width: image.width,
    height: image.height,
  };

  return {
    title: { absolute: resolvedTitle },
    description,
    alternates: { canonical },
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type,
      siteName: site.name,
      locale: 'nl_NL',
      title: resolvedTitle,
      description,
      url: canonical,
      images: [ogImage],
    },
    twitter: { card: 'summary_large_image' },
  };
}
