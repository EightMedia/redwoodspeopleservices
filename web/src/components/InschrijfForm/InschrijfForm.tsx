'use client';

import { Suspense, useState, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';

import './InschrijfForm.css';

export type InschrijfFormProps = {
  /** Weekend dates from the `houdMeVast` singleton; sold-out weekends are disabled. */
  weekends: { datum: string; vol?: boolean | null }[];
  /** Deposit as shown to visitors, e.g. "€ 697,50". */
  aanbetaling: string;
};

/** Mollie checkout follows the form when the public flag is set (same as the Astro site). */
const mollie = process.env.NEXT_PUBLIC_MOLLIE_ENABLED === 'true';

/** `?fout=` after a server-side redirect. Own component under Suspense so the page stays static. */
function Foutmelding() {
  const fout = useSearchParams().get('fout');
  return fout ? <p className="rw-inschrijf__fout">{fout}</p> : null;
}

/**
 * Sign-up form for the Houd me Vast weekend (Astro `InschrijfForm.astro`): name, address,
 * e-mail and phone per partner, the preferred weekend and consent to the terms.
 * Partner 2 lives at the same address by default; unticking shows separate address fields.
 * Posts to /api/inschrijven; with Mollie the checkout for the deposit follows.
 */
export function InschrijfForm({ weekends, aanbetaling }: InschrijfFormProps) {
  const [zelfdeAdres, setZelfdeAdres] = useState(true);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setBusy(true);
    setStatus('Even geduld…');
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || 'Versturen is niet gelukt.');
      window.location.href = data.checkoutUrl || data.redirect || '/houd-me-vast/bedankt/';
    } catch (err) {
      setStatus((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <form method="post" action="/api/inschrijven" className="rw-inschrijf" noValidate onSubmit={onSubmit}>
      <div className="rw-inschrijf__honeypot" aria-hidden="true">
        <label>
          Laat dit veld leeg <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <Suspense fallback={null}>
        <Foutmelding />
      </Suspense>

      <fieldset className="rw-inschrijf__fieldset">
        <legend className="rw-inschrijf__legend">Partner 1</legend>
        <div>
          <label htmlFor="naam1" className="rw-inschrijf__label">
            Naam
          </label>
          <input id="naam1" name="naam1" type="text" className="rw-inschrijf__field" required autoComplete="section-p1 name" />
        </div>
        <div className="rw-inschrijf__row rw-inschrijf__row--halves">
          <div>
            <label htmlFor="email1" className="rw-inschrijf__label">
              E-mailadres
            </label>
            <input id="email1" name="email1" type="email" className="rw-inschrijf__field" required autoComplete="section-p1 email" />
          </div>
          <div>
            <label htmlFor="telefoon1" className="rw-inschrijf__label">
              Telefoonnummer
            </label>
            <input id="telefoon1" name="telefoon1" type="tel" className="rw-inschrijf__field" required autoComplete="section-p1 tel" />
          </div>
        </div>
        <div>
          <label htmlFor="adres1" className="rw-inschrijf__label">
            Straat en huisnummer
          </label>
          <input id="adres1" name="adres1" type="text" className="rw-inschrijf__field" required autoComplete="section-p1 street-address" />
        </div>
        <div className="rw-inschrijf__row rw-inschrijf__row--postcode">
          <div>
            <label htmlFor="postcode1" className="rw-inschrijf__label">
              Postcode
            </label>
            <input id="postcode1" name="postcode1" type="text" className="rw-inschrijf__field" required autoComplete="section-p1 postal-code" />
          </div>
          <div>
            <label htmlFor="plaats1" className="rw-inschrijf__label">
              Woonplaats
            </label>
            <input id="plaats1" name="plaats1" type="text" className="rw-inschrijf__field" required autoComplete="section-p1 address-level2" />
          </div>
        </div>
      </fieldset>

      <fieldset className="rw-inschrijf__fieldset">
        <legend className="rw-inschrijf__legend">Partner 2</legend>
        <div>
          <label htmlFor="naam2" className="rw-inschrijf__label">
            Naam
          </label>
          <input id="naam2" name="naam2" type="text" className="rw-inschrijf__field" required autoComplete="section-p2 name" />
        </div>
        <div className="rw-inschrijf__row rw-inschrijf__row--halves">
          <div>
            <label htmlFor="email2" className="rw-inschrijf__label">
              E-mailadres
            </label>
            <input id="email2" name="email2" type="email" className="rw-inschrijf__field" required autoComplete="section-p2 email" />
          </div>
          <div>
            <label htmlFor="telefoon2" className="rw-inschrijf__label">
              Telefoonnummer
            </label>
            <input id="telefoon2" name="telefoon2" type="tel" className="rw-inschrijf__field" required autoComplete="section-p2 tel" />
          </div>
        </div>
        <label className="rw-inschrijf__check">
          <input
            type="checkbox"
            name="zelfdeAdres"
            value="ja"
            checked={zelfdeAdres}
            onChange={(e) => setZelfdeAdres(e.target.checked)}
            className="rw-inschrijf__checkbox"
          />
          <span>Woont op hetzelfde adres als partner 1</span>
        </label>
        <div className="rw-inschrijf__adres2" hidden={zelfdeAdres}>
          <div>
            <label htmlFor="adres2" className="rw-inschrijf__label">
              Straat en huisnummer
            </label>
            <input id="adres2" name="adres2" type="text" className="rw-inschrijf__field" required={!zelfdeAdres} autoComplete="section-p2 street-address" />
          </div>
          <div className="rw-inschrijf__row rw-inschrijf__row--postcode">
            <div>
              <label htmlFor="postcode2" className="rw-inschrijf__label">
                Postcode
              </label>
              <input id="postcode2" name="postcode2" type="text" className="rw-inschrijf__field" required={!zelfdeAdres} autoComplete="section-p2 postal-code" />
            </div>
            <div>
              <label htmlFor="plaats2" className="rw-inschrijf__label">
                Woonplaats
              </label>
              <input id="plaats2" name="plaats2" type="text" className="rw-inschrijf__field" required={!zelfdeAdres} autoComplete="section-p2 address-level2" />
            </div>
          </div>
        </div>
      </fieldset>

      <div className="rw-inschrijf__group">
        <div>
          <label htmlFor="weekend" className="rw-inschrijf__label">
            Gewenst weekend
          </label>
          <select id="weekend" name="weekend" className="rw-inschrijf__field" required defaultValue="">
            <option value="">Kies een weekend</option>
            {weekends.map((w) => (
              <option key={w.datum} value={w.datum} disabled={Boolean(w.vol)}>
                {w.datum}
                {w.vol ? ' (vol)' : ''}
              </option>
            ))}
            <option value="Wachtlijst / eerstvolgende beschikbare weekend">Wachtlijst / eerstvolgende beschikbare weekend</option>
          </select>
        </div>
        <label className="rw-inschrijf__check">
          <input type="checkbox" name="voorwaarden" value="ja" required className="rw-inschrijf__checkbox" />
          <span>
            We gaan akkoord met de{' '}
            <a href="/algemene-voorwaarden/" className="rw-inschrijf__link">
              algemene en annuleringsvoorwaarden
            </a>{' '}
            en het{' '}
            <a href="/privacybeleid/" className="rw-inschrijf__link">
              privacyverklaring
            </a>
            .
          </span>
        </label>
      </div>

      <div className="rw-inschrijf__note">
        {mollie ? (
          <p>
            Na het versturen betaal je de aanbetaling van <strong className="rw-inschrijf__strong">{aanbetaling}</strong> veilig via iDEAL
            of creditcard (Mollie). Het restant factureren we na het intakegesprek.
          </p>
        ) : (
          <p>
            Na je aanmelding nemen we contact op over de aanbetaling van <strong className="rw-inschrijf__strong">{aanbetaling}</strong>{' '}
            en het intakegesprek.
          </p>
        )}
      </div>

      <div className="rw-inschrijf__actions">
        <button type="submit" className="rw-btn--primary" disabled={busy}>
          {mollie ? 'Aanmelden en aanbetaling voldoen' : 'Aanmelden'}
        </button>
        <p className="rw-inschrijf__status" role="status" aria-live="polite">
          {status}
        </p>
      </div>
    </form>
  );
}
