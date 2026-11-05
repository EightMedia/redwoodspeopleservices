import { SanityImage } from '@/components/SanityImage/SanityImage';
import type { TeamMember } from '@/sanity/types';

import './TeamCard.css';

export type TeamCardProps = {
  member: TeamMember;
  /** Without intro and waiting time (home page). */
  compact?: boolean;
};

/** Team member card with portrait, name, role and link (Astro `TeamCard.astro`). */
export function TeamCard({ member, compact = false }: TeamCardProps) {
  const { name, role, intro, photo, wachttijd, slug } = member;
  const href = `/team/${slug}/`;
  const firstName = name.split(' ')[0];

  return (
    <article className="rw-team-card">
      <a href={href} className="rw-team-card__media" aria-hidden="true" tabIndex={-1}>
        <SanityImage
          image={photo}
          alt={`${name}, ${role.toLowerCase()} bij Redwoods People Services`}
          width={640}
          height={720}
          sizes="(min-width: 1024px) 352px, (min-width: 640px) 50vw, 100vw"
          className="rw-team-card__photo"
        />
      </a>
      <h3 className="rw-team-card__name">
        <a href={href} className="rw-team-card__name-link">
          {name}
        </a>
      </h3>
      <p className="rw-team-card__role">{role}</p>
      {!compact ? <p className="rw-team-card__intro">{intro}</p> : null}
      {!compact && wachttijd ? (
        <p className="rw-team-card__wachttijd">
          <span className="rw-team-card__wachttijd-label">Wachttijd:</span> {wachttijd}
        </p>
      ) : null}
      <a href={href} className="rw-team-card__more">
        Lees meer over {firstName} <span aria-hidden="true">→</span>
      </a>
    </article>
  );
}
