import type { ReactNode } from 'react';
import type { SurfaceName } from '@eightmedia/kikker-react';

import './Section.css';

export type SectionProps = {
  /** Astro tone → surface: paper=default, sand=subtle, tint=loud-alt, brand=loud, forest=inverse. */
  surface?: SurfaceName;
  id?: string;
  className?: string;
  children: ReactNode;
};

const DARK_SURFACES: ReadonlySet<SurfaceName> = new Set(['loud', 'inverse']);

/**
 * Page section with the site container inside (Astro `Section.astro`): vertical padding from
 * `--kr-section-padding`, background and text colours from the Kikker surface. Same markup
 * as Kikker's `Section` plus an `id` and the `.rw-container` wrapper.
 */
export function Section({ surface = 'default', id, className, children }: SectionProps) {
  const classes = ['kr-section', 'rw-section', className].filter(Boolean).join(' ');
  return (
    <section
      id={id}
      className={classes}
      data-surface={surface}
      data-scheme={DARK_SURFACES.has(surface) ? 'dark' : 'light'}
    >
      <div className="rw-container">{children}</div>
    </section>
  );
}
