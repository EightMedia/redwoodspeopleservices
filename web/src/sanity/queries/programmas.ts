import type { HoudMeVast, RouwEnVerlies } from '@/sanity/types';
import { sanityFetch } from '@/sanity/fetch';

/** Singleton `houdMeVast`: price, deposit and the weekend dates with their sold-out flag. */
const houdMeVastQuery = `*[_type == "houdMeVast" && _id == "houdMeVast"][0]{
  prijs,
  aanbetaling,
  aanbetalingBedrag,
  data[]{ datum, vol }
}`;

/** Singleton `rouwEnVerlies`: the practical details of the grief group. */
const rouwEnVerliesQuery = `*[_type == "rouwEnVerlies" && _id == "rouwEnVerlies"][0]{
  wanneer,
  omvang,
  prijs,
  inclusief
}`;

export async function getHoudMeVast(): Promise<HoudMeVast | null> {
  return sanityFetch<HoudMeVast | null>({ query: houdMeVastQuery, tags: ['houdMeVast'] });
}

export async function getRouwEnVerlies(): Promise<RouwEnVerlies | null> {
  return sanityFetch<RouwEnVerlies | null>({ query: rouwEnVerliesQuery, tags: ['rouwEnVerlies'] });
}
