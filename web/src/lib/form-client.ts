/**
 * Shared browser code for the forms: measure the fill-in time and guide the Turnstile check
 * (Astro `src/lib/form-client.ts` on `main`). Only call these from event handlers.
 */
type TurnstileApi = { reset: (el?: Element | string) => void };

/** Moment this module was evaluated in the browser, i.e. when the page with the form loaded. */
const geladen = Date.now();

/** FormData including the fill-in time (for the spam filter on the server). */
export function formData(form: HTMLFormElement): FormData {
  const data = new FormData(form);
  data.set('duur', String(Date.now() - geladen));
  return data;
}

/** True when the form has a Turnstile widget that has not produced a token yet. */
export function turnstileBezig(form: HTMLFormElement): boolean {
  if (!form.querySelector('.cf-turnstile')) return false;
  const veld = form.querySelector<HTMLInputElement>('[name="cf-turnstile-response"]');
  return !veld || !veld.value;
}

export const TURNSTILE_BEZIG = 'De spamcontrole is nog bezig. Wacht een paar seconden en probeer het opnieuw.';

/** A token is valid only once: fetch a new one after a failed attempt. */
export function turnstileReset(form: HTMLFormElement): void {
  const widget = form.querySelector('.cf-turnstile');
  const ts = (window as unknown as { turnstile?: TurnstileApi }).turnstile;
  if (widget && ts) {
    try {
      ts.reset(widget);
    } catch {
      /* widget not loaded yet */
    }
  }
}
