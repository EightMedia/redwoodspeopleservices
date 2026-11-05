import 'server-only';
import { Resend } from 'resend';

/** Sends a plain-text mail via Resend. Returns false when there is no key or sending fails. */
export async function sendMail(opts: {
  to: string | string[];
  subject: string;
  text: string;
  replyTo?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY ontbreekt');
    return false;
  }
  const from = process.env.MAIL_FROM || 'Redwoods website <onboarding@resend.dev>';
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: Array.isArray(opts.to) ? opts.to : [opts.to],
    subject: opts.subject,
    text: opts.text,
    replyTo: opts.replyTo,
  });
  if (error) console.error('Resend fout:', error.message);
  return !error;
}

export const MAIL_TO = () => process.env.MAIL_TO || 'secretariaat@redwoodspeopleservices.nl';
