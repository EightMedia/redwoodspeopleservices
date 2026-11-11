import { NextResponse } from 'next/server';

import { inschrijvingTekst, leesInschrijving, ontvangers } from '@/lib/inschrijving';
import { MAIL_TO, sendMail } from '@/lib/mail';
import { createPayment, euro, mollieEnabled } from '@/lib/mollie';
import { siteUrl } from '@/lib/siteUrl';
import { clientIp, spamFout, TURNSTILE_FOUT, verifyTurnstile } from '@/lib/spam';
import { sanityFetch } from '@/sanity/fetch';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Deposit amount and weekends from the `houdMeVast` singleton (was `src/data/houd-me-vast.json`). */
const houdMeVastQuery = `*[_type == "houdMeVast"][0]{ aanbetalingBedrag, data[]{ datum, vol } }`;

type HoudMeVastData = {
  aanbetalingBedrag?: number | null;
  data?: { datum?: string | null; vol?: boolean | null }[] | null;
} | null;

/** Origin of the incoming request (Astro's `url.origin`), with the configured site URL as fallback. */
function requestOrigin(request: Request): string {
  try {
    const origin = new URL(request.url).origin;
    if (origin && origin !== 'null') return origin;
  } catch {
    /* fall through */
  }
  return siteUrl();
}

const json = (body: Record<string, unknown>, status = 200) => NextResponse.json(body, { status });

/**
 * Registration for the Houd me Vast couples weekend.
 * With MOLLIE_API_KEY: creates a payment for the deposit and redirects to the Mollie checkout.
 * Without a key: mails the registration to the secretariat (the practice handles the deposit).
 */
export async function POST(request: Request) {
  const wantsJson = (request.headers.get('accept') || '').includes('application/json');
  const origin = requestOrigin(request);
  const fail = (error: string, status = 400) =>
    wantsJson
      ? json({ ok: false, error }, status)
      : NextResponse.redirect(
          new URL(`/houd-me-vast/?fout=${encodeURIComponent(error)}#aanmelden`, origin),
          303,
        );

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail('Ongeldig formulier.');
  }
  if (typeof form.get('website') === 'string' && (form.get('website') as string).trim()) {
    return wantsJson
      ? json({ ok: true })
      : NextResponse.redirect(new URL('/houd-me-vast/bedankt/', origin), 303);
  }

  const gelezen = leesInschrijving(form);
  if ('fout' in gelezen) return fail(gelezen.fout);
  const d = gelezen.data;
  const akkoord = form.get('voorwaarden') === 'ja';

  const hmv = await sanityFetch<HoudMeVastData>({ query: houdMeVastQuery, tags: ['houdMeVast'] });
  if (!hmv || typeof hmv.aanbetalingBedrag !== 'number') {
    console.error('houdMeVast: aanbetalingBedrag ontbreekt in Sanity');
    return fail('Het formulier is nog niet geconfigureerd.', 500);
  }
  const weekendOk =
    (hmv.data ?? []).some((w) => w.datum === d.weekend && !w.vol) ||
    d.weekend === 'Wachtlijst / eerstvolgende beschikbare weekend';

  if (!weekendOk) return fail('Kies een beschikbaar weekend.');
  if (!akkoord) return fail('Ga akkoord met de algemene en annuleringsvoorwaarden.');

  // Spam protection before a payment or mail is created
  const spam = spamFout(form, {
    kort: [d.p1, d.p2].flatMap((p) => [p.naam, p.telefoon, p.adres, p.postcode, p.plaats]),
  });
  if (spam) return fail(spam);
  if (!(await verifyTurnstile(form, clientIp(request)))) return fail(TURNSTILE_FOUT);

  const amount = hmv.aanbetalingBedrag.toFixed(2); // e.g. "697.50"

  if (mollieEnabled()) {
    try {
      const payment = await createPayment({
        amount,
        description: `Aanbetaling Houd me Vast ${d.weekend}`.slice(0, 255),
        redirectUrl: `${origin}/houd-me-vast/bedankt/`,
        // With `trailingSlash: true` Next 308-redirects `/api/mollie/webhook` to the slash
        // variant; give Mollie the final URL so its call never has to follow a redirect.
        webhookUrl: `${origin}/api/mollie/webhook/`,
        metadata: { ...d, type: 'houd-me-vast' },
      });
      const checkout = payment._links.checkout?.href;
      if (!checkout) throw new Error('Geen checkout-link van Mollie');
      return wantsJson
        ? json({ ok: true, checkoutUrl: checkout })
        : NextResponse.redirect(checkout, 303);
    } catch (e) {
      console.error('Mollie:', (e as Error).message);
      return fail('De betaling kon niet worden gestart. Probeer het opnieuw of mail ons.', 502);
    }
  }

  // Fallback without Mollie: registration by mail, the practice handles the deposit
  const text = [
    'Nieuwe aanmelding Houd me Vast relatieweekend (nog zonder aanbetaling)',
    '',
    ...inschrijvingTekst(d),
    'Akkoord met voorwaarden: ja',
    '',
    `Aanbetaling van ${euro(amount)} nog te factureren.`,
  ].join('\n');
  const ok = await sendMail({
    to: MAIL_TO(),
    subject: `[Website] Aanmelding Houd me Vast – ${d.p1.naam} en ${d.p2.naam}`,
    text,
    replyTo: d.p1.email,
  });
  if (!ok) return fail('Versturen is niet gelukt. Mail ons gerust rechtstreeks.', 502);
  await sendMail({
    to: ontvangers(d),
    subject: 'Je aanmelding voor het Houd me Vast relatieweekend',
    text: `Beste ${d.p1.naam} en ${d.p2.naam},\n\nBedankt voor jullie aanmelding voor het Houd me Vast relatieweekend (${d.weekend}). We nemen contact met jullie op om de aanbetaling van ${euro(amount)} en het intakegesprek via Zoom in te plannen.\n\nHartelijke groet,\nRedwoods People Services\nRosendaalselaan 30, 6891 DG Rozendaal\n+31 6 24913779`,
  });
  return wantsJson
    ? json({ ok: true, redirect: '/houd-me-vast/bedankt/' })
    : NextResponse.redirect(new URL('/houd-me-vast/bedankt/', origin), 303);
}
