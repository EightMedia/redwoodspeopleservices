import { sanityFetch } from '@/sanity/fetch';
import type { Dienst } from '@/sanity/types';

const fields = `{
  _id,
  title,
  "slug": slug.current,
  description,
  intro,
  "order": coalesce(order, 99),
  "faq": coalesce(faq[]{ q, a }, []),
  body
}`;

const published = `_type == "dienst" && !(_id in path("drafts.**")) && defined(slug.current)`;

/** All services, ordered by `order` (then title). */
export async function getDiensten(): Promise<Dienst[]> {
  return sanityFetch<Dienst[]>({
    query: `*[${published}] | order(order asc, title asc) ${fields}`,
    tags: ['dienst'],
  });
}

/** One service by slug, or `null`. */
export async function getDienst(slug: string): Promise<Dienst | null> {
  return sanityFetch<Dienst | null>({
    query: `*[${published} && slug.current == $slug][0] ${fields}`,
    params: { slug },
    tags: ['dienst'],
  });
}
