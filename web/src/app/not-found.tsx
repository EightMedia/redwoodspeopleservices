import type { Metadata } from 'next';
import { Container, Section } from '@eightmedia/kikker-react';

import { fullTitle } from '@/lib/metadata';

export const metadata: Metadata = {
  title: { absolute: fullTitle('Pagina niet gevonden') },
  description: 'Deze pagina bestaat niet (meer).',
  // Next adds `noindex` to not-found pages itself.
};

/** 404 page, text as on the Astro site (`src/pages/404.astro`). */
export default function NotFound() {
  return (
    <Section surface="default">
      <Container>
        <div className="rw-not-found">
          <p className="rw-eyebrow">404</p>
          <h1 className="rw-not-found__title">Deze pagina bestaat niet (meer)</h1>
          <p className="rw-not-found__text">
            Misschien is de pagina verplaatst. Kijk bij onze diensten of neem contact op.
          </p>
          <div className="rw-not-found__actions">
            <a href="/" className="rw-btn--primary">
              Naar de homepage
            </a>
            <a href="/contact/" className="rw-btn--secondary">
              Contact
            </a>
          </div>
        </div>
      </Container>
    </Section>
  );
}
