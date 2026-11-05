import type { Metadata } from 'next';

import foto from '@/assets/houd-me-vast.jpg';
import videoPoster from '@/assets/video-PA3rLgrEs_c.jpg';
import { Faq } from '@/components/Faq/Faq';
import { InschrijfForm } from '@/components/InschrijfForm/InschrijfForm';
import { JsonLd } from '@/components/JsonLd';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { SanityImage } from '@/components/SanityImage/SanityImage';
import { Section } from '@/components/Section/Section';
import { YouTube } from '@/components/YouTube/YouTube';
import { pageMetadata } from '@/lib/metadata';
import { getHoudMeVast } from '@/sanity/queries/programmas';
import { getTeamMembersBySlugs } from '@/sanity/queries/team';

import './page.css';

export const metadata: Metadata = pageMetadata({
  title: 'Houd me Vast relatieweekend',
  description:
    'Houd me Vast relatieweekend: in één weekend werken aan een diepere band, op basis van EFT. Kleine groep, ervaren therapeuten, klooster in Denekamp. Data en aanmelden.',
  path: '/houd-me-vast/',
  image: foto,
});

/** Team members who lead the weekend, in the order of the team page (`order`). */
const trainerSlugs = ['cris-van-dusseldorp', 'michelle-van-dusseldorp', 'joost-de-wolf', 'marielle-kattouw', 'joke-francissen'];

const themas = [
  'Liefde en hechting',
  'Omgaan met emoties',
  'Doorbreken van terugkerende patronen',
  'Ruzies stoppen en relaties herstellen',
  'Verbinden door gesprekken',
  'Vergeving en helen van pijnplekken',
  'Intimiteit: liefde en seks',
  'Veiligheid creëren in je relatie',
  'Onderling vertrouwen opbouwen',
];

const faq = [
  {
    q: 'Voor wie is het Houd me Vast relatieweekend?',
    a: "Voor stellen die hun relatie willen versterken, de emotionele band willen verdiepen of de verbinding weer willen opbouwen. Ideaal als eerste stap vóór relatietherapie, als aanvulling op een lopend traject, of als 'APK' voor je relatie. Ook voor jonge stellen die overwegen samen te gaan wonen of te trouwen. Je hoeft niet getrouwd te zijn en deelname staat open voor iedereen, ongeacht religie.",
  },
  {
    q: 'Moet ik persoonlijke dingen delen met de groep?',
    a: 'Nee. Je werkt vooral samen met je partner aan oefeningen, onder begeleiding van een relatietherapeut. Er zijn ontmoetingsmomenten met drie tot vier andere stellen, maar jullie bepalen zelf wat je deelt.',
  },
  {
    q: 'Wat kost het weekend en wat is inbegrepen?',
    a: 'Het weekend kost 1395 euro per stel, met een aanbetaling van 697,50 euro. Dit is inclusief materialen, begeleiding, twee overnachtingen en maaltijden in het Franciscaans Klooster in Denekamp. Het boek Houd me Vast is niet inbegrepen, maar wordt aanbevolen om vooraf te lezen.',
  },
  {
    q: 'Hoe groot is de groep?',
    a: 'We werken met maximaal 14 stellen en vier therapeuten die ook de rol van trainer vervullen, zodat er genoeg tijd is voor persoonlijke aandacht.',
  },
  {
    q: 'Is er ruimte voor rust?',
    a: 'Ja. Naast de oefeningen is er tijd om te ontspannen en van de omgeving te genieten. Bij de accommodatie zijn gratis fietsen beschikbaar.',
  },
  {
    q: 'Hoe zit het met eten en dieetwensen?',
    a: "De kloosterkeuken verzorgt tussen de middag een warme maaltijd en 's avonds een broodmaaltijd. Dieetwensen of allergieën geef je vooraf door via [secretariaat@redwoodspeopleservices.nl](mailto:secretariaat@redwoodspeopleservices.nl) of in het aanmeldformulier.",
  },
  {
    q: 'Kunnen onze kinderen mee?',
    a: 'Nee, kinderen kunnen helaas niet mee naar de locatie. Regel vooraf oppas, zodat jullie je volledig op elkaar kunnen richten.',
  },
  {
    q: 'Is er huiswerk vooraf?',
    a: "Nee, maar we raden aan om samen het boek Houd me Vast van Sue Johnson te lezen, of de christelijke versie Met jou en God verbonden. Tip: maak er een wekelijkse 'date night' van en lees samen een hoofdstuk.",
  },
  {
    q: 'Wat gebeurt er na aanmelding?',
    a: 'We plannen een intakegesprek van ongeveer 30 minuten via Zoom. We bespreken waarom jullie kiezen voor het weekend, jullie interactiepatronen, hoe jullie relatie begon en wat jullie hopen te halen uit het weekend. Bij aanmelding vragen we een aanbetaling van 50%; de rest wordt na de intake gefactureerd.',
  },
  {
    q: 'En na het weekend?',
    a: 'Jullie kunnen de inzichten direct toepassen. Indien gewenst kan het weekend de eerste stap zijn naar EFT-relatietherapie of individuele coaching. We raden aan de vrijdag ervoor rustig aan te doen en de maandag erna vrij te houden.',
  },
];

const eventJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'Houd me Vast relatieweekend',
  description: 'Relatieweekend voor stellen op basis van EFT, begeleid door relatietherapeuten van Redwoods People Services.',
  startDate: '2027-01-22',
  endDate: '2027-01-24',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: {
    '@type': 'Place',
    name: 'Franciscaans Klooster Denekamp',
    address: { '@type': 'PostalAddress', streetAddress: 'Gravenallee 30', postalCode: '7591 PE', addressLocality: 'Denekamp', addressCountry: 'NL' },
  },
  organizer: { '@id': 'https://www.redwoodspeopleservices.nl/#organization' },
  offers: { '@type': 'Offer', price: '1395', priceCurrency: 'EUR', url: 'https://www.redwoodspeopleservices.nl/houd-me-vast/' },
};

export default async function HoudMeVastPage() {
  const [hmv, trainers] = await Promise.all([getHoudMeVast(), getTeamMembersBySlugs(trainerSlugs)]);
  const data = hmv?.data ?? [];
  const prijs = hmv?.prijs ?? '';
  const aanbetaling = hmv?.aanbetaling ?? '';
  // Same order as the team page: by `order`, like `getCollection("team")` sorted in Astro.
  const begeleiders = [...trainers].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <>
      <JsonLd data={eventJsonLd} />
      <PageHeader
        eyebrow="Programma voor stellen"
        title="Houd me Vast relatieweekend"
        intro="Voelt het alsof je elkaar niet meer bereikt, dat de emotionele verbinding ontbreekt en dat jullie vastzitten in dezelfde conflicten? In één weekend werken jullie stap voor stap aan een diepere band en een veiligere relatie."
      >
        <div className="rw-hmv__actions">
          <a href="#aanmelden" className="rw-btn--primary">
            Aanmelden als stel
          </a>
          <a href="#data" className="rw-btn--secondary">
            Bekijk de data
          </a>
          <a href="/downloads/houd-me-vast-factsheet.pdf" className="rw-btn--ghost" download>
            Factsheet downloaden <span className="rw-hmv__filesize">(pdf, 0,7 MB)</span>
          </a>
        </div>
      </PageHeader>

      <Section>
        <div className="rw-hmv__grid rw-hmv__grid--center">
          <div className="rw-prose">
            <h2>Een toegankelijke versie van EFT-relatietherapie</h2>
            <p>
              Het Houd me Vast relatieweekend is speciaal voor stellen die willen werken aan een diepere emotionele band. Je krijgt stap
              voor stap de tools aangereikt om elkaar beter te begrijpen en de verbinding te versterken. Het programma heeft een heldere
              structuur, met het boek <em>Houd me Vast</em>, inspirerende filmpjes en praktische opdrachten.
            </p>
            <p>
              Het is een &apos;lightversie&apos; van EFT-relatietherapie: in korte tijd werken jullie aan de thema&apos;s die normaal in
              zeven sessies aan bod komen. Je hoeft je persoonlijke issues niet met de groep te delen. Je werkt samen met je partner aan
              oefeningen, onder begeleiding van een ervaren relatietherapeut.
            </p>
            <p>
              Samen leer je ruzies te stoppen, emoties op een gezonde manier te delen, en veiligheid en vertrouwen op te bouwen. Het
              weekend biedt direct resultaat.
            </p>
          </div>
          <YouTube id="PA3rLgrEs_c" title="Het Houd me Vast relatieweekend" poster={videoPoster} className="rw-hmv__video" />
        </div>
      </Section>

      <Section surface="loud" id="data">
        <div className="rw-hmv__grid">
          <div>
            <h2 className="rw-hmv__h2">Data en prijs</h2>
            <p className="rw-hmv__lead">Van vrijdagavond tot en met zondagmiddag, in het Franciscaans Klooster in Denekamp.</p>
            <ul className="rw-hmv__dates">
              {data.map((x) => (
                <li key={x.datum} className="rw-hmv__date">
                  <span>{x.datum}</span>
                  {x.vol ? (
                    <span className="rw-hmv__badge rw-hmv__badge--vol">Vol</span>
                  ) : (
                    <span className="rw-hmv__badge rw-hmv__badge--vrij">Plek beschikbaar</span>
                  )}
                </li>
              ))}
            </ul>
            <p className="rw-hmv__price">
              <strong>{prijs} per stel</strong> <span className="rw-hmv__soft">(aanbetaling {aanbetaling})</span>
            </p>
            <p className="rw-hmv__soft rw-hmv__included">Inclusief begeleiding, materialen, twee overnachtingen en maaltijden.</p>
            <a href="/downloads/houd-me-vast-factsheet.pdf" className="rw-btn rw-hmv__factsheet" download>
              Download de factsheet (pdf)
            </a>
          </div>
          <div>
            <h2 className="rw-hmv__h2">De thema&apos;s die we behandelen</h2>
            <ul className="rw-hmv__themes">
              {themas.map((t) => (
                <li key={t} className="rw-hmv__theme">
                  <span className="rw-hmv__dot" aria-hidden="true"></span>
                  {t}
                </li>
              ))}
            </ul>
            <blockquote className="rw-hmv__quote">
              &quot;Dit weekend heeft ons in korte tijd dichter bij elkaar gebracht en ons geholpen onze relatie naar een dieper niveau te
              tillen.&quot;
            </blockquote>
          </div>
        </div>
      </Section>

      <Section>
        <div className="rw-hmv__grid">
          <div className="rw-prose">
            <h2>Wat zijn de effecten?</h2>
            <p>
              Vele duizenden stellen zijn jullie voorgegaan met dit programma. Uit onderzoek blijkt dat de tevredenheid over de relatie
              na afloop werkelijk groter is. Stellen ervaren een sterkere band en hebben minder conflicten. Partners begrijpen zichzelf en
              de ander beter, waardoor er meer ruimte komt voor emoties en meer harmonie in het dagelijks leven.
            </p>
          </div>
          <div>
            <h2 className="rw-hmv__h2 rw-hmv__h2--fixed">Jullie begeleiders</h2>
            <p className="rw-hmv__muted">Alle vijf zijn EFT-advanced relatietherapeut en hebben zelf de Houd me Vast-training gevolgd.</p>
            <ul className="rw-hmv__trainers">
              {begeleiders.map((t) => (
                <li key={t.slug}>
                  <a href={`/team/${t.slug}/`} className="rw-hmv__trainer">
                    <SanityImage image={t.photo} alt={t.name} width={96} height={96} className="rw-hmv__trainer-photo" />
                    <span className="rw-hmv__trainer-name">{t.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section surface="subtle">
        <div className="rw-hmv__faq">
          <Faq items={faq} title="Alles wat je wilt weten over het weekend" />
        </div>
      </Section>

      <Section id="aanmelden">
        <div className="rw-hmv__grid">
          <div>
            <h2 className="rw-hmv__h2">Als stel aanmelden</h2>
            <p className="rw-measure rw-hmv__muted rw-hmv__muted--4">
              Schrijf je op tijd in, want we hebben een beperkt aantal plekken. Is het gewenste weekend vol, dan plaatsen we je op de
              wachtlijst of kun je je aanmelden voor het volgende weekend. Kies het weekend van jullie voorkeur en vul de namen van jullie
              beiden in.
            </p>
            <p className="rw-measure rw-hmv__muted rw-hmv__muted--4">
              Bij aanmelding vragen we een aanbetaling van {aanbetaling}. Daarna nemen we contact op voor een intakegesprek via Zoom; het
              restant factureren we na dat gesprek. De{' '}
              <a href="/algemene-voorwaarden/" className="rw-hmv__link rw-hmv__link--medium">
                algemene en annuleringsvoorwaarden
              </a>{' '}
              zijn van toepassing.
            </p>
            <p className="rw-hmv__muted rw-hmv__muted--6">
              Vragen? Mail{' '}
              <a href="mailto:secretariaat@redwoodspeopleservices.nl" className="rw-hmv__link">
                secretariaat@redwoodspeopleservices.nl
              </a>{' '}
              of bel{' '}
              <a href="tel:+31624913779" className="rw-hmv__link">
                +31 6 24913779
              </a>
              .
            </p>
          </div>
          <InschrijfForm weekends={data} aanbetaling={aanbetaling} />
        </div>
      </Section>
    </>
  );
}
