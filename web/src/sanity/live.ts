import 'server-only';
import { createSanityClient, defineKikkerLive } from '@eightmedia/kikker-next';

import { apiVersion, dataset, projectId } from './client';

export const client = createSanityClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_READ_TOKEN,
  studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL ?? 'http://localhost:3333',
});

export const { SanityLive, fetchSanity, pageClient, isDraftMode } = defineKikkerLive({
  client,
  serverToken: process.env.SANITY_API_READ_TOKEN ?? '',
});
