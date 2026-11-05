import type { Metadata } from 'next';
import Image from 'next/image';

import pand from '@/assets/pand-rosendaalselaan.jpg';
import { ContactForm } from '@/components/ContactForm/ContactForm';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { Section } from '@/components/Section/Section';
import { site } from '@/data/site';
import { pageMetadata } from '@/lib/metadata';

import './page.css';

export const metadata: Metadata = pageMetadata({
  title: 'Contact en route',
  description:
    'Neem contact op met Redwoods People Services in Rozendaal: telefoon, e-mail, contactformulier en routebeschrijving vanaf Arnhem en Velp.',
  path: '/contact/',
});

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** Contact page (Astro `contact/index.astro`). `?fout` shows the no-JavaScript failure notice. */
export default async function ContactPage({ searchParams }: { searchParams: SearchParams }) {
  const fout = 'fout' in (await searchParams);

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Neem contact op"
        intro="Heb je een vraag of wil je een afspraak maken? Bel, mail of laat je gegevens achter. Onze praktijkcoördinator Edwin neemt contact met je op."
      />
      <Section>
        <div className="rw-contact-grid">
          <div className="rw-contact-info">
            <div>
              <h2 className="rw-contact-h2">Bereikbaarheid</h2>
              <p className="rw-contact-text">
                Edwin is op maandag, woensdag en donderdag tussen 09:00 en 13:00 uur aanwezig. In die uren beantwoordt
                hij de telefoon, e-mails en berichten via het contactformulier.
              </p>
              <ul className="rw-contact-links">
                <li>
                  <a href={`tel:${site.phoneHref}`} className="rw-contact-link">
                    {site.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${site.email}`} className="rw-contact-link">
                    {site.email}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="rw-contact-h2">Adres</h2>
              <address className="rw-contact-address">
                {site.address.street}
                <br />
                {site.address.postalCode} {site.address.city}
              </address>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=Rosendaalselaan+30,+6891+DG+Rozendaal"
                rel="noopener"
                target="_blank"
                className="rw-btn--secondary rw-contact-route"
              >
                Routebeschrijving in Google Maps
              </a>
            </div>
            <Image
              src={pand}
              alt="Het witte monumentale pand van Redwoods aan de Rosendaalselaan"
              width={900}
              height={600}
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="rw-contact-image"
            />
          </div>
          <div className="rw-contact-card">
            <h2 className="rw-contact-h2">Contactformulier</h2>
            <p className="rw-contact-card__text">We nemen zo snel mogelijk contact met je op, per e-mail of telefoon.</p>
            {fout ? (
              <p className="rw-contact-error">
                Versturen is niet gelukt. Probeer het opnieuw of mail ons rechtstreeks.
              </p>
            ) : null}
            <div className="rw-contact-card__form">
              <ContactForm />
            </div>
          </div>
        </div>
      </Section>
      <Section surface="subtle">
        <div className="rw-contact-route-grid">
          <div className="rw-prose">
            <h2>Met het openbaar vervoer</h2>
            <p>
              <strong>Vanaf Arnhem Centraal:</strong> neem bus 8 (15 minuten). Stap uit op de Ringallee, vlak voor de
              rotonde met de Rosendaalselaan. Ga bij de rotonde linksaf; ons pand is na zo&apos;n twee minuten lopen
              aan je linkerhand.
            </p>
            <p>
              <strong>Vanaf station Velp:</strong> loop vanaf het stationsplein de Havelaarstraat helemaal uit, ga bij
              de T-splitsing links naar de bushalte en neem bus 8 richting Rozendaal (4 minuten). Stap uit op de
              Ringallee en ga bij de rotonde rechtsaf. Je kunt vanaf station Velp ook in ongeveer twintig minuten naar
              ons lopen.
            </p>
          </div>
          <div className="rw-prose">
            <h2>Met de auto</h2>
            <p>
              Rozendaal ligt direct ten noordoosten van Arnhem, aan de rand van de Veluwezoom. Vanaf de A12 neem je
              afslag Arnhem-Noord/Velp (afrit 27) en volg je de borden Rozendaal. Parkeren kan bij het pand.
            </p>
            <h2>Privacy</h2>
            <p>
              Je gegevens gebruiken we alleen om contact met je op te nemen. Als je vraag is beantwoord, bewaren we je
              naam, telefoonnummer en e-mailadres niet. Lees ons <a href="/privacybeleid/">privacyverklaring</a>.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
