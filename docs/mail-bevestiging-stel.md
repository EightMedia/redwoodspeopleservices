# Concepttekst: automatische mails bij aanmelding Houd me Vast

Deze teksten verstuurt de website automatisch. Tussen rechte haken staat wat de site zelf invult. De teksten staan in `src/pages/api/mollie/webhook.ts` (na betaling) en `src/pages/api/inschrijven.ts` (zonder betaling); wijzigingen in de tekst passen we daar aan.

## 1. Aan het stel, zodra de aanbetaling is betaald

**Onderwerp:** Bevestiging aanmelding Houd me Vast relatieweekend

> Beste [naam partner 1] en [naam partner 2],
>
> Jullie aanmelding voor het Houd me Vast relatieweekend ([gekozen weekend]) is ontvangen en de aanbetaling van [bedrag] is ontvangen. Betaalkenmerk: [Mollie-kenmerk]. De factuur wordt apart per mail verstuurd.
>
> Fijn dat we jullie mogen verwelkomen, we kijken ernaar uit.
>
> Wat nu? We nemen contact met jullie op om een intakegesprek van ongeveer 30 minuten via Zoom in te plannen. Het resterende bedrag factureren we na dat gesprek. De algemene en annuleringsvoorwaarden van het Houd-me-Vast-weekend zijn van toepassing. Je vindt ze op de website: https://www.redwoodspeopleservices.nl/voorwaarden-houd-me-vast/
>
> In de bijlage geven we alvast een inkijkje in het weekend. Naast praktische zaken vinden jullie hierin ook enkele tips ter voorbereiding.
>
> Hartelijke groet,
> Redwoods People Services
> Rosendaalselaan 30, 6891 DG Rozendaal
> secretariaat@redwoodspeopleservices.nl · +31 6 24913779

Tekst aangepast door Edwin op 16 november 2026. In zijn versie stond "is betaald ontvangen"; dat is hier "is ontvangen" geworden, en achter "op de website" staat het adres van de voorwaardenpagina van het weekend (`/voorwaarden-houd-me-vast/`, tekst van Edwin van 16 november 2026).

**Bijlage:** de opvolgbrief van het weekend (praktische informatie, programma, route naar het klooster in Denekamp) gaat als pdf mee, onder de naam "Houd me Vast relatieweekend - informatie.pdf". Op deze branch staat het bestand in `web/src/assets/mail/houd-me-vast-opvolgbrief.pdf`; `web/src/lib/attachments.ts` leest het en `outputFileTracingIncludes` in `web/next.config.ts` neemt het mee in de webhook-functie. Een nieuwe versie van de praktijk vervangt dat bestand; daarna opnieuw deployen. Lukt het versturen met bijlage niet, dan gaat de mail alsnog zonder bijlage weg en staat dat in de Vercel-logs.

## 2. Aan het secretariaat, zodra de aanbetaling is betaald

**Onderwerp:** [Website] Aanbetaling ontvangen Houd me Vast – [naam partner 1] en [naam partner 2]

> Nieuwe aanmelding Houd me Vast relatieweekend – aanbetaling ontvangen
>
> Weekend: [gekozen weekend]
> Partner 1: [naam]
> Partner 2: [naam]
> E-mail: [e-mailadres]
> Telefoon: [telefoonnummer]
> Opmerkingen/dieetwensen: [tekst of -]
>
> Aanbetaling: [bedrag] betaald via Mollie ([kenmerk]) op [datum en tijd]
> Resterend bedrag factureren na het intakegesprek.

Antwoorden op deze mail gaat rechtstreeks naar het stel (hun adres staat als reply-to).

## 3. Zolang Mollie nog niet actief is: aanmelding zonder betaling

**Aan het stel, onderwerp:** Je aanmelding voor het Houd me Vast relatieweekend

> Beste [naam partner 1] en [naam partner 2],
>
> Bedankt voor jullie aanmelding voor het Houd me Vast relatieweekend ([gekozen weekend]). We nemen contact met jullie op om de aanbetaling van [bedrag] en het intakegesprek via Zoom in te plannen.
>
> Hartelijke groet,
> Redwoods People Services
> Rosendaalselaan 30, 6891 DG Rozendaal
> +31 6 24913779

**Aan het secretariaat, onderwerp:** [Website] Aanmelding Houd me Vast – [naam partner 1] en [naam partner 2]

> Nieuwe aanmelding Houd me Vast relatieweekend (nog zonder aanbetaling)
>
> Weekend, partner 1, partner 2, e-mail, telefoon, opmerkingen, akkoord met voorwaarden: ja
> Aanbetaling van [bedrag] nog te factureren.

## Vragen aan de praktijk

- Klopt de toon ("jullie", "hartelijke groet")?
- Moet de mail aan het stel een vaste ondertekenaar krijgen, bijvoorbeeld Edwin als praktijkcoördinator?
- Willen jullie praktische informatie over de locatie in Denekamp al in deze mail, of pas na de intake?
- Moet er een verwijzing naar de annuleringsvoorwaarden met link in?
