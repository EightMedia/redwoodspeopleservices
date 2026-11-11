'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

type TurnstileApi = {
  render: (el: HTMLElement, options: { sitekey: string; language?: string }) => string;
  remove: (widgetId: string) => void;
};

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/**
 * Cloudflare Turnstile widget (spam check, Astro `Turnstile.astro`). Renders only when
 * NEXT_PUBLIC_TURNSTILE_SITE_KEY is set. Belongs inside a <form>; the widget itself adds
 * the hidden field `cf-turnstile-response`.
 * Rendered explicitly from an effect instead of Cloudflare's automatic rendering, so the
 * widget never lands in the markup before React has hydrated it.
 */
export function Turnstile() {
  const ref = useRef<HTMLDivElement>(null);
  const [scriptKlaar, setScriptKlaar] = useState(false);

  useEffect(() => {
    const ts = (window as unknown as { turnstile?: TurnstileApi }).turnstile;
    if (!scriptKlaar || !siteKey || !ref.current || !ts) return;
    const widgetId = ts.render(ref.current, { sitekey: siteKey, language: 'nl' });
    return () => {
      try {
        ts.remove(widgetId);
      } catch {
        /* widget already gone */
      }
    };
  }, [scriptKlaar]);

  if (!siteKey) return null;

  return (
    <>
      <div ref={ref} className="cf-turnstile" />
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setScriptKlaar(true)}
      />
    </>
  );
}
