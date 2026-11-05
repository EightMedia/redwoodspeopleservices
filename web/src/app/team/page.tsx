import type { Metadata } from 'next';

import { Cta } from '@/components/Cta/Cta';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { Section } from '@/components/Section/Section';
import { TeamCard } from '@/components/TeamCard/TeamCard';
import { pageMetadata } from '@/lib/metadata';
import { getTeamMembers } from '@/sanity/queries/team';

import './page.css';

export const metadata: Metadata = pageMetadata({
  title: 'Ons team',
  description:
    'Maak kennis met de therapeuten, relatietherapeuten en coaches van Redwoods People Services in Rozendaal bij Arnhem.',
  path: '/team/',
});

/** Team overview (Astro `team/index.astro`). */
export default async function TeamPage() {
  const team = await getTeamMembers();

  return (
    <>
      <PageHeader
        eyebrow="Team"
        title="Ervaren therapeuten, met plezier en passie voor het vak"
        intro="Onze therapeuten begeleiden je met al hun kennis en levenservaring. Allemaal zijn ze aangesloten bij beroepsverenigingen als VIT, RBCZ en SCAG."
      />
      <Section>
        <div className="rw-team-grid">
          {team.map((member) => (
            <TeamCard key={member.slug} member={member} />
          ))}
        </div>
      </Section>
      <Cta />
    </>
  );
}
