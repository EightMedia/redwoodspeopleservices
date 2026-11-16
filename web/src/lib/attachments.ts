import 'server-only';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export type Attachment = { filename: string; content: string };

/**
 * Follow-up letter of the Houd me Vast weekend (practical information, programme, route).
 * Sent with the confirmation mail after the deposit. The PDF is not public: it is traced into
 * the webhook function through `outputFileTracingIncludes` in `next.config.ts`. A new version
 * from the practice replaces `src/assets/mail/houd-me-vast-opvolgbrief.pdf`, then redeploy.
 * Returns undefined when the file cannot be read, so the mail still goes out.
 */
export async function opvolgbriefHmv(): Promise<Attachment | undefined> {
  try {
    const file = path.join(process.cwd(), 'src/assets/mail/houd-me-vast-opvolgbrief.pdf');
    return {
      filename: 'Houd me Vast relatieweekend - informatie.pdf',
      content: (await readFile(file)).toString('base64'),
    };
  } catch (e) {
    console.error('Opvolgbrief Houd me Vast niet gevonden:', (e as Error).message);
    return undefined;
  }
}
