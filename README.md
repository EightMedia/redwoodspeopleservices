# Redwoods People Services – website (Kikker-versie)

Website van [Redwoods People Services](https://www.redwoodspeopleservices.nl), praktijk voor psychotherapie, relatietherapie, coaching en supervisie in Rozendaal. Deze branch (`feature/kikker`) is de herbouw van de Astro-site op Eight's Kikker-stack: Sanity als CMS, Next.js 16 als front-end en de `@eightmedia/kikker-*`-pakketten als fundament. De site op `main` (Astro, Keystatic) is wat nu live staat.

Het ontwerpdocument van de herbouw, met alle afspraken, het contentmodel en de open punten voor Kikker, staat in [`docs/kikker-herbouw.md`](docs/kikker-herbouw.md). Lees dat eerst.

## Inhoud

1. [Opzet](#1-opzet)
2. [Mappen](#2-mappen)
3. [Lokaal werken](#3-lokaal-werken)
4. [Content: Sanity Studio en migratie](#4-content-sanity-studio-en-migratie)
5. [Formulieren, mail en Mollie](#5-formulieren-mail-en-mollie)
6. [Uitrollen op Vercel](#6-uitrollen-op-vercel)
7. [SEO](#7-seo)
8. [Accounts en stand van zaken](#8-accounts-en-stand-van-zaken)
9. [Wat nog moet gebeuren voor deze branch live kan](#9-wat-nog-moet-gebeuren-voor-deze-branch-live-kan)

## 1. Opzet

| Onderdeel | Wat het doet |
|---|---|
| **Next.js 16** (`web/`) | Alle pagina's, App Router, `trailingSlash: true`, dezelfde URL's als de Astro-site. Gecodeerde pagina's (home, over ons, contact, programma's, plaatspagina's) halen hun data uit Sanity; privacyverklaring en algemene voorwaarden zijn Sanity-pagina's via de catch-all route. |
| **Sanity Studio 6** (`studio/`) | Beheerscherm voor blog, team, diensten, tarieven, programmadata, de twee juridische pagina's en de site-instellingen (menu, footer, SEO, redirects). |
| **@eightmedia/kikker-tokens, -react, -groq, -next, -sanity** | Designtokens en thema, basiscomponenten, GROQ-fragmenten, Next-helpers (Sanity-client, live preview, revalidate, security headers) en schema-helpers. |
| **Resend** en **Mollie** | Mail vanuit de formulieren en de aanbetaling van Houd me Vast, functioneel gelijk aan de Astro-versie. |

Het ontwerp is één op één overgenomen: Roboto en Roboto Slab via `next/font`, de merkkleuren als overschrijving van de Kikker-tokens (`web/src/app/theme.css`), eigen componenten in plain CSS met prefix `rw-`. Geen Tailwind.

## 2. Mappen

```
.
├── web/                    Next.js-app
│   ├── src/app/            Routes (één map per URL), layout, theme.css, globals.css
│   ├── src/components/     SiteHeader, SiteFooter, PageHeader, Section, Faq, Cta, TeamCard,
│   │                       Locatie, ContactForm, InschrijfForm, YouTube, Prose, SanityImage
│   ├── src/sanity/         client, live, fetch (met lokale groq-js-stand), image, queries/
│   ├── src/lib/            metadata, jsonld, mail, mollie, inschrijving
│   ├── src/data/           site.ts (praktijkgegevens, menu), routes.ts, redirects.ts
│   └── src/assets/         Afbeeldingen voor gecodeerde pagina's
├── studio/                 Sanity Studio
│   ├── schemaTypes/        Documenttypen, velden, instellingen, structure
│   └── scripts/            migrate-from-astro.ts
├── docs/                   kikker-herbouw.md en de eerdere projectnotities
└── archief/                Oude WordPress-site (ongewijzigd)
```

## 3. Lokaal werken

Node 24 (`.nvmrc`), pnpm via corepack. De Kikker-pakketten staan nog niet op GitHub Packages; tot die tijd link je ze uit een lokale checkout van `kikker-core` naast deze map (`~/Sites/kikker-core` en `~/Sites/redwoods-kikker`), zoals beschreven in `kikker-core/docs/local-linking.md`:

```bash
cd ~/Sites/kikker-core && pnpm install && pnpm build
cd ~/Sites/redwoods-kikker/web
pnpm install
pnpm link ../../kikker-core/packages/tokens ../../kikker-core/packages/react ../../kikker-core/packages/groq ../../kikker-core/packages/next
pnpm dev            # http://localhost:3000
```

```bash
cd ~/Sites/redwoods-kikker/studio
pnpm install
pnpm link ../../kikker-core/packages/sanity ../../kikker-core/packages/groq
pnpm dev            # http://localhost:3333
```

`web/.env.local` heeft `KIKKER_LINK_ROOT=/Users/<jij>/Sites` nodig zolang je linkt (zie `web/.env.example`). Lockfiles en `pnpm-workspace.yaml` met link-paden worden niet gecommit (`.gitignore`); zodra de pakketten gepubliceerd zijn, verdwijnt het linken en komen de lockfiles terug.

**Zonder Sanity-project.** Zolang `NEXT_PUBLIC_SANITY_PROJECT_ID` op `placeholder` staat, leest de site alle content uit de dry-run-uitvoer van het migratiescript (`studio/migration-output/`, zie hieronder) en evalueert GROQ lokaal met `groq-js`. Zo is elke pagina lokaal te bekijken.

## 4. Content: Sanity Studio en migratie

Documenttypen (details in `docs/kikker-herbouw.md` en `studio/README.md`): `page`, `listPage` (blog-overzicht), `news` (blogartikel), `teamMember`, `dienst`, singletons `tarieven`, `houdMeVast`, `rouwEnVerlies`, en de Kikker-instellingen (header, footer, site, SEO, redirects, analytics). Vaste id's zoals `teamMember.cris-van-dusseldorp` en `news.<slug>`.

Migratie vanuit de Astro-content:

```bash
cd studio
pnpm migrate -- "/pad/naar/astro-checkout" --dry-run   # schrijft studio/migration-output/
pnpm migrate -- "/pad/naar/astro-checkout"             # uploadt naar Sanity (SANITY_API_WRITE_TOKEN)
```

Het script is herhaalbaar (vaste id's, `createOrReplace`) en zet markdown om naar Portable Text met dezelfde typografie als Astro.

## 5. Formulieren, mail en Mollie

Gelijk aan de Astro-site: `POST /api/contact` (honeypot, validatie, spamfilter, Turnstile, mail naar het secretariaat plus ontvangstbevestiging), `POST /api/inschrijven` (Houd me Vast, maakt een Mollie-betaling voor `houdMeVast.aanbetalingBedrag` of valt terug op mail), `POST /api/mollie/webhook` (haalt de betaling op bij Mollie en mailt bij `paid` het secretariaat en het stel). Omgevingsvariabelen staan in `web/.env.example`; `PUBLIC_MOLLIE_ENABLED` heet nu `NEXT_PUBLIC_MOLLIE_ENABLED` en `PUBLIC_TURNSTILE_SITE_KEY` heet nu `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.

**Spamwering** (overgezet van `main`, waar ze op 11 nov 2026 is toegevoegd na spam via het contactformulier). Het contactformulier en het aanmeldformulier Houd me Vast gebruiken dezelfde lagen, in `web/src/lib/spam.ts` (server), `web/src/lib/form-client.ts` (browser) en `web/src/components/Turnstile/`:

1. Honeypot: een verborgen veld dat mensen niet invullen.
2. Invultijd: de browser stuurt mee hoe lang het formulier open stond; binnen drie seconden terug is geweigerd.
3. Inhoud: geen webadressen in naam-, telefoon- en adresvelden, hooguit twee links in de vraag, en geen bericht dat grotendeels in een ander schrift is geschreven (Cyrillisch, Chinees en dergelijke).
4. Turnstile: zonder geldige token geen mail en geen Mollie-betaling.

Een geweigerde bezoeker krijgt een uitleg en, bij het contactformulier, het e-mailadres van het secretariaat. In de Vercel-logs staat per weigering alleen de reden (`Formulier geweigerd (spamfilter): …`), geen persoonsgegevens. De bevestigingsmail van het contactformulier gaat alleen weg als Turnstile aanstaat, zodat een bot niet andermans adres kan laten mailen vanaf het domein van de praktijk. Zonder sleutels werken de formulieren met alleen de honeypot en het filter. Lokaal testen kan met de dummy-sleutels van Cloudflare (zie hun documentatie onder Testing) in `web/.env.local`; Next leest dat bestand ook aan de serverkant, dus de hele keten is lokaal te testen.

## 6. Uitrollen op Vercel

Nog niet gedaan voor deze branch. Nodig: root directory `web`, framework Next.js, de omgevingsvariabelen uit `web/.env.example` (waaronder `NEXT_PUBLIC_TURNSTILE_SITE_KEY` en `TURNSTILE_SECRET_KEY` voor de spamwering: altijd allebei zetten, want met alleen de geheime sleutel weigert de server elke inzending, en de site-sleutel wordt bij de build ingebakken, dus na een wijziging opnieuw deployen), en toegang tot GitHub Packages (`.npmrc` met `GITHUB_TOKEN` met `read:packages`) zodra de Kikker-pakketten gepubliceerd zijn. De Studio kan op Sanity's eigen hosting (`pnpm deploy` in `studio/`) of als tweede Vercel-project.

## 7. SEO

Titels, beschrijvingen, canonicals, Open Graph, JSON-LD (LocalBusiness/MedicalBusiness, Service, Person, BlogPosting, Event, FAQPage), sitemap, robots en alle redirects van de oude WordPress-URL's zijn overgenomen (`web/src/lib/metadata.ts`, `jsonld.ts`, `app/sitemap.ts`, `robots.ts`, `data/redirects.ts`). De SEO-analyse en de plaatspagina's staan beschreven in `docs/seo-analyse-2026-11.md`.

## 8. Accounts en stand van zaken

Wachtwoorden en sleutels staan in Proton Pass (Eight), nooit in deze repo.

| Dienst | Status |
|---|---|
| GitHub | organisatie EightMedia, repo `redwoodspeopleservices`; `main` deployt naar Vercel, deze branch niet |
| Vercel | project `redwoodspeopleservices` draait de Astro-site van `main`; voor deze branch is nog geen project ingericht |
| Sanity | nog geen project voor Redwoods in de organisatie Eight Media BV |
| Resend | account bestaat, `RESEND_API_KEY` in Vercel; DNS bij Strato: DKIM en CNAME `send` goed, CNAME `rsend` met tikfout (5 nov 2026), verificatie pending |
| Mollie | account van Redwoods People Services B.V.; testsleutel in Vercel, testbetaling geslaagd; live-sleutel bij livegang |
| DNS | Strato; A `@` en CNAME `www` naar Vercel, Google Search Console TXT staat |

## 9. Wat nog moet gebeuren voor deze branch live kan

1. Kikker-pakketten publiceren op GitHub Packages (release-flow in `kikker-core`), daarna hier `pnpm install` zonder link en de lockfiles committen.
2. Sanity-project aanmaken, CORS voor localhost en het domein, read-token en write-token; project-id in `web/.env.local`, `studio/.env.local` en Vercel.
3. Migratie uitvoeren (`pnpm migrate` zonder `--dry-run`), Studio deployen, de praktijk toegang geven.
4. Vercel-project voor `web/` met alle omgevingsvariabelen; Mollie-webhook werkt per betaling op het aangevraagde domein, dus geen instelling in het Mollie-dashboard.
5. Alle routes vergelijken met de live site (tekst, metadata, JSON-LD, formulieren) en een Mollie-testbetaling en een testmail doorlopen op de preview-URL.
6. DNS omzetten en `main` vervangen door deze branch.
