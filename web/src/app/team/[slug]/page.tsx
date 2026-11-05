import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Cta } from '@/components/Cta/Cta';
import { JsonLd } from '@/components/JsonLd';
import { Prose } from '@/components/Prose/Prose';
import { SanityImage } from '@/components/SanityImage/SanityImage';
import { Section } from '@/components/Section/Section';
import { site } from '@/data/site';
import { pageMetadata } from '@/lib/metadata';
import { absoluteUrl } from '@/lib/siteUrl';
import { hasSanityProject } from '@/sanity/client';
import { imageUrl } from '@/sanity/image';
import { getTeamMember, getTeamMembers } from '@/sanity/queries/team';

import './page.css';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  if (!hasSanityProject) return [];
  const team = await getTeamMembers();
  return team.map((member) => ({ slug: member.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const member = await getTeamMember(slug);
  if (!member) return {};

  const firstSentence = member.intro.split(/(?<=[.!?])\s/)[0] ?? '';
  const meta = pageMetadata({
    title: member.name,
    description: `${member.name}, ${member.role.toLowerCase()} bij Redwoods People Services in Rozendaal. ${firstSentence}`.slice(0, 155),
    path: `/team/${member.slug}/`,
  });
  // Open Graph image: the portrait (Astro `image={d.photo}`).
  const photo = imageUrl(member.photo, { width: 1200, height: 630, fit: 'crop' });
  if (photo) {
    meta.openGraph = { ...meta.openGraph, images: [{ url: photo, width: 1200, height: 630 }] };
  }
  return meta;
}

/** Team member page (Astro `team/[id].astro`). */
export default async function TeamMemberPage({ params }: { params: Params }) {
  const { slug } = await params;
  const [member, team] = await Promise.all([getTeamMember(slug), getTeamMembers()]);
  if (!member) notFound();

  const others = team.filter((other) => other.slug !== member.slug);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: member.name,
    jobTitle: member.role,
    description: member.intro,
    worksFor: { '@id': `${site.url}/#organization` },
    url: absoluteUrl(`/team/${member.slug}/`),
    knowsAbout: member.specialties,
  };

  return (
    <>
      <Section className="rw-member-section">
        <a href="/team/" className="rw-member-back">
          <span aria-hidden="true">←</span> Het hele team
        </a>
        <div className="rw-member-grid">
          <div className="rw-member-side">
            <SanityImage
              image={member.photo}
              alt={`Portret van ${member.name}`}
              width={760}
              height={855}
              priority
              sizes="(min-width: 1024px) 380px, 100vw"
              className="rw-member-photo"
            />
            {member.specialties.length > 0 ? (
              <div className="rw-member-block">
                <p className="rw-eyebrow">Specialisaties</p>
                <ul className="rw-member-tags">
                  {member.specialties.map((specialty) => (
                    <li key={specialty} className="rw-member-tag">
                      {specialty}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {member.wachttijd ? (
              <div className="rw-member-block rw-member-card rw-member-card--soft">
                <p className="rw-member-card__title rw-member-card__title--deep">Wachttijd</p>
                <p className="rw-member-card__wachttijd">{member.wachttijd}</p>
              </div>
            ) : null}
            {member.registrations.length > 0 ? (
              <div className="rw-member-block rw-member-card rw-member-card--outline">
                <p className="rw-member-card__title">Registraties</p>
                <ul className="rw-member-registrations">
                  {member.registrations.map((registration) => (
                    <li key={registration}>{registration}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
          <div>
            <p className="rw-eyebrow rw-member-role">{member.role}</p>
            <h1 className="rw-member-name">{member.name}</h1>
            <p className="rw-measure rw-member-intro">{member.intro}</p>
            <Prose value={member.body} className="rw-member-body" />
            <div className="rw-member-actions">
              <a href="/contact/" className="rw-btn--primary">
                Maak kennis
              </a>
              <a href="/diensten/" className="rw-btn--secondary">
                Onze diensten
              </a>
            </div>
          </div>
        </div>
      </Section>
      <Section surface="subtle">
        <h2 className="rw-member-others__title">Ook in het team</h2>
        <ul className="rw-member-others">
          {others.map((other) => (
            <li key={other.slug}>
              <a href={`/team/${other.slug}/`} className="rw-member-other">
                <SanityImage
                  image={other.photo}
                  alt={other.name}
                  width={112}
                  height={112}
                  sizes="56px"
                  className="rw-member-other__photo"
                />
                <span>
                  <span className="rw-member-other__name">{other.name}</span>
                  <span className="rw-member-other__role">{other.role}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Section>
      <Cta />
      <JsonLd data={jsonLd} />
    </>
  );
}
