import { sanityFetch } from '@/sanity/fetch';
import type { BlogPost } from '@/sanity/types';

const image = `{ _type, alt, hotspot, crop, asset->{ _id, url, metadata{ dimensions } } }`;

/** Kikker `news`: `description` and `cover` come from `listDisplay`. */
const fields = `{
  _id,
  title,
  "slug": slug.current,
  "date": publicationDate,
  "description": coalesce(listDisplay.text, ""),
  "cover": listDisplay.image${image},
  "author": coalesce(author, "Redwoods People Services"),
  "body": body[]{
    ...,
    _type == "image" => { ..., asset->{ _id, url, metadata{ dimensions } } }
  }
}`;

/**
 * Publication window. Kikker's `publicationWindowFilter()` compares the `datetime` string
 * with `dateTime(now())` directly, which never matches; wrap the field in `dateTime()`.
 */
const publicationWindow = `(!defined(publicationDate) || dateTime(publicationDate) <= dateTime(now()))
  && (!defined(sunsetDate) || dateTime(sunsetDate) > dateTime(now()))`;

const published = `_type == "news" && !(_id in path("drafts.**")) && defined(slug.current) && (${publicationWindow})`;

/** All blog posts, newest first. */
export async function getBlogPosts(): Promise<BlogPost[]> {
  return sanityFetch<BlogPost[]>({
    query: `*[${published}] | order(publicationDate desc) ${fields}`,
    tags: ['news'],
  });
}

/** One blog post by slug, or `null`. */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  return sanityFetch<BlogPost | null>({
    query: `*[${published} && slug.current == $slug][0] ${fields}`,
    params: { slug },
    tags: ['news'],
  });
}

/** `2026-01-19` → `19 januari 2026` (Astro `fmt`). */
export function formatBlogDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.valueOf())) return iso;
  return date.toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Amsterdam',
  });
}
