'use client';

import { useState } from 'react';
import Image, { type StaticImageData } from 'next/image';

import './YouTube.css';

export type YouTubeProps = {
  /** YouTube video id. */
  id: string;
  title: string;
  /** Local poster image (static import) or an image URL. */
  poster: StaticImageData | string;
  className?: string;
};

/**
 * Privacy-friendly YouTube embed (Astro `YouTube.astro`): shows a local poster and only
 * loads the player (youtube-nocookie.com) after the visitor presses play.
 */
export function YouTube({ id, title, poster, className }: YouTubeProps) {
  const [playing, setPlaying] = useState(false);
  const classes = ['rw-youtube', className].filter(Boolean).join(' ');

  if (playing) {
    return (
      <div className={classes}>
        <iframe
          className="rw-youtube__player"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className={classes}>
      <Image src={poster} alt="" width={1280} height={720} className="rw-youtube__poster" />
      <button
        type="button"
        className="rw-youtube__play"
        aria-label={`Video afspelen: ${title}`}
        onClick={() => setPlaying(true)}
      >
        <span className="rw-youtube__play-circle">
          <svg className="rw-youtube__play-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5.14v13.72c0 .79.87 1.27 1.54.84l10.3-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
          </svg>
        </span>
      </button>
      <p className="rw-youtube__caption">{title} · speelt af via YouTube</p>
    </div>
  );
}
