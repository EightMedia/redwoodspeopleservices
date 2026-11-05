/** Site name used by `fetchPage` and GROQ helpers (one site: `siteNames: ['default']`). */
export const siteName = 'default';

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'placeholder';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
export const apiVersion = '2026-10-01';

/**
 * True once a real Sanity project id is configured. Until then every Sanity read
 * must be skipped so `next build` and the static routes work with the placeholder.
 */
export const hasSanityProject = projectId !== '' && projectId !== 'placeholder';
