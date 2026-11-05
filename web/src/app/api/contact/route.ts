import { NextResponse } from 'next/server';
import { Resend } from 'resend';

import { siteUrl } from '@/lib/siteUrl';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX = { naam: 120, email: 200, telefoon: 40, vraag: 5000 };

function clean(v: FormDataEntryValue | null, max: number) {
  return (typeof v === 'string' ? v : '').trim().slice(0, max);
}

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

async function verifyTurnstile(token: string, ip: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Turnstile not configured: skip
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);
  const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  const j = (await r.json()) as { success?: boolean };
  return Boolean(j.success);
}

export async function POST(request: Request) {
  const wantsJson = (request.headers.get('accept') || '').includes('application/json');
  const origin = requestOrigin(request);
  const reply = (ok: boolean, error?: string, status = ok ? 200 : 400) =>
    wantsJson
      ? NextResponse.json({ ok, error }, { status })
      : NextResponse.redirect(new URL(ok ? '/contact/bedankt/' : '/contact/?fout=1', origin), 303);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return reply(false, 'Ongeldig formulier.');
  }

  // Honeypot: real people never fill in this hidden field
  if (clean(form.get('website'), 10)) return reply(true);

  const naam = clean(form.get('naam'), MAX.naam);
  const email = clean(form.get('email'), MAX.email);
  const telefoon = clean(form.get('telefoon'), MAX.telefoon);
  const vraag = clean(form.get('vraag'), MAX.vraag);
  const onderwerp = clean(form.get('onderwerp'), 120) || 'Contactformulier website';
  const pagina = clean(form.get('pagina'), 200);

  if (!naam || !vraag || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return reply(false, 'Vul je naam, een geldig e-mailadres en je vraag in.');
  }

  const token = clean(form.get('cf-turnstile-response'), 4000);
  const clientAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null;
  if (process.env.TURNSTILE_SECRET_KEY && !(await verifyTurnstile(token, clientAddress))) {
    return reply(false, 'De spamcontrole is mislukt. Probeer het opnieuw.');
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.MAIL_TO || 'secretariaat@redwoodspeopleservices.nl';
  const from = process.env.MAIL_FROM || 'Redwoods website <onboarding@resend.dev>';
  if (!apiKey) {
    console.error('RESEND_API_KEY ontbreekt');
    return reply(false, 'Het formulier is nog niet geconfigureerd.', 500);
  }

  const resend = new Resend(apiKey);
  const text = [
    `Onderwerp: ${onderwerp}`,
    `Naam: ${naam}`,
    `E-mail: ${email}`,
    `Telefoon: ${telefoon || '-'}`,
    pagina ? `Verstuurd vanaf: ${pagina}` : '',
    '',
    'Vraag:',
    vraag,
  ]
    .filter((l) => l !== undefined)
    .join('\n');

  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: email,
    subject: `[Website] ${onderwerp} – ${naam}`,
    text,
  });
  if (error) {
    console.error('Resend fout:', error.message);
    return reply(false, 'Versturen is niet gelukt.', 502);
  }

  // Confirmation to the sender (if this fails the message has still arrived)
  await resend.emails
    .send({
      from,
      to: [email],
      subject: 'We hebben je bericht ontvangen – Redwoods People Services',
      text: `Beste ${naam},\n\nBedankt voor je bericht. We nemen zo snel mogelijk contact met je op, per e-mail of telefoon.\n\nDit stuurde je ons:\n\n${vraag}\n\nHartelijke groet,\nRedwoods People Services\nRosendaalselaan 30, 6891 DG Rozendaal\n+31 6 24913779`,
    })
    .catch(() => {});

  return reply(true);
}
