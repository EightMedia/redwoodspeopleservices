/**
 * Gedeelde browsercode voor de formulieren: invultijd meten en de Turnstile-controle begeleiden.
 */
type Turnstile = { reset: (el?: Element | string) => void };

const geladen = Date.now();

/** FormData met de invultijd erbij (voor het spamfilter op de server). */
export function formData(form: HTMLFormElement): FormData {
  const data = new FormData(form);
  data.set("duur", String(Date.now() - geladen));
  return data;
}

/** True als het formulier een Turnstile-widget heeft dat nog geen token heeft opgeleverd. */
export function turnstileBezig(form: HTMLFormElement): boolean {
  if (!form.querySelector(".cf-turnstile")) return false;
  const veld = form.querySelector<HTMLInputElement>('[name="cf-turnstile-response"]');
  return !veld || !veld.value;
}

export const TURNSTILE_BEZIG = "De spamcontrole is nog bezig. Wacht een paar seconden en probeer het opnieuw.";

/** Een token is maar één keer geldig: na een mislukte poging een nieuwe ophalen. */
export function turnstileReset(form: HTMLFormElement): void {
  const widget = form.querySelector(".cf-turnstile");
  const ts = (window as unknown as { turnstile?: Turnstile }).turnstile;
  if (widget && ts) {
    try {
      ts.reset(widget);
    } catch {
      /* widget nog niet geladen */
    }
  }
}
