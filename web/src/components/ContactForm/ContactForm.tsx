'use client';

import { useState, type FormEvent } from 'react';
import { usePathname } from 'next/navigation';

import { site } from '@/data/site';

import './ContactForm.css';

export type ContactFormProps = {
  /** Subject line of the mail to the practice. */
  subject?: string;
  buttonLabel?: string;
  questionLabel?: string;
  questionPlaceholder?: string;
};

type Status =
  | { state: 'idle' }
  | { state: 'sending' }
  | { state: 'success' }
  | { state: 'error'; message: string };

const turnstileKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/**
 * Contact form: name, e-mail, phone, question (Astro `ContactForm.astro`). Posts as form
 * data to `/api/contact`, which mails through Resend. Honeypot field `website`.
 */
export function ContactForm({
  subject = 'Contactformulier website',
  buttonLabel = 'Verstuur',
  questionLabel = 'Je vraag',
  questionPlaceholder = 'Waar kunnen we je mee helpen?',
}: ContactFormProps) {
  const pathname = usePathname() ?? '/';
  const [status, setStatus] = useState<Status>({ state: 'idle' });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setStatus({ state: 'sending' });
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || 'Versturen is niet gelukt.');
      setStatus({ state: 'success' });
    } catch (err) {
      setStatus({ state: 'error', message: (err as Error).message });
    }
  }

  if (status.state === 'success') {
    return (
      <div className="rw-contact-form__success">
        <p className="rw-contact-form__success-title">Bedankt, je bericht is verstuurd.</p>
        <p className="rw-contact-form__success-text">
          We nemen zo snel mogelijk contact met je op, per e-mail of telefoon.
        </p>
      </div>
    );
  }

  return (
    <form method="post" action="/api/contact" className="rw-contact-form" noValidate onSubmit={handleSubmit}>
      <input type="hidden" name="onderwerp" value={subject} />
      <input type="hidden" name="pagina" value={pathname} />
      <div className="rw-contact-form__honeypot" aria-hidden="true">
        <label>
          Laat dit veld leeg <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="rw-contact-form__row">
        <div>
          <label htmlFor="naam" className="rw-label">
            Naam
          </label>
          <input id="naam" name="naam" type="text" className="rw-field" required autoComplete="name" />
        </div>
        <div>
          <label htmlFor="telefoon" className="rw-label">
            Telefoonnummer
          </label>
          <input id="telefoon" name="telefoon" type="tel" className="rw-field" autoComplete="tel" />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="rw-label">
          E-mailadres
        </label>
        <input id="email" name="email" type="email" className="rw-field" required autoComplete="email" />
      </div>
      <div>
        <label htmlFor="vraag" className="rw-label">
          {questionLabel}
        </label>
        <textarea
          id="vraag"
          name="vraag"
          rows={5}
          className="rw-field"
          required
          placeholder={questionPlaceholder}
        />
      </div>

      {turnstileKey ? (
        <>
          <div className="cf-turnstile" data-sitekey={turnstileKey} data-language="nl" />
          <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
        </>
      ) : null}

      <p className="rw-contact-form__privacy">
        We gebruiken je gegevens alleen om je vraag te beantwoorden. Zie ons{' '}
        <a href="/privacybeleid/" className="rw-contact-form__privacy-link">
          privacyverklaring
        </a>
        .
      </p>

      <div className="rw-contact-form__actions">
        <button type="submit" className="rw-btn--primary" disabled={status.state === 'sending'}>
          {buttonLabel}
        </button>
        <p className="rw-contact-form__status" role="status" aria-live="polite">
          {status.state === 'sending' ? 'Bezig met versturen…' : null}
          {status.state === 'error' ? (
            <>
              {status.message} Mail ons gerust rechtstreeks op{' '}
              <a href={`mailto:${site.email}`} className="rw-contact-form__status-link">
                {site.email}
              </a>
              .
            </>
          ) : null}
        </p>
      </div>
    </form>
  );
}
