import type { APIRoute } from "astro";
import { getPayment, mollieEnabled, euro } from "../../../lib/mollie";
import { sendMail, MAIL_TO } from "../../../lib/mail";

export const prerender = false;

/**
 * Mollie roept deze URL aan bij elke statuswijziging, met alleen het betaal-id.
 * We halen de betaling zelf op bij Mollie (dat is de echtheidscontrole) en mailen bij "paid".
 * Geen database: Mollie bewaart de gegevens in de metadata van de betaling.
 */
export const POST: APIRoute = async ({ request }) => {
  if (!mollieEnabled()) return new Response("Mollie niet geconfigureerd", { status: 503 });
  let id = "";
  try {
    const form = await request.formData();
    id = String(form.get("id") || "");
  } catch {
    /* leeg */
  }
  if (!/^tr_[A-Za-z0-9]+$/.test(id)) return new Response("Ongeldig id", { status: 400 });

  let payment;
  try {
    payment = await getPayment(id);
  } catch (e) {
    console.error("Mollie webhook:", (e as Error).message);
    return new Response("Betaling niet gevonden", { status: 404 });
  }

  if (payment.status === "paid" && payment.metadata?.type === "houd-me-vast") {
    const m = payment.metadata;
    const bedrag = euro(payment.amount.value);
    const text = [
      "Nieuwe aanmelding Houd me Vast relatieweekend – aanbetaling ontvangen",
      "",
      `Weekend: ${m.weekend}`,
      `Partner 1: ${m.partner1}`,
      `Partner 2: ${m.partner2}`,
      `E-mail: ${m.email}`,
      `Telefoon: ${m.telefoon}`,
      `Opmerkingen/dieetwensen: ${m.opmerkingen || "-"}`,
      "",
      `Aanbetaling: ${bedrag} betaald via Mollie (${payment.id}) op ${payment.paidAt ?? "-"}`,
      "Resterend bedrag factureren na het intakegesprek.",
    ].join("\n");
    await sendMail({ to: MAIL_TO(), subject: `[Website] Aanbetaling ontvangen Houd me Vast – ${m.partner1} en ${m.partner2}`, text, replyTo: m.email });
    await sendMail({
      to: m.email,
      subject: "Bevestiging aanmelding Houd me Vast relatieweekend",
      text: `Beste ${m.partner1} en ${m.partner2},\n\nJullie aanmelding voor het Houd me Vast relatieweekend (${m.weekend}) is ontvangen en de aanbetaling van ${bedrag} is betaald. Betaalkenmerk: ${payment.id}.\n\nWat nu? We nemen contact met jullie op om een intakegesprek van ongeveer 30 minuten via Zoom in te plannen. Het resterende bedrag factureren we na dat gesprek. De algemene en annuleringsvoorwaarden zijn van toepassing.\n\nTip: lees alvast samen het boek Houd me Vast van Sue Johnson.\n\nHartelijke groet,\nRedwoods People Services\nRosendaalselaan 30, 6891 DG Rozendaal\nsecretariaat@redwoodspeopleservices.nl · +31 6 24913779`,
    });
  }
  // Altijd 200, anders blijft Mollie het opnieuw proberen
  return new Response("OK", { status: 200 });
};
