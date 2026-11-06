import 'server-only';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { evaluate, parse } from 'groq-js';
import { draftMode } from 'next/headers';

import { hasSanityProject } from './client';
import { client, fetchSanity } from './live';

export type SanityFetchOptions = {
  query: string;
  params?: Record<string, unknown>;
  /** Extra cache tags. Sanity Live tags every fetch itself; these are only for read-your-own-write cases. */
  tags?: string[];
};

/**
 * Single entry point for GROQ reads.
 *
 * With a real Sanity project (`hasSanityProject`) the query goes through next-sanity's live
 * fetch in `./live` (published content, or drafts with stega in draft mode). Without one it
 * is evaluated locally with `groq-js` over the dry-run output of the migration script:
 * `../studio/migration-output/documents.ndjson` plus `assets.ndjson`, so every page can be
 * viewed and compared before the project exists. `->` dereferences across both files.
 */
export async function sanityFetch<T>({ query, params = {}, tags }: SanityFetchOptions): Promise<T> {
  if (hasSanityProject) {
    // `live.ts` only exposes Kikker's `fetchSanity`, which has no `tags` option. Sanity Live
    // adds its own sync tags to every fetch and `/api/revalidate` revalidates by path, so
    // revalidation works without them; custom tags are kept in the signature for later.
    void tags;
    if (await inRequestScope()) return fetchSanity<T>(query, params);
    // `generateStaticParams` and other build-time callers have no request: published content
    // straight from the client (Kikker's `fetchSanity` would call `draftMode()` and throw).
    return client.fetch<T>(query, params, { perspective: 'published' });
  }
  return localFetch<T>(query, params);
}

/** `draftMode()` throws outside a request (e.g. in `generateStaticParams`). */
async function inRequestScope(): Promise<boolean> {
  try {
    await draftMode();
    return true;
  } catch {
    return false;
  }
}

/* ---------------------------------------------------------------------------------------- */
/* Local evaluation over the migration dry-run                                               */
/* ---------------------------------------------------------------------------------------- */

const FILES = ['documents.ndjson', 'assets.ndjson'] as const;

type Dataset = { docs: Record<string, unknown>[]; key: string };

let cached: Dataset | null = null;
let warned = false;

/** `studio/migration-output`, from `web/` (dev and build) or from the repository root. */
function outputDirs(): string[] {
  const cwd = process.cwd();
  return [path.resolve(cwd, '../studio/migration-output'), path.resolve(cwd, 'studio/migration-output')];
}

async function findOutputDir(): Promise<string | null> {
  for (const dir of outputDirs()) {
    try {
      // turbopackIgnore: the dry-run folder lives outside `web/` and must not be traced.
      await stat(/* turbopackIgnore: true */ `${dir}/${FILES[0]}`);
      return dir;
    } catch {
      /* try next */
    }
  }
  return null;
}

function parseNdjson(text: string, file: string): Record<string, unknown>[] {
  const docs: Record<string, unknown>[] = [];
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]?.trim();
    if (!line) continue;
    try {
      const doc = JSON.parse(line) as Record<string, unknown>;
      // Published perspective: drafts never reach the site.
      if (typeof doc._id === 'string' && doc._id.startsWith('drafts.')) continue;
      docs.push(doc);
    } catch {
      console.warn(`[sanity/fetch] ${file}: regel ${i + 1} is geen geldige JSON, overgeslagen`);
    }
  }
  return docs;
}

/**
 * Loads both NDJSON files into one dataset. Production keeps it for the lifetime of the
 * process; development re-reads whenever a file changed, so a re-run of the dry run is
 * picked up on the next request.
 */
async function loadDataset(): Promise<Dataset> {
  const production = process.env.NODE_ENV === 'production';
  if (production && cached) return cached;

  const dir = await findOutputDir();
  if (!dir) {
    if (!warned) {
      warned = true;
      console.warn(
        '[sanity/fetch] Geen Sanity-project en geen studio/migration-output/documents.ndjson: ' +
          'alle queries geven lege resultaten. Draai het migratiescript met --dry-run.',
      );
    }
    cached = { docs: [], key: 'missing' };
    return cached;
  }

  const stats = await Promise.all(
    FILES.map((file) => stat(/* turbopackIgnore: true */ `${dir}/${file}`).catch(() => null)),
  );
  const key = `${dir}|${stats.map((s) => (s ? `${s.mtimeMs}:${s.size}` : '-')).join('|')}`;
  if (cached && cached.key === key) return cached;

  const docs: Record<string, unknown>[] = [];
  for (const [i, file] of FILES.entries()) {
    if (!stats[i]) continue;
    const text = await readFile(/* turbopackIgnore: true */ `${dir}/${file}`, 'utf8');
    docs.push(...parseNdjson(text, file));
  }
  cached = { docs, key };
  return cached;
}

async function localFetch<T>(query: string, params: Record<string, unknown>): Promise<T> {
  const { docs } = await loadDataset();
  try {
    const tree = parse(query);
    const value = await evaluate(tree, { dataset: docs, params });
    return (await value.get()) as T;
  } catch (error) {
    console.error('[sanity/fetch] Lokale GROQ-evaluatie mislukt:', (error as Error).message);
    // Mirror what an empty dataset returns: `*[...]` gives [], `*[...][0]` gives null.
    return (/\]\s*\[\s*0\s*\]\s*(\{[\s\S]*\})?\s*$/.test(query.trim()) ? null : []) as T;
  }
}
