import { imageDimensions, imageUrl, type ImageSource } from '@/sanity/image';

import './SanityImage.css';

export type SanityImageProps = {
  image: ImageSource | null | undefined;
  alt: string;
  /** Rendered width; the height follows the asset's aspect ratio when not given. */
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  /** Above-the-fold image: eager loading with high fetch priority instead of lazy loading. */
  priority?: boolean;
};

/**
 * Plain `<img>` for a Sanity image (project `foto{ hotspot, crop, asset->{ _id, url,
 * metadata{ dimensions } } }`). Real project: Sanity CDN URL at the requested size; local
 * dry run: the file under `/migration-assets/`. Renders nothing without an asset.
 */
export function SanityImage({
  image,
  alt,
  width,
  height,
  sizes,
  className,
  priority = false,
}: SanityImageProps) {
  const dims = imageDimensions(image);

  // Fill in the missing side from the asset's aspect ratio so the box never jumps.
  let w = width;
  let h = height;
  if (dims) {
    const ratio = dims.aspectRatio || dims.width / dims.height;
    if (w && !h) h = Math.round(w / ratio);
    else if (h && !w) w = Math.round(h * ratio);
    else if (!w && !h) {
      w = dims.width;
      h = dims.height;
    }
  }

  const src = imageUrl(image, { width: w, height: h });
  if (!src) return null;

  const classes = className ? `rw-sanity-image ${className}` : 'rw-sanity-image';

  return (
    // eslint-disable-next-line @next/next/no-img-element -- Sanity CDN serves sized images itself
    <img
      src={src}
      alt={alt}
      width={w}
      height={h}
      sizes={sizes}
      className={classes}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
    />
  );
}
