import type { ReactNode } from 'react';

import './PageHeader.css';

export type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
  /** `light` = brand tint background, `brand` = brand background with white text. */
  tone?: 'light' | 'brand';
  children?: ReactNode;
};

/** Page title band (Astro `PageHeader.astro`). */
export function PageHeader({ eyebrow, title, intro, tone = 'light', children }: PageHeaderProps) {
  return (
    <section className="rw-page-header" data-tone={tone}>
      <div className="rw-container">
        {eyebrow ? <p className="rw-eyebrow rw-page-header__eyebrow">{eyebrow}</p> : null}
        <h1 className="rw-page-header__title">{title}</h1>
        {intro ? <p className="rw-measure rw-page-header__intro">{intro}</p> : null}
        {children}
      </div>
    </section>
  );
}
