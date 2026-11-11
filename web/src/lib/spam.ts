import 'server-only';

/**
 * Spam protection for the forms (contact and registration Houd me Vast), ported from the
 * Astro site (`src/lib/spam.ts` on `main`).
 * 1. Cloudflare Turnstile keeps bots out (only active with TURNSTILE_SECRET_KEY).
 * 2. Fill-in time: a form that comes back within a few seconds of loading was not filled in by a person.
 * 3. Content: links in fields where they do not belong, too many links in the message, or text in another script.
 * Nothing is stored; the Vercel logs only get the reason of a rejection, no personal data.
 */

export const turnstileEnabled = () => Boolean(process.env.TURNSTILE_SECRET_KEY);

/** Checks the Turnstile token with Cloudflare. Without a key the check is disabled (true). */
export async function verifyTurnstile(form: FormData, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  const raw = form.get('cf-turnstile-response');
  const token = typeof raw === 'string' ? raw.trim().slice(0, 4000) : '';
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
      cache: 'no-store',
    });
    const j = (await r.json()) as { success?: boolean };
    return Boolean(j.success);
  } catch {
    return false;
  }
}

export const TURNSTILE_FOUT = 'De spamcontrole is mislukt. Probeer het opnieuw.';

/** Client address as Vercel passes it on; only used as a hint for Turnstile. */
export const clientIp = (request: Request): string | null =>
  request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null;

/** Minimum fill-in time in milliseconds. The form measures the time between loading and submitting. */
const MIN_INVULTIJD = 3000;
const LINK = /https?:\/\/|www\.[a-z0-9-]+\.[a-z]{2,}/gi;
const ANDER_SCHRIFT =
  /[\p{Script=Cyrillic}\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\p{Script=Arabic}\p{Script=Hebrew}\p{Script=Thai}\p{Script=Devanagari}]/gu;
const LETTER = /\p{L}/gu;

const aantal = (s: string, re: RegExp) => (s.match(re) || []).length;

export type SpamInvoer = {
  /** Short fields such as name, phone and address: a link never belongs here. */
  kort: string[];
  /** Free text (the question). A few links are allowed here. */
  vrij?: string;
};

/**
 * Returns an error message for the visitor when the submission looks like spam, otherwise null.
 * The message is friendly on purpose: a person who is rejected by accident knows what to do.
 */
export function spamFout(form: FormData, invoer: SpamInvoer): string | null {
  const weiger = (reden: string, melding: string) => {
    console.warn(`Formulier geweigerd (spamfilter): ${reden}`);
    return melding;
  };

  const duur = form.get('duur');
  if (typeof duur === 'string' && /^\d+$/.test(duur) && Number(duur) < MIN_INVULTIJD) {
    return weiger('te snel ingevuld', 'Dat ging wel erg snel. Probeer het over een paar seconden opnieuw.');
  }

  if (invoer.kort.some((v) => aantal(v, LINK) > 0)) {
    return weiger('link in naam- of adresveld', 'Zet geen webadressen in de naam-, telefoon- of adresvelden.');
  }

  const vrij = invoer.vrij ?? '';
  if (aantal(vrij, LINK) > 2) {
    return weiger('meer dan twee links in bericht', 'Je bericht bevat veel links. Haal ze weg en probeer het opnieuw.');
  }

  const tekst = [...invoer.kort, vrij].join(' ');
  const letters = aantal(tekst, LETTER);
  if (letters >= 10 && aantal(tekst, ANDER_SCHRIFT) / letters > 0.3) {
    return weiger('ander schrift', 'We kunnen alleen berichten in het Nederlands of Engels verwerken.');
  }

  return null;
}
