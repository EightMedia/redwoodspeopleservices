import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createFaviconIcoHandler } from '@eightmedia/kikker-next';

import { hasSanityProject, siteName } from '@/sanity/client';
import { client } from '@/sanity/live';

export const revalidate = 3600;

const sanityHandler = createFaviconIcoHandler(client, { siteName });

/** Serve the PNG from `public/` (the Astro favicon) until Sanity site settings carry one. */
async function localFavicon(): Promise<Response> {
  const file = await readFile(path.join(process.cwd(), 'public', 'favicon.png'));
  return new Response(new Uint8Array(file), {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

export async function GET(): Promise<Response> {
  if (hasSanityProject) {
    const response = await sanityHandler.GET();
    if (response.status === 200) return response;
  }
  return localFavicon();
}
