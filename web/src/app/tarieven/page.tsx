import type { Metadata } from 'next';

import { Cta } from '@/components/Cta/Cta';
import { Faq } from '@/components/Faq/Faq';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { Section } from '@/components/Section/Section';
import { pageMetadata } from '@/lib/metadata';
import { getTarieven } from '@/sanity/queries/tarieven';

import './page.css';

export const metadata: Metadata = pageMetadata({
  title: 'Tarieven en vergoedingen',
  description:
    'Tarieven voor psychotherapie, relatietherapie, coaching en supervisie bij Redwoods in Rozendaal, en hoe vergoeding via je zorgverzekeraar werkt.',
  path: '/tarieven/',
});

/** Rates page (Astro `tarieven.astro`); data from the Sanity singleton `tarieven`. */
export default async function TarievenPage() {
  const data = await getTarieven();
  const tarieven = data?.tarieven ?? [];
  const geldigVanaf = data?.geldigVanaf ?? '';
  const noShow = data?.noShow;
  const noShowAlineas = (noShow?.tekst ?? '')
    .split('\n')
    .map((regel) => regel.trim())
    .filter(Boolean);

  const faq = [
    {
      q: 'Wordt therapie vergoed door mijn zorgverzekeraar?',
      a: 'Veel van onze therapieën worden (deels) vergoed vanuit het aanvullende pakket van je zorgverzekering en vallen niet onder het verplichte eigen risico. Vraag je verzekeraar naar de voorwaarden en percentages voor (psychosociale) therapie, ook wel integratieve psychotherapie genoemd. Op de website van [Zorgwijzer](https://www.zorgwijzer.nl/vergoeding/psychosociale-therapie) vind je een overzicht per verzekeraar.',
    },
    {
      q: 'Worden coaching en supervisie vergoed?',
      a: 'Coaching en supervisie worden doorgaans niet vergoed door zorgverzekeraars, maar vaak wel betaald door je werkgever.',
    },
    {
      q: 'Ik ben al cliënt. Gelden deze tarieven ook voor mij?',
      a: `Deze tarieven gelden voor nieuwe cliënten en voor trajecten die starten vanaf ${geldigVanaf}. Ben je al cliënt, dan blijven de eerder afgesproken tarieven voor je lopende traject van kracht, tenzij we samen iets anders afspreken.`,
    },
    {
      q: 'Wat als de kosten een uitdaging zijn?',
      a: 'We denken graag met je mee om samen een passende oplossing te vinden. [Laat het ons weten](/contact/).',
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Tarieven"
        title="Tarieven en vergoedingen"
        intro="De financiële kant van therapie is belangrijk. Hier vind je onze tarieven en hoe eventuele vergoeding via je zorgverzekeraar werkt."
      />
      <Section>
        <div className="rw-tarieven">
          <p className="rw-tarieven__lead">
            Deze tarieven gelden voor nieuwe cliënten en voor trajecten die starten vanaf {geldigVanaf}.
          </p>
          <ul className="rw-tarieven__list">
            {tarieven.map((tarief, index) => (
              <li key={index} className="rw-tarieven__item">
                <div>
                  <p className="rw-tarieven__name">{tarief.naam}</p>
                  <p className="rw-tarieven__info">{tarief.info}</p>
                </div>
                <p className="rw-tarieven__price">
                  <span className="rw-tarieven__amount">{tarief.prijs}</span>
                  {tarief.btw ? <span className="rw-tarieven__btw">{tarief.btw}</span> : null}
                </p>
              </li>
            ))}
          </ul>
          {noShowAlineas.length > 0 ? (
            <div className="rw-tarieven__noshow">
              <h2 className="rw-tarieven__noshow-title">{noShow?.titel}</h2>
              {noShowAlineas.map((alinea, index) => (
                <p key={index} className="rw-tarieven__noshow-text">
                  {alinea}
                </p>
              ))}
              <p className="rw-tarieven__noshow-note">
                Zie ook de{' '}
                <a href="/algemene-voorwaarden/" className="rw-tarieven__link">
                  algemene voorwaarden
                </a>
                .
              </p>
            </div>
          ) : null}
        </div>
      </Section>
      <Section surface="subtle">
        <div className="rw-tarieven">
          <Faq items={faq} title="Vergoeding en voorwaarden" />
        </div>
      </Section>
      <Cta
        title="Vragen over kosten of vergoeding?"
        text="Twijfel je over je situatie, of zijn de kosten een uitdaging? Laat het ons weten. We denken graag met je mee."
        secondary={{ label: 'Onze diensten', href: '/diensten/' }}
      />
    </>
  );
}
