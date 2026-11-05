import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ContactForm } from '@/components/ContactForm/ContactForm';
import { Faq } from '@/components/Faq/Faq';
import { JsonLd } from '@/components/JsonLd';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { Prose } from '@/components/Prose/Prose';
import { Section } from '@/components/Section/Section';
import { site } from '@/data/site';
import { pageMetadata } from '@/lib/metadata';
import { absoluteUrl } from '@/lib/siteUrl';
import { hasSanityProject } from '@/sanity/client';
import { getDienst, getDiensten } from '@/sanity/queries/diensten';

import './page.css';

type Params = Promise<{ slug: string }>;

/** Links to the place pages per service (Astro `diensten/[id].astro`). */
const plaatsen: Record<string, { label: string; href: string }[]> = {
  relatietherapie: [
    { label: 'Relatietherapie in Arnhem', href: '/relatietherapie-arnhem/' },
    { label: 'Relatietherapie in Velp', href: '/relatietherapie-velp/' },
  ],
  psychotherapie: [
    { label: 'Psychotherapie in Arnhem', href: '/psychotherapie-arnhem/' },
    { label: 'Therapie in Rheden en Rozendaal', href: '/therapie-rheden-rozendaal/' },
  ],
};

export async function generateStaticParams() {
  if (!hasSanityProject) return [];
  const diensten = await getDiensten();
  return diensten.map((dienst) => ({ slug: dienst.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const dienst = await getDienst(slug);
  if (!dienst) return {};
  return pageMetadata({
    title: `${dienst.title} in Rozendaal bij Arnhem`,
    description: dienst.description,
    path: `/diensten/${dienst.slug}/`,
  });
}

/** Service detail page (Astro `diensten/[id].astro`). */
export default async function DienstPage({ params }: { params: Params }) {
  const { slug } = await params;
  const [dienst, alle] = await Promise.all([getDienst(slug), getDiensten()]);
  if (!dienst) notFound();

  const others = alle.filter((other) => other.slug !== dienst.slug);
  const shortName = dienst.title.toLowerCase().replace(' (eft)', '');
  const plaatsLinks = plaatsen[dienst.slug] ?? [];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: dienst.title,
    description: dienst.description,
    provider: { '@id': `${site.url}/#organization` },
    areaServed: ['Rozendaal', 'Arnhem', 'Velp', 'Rheden', 'Gelderland'],
    url: absoluteUrl(`/diensten/${dienst.slug}/`),
  };

  return (
    <>
      <PageHeader eyebrow="Diensten" title={dienst.title} intro={dienst.intro} />
      <Section>
        <div className="rw-dienst-grid">
          <Prose value={dienst.body} />
          <aside className="rw-dienst-aside">
            <div className="rw-dienst-box rw-dienst-box--tint">
              <p className="rw-dienst-box__title rw-dienst-box__title--large">Een eerste stap zetten?</p>
              <p className="rw-dienst-box__text">
                Bel of mail ons, of laat je gegevens achter. Edwin, onze praktijkcoördinator, neemt contact met je op.
              </p>
              <a href="/contact/" className="rw-btn--primary rw-btn--block rw-dienst-box__button">
                Neem contact op
              </a>
              <a href="/tarieven/" className="rw-btn--ghost rw-btn--block rw-dienst-box__button--ghost">
                Tarieven en vergoeding
              </a>
            </div>
            {plaatsLinks.length > 0 ? (
              <div className="rw-dienst-box rw-dienst-box--outline">
                <p className="rw-dienst-box__title">Bij jou in de buurt</p>
                <ul className="rw-dienst-box__list">
                  {plaatsLinks.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} className="rw-dienst-box__link">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="rw-dienst-box rw-dienst-box--outline">
              <p className="rw-dienst-box__title">Andere diensten</p>
              <ul className="rw-dienst-box__list">
                {others.map((other) => (
                  <li key={other.slug}>
                    <a href={`/diensten/${other.slug}/`} className="rw-dienst-box__link">
                      {other.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Section>
      {dienst.faq.length > 0 ? (
        <Section surface="subtle">
          <div className="rw-dienst-faq">
            <Faq items={dienst.faq} />
          </div>
        </Section>
      ) : null}
      <Section>
        <div className="rw-dienst-ask">
          <div>
            <h2 className="rw-dienst-ask__title">Stel je vraag over {shortName}</h2>
            <p className="rw-measure rw-dienst-ask__text">
              Twijfel je of dit bij je past, of wil je weten of er plek is? Laat je vraag achter en we nemen contact
              met je op.
            </p>
          </div>
          <ContactForm subject={`Vraag over ${dienst.title}`} />
        </div>
      </Section>
      <JsonLd data={jsonLd} />
    </>
  );
}
