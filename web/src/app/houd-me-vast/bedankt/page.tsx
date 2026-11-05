import type { Metadata } from 'next';
import { cache } from 'react';

import { Section } from '@/components/Section/Section';
import { pageMetadata } from '@/lib/metadata';
import { euro, getPayment, mollieEnabled, type MolliePayment } from '@/lib/mollie';

import './page.css';

// Rendered on request: shows the payment status when Mollie passes an id.
export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ id?: string | string[] }>;

/** Payment for `?id=tr_…`, or null without Mollie, an invalid id or an API error. */
const loadPayment = cache(async (id: string): Promise<MolliePayment | null> => {
  if (!mollieEnabled() || !/^tr_[A-Za-z0-9]+$/.test(id)) return null;
  try {
    return await getPayment(id);
  } catch {
    return null;
  }
});

function titleFor(payment: MolliePayment | null): string {
  const status = payment?.status;
  if (!payment) return 'Bedankt voor jullie aanmelding';
  if (status === 'paid') return 'Aanbetaling ontvangen, jullie zijn aangemeld';
  if (status === 'pending' || status === 'authorized') return 'Je betaling wordt verwerkt';
  if (status === 'open') return 'De betaling is nog niet afgerond';
  return 'De betaling is niet gelukt';
}

async function idFrom(searchParams: SearchParams): Promise<string> {
  const { id } = await searchParams;
  return (Array.isArray(id) ? id[0] : id) ?? '';
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const payment = await loadPayment(await idFrom(searchParams));
  return pageMetadata({
    title: titleFor(payment),
    description: 'Bevestiging van je aanmelding voor het Houd me Vast relatieweekend.',
    path: '/houd-me-vast/bedankt/',
    noindex: true,
  });
}

export default async function BedanktPage({ searchParams }: { searchParams: SearchParams }) {
  const payment = await loadPayment(await idFrom(searchParams));
  const status = payment?.status;
  const geslaagd = !payment || status === 'paid' || status === 'pending' || status === 'authorized';
  const titel = titleFor(payment);

  return (
    <Section>
      <div className="rw-bedankt">
        <p className="rw-eyebrow">Houd me Vast relatieweekend</p>
        <h1 className="rw-bedankt__title">{titel}</h1>
        {geslaagd ? (
          <p className="rw-bedankt__text">
            {payment?.status === 'paid'
              ? `De aanbetaling van ${euro(payment.amount.value)} is betaald (kenmerk ${payment.id}). Jullie ontvangen een bevestiging per e-mail en we nemen contact op voor het intakegesprek via Zoom.`
              : 'Jullie ontvangen een bevestiging per e-mail zodra alles is verwerkt. We nemen daarna contact op voor het intakegesprek via Zoom.'}
          </p>
        ) : (
          <p className="rw-bedankt__text">
            Er is geen aanbetaling ontvangen, dus de aanmelding is nog niet definitief. Probeer het opnieuw of neem contact met ons op via{' '}
            <a href="mailto:secretariaat@redwoodspeopleservices.nl" className="rw-bedankt__link">
              secretariaat@redwoodspeopleservices.nl
            </a>
            .
          </p>
        )}
        <div className="rw-bedankt__actions">
          {!geslaagd ? (
            <a href="/houd-me-vast/#aanmelden" className="rw-btn--primary">
              Opnieuw aanmelden
            </a>
          ) : null}
          <a href="/" className={geslaagd ? 'rw-btn--primary' : 'rw-btn--secondary'}>
            Naar de homepage
          </a>
        </div>
      </div>
    </Section>
  );
}
