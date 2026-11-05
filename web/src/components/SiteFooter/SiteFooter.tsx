import { site } from '@/data/site';

import './SiteFooter.css';

const columns = [
  {
    title: 'Diensten',
    links: [
      { label: 'Psychotherapie', href: '/diensten/psychotherapie/' },
      { label: 'Relatietherapie (EFT)', href: '/diensten/relatietherapie/' },
      { label: 'Coaching', href: '/diensten/coaching/' },
      { label: 'Supervisie', href: '/diensten/supervisie/' },
      { label: 'Tarieven', href: '/tarieven/' },
    ],
  },
  {
    title: "Programma's",
    links: [
      { label: 'Houd me Vast relatieweekend', href: '/houd-me-vast/' },
      { label: 'Rouw en Verlies', href: '/rouw-en-verlies/' },
      { label: 'Greenwoods', href: '/greenwoods/' },
    ],
  },
  {
    title: 'Werkgebied',
    links: [
      { label: 'Relatietherapie Arnhem', href: '/relatietherapie-arnhem/' },
      { label: 'Relatietherapie Velp', href: '/relatietherapie-velp/' },
      { label: 'Psychotherapie Arnhem', href: '/psychotherapie-arnhem/' },
      { label: 'Therapie Rheden en Rozendaal', href: '/therapie-rheden-rozendaal/' },
    ],
  },
  {
    title: 'Over Redwoods',
    links: [
      { label: 'Ons team', href: '/team/' },
      { label: 'Over ons', href: '/over-ons/' },
      { label: 'Blog', href: '/blog/' },
      { label: 'Contact en route', href: '/contact/' },
    ],
  },
];

const socials = [
  { label: 'LinkedIn', href: site.socials.linkedin },
  { label: 'Instagram', href: site.socials.instagram },
  { label: 'Facebook', href: site.socials.facebook },
  { label: 'YouTube', href: site.socials.youtube },
];

/** Site footer (Astro `Footer.astro`): practice details, link columns, legal links, socials. */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="rw-footer">
      <div className="rw-container rw-footer__grid">
        <div className="rw-footer__about">
          <p className="rw-footer__name">Redwoods People Services</p>
          <p className="rw-footer__tagline">
            Praktijk voor psychotherapie, EFT-relatietherapie, coaching en supervisie in Rozendaal. Voor
            Arnhem, Velp, Rheden, Oosterbeek en de rest van Gelderland.
          </p>
          <address className="rw-footer__address">
            <p>
              {site.address.street}
              <br />
              {site.address.postalCode} {site.address.city}
            </p>
            <p className="rw-footer__contact">
              <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
              <br />
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
          </address>
          <p className="rw-footer__hours">
            Telefonisch bereikbaar op maandag, woensdag en donderdag van 09:00 tot 13:00 uur.
          </p>
        </div>
        {columns.map((column) => (
          <div key={column.title} className="rw-footer__column">
            <p className="rw-footer__title">{column.title}</p>
            <ul className="rw-footer__list">
              {column.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="rw-footer__link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="rw-footer__bottom">
        <div className="rw-container rw-footer__bottom-inner">
          <p>
            © {year} Redwoods People Services · KvK {site.kvk}
          </p>
          <ul className="rw-footer__legal">
            <li>
              <a href="/privacybeleid/" className="rw-footer__link">
                Privacyverklaring
              </a>
            </li>
            <li>
              <a href="/algemene-voorwaarden/" className="rw-footer__link">
                Algemene voorwaarden
              </a>
            </li>
            {socials.map((social) => (
              <li key={social.href}>
                <a href={social.href} rel="noopener" target="_blank" className="rw-footer__link">
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
