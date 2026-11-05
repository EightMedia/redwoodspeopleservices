import { inschrijvingTekst, ontvangers, type Inschrijving } from '@/lib/inschrijving';
import { MAIL_TO, sendMail } from '@/lib/mail';
import { euro, getPayment, mollieEnabled } from '@/lib/mollie';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Mollie calls this URL on every status change, with only the payment id.
 * We fetch the payment from Mollie ourselves (that is the authenticity check) and mail on "paid".
 * No database: Mollie keeps the data in the payment's metadata.
 */
export async function POST(request: Request) {
  if (!mollieEnabled()) return new Response('Mollie niet geconfigureerd', { status: 503 });
  let id = '';
  try {
    const form = await request.formData();
    id = String(form.get('id') || '');
  } catch {
    /* empty */
  }
  if (!/^tr_[A-Za-z0-9]+$/.test(id)) return new Response('Ongeldig id', { status: 400 });

  let payment;
  try {
    payment = await getPayment(id);
  } catch (e) {
    console.error('Mollie webhook:', (e as Error).message);
    return new Response('Betaling niet gevonden', { status: 404 });
  }

  if (
    payment.status === 'paid' &&
    payment.metadata?.type === 'houd-me-vast' &&
    payment.metadata.p1 &&
    payment.metadata.p2
  ) {
    const m = payment.metadata as unknown as Inschrijving;
    const bedrag = euro(payment.amount.value);
    const text = [
      'Nieuwe aanmelding Houd me Vast relatieweekend – aanbetaling ontvangen',
      '',
      ...inschrijvingTekst(m),
      '',
      `Aanbetaling: ${bedrag} betaald via Mollie (${payment.id}) op ${payment.paidAt ?? '-'}`,
      'Resterend bedrag factureren na het intakegesprek.',
    ].join('\n');
    await sendMail({
      to: MAIL_TO(),
      subject: `[Website] Aanbetaling ontvangen Houd me Vast – ${m.p1.naam} en ${m.p2.naam}`,
      text,
      replyTo: m.p1.email,
    });
    await sendMail({
      to: ontvangers(m),
      subject: 'Bevestiging aanmelding Houd me Vast relatieweekend',
      text: `Beste ${m.p1.naam} en ${m.p2.naam},\n\nJullie aanmelding voor het Houd me Vast relatieweekend (${m.weekend}) is ontvangen en de aanbetaling van ${bedrag} is betaald. Betaalkenmerk: ${payment.id}.\n\nWat nu? We nemen contact met jullie op om een intakegesprek van ongeveer 30 minuten via Zoom in te plannen. Het resterende bedrag factureren we na dat gesprek. De algemene en annuleringsvoorwaarden zijn van toepassing.\n\nTip: lees alvast samen het boek Houd me Vast van Sue Johnson.\n\nHartelijke groet,\nRedwoods People Services\nRosendaalselaan 30, 6891 DG Rozendaal\nsecretariaat@redwoodspeopleservices.nl · +31 6 24913779`,
    });
  }
  // Always 200, otherwise Mollie keeps retrying
  return new Response('OK', { status: 200 });
}
