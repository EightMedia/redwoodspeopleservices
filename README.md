# Redwoods People Services – website

Statische website voor [Redwoods People Services](https://www.redwoodspeopleservices.nl), praktijk voor psychotherapie, relatietherapie, coaching en supervisie in Rozendaal. Gebouwd met Astro, gehost op Vercel, content beheerbaar via Keystatic.

Dit document legt uit wat er in het project zit, welke onderdelen er zijn, hoe ze samenwerken en hoe je de site beheert en uitrolt.

## Inhoud

1. [Waarom deze opzet](#1-waarom-deze-opzet)
2. [Frameworks en libraries](#2-frameworks-en-libraries)
3. [Hoe alles samenwerkt](#3-hoe-alles-samenwerkt)
4. [Mappenstructuur](#4-mappenstructuur)
5. [Lokaal werken](#5-lokaal-werken)
6. [Content beheren (Keystatic)](#6-content-beheren-keystatic)
7. [Contactformulier](#7-contactformulier)
8. [Aanmelden Houd me Vast met aanbetaling (Mollie)](#8-aanmelden-houd-me-vast-met-aanbetaling-mollie)
9. [Uitrollen op Vercel](#9-uitrollen-op-vercel)
10. [SEO en vindbaarheid](#10-seo-en-vindbaarheid)
11. [Livegang vanaf WordPress](#11-livegang-vanaf-wordpress)
12. [Accounts en stand van zaken](#12-accounts-en-stand-van-zaken)
13. [Onderhoud](#13-onderhoud)

---

## 1. Waarom deze opzet

De oude site draaide op WordPress met Elementor en WooCommerce. Die combinatie gaf te kleine tekst, te lange regels, veel dubbele content en bleek gehackt (verborgen casino-spam en een gekaapte sitemap). De nieuwe site is bewust eenvoudig:

- **Statisch.** Elke pagina is een kant-en-klaar HTML-bestand. Er draait geen WordPress, geen database en geen PHP. Dat is snel, veilig en vrijwel niet te hacken.
- **Content als bestanden.** Blogposts, teamleden en diensten zijn Markdown-bestanden in de repository. Keystatic biedt daar een beheerscherm op.
- **Eén stukje server.** Alleen het contactformulier heeft een serverfunctie nodig (om te mailen). Vercel draait die automatisch.
- **Leesbaarheid ingebakken.** Broodtekst is 18px, regels zijn maximaal 65 tekens breed, koppen hebben een vaste hiërarchie. Dit zit in de stylesheet, niet in losse pagina-instellingen, zodat het niet kan "wegslijten".

## 2. Frameworks en libraries

| Onderdeel | Wat het is | Wat het hier doet |
|---|---|---|
| **Astro** (`astro`) | Framework voor contentgerichte websites. Bouwt pagina's bij voorbaat tot HTML, stuurt standaard géén JavaScript naar de browser. | De basis van alles: routing (`src/pages`), layouts, componenten, content-collecties, afbeeldingsoptimalisatie en de build. |
| **Tailwind CSS v4** (`tailwindcss`, `@tailwindcss/vite`) | CSS-framework met utility-classes. | Alle opmaak. De huisstijl (kleuren, fonts) staat als tokens in `src/styles/global.css`. |
| **@tailwindcss/typography** | Tailwind-plugin voor nette opmaak van vrije tekst. | Opmaak van Markdown-content (blogartikelen, profielen, dienstteksten) via de klasse `prose-site`. |
| **Fontsource** (`@fontsource/roboto`, `@fontsource/roboto-slab`) | Lettertypes als npm-pakket. | Roboto (broodtekst) en Roboto Slab (koppen) worden lokaal geserveerd, zonder verzoek naar Google Fonts (AVG). |
| **@astrojs/vercel** | Vercel-adapter voor Astro. | Zet de build om in het formaat dat Vercel verwacht en maakt van `/api/contact` een serverless functie. |
| **@astrojs/sitemap** | Sitemap-integratie. | Genereert `sitemap-index.xml` bij elke build. |
| **Resend** (`resend`) | E-mail-API. | Verstuurt de berichten van het contactformulier naar het secretariaat en een bevestiging naar de afzender. |
| **Keystatic** (`@keystatic/core`, `@keystatic/astro`) | Git-gebaseerd CMS. | Beheerscherm op `/keystatic` voor blog, team, diensten, tarieven en programmadata. Slaat alles op als bestanden in de repo. |
| **React** (`react`, `react-dom`, `@astrojs/react`) | UI-bibliotheek. | Alleen nodig voor het Keystatic-beheerscherm. De publieke site gebruikt geen React. |
| **Cloudflare Turnstile** (optioneel, geen pakket) | Spamcheck zonder CAPTCHA-puzzels. | Beschermt het contactformulier zodra de sleutels zijn ingevuld. Zonder sleutels werkt het formulier met alleen een honeypot. |

## 3. Hoe alles samenwerkt

```
                         ┌──────────────────────────────┐
   Redacteur ──login───▶ │  /keystatic  (beheerscherm)   │
                         └──────────────┬───────────────┘
                                        │ commit (Markdown + afbeeldingen)
                                        ▼
                         ┌──────────────────────────────┐
                         │  GitHub-repo                  │
                         │  src/content/*  src/data/*    │
                         └──────────────┬───────────────┘
                                        │ webhook: nieuwe commit
                                        ▼
                         ┌──────────────────────────────┐
                         │  Vercel build: `astro build`  │
                         │  Markdown → HTML, afbeeldingen│
                         │  → WebP, sitemap, redirects   │
                         └──────┬───────────────┬───────┘
                                │               │
                     statische bestanden   serverless functie
                                │               │
                                ▼               ▼
   Bezoeker ◀──── HTML/CSS/WebP (CDN)     /api/contact ──▶ Resend ──▶ e-mail
                                                │
                                                └──▶ Turnstile (spamcheck)
```

**Bouwtijd (build).** `astro build` leest de Markdown-bestanden uit `src/content`, controleert ze tegen het schema in `src/content.config.ts`, rendert elke pagina in `src/pages` naar HTML, maakt van elke afbeelding in `src/assets` geoptimaliseerde WebP-varianten en schrijft sitemap en redirects weg. Het resultaat staat in `dist/` en `.vercel/output/`.

**Bezoektijd (runtime).** Een bezoeker krijgt kant-en-klare bestanden van het Vercel-CDN. Het enige JavaScript op de publieke site is het mobiele menu en de verzendlogica van het contactformulier (samen een paar kilobyte).

**Formulier.** De browser POST naar `/api/contact`. Die route heeft `prerender = false` en draait daardoor als serverless functie op Vercel. De functie valideert de invoer, controleert de Turnstile-token (als geconfigureerd), roept de Resend-API aan en antwoordt met JSON. Er wordt niets opgeslagen.

**Content.** Keystatic schrijft naar dezelfde bestanden die Astro leest. Lokaal (`npm run dev`) direct op schijf; in productie via een commit in GitHub. Elke commit op `main` triggert een nieuwe Vercel-build, na één à twee minuten staat de wijziging live.

## 4. Mappenstructuur

```
.
├── astro.config.mjs        Astro-config: site-URL, adapter, integraties, redirects
├── keystatic.config.ts     Keystatic: welke velden het beheerscherm toont
├── src/
│   ├── content.config.ts   Schema's van de content-collecties (blog, team, diensten)
│   ├── content/
│   │   ├── blog/           Blogposts (Markdown + frontmatter)
│   │   ├── team/           Teamleden
│   │   └── diensten/       Diensten (psychotherapie, relatietherapie, coaching, supervisie)
│   ├── data/
│   │   ├── site.ts         Naam, adres, telefoon, socials, navigatie
│   │   ├── tarieven.json   Tarieventabel (beheerbaar in Keystatic)
│   │   ├── houd-me-vast.json           Data en prijs relatieweekend
│   │   └── rouw-en-verlies.json  Data en prijs rouwgroep
│   ├── assets/             Afbeeldingen (worden bij de build geoptimaliseerd)
│   ├── components/         Header, Footer, ContactForm, Faq, TeamCard, Section, Cta, PageHeader
│   ├── layouts/Base.astro  HTML-skelet, <head>, SEO-tags, JSON-LD, header en footer
│   ├── pages/              Elke file is een URL
│   │   ├── index.astro               /
│   │   ├── diensten/[id].astro       /diensten/psychotherapie/ enz.
│   │   ├── team/[id].astro           /team/cris-van-dusseldorp/ enz.
│   │   ├── blog/[id].astro           /blog/<slug>/
│   │   ├── houd-me-vast.astro, rouw-en-verlies.astro, greenwoods.astro
│   │   ├── over-ons.astro, tarieven.astro, contact/index.astro
│   │   ├── privacybeleid.astro, algemene-voorwaarden.astro, 404.astro
│   │   └── api/contact.ts            Serverless endpoint voor het formulier
│   └── styles/global.css   Tailwind-import, huisstijltokens, basisstijlen
├── public/                 Bestanden die 1-op-1 worden gekopieerd (favicon, robots.txt)
└── .env.example            Welke omgevingsvariabelen nodig zijn
```

## 5. Lokaal werken

Vereist Node 22.12 of hoger (zie `.nvmrc`).

```bash
npm install        # eenmalig
npm run dev        # dev-server op http://localhost:4321, met /keystatic in lokale modus
npm run build      # productie-build naar dist/ en .vercel/output/
npm run preview    # bekijk de build lokaal
```

Kopieer `.env.example` naar `.env` en vul de Resend-sleutel in als je het formulier lokaal wilt testen.

> De map staat in Dropbox. `node_modules` is gemarkeerd als "Dropbox ignored", zodat Dropbox die duizenden bestanden niet synchroniseert. Na een verse `git clone` elders is dat niet nodig.

## 6. Content beheren (Keystatic)

Keystatic is bereikbaar op **`/keystatic`**. Het toont formulieren voor:

| Sectie | Wat je kunt doen | Waar het terechtkomt |
|---|---|---|
| Blog | Artikelen schrijven, bewerken en verwijderen, met omslagfoto en afbeeldingen in de tekst | `src/content/blog/<slug>.md` en `src/assets/blog/` |
| Team | Teamleden toevoegen, foto, functie, intro, specialisaties, registraties, profieltekst, volgorde | `src/content/team/<slug>.md` en `src/assets/team/` |
| Diensten | Teksten en veelgestelde vragen per dienst | `src/content/diensten/<slug>.md` |
| Tarieven | De tarieventabel en de studententarieven | `src/data/tarieven.json` |
| Houd me Vast | Weekenddata (met "vol"-vinkje), prijs en aanbetaling | `src/data/houd-me-vast.json` |
| Rouw en Verlies | Startdatum, omvang, prijs | `src/data/rouw-en-verlies.json` |

De homepage, Over ons, Greenwoods en Contact staan bewust in code. Daar verandert zelden iets, en zo blijft de structuur (en de leesbaarheid) intact.

### Toegang geven aan de klant

Keystatic kent drie opslagmodi, ingesteld in `keystatic.config.ts`:

1. **Lokaal** (automatisch bij `npm run dev`): schrijft direct naar de bestanden op je machine. Voor ontwikkelaars.
2. **GitHub** (standaard in productie): de redacteur logt in met een GitHub-account dat toegang heeft tot de repo. Keystatic maakt commits namens die persoon. Eenmalige setup: ga lokaal naar `/keystatic`, kies "Setup GitHub App" en volg de stappen. Dat levert vier variabelen op (`KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`) die je in Vercel zet.
3. **Keystatic Cloud** (aanbevolen voor de klant): de redacteur logt in met e-mail, zonder GitHub-account. Maak een project aan op keystatic.cloud, koppel de repo en zet `PUBLIC_KEYSTATIC_CLOUD_PROJECT=team/project` in Vercel. Gratis voor kleine teams.

### Afbeeldingen

Een afbeeldingsveld slaat het bestand op in de repo (`src/assets/blog/` of `src/assets/team/`). Astro maakt daar bij de build verkleinde WebP-varianten van. Richtlijn voor redacteuren: foto's kleiner dan 2 MB en minimaal 1200 pixels breed uploaden. Keystatic verkleint zelf niet.

### Handmatig (zonder Keystatic)

Een blogpost is een gewoon Markdown-bestand met frontmatter. Je kunt er ook een aanmaken in GitHub of je editor:

```markdown
---
title: "Titel van het artikel"
description: "Twee zinnen samenvatting voor overzichten en Google."
date: 2026-11-01
cover: ../../assets/blog/mijn-foto.jpg
author: "Cris van Dusseldorp"
---

Tekst in Markdown. Koppen met `##`, nadruk met `**vet**`.
```

## 7. Contactformulier

Velden: naam, e-mailadres, telefoonnummer en vraag. Het formulier staat op de contactpagina en, met een ander onderwerp, op de dienstpagina's, Houd me Vast en Rouw en Verlies.

**Flow**

1. De browser stuurt de velden naar `/api/contact` (progressive enhancement: zonder JavaScript werkt een gewone POST met redirect naar `/contact/bedankt/`).
2. De serverless functie (`src/pages/api/contact.ts`) controleert een verborgen honeypot-veld, valideert naam, e-mail en vraag, en controleert de Turnstile-token als `TURNSTILE_SECRET_KEY` is ingesteld.
3. Via Resend gaat één mail naar `MAIL_TO` (het secretariaat) met het e-mailadres van de afzender als reply-to, en één bevestiging naar de afzender.
4. De functie antwoordt met JSON; de pagina toont een bevestiging. Er wordt niets in een database opgeslagen. Resend bewaart verzonden mails tijdelijk in zijn eigen logboek.

**Instellen**

- Het Resend-account bestaat; de inloggegevens staan in Proton Pass (Eight). Gratis tot 3.000 mails per maand.
- Verifieer het domein `redwoodspeopleservices.nl` (DNS-records die Resend toont), zodat je kunt verzenden vanaf `noreply@redwoodspeopleservices.nl`.
- `RESEND_API_KEY`, `MAIL_FROM` en `MAIL_TO` staan in Vercel (Settings → Environment Variables). Verzenden vanaf het eigen domein werkt pas als de DNS-records van Resend bij Strato staan.
- Optioneel: maak een Turnstile-widget aan in het Cloudflare-dashboard en zet `PUBLIC_TURNSTILE_SITE_KEY` en `TURNSTILE_SECRET_KEY` in Vercel.

## 8. Aanmelden Houd me Vast met aanbetaling (Mollie)

Het aanmeldformulier op `/houd-me-vast/` (`src/components/InschrijfForm.astro`) vraagt beide namen, e-mail, telefoon, gewenst weekend, opmerkingen en akkoord met de voorwaarden. Er is geen database; de flow loopt volledig via Mollie en e-mail.

1. `POST /api/inschrijven` valideert en maakt met `MOLLIE_API_KEY` een betaling aan voor het bedrag in `src/data/houd-me-vast.json` (`aanbetalingBedrag`, beheerbaar in Keystatic). De formuliergegevens gaan mee als metadata van de betaling.
2. De bezoeker betaalt op de Mollie-checkout (iDEAL, creditcard) en komt terug op `/houd-me-vast/bedankt/?id=tr_…`, die de status toont.
3. Mollie roept `POST /api/mollie/webhook` aan. De site haalt de betaling op bij Mollie (echtheidscontrole) en mailt bij status `paid` het secretariaat én het stel. Het restant factureert de praktijk na de intake.

Zonder `MOLLIE_API_KEY` valt het formulier terug op een aanmelding per mail; de praktijk regelt de aanbetaling dan zelf. Zet daarom ook `PUBLIC_MOLLIE_ENABLED=true` zodra de sleutel er is, zodat het formulier de betaalstap aankondigt.

Testen: gebruik de `test_`-sleutel van Mollie in een Vercel Preview-omgeving (de webhook moet publiek bereikbaar zijn, dus niet op localhost). Mollie's testmodus laat je elke betaalstatus simuleren.

## 9. Uitrollen op Vercel

1. Importeer de GitHub-repo in Vercel (Add New → Project). Vercel herkent Astro; framework preset "Astro", build command `astro build`, output wordt door de adapter bepaald.
2. Vul de omgevingsvariabelen uit `.env.example` in.
3. Deploy. Elke push naar `main` deployt automatisch; elke pull request krijgt een preview-URL.
4. Koppel het domein: Settings → Domains → `redwoodspeopleservices.nl` en `www.redwoodspeopleservices.nl`. Vercel toont de DNS-records (A-record naar `76.76.21.21` en CNAME voor `www`). Zet `www` als primair domein, zodat de canonical-URL's kloppen.

**Plan.** Het gratis Hobby-plan van Vercel is volgens de voorwaarden alleen voor niet-commercieel gebruik. Voor een praktijksite is Pro (ca. 20 dollar per maand) de nette keuze. Alternatief met dezelfde code: Cloudflare Pages (gratis voor commercieel gebruik, adapter wisselen naar `@astrojs/cloudflare`).

## 10. SEO en vindbaarheid

Wat er in zit:

- Unieke `<title>` en meta description per pagina, met plaatsnamen (Rozendaal, Arnhem, Velp) in titels van diensten en de homepage.
- Open Graph-tags en een OG-afbeelding per pagina.
- **JSON-LD** op elke pagina: `LocalBusiness`/`MedicalBusiness` met adres, geo, openingstijden en werkgebied. Daarbovenop `Service` op dienstpagina's, `Person` op teamprofielen, `BlogPosting` op artikelen, `Event` voor het relatieweekend en `FAQPage` bij elke lijst veelgestelde vragen. AI-assistenten en Google lezen dit direct.
- Automatische sitemap (`/sitemap-index.xml`), `robots.txt` die AI-crawlers toelaat en `/api/` uitsluit.
- Eén H1 per pagina, logische koppenhiërarchie, alt-teksten op afbeeldingen.
- Redirects van alle oude WordPress-URL's (zie `astro.config.mjs`), zodat bestaande posities behouden blijven.

Buiten de code, maar minstens zo belangrijk: Google Bedrijfsprofiel claimen (categorie Psychotherapeut), vermeldingen bij Zorgkaart Nederland en de registers van VIT, RBCZ en SCAG, en na livegang in Google Search Console de nieuwe sitemap indienen en de spam-URL's van de oude site laten verwijderen.

## 11. Livegang vanaf WordPress

1. DNS omzetten naar Vercel (zie het hoofdstuk Uitrollen op Vercel). Zet de TTL een dag van tevoren laag.
2. De oude WordPress-installatie direct daarna offline halen of in elk geval niet meer bereikbaar laten via het domein. De gehackte bestanden mogen niet blijven staan.
3. In Google Search Console: eigendom verifiëren voor het nieuwe domein, sitemap `https://www.redwoodspeopleservices.nl/sitemap-index.xml` indienen, en onder "Verwijderingen" de URL's onder `/nl/nieuwe-casinos/` laten verwijderen.
4. Controleer de omgevingsvariabelen in Vercel (Resend, eventueel Turnstile en Keystatic) en stuur een testbericht via het contactformulier.
5. Vraag de praktijk de teksten voor privacybeleid en algemene voorwaarden na te lopen; de huidige teksten zijn een beknopt startpunt.

## 12. Accounts en stand van zaken

Wachtwoorden en sleutels staan in Proton Pass (Eight), nooit in deze repo.

| Dienst | Waar | Status |
|---|---|---|
| GitHub | organisatie EightMedia, repo `redwoodspeopleservices` | Gekoppeld aan Vercel; elke push naar `main` deployt |
| Vercel | team Eight Media (Pro), project `redwoodspeopleservices` | Live op redwoodspeopleservices.vercel.app; domeinen toegevoegd, wachten op DNS |
| Resend | account aangemaakt, inlog in Proton Pass | `RESEND_API_KEY` staat in Vercel; domeinverificatie wacht op DNS-records bij Strato |
| Mollie | nog aan te vragen door de praktijk | Code staat klaar; zie `docs/mail-opdrachtgever-mollie.md` voor wat we nodig hebben |
| Keystatic | `/keystatic` | Lokaal werkend; toegang voor de klant (Cloud of GitHub-app) nog in te richten |
| DNS | Strato, beheerd door de domeinhouder | Te zetten: A `@` → 216.150.16.1, CNAME `www` → `1c372f4ef3c47e2c.vercel-dns-016.com`, plus de drie Resend-records. MX (Google Workspace) en SPF niet wijzigen |

Openstaand voor de praktijk: definitieve teksten privacybeleid en algemene/annuleringsvoorwaarden, Mollie-account, Google Bedrijfsprofiel, en na de DNS-omzetting de oude WordPress-site uitzetten en in Search Console de spam-URL's laten verwijderen.

## 13. Onderhoud

- **Afhankelijkheden bijwerken**: `npm outdated` en `npm update`, daarna `npm run build` om te controleren. Doe dit een paar keer per jaar.
- **Nieuwe pagina**: maak een `.astro`-bestand in `src/pages`, gebruik `Base` als layout en `PageHeader`/`Section` voor de structuur. Voeg de link toe aan `nav` in `src/data/site.ts`.
- **Huisstijl aanpassen**: kleuren en fonts staan in `@theme` in `src/styles/global.css`.
- **Adres of telefoonnummer wijzigen**: `src/data/site.ts`, dat voedt footer, contactpagina en JSON-LD tegelijk.
