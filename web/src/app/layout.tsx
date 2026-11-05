import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { VisualEditing } from 'next-sanity/visual-editing';

import { JsonLd } from '@/components/JsonLd';
import { SiteFooter } from '@/components/SiteFooter/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader/SiteHeader';
import { site } from '@/data/site';
import { organizationJsonLd } from '@/lib/jsonld';
import { defaultOgImageUrl } from '@/lib/metadata';
import { siteUrl } from '@/lib/siteUrl';
import { hasSanityProject } from '@/sanity/client';
import { isDraftMode, SanityLive } from '@/sanity/live';

import { roboto, robotoSlab } from './fonts';

import '@eightmedia/kikker-tokens/css/reset.css';
import '@eightmedia/kikker-tokens/css/tokens.css';
import '@eightmedia/kikker-tokens/css/theme-default.css';
import '@eightmedia/kikker-tokens/css/surfaces.css';
import '@eightmedia/kikker-tokens/css/base.css';
import '@eightmedia/kikker-react/styles.css';
import './theme.css';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { absolute: site.name },
  description: site.description,
  icons: {
    icon: [{ url: '/favicon.png', type: 'image/png' }],
    apple: [{ url: '/apple-touch-icon.png' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#e75c50',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const draft = hasSanityProject && (await isDraftMode());

  return (
    <html lang="nl" className={`${roboto.variable} ${robotoSlab.variable}`}>
      <body>
        <a href="#main" className="rw-skip-link">
          Naar de inhoud
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <JsonLd data={organizationJsonLd(defaultOgImageUrl())} />
        {hasSanityProject ? <SanityLive includeDrafts={draft} /> : null}
        {draft ? <VisualEditing /> : null}
        <SpeedInsights />
      </body>
    </html>
  );
}
