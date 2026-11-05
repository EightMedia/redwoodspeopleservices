import { sanityFetch } from '@/sanity/fetch';
import type { TeamMember } from '@/sanity/types';

const image = `{ _type, alt, hotspot, crop, asset->{ _id, url, metadata{ dimensions } } }`;

const fields = `{
  _id,
  name,
  "slug": slug.current,
  role,
  intro,
  "photo": photo${image},
  "order": coalesce(order, 99),
  "registrations": coalesce(registrations, []),
  "specialties": coalesce(specialties, []),
  wachttijd,
  body
}`;

const published = `_type == "teamMember" && !(_id in path("drafts.**")) && defined(slug.current)`;

/** All team members, ordered by `order` (then name). */
export async function getTeamMembers(): Promise<TeamMember[]> {
  return sanityFetch<TeamMember[]>({
    query: `*[${published}] | order(order asc, name asc) ${fields}`,
    tags: ['teamMember'],
  });
}

/** One team member by slug, or `null`. */
export async function getTeamMember(slug: string): Promise<TeamMember | null> {
  return sanityFetch<TeamMember | null>({
    query: `*[${published} && slug.current == $slug][0] ${fields}`,
    params: { slug },
    tags: ['teamMember'],
  });
}

/** Team members for the given slugs, in the order of `slugs` (unknown slugs are skipped). */
export async function getTeamMembersBySlugs(slugs: string[]): Promise<TeamMember[]> {
  if (slugs.length === 0) return [];
  const members = await sanityFetch<TeamMember[]>({
    query: `*[${published} && slug.current in $slugs] ${fields}`,
    params: { slugs },
    tags: ['teamMember'],
  });
  const bySlug = new Map(members.map((member) => [member.slug, member]));
  return slugs.flatMap((slug) => {
    const member = bySlug.get(slug);
    return member ? [member] : [];
  });
}
