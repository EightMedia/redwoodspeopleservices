import type { Metadata } from 'next';

import { Section } from '@/components/Section/Section';
import { pageMetadata } from '@/lib/metadata';

import './page.css';

export const metadata: Metadata = pageMetadata({
  title: 'Bedankt voor je bericht',
  description: 'We hebben je bericht ontvangen en nemen zo snel mogelijk contact met je op.',
  path: '/contact/bedankt/',
  noindex: true,
});

/** Confirmation after the contact form (Astro `contact/bedankt.astro`). */
export default function ContactBedanktPage() {
  return (
    <Section>
      <div className="rw-thanks">
        <h1 className="rw-thanks__title">Bedankt, je bericht is verstuurd.</h1>
        <p className="rw-thanks__text">We nemen zo snel mogelijk contact met je op, per e-mail of telefoon.</p>
        <a href="/" className="rw-btn--primary rw-thanks__button">
          Terug naar de homepage
        </a>
      </div>
    </Section>
  );
}
