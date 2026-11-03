import type { APIRoute } from "astro";
import { sendMail, MAIL_TO } from "../../lib/mail";
import { createPayment, mollieEnabled, euro } from "../../lib/mollie";
import { leesInschrijving, inschrijvingTekst, ontvangers } from "../../lib/inschrijving";
import hmv from "../../data/houd-me-vast.json";

export const prerender = false;

/**
 * Inschrijving Houd me Vast relatieweekend.
 * Met MOLLIE_API_KEY: maakt een betaling voor de aanbetaling aan en stuurt door naar de Mollie-checkout.
 * Zonder sleutel: mailt de aanmelding naar het secretariaat (de praktijk regelt de aanbetaling zelf).
 */
export const POST: APIRoute = async ({ request, redirect, url }) => {
  const wantsJson = (request.headers.get("accept") || "").includes("application/json");
  const fail = (error: string, status = 400) =>
    wantsJson
      ? new Response(JSON.stringify({ ok: false, error }), { status, headers: { "content-type": "application/json" } })
      : redirect(`/houd-me-vast/?fout=${encodeURIComponent(error)}#aanmelden`, 303);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail("Ongeldig formulier.");
  }
  if (typeof form.get("website") === "string" && (form.get("website") as string).trim()) {
    return wantsJson ? new Response(JSON.stringify({ ok: true }), { headers: { "content-type": "application/json" } }) : redirect("/houd-me-vast/bedankt/", 303);
  }

  const gelezen = leesInschrijving(form);
  if ("fout" in gelezen) return fail(gelezen.fout);
  const d = gelezen.data;
  const akkoord = form.get("voorwaarden") === "ja";
  const weekendOk = hmv.data.some((w) => w.datum === d.weekend && !w.vol) || d.weekend === "Wachtlijst / eerstvolgende beschikbare weekend";

  if (!weekendOk) return fail("Kies een beschikbaar weekend.");
  if (!akkoord) return fail("Ga akkoord met de algemene en annuleringsvoorwaarden.");

  const amount = hmv.aanbetalingBedrag; // bijv. "697.50"

  if (mollieEnabled()) {
    try {
      const payment = await createPayment({
        amount,
        description: `Aanbetaling Houd me Vast ${d.weekend}`.slice(0, 255),
        redirectUrl: `${url.origin}/houd-me-vast/bedankt/`,
        webhookUrl: `${url.origin}/api/mollie/webhook`,
        metadata: { ...d, type: "houd-me-vast" },
      });
      const checkout = payment._links.checkout?.href;
      if (!checkout) throw new Error("Geen checkout-link van Mollie");
      return wantsJson
        ? new Response(JSON.stringify({ ok: true, checkoutUrl: checkout }), { headers: { "content-type": "application/json" } })
        : redirect(checkout, 303);
    } catch (e) {
      console.error("Mollie:", (e as Error).message);
      return fail("De betaling kon niet worden gestart. Probeer het opnieuw of mail ons.", 502);
    }
  }

  // Terugval zonder Mollie: aanmelding per mail, aanbetaling regelt de praktijk
  const text = [
    "Nieuwe aanmelding Houd me Vast relatieweekend (nog zonder aanbetaling)",
    "",
    ...inschrijvingTekst(d),
    "Akkoord met voorwaarden: ja",
    "",
    `Aanbetaling van ${euro(amount)} nog te factureren.`,
  ].join("\n");
  const ok = await sendMail({ to: MAIL_TO(), subject: `[Website] Aanmelding Houd me Vast – ${d.p1.naam} en ${d.p2.naam}`, text, replyTo: d.p1.email });
  if (!ok) return fail("Versturen is niet gelukt. Mail ons gerust rechtstreeks.", 502);
  await sendMail({
    to: ontvangers(d),
    subject: "Je aanmelding voor het Houd me Vast relatieweekend",
    text: `Beste ${d.p1.naam} en ${d.p2.naam},\n\nBedankt voor jullie aanmelding voor het Houd me Vast relatieweekend (${d.weekend}). We nemen contact met jullie op om de aanbetaling van ${euro(amount)} en het intakegesprek via Zoom in te plannen.\n\nHartelijke groet,\nRedwoods People Services\nRosendaalselaan 30, 6891 DG Rozendaal\n+31 6 24913779`,
  });
  return wantsJson
    ? new Response(JSON.stringify({ ok: true, redirect: "/houd-me-vast/bedankt/" }), { headers: { "content-type": "application/json" } })
    : redirect("/houd-me-vast/bedankt/", 303);
};
