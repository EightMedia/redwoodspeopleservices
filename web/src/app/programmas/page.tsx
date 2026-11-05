import type { Metadata } from 'next';

import { PageHeader } from '@/components/PageHeader/PageHeader';
import { Section } from '@/components/Section/Section';
import { pageMetadata } from '@/lib/metadata';

import './page.css';

export const metadata: Metadata = pageMetadata({
  title: "Programma's",
  description:
    "Groepsprogramma's van Redwoods: het Houd me Vast relatieweekend, de rouwgroep Rouw en Verlies en de retraites en spiritual direction van Greenwoods.",
  path: '/programmas/',
});

const items = [
  {
    title: 'Houd me Vast relatieweekend',
    text: 'In één weekend werken aan een diepere emotionele band, op basis van EFT. Kleine groep, ervaren relatietherapeuten, klooster in Denekamp.',
    href: '/houd-me-vast/',
  },
  {
    title: 'Rouw en Verlies',
    text: 'Therapeutisch begeleide groep voor mensen die een dierbare hebben verloren. Vijf bijeenkomsten in Rozendaal.',
    href: '/rouw-en-verlies/',
  },
  {
    title: 'Greenwoods',
    text: 'Spiritual direction, retraites in de natuur en leiderschapsontwikkeling. Leven vanuit de diepte.',
    href: '/greenwoods/',
  },
];

/** Programmes overview (Astro `programmas.astro`). */
export default function ProgrammasPage() {
  return (
    <>
      <PageHeader
        eyebrow="Programma's"
        title="Samen op weg, in een groep"
        intro="Naast individuele trajecten bieden we programma's waarin je met anderen aan de slag gaat."
      />
      <Section>
        <div className="rw-programmas-grid">
          {items.map((item) => (
            <a key={item.href} href={item.href} className="rw-programmas-card">
              <h2 className="rw-programmas-card__title">{item.title}</h2>
              <p className="rw-programmas-card__text">{item.text}</p>
              <span className="rw-programmas-card__more">Lees meer →</span>
            </a>
          ))}
        </div>
      </Section>
    </>
  );
}
