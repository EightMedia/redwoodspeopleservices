'use client';

import { useEffect, useRef, useState } from 'react';

import './YouTube.css';

export type VideoBackgroundProps = {
  /** YouTube video id, played muted in a loop behind the section content. */
  id: string;
  title: string;
};

/**
 * Muted, looping YouTube background video (home page). Loads once the section comes
 * near the viewport and never with a "reduced motion" preference, like the Astro script.
 */
export function VideoBackground({ id, title }: VideoBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const box = ref.current;
    if (!box || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const start = () => setLoad(true);
    if (!('IntersectionObserver' in window)) {
      const timer = setTimeout(start, 0);
      return () => clearTimeout(timer);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          io.disconnect();
          start();
        }
      },
      { rootMargin: '400px' },
    );
    io.observe(box);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="rw-video-bg">
      {load ? (
        <iframe
          className="rw-video-bg__frame"
          data-visible={visible ? '' : undefined}
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&playsinline=1&rel=0&modestbranding=1&disablekb=1&iv_load_policy=3`}
          title={title}
          aria-hidden="true"
          tabIndex={-1}
          allow="autoplay; encrypted-media"
          onLoad={() => setTimeout(() => setVisible(true), 800)}
        />
      ) : null}
    </div>
  );
}
