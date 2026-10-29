# Mail aan Redwoods: wat we nodig hebben voor online aanmelden met aanbetaling

**Onderwerp:** Online aanmelden Houd me Vast met aanbetaling via Mollie – wat we van jullie nodig hebben

Beste Cris, Michelle en Edwin,

Op de nieuwe website kunnen stellen zich straks direct aanmelden voor het Houd me Vast relatieweekend en meteen de aanbetaling voldoen via iDEAL of creditcard. De techniek daarvoor staat klaar. Om hem aan te zetten hebben we vijf dingen van jullie nodig.

## 1. Een Mollie-account op naam van Redwoods

De betalingen worden uitbetaald op jullie rekening, dus het account moet op naam van de praktijk staan. Aanmelden kan op mollie.com/nl. Mollie vraagt daarbij om:

- KvK-nummer (77235320) en de bedrijfsgegevens
- het IBAN waarop uitbetaald moet worden
- een identiteitsbewijs van de tekenbevoegde en, als die er zijn, van de uiteindelijk belanghebbenden (UBO's)
- een korte omschrijving van wat jullie verkopen: "aanbetaling voor relatieweekenden"

De controle door Mollie duurt meestal één tot enkele werkdagen. Mollie rekent geen abonnementskosten, alleen een bedrag per transactie (iDEAL op dit moment € 0,29 plus btw).

## 2. Toegang voor ons

Nodig in het Mollie-dashboard onder Instellingen → Teamleden het adres daniel@eight.nl uit, met de rol die API-sleutels mag beheren. Dan kunnen wij zelf de sleutels aanmaken en hoeven jullie die niet via de mail te sturen.

Lukt dat niet, maak dan onder Ontwikkelaars → API-sleutels twee sleutels aan en deel ze op een veilige manier (bijvoorbeeld telefonisch of via een wachtwoordkluis, niet per e-mail):

- de **testsleutel** (begint met `test_`), waarmee we alles doorlopen zonder echt geld
- de **livesleutel** (begint met `live_`), die pas actief wordt bij de livegang

## 3. Keuzes over het formulier

Dit stellen we nu voor; laat weten als jullie het anders willen.

| Onderdeel | Voorstel |
|---|---|
| Gevraagde gegevens | Naam partner 1, naam partner 2, e-mailadres, telefoonnummer, gewenst weekend, dieetwensen of opmerkingen (optioneel), akkoord met de voorwaarden |
| Aanbetaling | € 697,50 per stel (50% van € 1.395,-), direct bij aanmelding |
| Restant | € 697,50, gefactureerd door jullie na het intakegesprek, zoals nu |
| Volle weekenden | Niet te kiezen in het formulier; wel een optie "wachtlijst / eerstvolgende beschikbare weekend". Het "vol"-vinkje zetten jullie zelf in het beheerscherm |
| Omschrijving op het bankafschrift | "Aanbetaling Houd me Vast [datum weekend]" |

## 4. De bevestigingsmails

Zodra de aanbetaling binnen is, gaan er automatisch twee mails uit:

- naar secretariaat@redwoodspeopleservices.nl met alle gegevens en het betaalkenmerk;
- naar het stel, met de bevestiging, het betaalde bedrag, de uitleg over het intakegesprek via Zoom en de tip om alvast het boek Houd me Vast te lezen.

De concepttekst van die mail aan het stel sturen we mee; geef aan wat jullie anders willen. Er wordt niets opgeslagen op de website; de gegevens staan bij Mollie bij de betaling en in jullie mailbox.

## 5. Voorwaarden

In het formulier staat een verplicht vinkje voor de algemene en annuleringsvoorwaarden. Daarvoor hebben we de definitieve tekst van jullie annuleringsvoorwaarden voor het weekend nodig, zodat die op de website staat op het moment dat de eerste betaling binnenkomt.

## Planning

Zodra het Mollie-account is goedgekeurd en wij toegang hebben, testen we de hele route in de testomgeving van Mollie (aanmelden, betalen, mails) en zetten we hem daarna live. Reken op een week doorlooptijd na goedkeuring van het account, vooral vanwege de controle door Mollie.

Hartelijke groet,

Daniel Spronk
Eight
