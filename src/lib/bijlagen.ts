// Vite zet het bestand als base64 in de serverbundel (`?inline`), zodat de functie op Vercel
// geen los bestand hoeft te vinden. De pdf staat daardoor niet openbaar op de site.
import opvolgbrief from "../assets/mail/houd-me-vast-opvolgbrief.pdf?inline";

export type Bijlage = { filename: string; content: string };

/**
 * Opvolgbrief van het Houd me Vast relatieweekend (praktische informatie, programma, route).
 * Gaat mee met de bevestigingsmail na de aanbetaling. Nieuwe versie van de praktijk: vervang
 * `src/assets/mail/houd-me-vast-opvolgbrief.pdf` en deploy opnieuw.
 */
export const opvolgbriefHmv: Bijlage = {
  filename: "Houd me Vast relatieweekend - informatie.pdf",
  content: opvolgbrief.slice(opvolgbrief.indexOf(",") + 1),
};
