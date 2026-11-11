/**
 * Spamwering voor de formulieren (contact en aanmelding Houd me Vast).
 * 1. Cloudflare Turnstile houdt bots tegen (alleen actief met TURNSTILE_SECRET_KEY).
 * 2. Invultijd: een formulier dat binnen een paar seconden na het laden terugkomt, is niet door een mens ingevuld.
 * 3. Inhoud: links in velden waar ze niet horen, te veel links in het bericht, of tekst in een ander schrift.
 * Er wordt niets opgeslagen; in de Vercel-logs komt alleen de reden van een weigering, geen persoonsgegevens.
 */

export const turnstileEnabled = () => Boolean(process.env.TURNSTILE_SECRET_KEY);

/** Controleert de Turnstile-token bij Cloudflare. Zonder sleutel is de controle uitgeschakeld (true). */
export async function verifyTurnstile(form: FormData, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  const raw = form.get("cf-turnstile-response");
  const token = typeof raw === "string" ? raw.trim().slice(0, 4000) : "";
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);
  try {
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
    const j = (await r.json()) as { success?: boolean };
    return Boolean(j.success);
  } catch {
    return false;
  }
}

export const TURNSTILE_FOUT = "De spamcontrole is mislukt. Probeer het opnieuw.";

/** Minimale invultijd in milliseconden. Het script in het formulier meet de tijd tussen laden en versturen. */
const MIN_INVULTIJD = 3000;
const LINK = /https?:\/\/|www\.[a-z0-9-]+\.[a-z]{2,}/gi;
const ANDER_SCHRIFT = /[\p{Script=Cyrillic}\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\p{Script=Arabic}\p{Script=Hebrew}\p{Script=Thai}\p{Script=Devanagari}]/gu;
const LETTER = /\p{L}/gu;

const aantal = (s: string, re: RegExp) => (s.match(re) || []).length;

export type SpamInvoer = {
  /** Korte velden zoals naam, telefoon en adres: hier hoort nooit een link in. */
  kort: string[];
  /** Vrije tekst (de vraag). Hier mogen een paar links in staan. */
  vrij?: string;
};

/**
 * Geeft een foutmelding voor de bezoeker als de inzending op spam lijkt, anders null.
 * De melding is bewust vriendelijk: een mens die per ongeluk wordt geweigerd, weet wat te doen.
 */
export function spamFout(form: FormData, invoer: SpamInvoer): string | null {
  const weiger = (reden: string, melding: string) => {
    console.warn(`Formulier geweigerd (spamfilter): ${reden}`);
    return melding;
  };

  const duur = form.get("duur");
  if (typeof duur === "string" && /^\d+$/.test(duur) && Number(duur) < MIN_INVULTIJD) {
    return weiger("te snel ingevuld", "Dat ging wel erg snel. Probeer het over een paar seconden opnieuw.");
  }

  if (invoer.kort.some((v) => aantal(v, LINK) > 0)) {
    return weiger("link in naam- of adresveld", "Zet geen webadressen in de naam-, telefoon- of adresvelden.");
  }

  const vrij = invoer.vrij ?? "";
  if (aantal(vrij, LINK) > 2) {
    return weiger("meer dan twee links in bericht", "Je bericht bevat veel links. Haal ze weg en probeer het opnieuw.");
  }

  const tekst = [...invoer.kort, vrij].join(" ");
  const letters = aantal(tekst, LETTER);
  if (letters >= 10 && aantal(tekst, ANDER_SCHRIFT) / letters > 0.3) {
    return weiger("ander schrift", "We kunnen alleen berichten in het Nederlands of Engels verwerken.");
  }

  return null;
}
