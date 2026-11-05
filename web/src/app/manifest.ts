import type { MetadataRoute } from 'next';
import { buildManifest } from '@eightmedia/kikker-next';

import { site } from '@/data/site';
import { hasSanityProject, siteName } from '@/sanity/client';
import { client } from '@/sanity/live';

export const revalidate = 3600;

const fallback: MetadataRoute.Manifest = {
  name: site.name,
  short_name: site.shortName,
  display: 'standalone',
  theme_color: '#e75c50',
  background_color: '#ffffff',
  icons: [{ src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
};

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  if (!hasSanityProject) return fallback;

  const fromSanity = await buildManifest(client, {
    siteName,
    themeColor: fallback.theme_color,
    backgroundColor: fallback.background_color,
  });

  // Keep the local icons and names until the Studio has a favicon and site title.
  return {
    ...fallback,
    ...fromSanity,
    name: fromSanity.name ?? fallback.name,
    short_name: fromSanity.short_name ?? fallback.short_name,
    icons: fromSanity.icons ?? fallback.icons,
  };
}
