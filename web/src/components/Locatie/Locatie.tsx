import { ContactForm } from '@/components/ContactForm/ContactForm';
import { Faq } from '@/components/Faq/Faq';
import { JsonLd } from '@/components/JsonLd';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { Section } from '@/components/Section/Section';
import { TeamCard } from '@/components/TeamCard/TeamCard';
import { site } from '@/data/site';
import { absoluteUrl } from '@/lib/siteUrl';
import { getTeamMembersBySlugs } from '@/sanity/queries/team';

import './Locatie.css';

export type LocatieProps = {
  /** Site path of the page, e.g. `/relatietherapie-arnhem/` (Service JSON-LD url). */
  path: string;
  eyebrow: string;
  title: string;
  intro: string;
  /** Text blocks: heading + paragraphs. Paragraphs may contain HTML (links). */
  blokken: { kop: string; alineas: string[] }[];
  route: { kop: string; items: string[] };
  faq: { q: string; a: string }[];
  /** Team member slugs shown on this page, in this order. */
  teamIds: string[];
  teamKop: string;
  dienst: { label: string; href: string };
  verwant: { label: string; href: string }[];
  formulierOnderwerp: string;
  service: { name: string; description: string; plaatsen: string[] };
};

/**
 * Place page: one service for one town or region (e.g. Relatietherapie Arnhem), from
 * Astro `Locatie.astro`. Each page brings its own text; the structure and sidebar are shared.
 * Title and description go through `pageMetadata` in the route file.
 */
export async function Locatie(p: LocatieProps) {
  const team = await getTeamMembersBySlugs(p.teamIds);
  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: p.service.name,
    description: p.service.description,
    serviceType: p.service.name,
    provider: { '@id': `${site.url}/#organization` },
    areaServed: p.service.plaatsen.map((naam) => ({ '@type': 'City', name: naam })),
    url: absoluteUrl(p.path),
  };

  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <PageHeader eyebrow={p.eyebrow} title={p.title} intro={p.intro} />
      <Section>
        <div className="rw-locatie__layout">
          <div className="rw-prose">
            {p.blokken.map((b) => (
              <div key={b.kop} className="rw-locatie__block">
                <h2>{b.kop}</h2>
                {b.alineas.map((a) => (
                  <p key={a} dangerouslySetInnerHTML={{ __html: a }} />
                ))}
              </div>
            ))}
            <h2>{p.route.kop}</h2>
            <ul>
              {p.route.items.map((i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: i }} />
              ))}
            </ul>
          </div>
          <aside className="rw-locatie__aside">
            <div className="rw-locatie__card rw-locatie__card--tint">
              <p className="rw-locatie__card-title rw-locatie__card-title--xl">Een eerste stap zetten?</p>
              <p className="rw-locatie__card-text">
                Bel of mail ons, of laat je gegevens achter. Edwin, onze praktijkcoördinator, neemt contact met je op.
              </p>
              <a href="/contact/" className="rw-btn--primary rw-btn--block rw-locatie__card-btn">
                Neem contact op
              </a>
              <a href="/tarieven/" className="rw-btn--ghost rw-btn--block rw-locatie__card-btn rw-locatie__card-btn--ghost">
                Tarieven en vergoeding
              </a>
            </div>
            <div className="rw-locatie__card rw-locatie__card--line">
              <p className="rw-locatie__card-title">Praktijk</p>
              <address className="rw-locatie__address">
                {site.name}
                <br />
                {site.address.street}
                <br />
                {site.address.postalCode} {site.address.city}
                <br />
                <a href={`tel:${site.phoneHref}`} className="rw-locatie__link">
                  {site.phone}
                </a>
              </address>
            </div>
            <div className="rw-locatie__card rw-locatie__card--line">
              <p className="rw-locatie__card-title">Lees ook</p>
              <ul className="rw-locatie__links">
                <li>
                  <a href={p.dienst.href} className="rw-locatie__link">
                    {p.dienst.label}
                  </a>
                </li>
                {p.verwant.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="rw-locatie__link">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Section>
      {team.length > 0 ? (
        <Section surface="subtle">
          <h2 className="rw-locatie__h2">{p.teamKop}</h2>
          <div className="rw-locatie__team">
            {team.map((m) => (
              <TeamCard key={m.slug} member={m} compact />
            ))}
          </div>
          <p className="rw-locatie__team-more">
            <a href="/team/" className="rw-locatie__link rw-locatie__link--medium">
              Bekijk het hele team →
            </a>
          </p>
        </Section>
      ) : null}
      <Section>
        <div className="rw-locatie__faq">
          <Faq items={p.faq} />
        </div>
      </Section>
      <Section surface="loud-alt">
        <div className="rw-locatie__contact">
          <div>
            <h2 className="rw-locatie__h2">Stel je vraag</h2>
            <p className="rw-measure rw-locatie__contact-text">
              Twijfel je of dit bij je past, of wil je weten of er plek is? Laat je vraag achter en we nemen contact met je op.
            </p>
          </div>
          <ContactForm subject={p.formulierOnderwerp} />
        </div>
      </Section>
    </>
  );
}
