/**
 * Data of a registration for the Houd me Vast couples weekend.
 * Stored as metadata on the Mollie payment (1 KB at most), hence the short maximum lengths.
 * No `server-only`: this module holds no secrets and the client form may import its types.
 */
export type Partner = {
  naam: string;
  email: string;
  telefoon: string;
  adres: string;
  postcode: string;
  plaats: string;
};
export type Inschrijving = { p1: Partner; p2: Partner; weekend: string };

const clean = (v: FormDataEntryValue | null, max: number) =>
  (typeof v === 'string' ? v : '').trim().slice(0, max);
const emailOk = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

const partner = (form: FormData, n: 1 | 2): Partner => ({
  naam: clean(form.get(`naam${n}`), 50),
  email: clean(form.get(`email${n}`), 80),
  telefoon: clean(form.get(`telefoon${n}`), 20),
  adres: clean(form.get(`adres${n}`), 60),
  postcode: clean(form.get(`postcode${n}`), 8),
  plaats: clean(form.get(`plaats${n}`), 40),
});

/** Reads the form; returns an error message (string) or the registration. */
export function leesInschrijving(form: FormData): { fout: string } | { data: Inschrijving } {
  const p1 = partner(form, 1);
  const p2 = partner(form, 2);
  if (form.get('zelfdeAdres') === 'ja' || (!p2.adres && !p2.postcode && !p2.plaats)) {
    p2.adres = p1.adres;
    p2.postcode = p1.postcode;
    p2.plaats = p1.plaats;
  }
  for (const [p, label] of [
    [p1, 'partner 1'],
    [p2, 'partner 2'],
  ] as const) {
    if (!p.naam || !emailOk(p.email) || !p.telefoon) {
      return { fout: `Vul naam, een geldig e-mailadres en telefoonnummer van ${label} in.` };
    }
    if (!p.adres || !p.postcode || !p.plaats) {
      return { fout: `Vul straat, postcode en woonplaats van ${label} in.` };
    }
  }
  return { data: { p1, p2, weekend: clean(form.get('weekend'), 60) } };
}

const partnerTekst = (kop: string, p: Partner) => [
  `${kop}: ${p.naam}`,
  `  Adres: ${p.adres}, ${p.postcode} ${p.plaats}`,
  `  E-mail: ${p.email}`,
  `  Telefoon: ${p.telefoon}`,
];

/** Lines for the mail to the secretariat. */
export const inschrijvingTekst = (d: Inschrijving) => [
  `Weekend: ${d.weekend}`,
  ...partnerTekst('Partner 1', d.p1),
  ...partnerTekst('Partner 2', d.p2),
];

/** Both partners receive the confirmation, also when they give the same address. */
export const ontvangers = (d: Inschrijving) => Array.from(new Set([d.p1.email, d.p2.email]));
