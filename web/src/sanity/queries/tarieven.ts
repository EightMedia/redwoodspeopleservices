import { sanityFetch } from '@/sanity/fetch';
import type { Tarieven } from '@/sanity/types';

/** The `tarieven` singleton (document id `tarieven`), or `null` when it does not exist yet. */
export async function getTarieven(): Promise<Tarieven | null> {
  return sanityFetch<Tarieven | null>({
    query: `*[_type == "tarieven" && !(_id in path("drafts.**"))][0]{
      geldigVanaf,
      "tarieven": coalesce(tarieven[]{ naam, prijs, btw, info }, []),
      noShow{ titel, tekst }
    }`,
    tags: ['tarieven'],
  });
}
