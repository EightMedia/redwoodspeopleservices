import { site } from '@/data/site';
import { absoluteUrl } from './siteUrl';

export type JsonLdObject = Record<string, unknown>;

/** LocalBusiness + MedicalBusiness for the practice, rendered on every page (from `Base.astro`). */
export function organizationJsonLd(imageUrl: string): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'MedicalBusiness'],
    '@id': `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    description: site.description,
    telephone: site.phoneHref,
    email: site.email,
    image: imageUrl,
    logo: absoluteUrl('/apple-touch-icon.png'),
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
    areaServed: ['Rozendaal', 'Arnhem', 'Velp', 'Rheden', 'Oosterbeek', 'Gelderland'],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Wednesday', 'Thursday'],
        opens: '09:00',
        closes: '13:00',
      },
    ],
    sameAs: Object.values(site.socials),
    medicalSpecialty: 'Psychiatric',
    knowsAbout: [
      'Psychotherapie',
      'Relatietherapie',
      'Emotionally Focused Therapy',
      'Coaching',
      'Supervisie',
      'Rouwbegeleiding',
    ],
  };
}
