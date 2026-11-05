import type { Metadata } from 'next';

import { Cta } from '@/components/Cta/Cta';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { Section } from '@/components/Section/Section';
import { pageMetadata } from '@/lib/metadata';
import { getDiensten } from '@/sanity/queries/diensten';

import './page.css';

export const metadata: Metadata = pageMetadata({
  title: 'Diensten',
  description:
    'Psychotherapie, EFT-relatietherapie, coaching en supervisie bij Redwoods People Services in Rozendaal, bij Arnhem en Velp.',
  path: '/diensten/',
});

/** Services overview (Astro `diensten/index.astro`). */
export default async function DienstenPage() {
  const diensten = await getDiensten();

  return (
    <>
      <PageHeader
        eyebrow="Diensten"
        title="Therapie, coaching en supervisie op maat"
        intro="Of je nu zoekt naar persoonlijke groei, hulp in je relatie of professionele begeleiding: we kijken samen welke aanpak bij je past."
      />
      <Section>
        <div className="rw-diensten-grid">
          {diensten.map((dienst) => (
            <a key={dienst.slug} href={`/diensten/${dienst.slug}/`} className="rw-diensten-card">
              <h2 className="rw-diensten-card__title">{dienst.title}</h2>
              <p className="rw-diensten-card__intro">{dienst.intro}</p>
              <span className="rw-diensten-card__more">
                Lees meer <span aria-hidden="true">→</span>
              </span>
            </a>
          ))}
        </div>
        <div className="rw-diensten-groups">
          <h2 className="rw-diensten-groups__title">Programma&apos;s in groepsverband</h2>
          <p className="rw-measure rw-diensten-groups__text">
            Naast individuele trajecten bieden we het{' '}
            <a href="/houd-me-vast/" className="rw-diensten-link">
              Houd me Vast relatieweekend
            </a>
            , de rouwgroep{' '}
            <a href="/rouw-en-verlies/" className="rw-diensten-link">
              Rouw en Verlies
            </a>{' '}
            en via{' '}
            <a href="/greenwoods/" className="rw-diensten-link">
              Greenwoods
            </a>{' '}
            spiritual direction en retraites.
          </p>
        </div>
      </Section>
      <Cta />
    </>
  );
}
