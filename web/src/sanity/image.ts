import { createImageUrlBuilder, type FitMode, type SanityImageSource } from '@sanity/image-url';

import { dataset, hasSanityProject, projectId } from './client';

/**
 * Minimal shape `imageUrl` needs. Compatible with `SanityImage` in `./types` and with the
 * projection `foto{ hotspot, crop, asset->{ _id, url, metadata{ dimensions } } }`.
 */
export type ImageSource = {
  _type?: string;
  hotspot?: { x: number; y: number; width: number; height: number } | null;
  crop?: { top: number; bottom: number; left: number; right: number } | null;
  asset?: {
    _id?: string;
    _ref?: string;
    url?: string | null;
    metadata?: { dimensions?: { width: number; height: number; aspectRatio: number } | null } | null;
  } | null;
};

export type ImageUrlOptions = {
  width?: number;
  height?: number;
  /** Sanity fit mode: clip, crop, fill, fillmax, max, scale, min. */
  fit?: string;
};

// Built from the public project settings, not from the server-only client in `./live`,
// so client components may use this module as well.
const builder = hasSanityProject ? createImageUrlBuilder({ projectId, dataset }) : null;

/**
 * URL for a Sanity image. Real project: the Sanity CDN via `@sanity/image-url` (hotspot and
 * crop applied when both width and height are given). Local dry-run data: the asset
 * document's `url`, which points at `/migration-assets/<file>`; size options are ignored there.
 */
export function imageUrl(
  image: ImageSource | null | undefined,
  opts: ImageUrlOptions = {},
): string | undefined {
  if (!image?.asset) return undefined;

  if (builder) {
    let chain = builder.image(image as SanityImageSource).auto('format');
    if (opts.width) chain = chain.width(Math.round(opts.width));
    if (opts.height) chain = chain.height(Math.round(opts.height));
    if (opts.fit) chain = chain.fit(opts.fit as FitMode);
    return chain.url();
  }

  const url = image.asset.url;
  return typeof url === 'string' && url !== '' ? url : undefined;
}

/** Intrinsic dimensions from the projected asset metadata, if any. */
export function imageDimensions(
  image: ImageSource | null | undefined,
): { width: number; height: number; aspectRatio: number } | undefined {
  const d = image?.asset?.metadata?.dimensions;
  return d && d.width > 0 && d.height > 0 ? d : undefined;
}
