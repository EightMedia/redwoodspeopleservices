import './Cta.css';

export type CtaProps = {
  title?: string;
  text?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string } | null;
};

/** Brand call-to-action card at the end of a page (Astro `Cta.astro`), same defaults. */
export function Cta({
  title = 'Benieuwd of Redwoods bij je past?',
  text = 'Neem vrijblijvend contact op. Onze praktijkcoördinator Edwin belt of mailt je terug en denkt mee over de aanpak die bij je past.',
  primary = { label: 'Neem contact op', href: '/contact/' },
  secondary = { label: 'Bekijk de tarieven', href: '/tarieven/' },
}: CtaProps) {
  return (
    <section className="rw-cta">
      <div className="rw-container">
        <div className="rw-cta__card">
          <div className="rw-cta__grid">
            <div>
              <h2 className="rw-cta__title">{title}</h2>
              <p className="rw-measure rw-cta__text">{text}</p>
            </div>
            <div className="rw-cta__actions">
              <a href={primary.href} className="rw-btn rw-btn--on-brand">
                {primary.label}
              </a>
              {secondary ? (
                <a href={secondary.href} className="rw-btn rw-btn--outline-white">
                  {secondary.label}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
