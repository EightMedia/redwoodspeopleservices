import { Resend } from "resend";

/** Verstuurt platte-tekstmail via Resend. Geeft false terug als er geen sleutel is of het mislukt. */
export async function sendMail(opts: { to: string; subject: string; text: string; replyTo?: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY ontbreekt");
    return false;
  }
  const from = process.env.MAIL_FROM || "Redwoods website <onboarding@resend.dev>";
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({ from, to: [opts.to], subject: opts.subject, text: opts.text, replyTo: opts.replyTo });
  if (error) console.error("Resend fout:", error.message);
  return !error;
}

export const MAIL_TO = () => process.env.MAIL_TO || "secretariaat@redwoodspeopleservices.nl";
