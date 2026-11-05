import type { Metadata } from 'next';

import { ContactForm } from '@/components/ContactForm/ContactForm';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { SanityImage } from '@/components/SanityImage/SanityImage';
import { Section } from '@/components/Section/Section';
import { pageMetadata } from '@/lib/metadata';
import { getRouwEnVerlies } from '@/sanity/queries/programmas';
import { getTeamMembersBySlugs } from '@/sanity/queries/team';

import './page.css';

export const metadata: Metadata = pageMetadata({
  title: 'Rouwgroep Rouw en Verlies in Rozendaal bij Arnhem',
  description:
    'Rouw en Verlies: therapeutisch begeleide groep voor wie een dierbare heeft verloren. Vijf bijeenkomsten in Rozendaal bij Arnhem, begeleid door ervaren therapeuten.',
  path: '/rouw-en-verlies/',
});

/** The two therapists who lead the group, shown in team order (`order`). */
const begeleiderSlugs = ['marielle-kattouw', 'joke-francissen'];

export default async function RouwEnVerliesPage() {
  const [vmv, leden] = await Promise.all([getRouwEnVerlies(), getTeamMembersBySlugs(begeleiderSlugs)]);
  const begeleiders = [...leden].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <>
      <PageHeader
        eyebrow="Groepstraject omgaan met verlies"
        title="Rouw en Verlies"
        intro="Voelt het alsof je na een verlies bent vastgelopen en het moeilijk is om weer ruimte te voelen voor jezelf en het leven? In deze groep ontmoet je anderen die ook met verlies leven."
      >
        <div className="rw-rouw__actions">
          <a href="#aanmelden" className="rw-btn--primary">
            Aanmelden als geïnteresseerde
          </a>
        </div>
      </PageHeader>

      <Section>
        <div className="rw-rouw__grid">
          <div className="rw-prose">
            <h2>Opnieuw je evenwicht vinden</h2>
            <p>
              Als rouw en verlies je leven raken, doet dat pijn. Pijn waar we soms moeilijk mee om weten te gaan. Het is meer dan
              verdriet: het raakt ons in de kern van ons bestaan. Niets is meer vanzelfsprekend. De wereld om je heen gaat gewoon door, en
              toch is alles veranderd.
            </p>
            <p>
              In de groep Rouw en Verlies ontmoet je anderen die eveneens met verlies leven. In een veilige en respectvolle omgeving is er
              ruimte voor jouw verhaal, emoties en vragen. Je hoeft niets te delen wat je niet wilt; luisteren mag ook.
            </p>
            <p>
              Samen staan we stil bij wat verlies met je doet en zoeken we naar manieren om verder te leven met wat er is gebeurd. Er is
              aandacht voor herkenning, verbinding en het hervinden van veerkracht.
            </p>
            <blockquote>Rouw en verlies horen bij het leven, maar de weg erdoorheen is voor iedereen anders.</blockquote>
          </div>
          <div className="rw-rouw__aside">
            <div className="rw-rouw__card rw-rouw__card--tint">
              <h2 className="rw-rouw__card-title">Praktische informatie</h2>
              <dl className="rw-rouw__dl">
                <div>
                  <dt className="rw-rouw__dt">Wanneer</dt>
                  <dd className="rw-rouw__dd">{vmv?.wanneer}</dd>
                </div>
                <div>
                  <dt className="rw-rouw__dt">Omvang</dt>
                  <dd className="rw-rouw__dd">{vmv?.omvang}</dd>
                </div>
                <div>
                  <dt className="rw-rouw__dt">Waar</dt>
                  <dd className="rw-rouw__dd">Rosendaalselaan 30, Rozendaal</dd>
                </div>
                <div>
                  <dt className="rw-rouw__dt">Prijs</dt>
                  <dd className="rw-rouw__dd">
                    {vmv?.prijs} inclusief {vmv?.inclusief}
                  </dd>
                </div>
              </dl>
            </div>
            <div className="rw-rouw__card rw-rouw__card--line">
              <h2 className="rw-rouw__card-title">Waar we samen bij stilstaan</h2>
              <ol className="rw-rouw__steps">
                <li>De werkelijkheid van het verlies onder ogen zien</li>
                <li>De pijn van het verlies ervaren</li>
                <li>Je aanpassen aan de nieuwe werkelijkheid</li>
                <li>Opnieuw leren genieten en de herinneringen bewaren</li>
              </ol>
            </div>
          </div>
        </div>
      </Section>

      <Section surface="subtle">
        <div className="rw-rouw__grid">
          <div className="rw-prose">
            <h2>Voor wie is deze groep?</h2>
            <p>
              Rouw en Verlies is een professioneel therapeutisch begeleid groepstraject voor mensen die een dierbare door overlijden hebben
              verloren.
            </p>
            <p>
              Naast herkenning en ontmoeting bieden we een veilige, gestructureerde omgeving waarin je niet alleen steun ervaart, maar ook
              actief werkt aan het doorvoelen van je verlies en het hervinden van balans. We gebruiken bewezen effectieve methoden en
              modellen uit de rouwbegeleiding. Je krijgt inzicht in wat rouw met je doet, praktische handvatten en oefeningen die je
              ondersteunen bij het leren leven met verlies.
            </p>
          </div>
          <div>
            <h2 className="rw-rouw__h2 rw-rouw__h2--fixed">Jullie begeleiders</h2>
            <p className="rw-rouw__muted">
              Joke en Mariëlle zijn beiden ervaren integratief therapeut. Vanuit hun professionele expertise én hun eigen ervaring met
              verlies begeleiden zij deelnemers met zorg, aandacht en respect voor ieders proces.
            </p>
            <ul className="rw-rouw__team">
              {begeleiders.map((t) => (
                <li key={t.slug}>
                  <a href={`/team/${t.slug}/`} className="rw-rouw__member">
                    <SanityImage image={t.photo} alt={t.name} width={400} height={400} className="rw-rouw__member-photo" />
                    <span className="rw-rouw__member-name">{t.name}</span>
                    <span className="rw-rouw__member-role">{t.role}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section id="aanmelden">
        <div className="rw-rouw__grid">
          <div>
            <h2 className="rw-rouw__h2">Aanmelden als geïnteresseerde</h2>
            <p className="rw-measure rw-rouw__muted rw-rouw__muted--4">
              Meld je alvast aan, want we werken met een beperkt aantal plekken. Zodra de nieuwe data bekend zijn, openen we de
              inschrijving en nemen we contact met je op. Bij definitieve inschrijving zijn de{' '}
              <a href="/algemene-voorwaarden/" className="rw-rouw__link">
                algemene en annuleringsvoorwaarden
              </a>{' '}
              van toepassing.
            </p>
            <p className="rw-measure rw-rouw__muted rw-rouw__muted--4">
              Heb je vragen of wil je weten of deze groep bij je past? Stel ze gerust in je bericht.
            </p>
          </div>
          <ContactForm
            subject="Interesse in groep Rouw en Verlies"
            buttonLabel="Aanmelden"
            questionLabel="Je bericht"
            questionPlaceholder="Vertel kort waarom je interesse hebt, of stel je vraag."
          />
        </div>
      </Section>
    </>
  );
}
