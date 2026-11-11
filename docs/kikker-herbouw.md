# Herbouw op Kikker (branch `feature/kikker`)

Dit document is de afspraak tussen alle agents en mensen die aan de herbouw werken. Lees het
helemaal voordat je iets bouwt. Wijkt de werkelijkheid af van dit document, pas dan het
document aan, niet stilzwijgend de code.

## Doel

De huidige Astro-site van Redwoods People Services (branch `main`, live op
https://www.redwoodspeopleservices.nl) wordt één op één herbouwd op Eight's Kikker-stack:
Sanity (CMS), Next.js 16 (App Router) en de `@eightmedia/kikker-*` pakketten. Het
eindresultaat moet voor bezoekers hetzelfde zijn: dezelfde URL's, dezelfde teksten,
hetzelfde ontwerp, dezelfde formulieren en betalingen. Voor de praktijk komt er een Sanity
Studio in plaats van Keystatic.

Wat niet verandert: `main` blijft onaangeroerd. Alles gebeurt op `feature/kikker`, in de
worktree `~/Sites/redwoods-kikker` naast `~/Sites/kikker-core`.

## Locaties

| Wat | Waar |
| --- | --- |
| Deze branch (worktree) | `~/Sites/redwoods-kikker` |
| Kikker-core (gebouwd, lokaal gelinkt) | `~/Sites/kikker-core` |
| Kikker-documentatie | `~/Sites/kikker-core/docs/*.md`, `AGENTS.md`, `skills/` |
| Referentie-implementatie | `~/Sites/kikker-core/examples/sandbox/web` en `.../studio` |
| Bronsite (Astro, alleen lezen) | `/Users/danielspronk/Eight Media Dropbox/Daniel Spronk/Felagund/all things Eight/Redwoodspeopleservices` (branch `main`) |
| Live site (ontwerpreferentie) | https://www.redwoodspeopleservices.nl |

De Astro-bron staat op deze branch ook nog in git-historie (`git show main:src/...`), maar
lees liever uit de Dropbox-checkout hierboven: die bevat de laatste contentwijzigingen.

## Repo-structuur op deze branch

```
redwoods-kikker/
├── web/          Next.js 16-app (App Router, src/, TypeScript, pnpm)
├── studio/       Sanity Studio 6 + migratiescript
├── docs/         projectdocumentatie (dit document, feedback-notities)
├── archief/      ongewijzigd (oude site)
├── .nvmrc        24
└── README.md     wordt aan het eind herschreven voor de nieuwe stack
```

`web/` en `studio/` zijn twee losse pnpm-projecten met elk een eigen lockfile (geen
root-workspace). De Astro-bestanden (`src/`, `public/`, `astro.config.mjs`,
`keystatic.config.ts`, root `package.json`, `package-lock.json`, `tsconfig.json`,
`vercel.json`, `scripts/`) verdwijnen van deze branch zodra hun vervanging er is. Verplaats
wat herbruikbaar is (afbeeldingen, downloads, robots) naar `web/`.

## Kikker-pakketten: lokaal gelinkt

De pakketten staan nog niet op GitHub Packages. We volgen `kikker-core/docs/local-linking.md`:

- `package.json` van `web/` en `studio/` noemt de gepubliceerde versies zoals ze nu in
  kikker-core staan: tokens `^0.1.0`, react `^0.2.0`, groq `^1.0.0`, sanity `^1.0.0`,
  next `^1.0.0`.
- Lokaal linken: `cd web && pnpm link ../../kikker-core/packages/tokens ../../kikker-core/packages/react ../../kikker-core/packages/groq ../../kikker-core/packages/next`
  en `cd studio && pnpm link ../../kikker-core/packages/sanity ../../kikker-core/packages/groq`.
- `web/next.config.ts` leest `KIKKER_LINK_ROOT` (zie local-linking.md); `web/.env.local`
  bevat `KIKKER_LINK_ROOT=/Users/danielspronk/Sites`.
- `pnpm link` (pnpm 12) laat `package.json` met rust en schrijft de `link:`-paden alleen in
  `pnpm-workspace.yaml` (overrides) en `pnpm-lock.yaml`. Zolang de pakketten niet op GitHub
  Packages staan kan er geen lockfile met gepubliceerde versies bestaan: commit
  `web/pnpm-lock.yaml` en `web/pnpm-workspace.yaml` dan ook nog niet.
- Commit nooit de link-paden. Voor het committen: `git checkout -- package.json pnpm-lock.yaml`
  (en verwijder een eventueel aangemaakte `pnpm-workspace.yaml`). Beschrijf in de README
  hoe een collega linkt totdat de pakketten gepubliceerd zijn. Voeg `.npmrc.example` toe
  zoals in `EightMedia/loft.nl`.

Wijzig niets in `~/Sites/kikker-core`. Mis je iets in Kikker, los het dan op in projectcode
en noteer het onder "Open punten voor Kikker" onderaan dit document.

## Omgeving

Node 24 (`~/.nvm/versions/node/v24.13.1`, al actief), pnpm via corepack (`corepack enable`
is gedaan). `nvm` als shellcommando bestaat niet; `nvm use` kun je overslaan.

## URL's (moeten exact gelijk blijven, met slash aan het eind)

```
/                                   home (code)
/over-ons/                          code
/contact/                           code, contactformulier
/diensten/                          code, overzicht uit Sanity
/diensten/[slug]/                   dienst uit Sanity (psychotherapie, relatietherapie, coaching, supervisie)
/team/                              code, overzicht uit Sanity
/team/[slug]/                       teamlid uit Sanity (7 personen)
/blog/                              overzicht uit Sanity
/blog/[slug]/                       blogartikel uit Sanity (6 artikelen)
/tarieven/                          code, data uit Sanity-singleton tarieven
/programmas/                        code
/houd-me-vast/                      code, data uit singleton houdMeVast, inschrijfformulier + Mollie
/houd-me-vast/bedankt/?id=tr_…      code, leest Mollie-status
/rouw-en-verlies/                   code, data uit singleton rouwEnVerlies
/greenwoods/                        code
/relatietherapie-arnhem/            code (plaatspagina)
/relatietherapie-velp/              code (plaatspagina)
/psychotherapie-arnhem/             code (plaatspagina)
/therapie-rheden-rozendaal/         code (plaatspagina)
/contact/bedankt/                   code (bevestiging contactformulier)
/privacybeleid/                     Sanity `page` via catch-all
/algemene-voorwaarden/              Sanity `page` via catch-all
/404                                code (not-found.tsx)
/api/contact                        POST, Resend-mail + ontvangstbevestiging
/api/inschrijven                    POST, Mollie-betaling aanmaken (of mail-fallback)
/api/mollie/webhook                 POST, Mollie-webhook → bevestigingsmails
/sitemap.xml, /robots.txt           Kikker-helpers (buildSitemap/buildRobots) + eigen routes
```

De catch-all is `web/src/app/[...slug]/page.tsx` (verplicht segment, geen `[[...slug]]`): de
home is een gecodeerde `src/app/page.tsx`, en Next staat geen optionele catch-all naast een
`page.tsx` op hetzelfde niveau toe. `/` komt dus nooit in de catch-all.

Next-config: `trailingSlash: true`. De 20 redirects uit `vercel.json` op main (oude
WordPress-URL's) gaan naar `redirects()` in `next.config.ts`, met en zonder slash. De
catch-all gebruikt daarnaast Kikker's `fetchRedirect`, zodat de praktijk later redirects in
Sanity kan beheren.

"Code" betekent: een vaste Next-route met React-componenten, teksten in de code (zoals nu
in Astro), waar nodig aangevuld met data uit Sanity. Dat was de afspraak met de praktijk:
home, over-ons en contact blijven in code; blog, team, diensten en de tariefdata zijn
bewerkbaar in het CMS. Nieuw ten opzichte van Astro: privacyverklaring en algemene
voorwaarden worden Sanity-pagina's, zodat de praktijk die zelf kan bijwerken.

## Contentmodel (Sanity, in `studio/schemaTypes/`)

Gebruik Kikker-helpers waar ze bestaan (`@eightmedia/kikker-sanity`): `fieldSeo`, `fieldSlug`,
`fieldTitle`, `fieldBlockContent`, `fieldImage`, `fieldListDisplay`, `fieldPublicationWindow`,
`documentPage`, `documentListPage`, `documentNews`, `settingsHeader`, `settingsFooter`,
`settingsSiteSettings`, `settingsRedirects`, `settingsSeo`, `kikkerTemplates`. Lees
`kikker-core/docs/sanity-schema.md` en de sandbox-studio. Één site: `siteNames: ['default']`,
`kikker.config.ts` met `site.name: 'default'`.

| Documenttype | Bron op main | Velden |
| --- | --- | --- |
| `page` (Kikker) | `src/pages/privacybeleid.astro`, `algemene-voorwaarden.astro` | title, slug, seo, body (blockContent) |
| `listPage` (Kikker) | — | één document met slug `blog`, titel "Blog" (ouder van news) |
| `news` (Kikker) = blogartikel | `src/content/blog/*.md` | title, slug, publicationDate (= `date`), listDisplay (text = `description`, image = `cover`), author (string, default "Redwoods People Services"), body (blockContent) |
| `teamMember` (eigen) | `src/content/team/*.md` | name, slug (= bestandsnaam), role, intro, photo (image), order (number), registrations (string[]), specialties (string[]), wachttijd (string, optioneel), body (blockContent) |
| `dienst` (eigen) | `src/content/diensten/*.md` | title, slug (= bestandsnaam), description (SEO), intro, order, faq[] { q: string, a: blockContent }, body (blockContent) |
| `tarieven` (eigen singleton) | `src/data/tarieven.json` | geldigVanaf, tarieven[] { naam, prijs, btw, info }, noShow { titel, tekst } |
| `houdMeVast` (eigen singleton) | `src/data/houd-me-vast.json` | prijs, aanbetaling, aanbetalingBedrag (number, voor Mollie), data[] { datum, vol } |
| `rouwEnVerlies` (eigen singleton) | `src/data/rouw-en-verlies.json` | wanneer, omvang, prijs, inclusief |
| Kikker settings | `src/data/site.ts` (`nav`), `Footer.astro` | header (menu), footer, siteSettings, seo, redirects, analytics |

Praktijkgegevens (naam, adres, telefoon, e-mail, KvK, socials, openingstijden) blijven in
code: `web/src/data/site.ts`, één op één uit Astro overgenomen.

Markdown-links in FAQ-antwoorden (`[tekst](/pad/)`) worden bij migratie echte links in
Portable Text. De markdown-body's (blog, team, diensten) worden Portable Text via
markdown → HTML → `@portabletext/block-tools`.

Studio-teksten (labels, beschrijvingen) in het Nederlands, zoals Keystatic nu. Code en
commentaar in het Engels (Kikker-regel).

## Migratie

`studio/scripts/migrate-from-astro.ts <pad-naar-astro-checkout>` leest de bronbestanden,
uploadt afbeeldingen (teamfoto's, blogcovers) naar Sanity en schrijft alle documenten met
vaste `_id`'s (bijv. `teamMember.cris-van-dusseldorp`, `news.samen-door-de-modder`,
`tarieven`), zodat het script herhaalbaar is. Schrijven gebeurt met
`SANITY_API_WRITE_TOKEN` uit `studio/.env.local`. Het script mag pas tegen het echte project
draaien als `NEXT_PUBLIC_SANITY_PROJECT_ID` bekend is; tot die tijd: `--dry-run` schrijft
NDJSON naar `studio/migration-output/` (git-ignored).

## Ontwerp

Het ontwerp blijft exact zoals de live site. Referentie: de Astro-componenten in
`src/components/*.astro`, `src/layouts/Base.astro`, `src/styles/global.css` en de live site.

- Tokens: eigen thema-CSS `web/src/app/theme.css` dat de Kikker-variabelen overschrijft
  (`--kr-color-primary-normal: #e75c50`, enz.). Lees `kikker-core/packages/tokens/src/definition.ts`
  en de gegenereerde `css/theme-default.css` om te zien welke variabelen bestaan. Merkkleuren:
  brand #e75c50, brand-dark #b7392e, brand-deep #8f2a22, brand-soft #fbe9e6, brand-tint #fdf4f2,
  forest #3f5d4b, forest-soft #e6ede8, ink #2b2b2b, muted #5c5c5c, line #e8e2dc, sand #f7f3ee,
  paper #ffffff. Fonts: Roboto (400/500/700) voor tekst, Roboto Slab (500/700) voor koppen,
  via `next/font/google`.
- Surfaces: Kikker kent `default`, `subtle`, `loud`, `loud-alt`, `inverse`. Afspraak:
  `default` = paper, `subtle` = sand, `loud` = brand (#e75c50, witte tekst), `loud-alt` =
  brand-soft, `inverse` = forest. Astro's `<Section tone="sand|brand|...">` wordt Kikker's
  `Section` met `surface`.
- Kikker-componenten gebruiken waar ze passen: `PageWrapper`, `Header`, `Footer`, `Section`,
  `Container`, `Button`, `Link`, `RichText`/`BlockContent`, `Figure`, `CtaSection`. Lukt het
  ontwerp niet met de Kikker-header of -footer, bouw dan een eigen `SiteHeader`/`SiteFooter`
  in projectcode en noteer waarom onder "Open punten voor Kikker".
- Eigen componenten (projectcode, `web/src/components/<Naam>/<Naam>.tsx` + `<Naam>.css`,
  plain CSS, ongelayerd, class-prefix `rw-`): PageHeader, Faq (details/summary zoals nu),
  TeamCard, Locatie (plaatspagina-template), Cta, YouTube, ContactForm (client),
  InschrijfForm (client), Section-varianten die Kikker niet kent.
- Geen Tailwind. Geen CSS-in-JS. Toegankelijkheid minstens zoals nu (skip-link, focus-stijlen,
  labels, `aria-*` op het menu).

## SEO en metadata

Zelfde titels, beschrijvingen, canonicals, Open Graph, JSON-LD (LocalBusiness +
MedicalBusiness uit `Base.astro`, FAQPage op dienstpagina's en plaatspagina's, Article op
blog) als op main. Gebruik Kikker's `buildPageMetadata`, `buildSitemap`, `buildRobots`,
`kikkerSecurityHeaders` waar het past; vul aan met eigen code waar Kikker tekortschiet.
Titelregel: `${title} | Redwoods People Services` als dat ≤ 60 tekens is, anders
`| Redwoods`, anders alleen de titel (zie `Base.astro`).

## Formulieren, mail en Mollie

Port `src/lib/mail.ts`, `src/lib/mollie.ts`, `src/lib/inschrijving.ts` en de drie API-routes
naar `web/src/lib/` en `web/src/app/api/.../route.ts`, functioneel identiek. Env-variabelen
behouden dezelfde namen: `PUBLIC_MOLLIE_ENABLED` wordt `NEXT_PUBLIC_MOLLIE_ENABLED`,
`MOLLIE_API_KEY`, `RESEND_API_KEY`, `MAIL_FROM`, `MAIL_TO`, plus `NEXT_PUBLIC_SITE_URL`.
Spamwering (van `main`, 11 nov 2026): `PUBLIC_TURNSTILE_SITE_KEY` wordt
`NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` blijft; zie README §5.
Geen sleutels in de repo; `web/.env.example` documenteert de namen. Formulieren posten met
`fetch` naar dezelfde paden als nu, met dezelfde foutmeldingen (Nederlands).

## Werkafspraken voor agents

- Werk alleen in de map die in je opdracht staat. Raak geen bestanden van een andere agent.
- Commit niet; de hoofdsessie commit per fase. Wijzig niets op `main` en niets in
  `~/Sites/kikker-core`.
- Elke opdracht eindigt met een werkende `pnpm build` (of `pnpm typecheck`) van het eigen
  pakket, en een korte lijst van wat af is, wat niet, en wat je in Kikker miste.
- Teksten letterlijk overnemen van main. Niet herschrijven, niet "verbeteren".
- Bij twijfel over Kikker-API: lees de bron in `kikker-core/packages/*/src`, niet alleen de docs.

## Contracten tweede ronde (bindend voor de parallelle agents)

Drie agents werken tegelijk. Ieder raakt alleen zijn eigen bestanden; gedeelde code wordt
gebruikt via de afspraken hieronder, niet door ernaar te gaan zitten wachten of hem zelf te
schrijven.

### Datalaag (eigenaar: agent API)

`web/src/sanity/fetch.ts`:

```ts
export async function sanityFetch<T>(opts: { query: string; params?: Record<string, unknown>; tags?: string[] }): Promise<T>;
```

Is `hasSanityProject` (uit `client.ts`) waar, dan gaat de query via next-sanity (`live.ts`).
Zo niet, dan evalueert `groq-js` de query lokaal over de dry-run-uitvoer van het
migratiescript: `../studio/migration-output/documents.ndjson` plus `assets.ndjson` (één
document per regel, pad relatief aan `web/`). Zo zijn alle pagina's lokaal te bekijken en te
vergelijken zonder Sanity-project. Projecties met `->` werken daardoor ook lokaal.

Afbeeldingen: `web/src/sanity/image.ts` exporteert
`imageUrl(image, opts?: { width?: number; height?: number; fit?: string }): string | undefined`.
Bij een echt project: `@sanity/image-url`. Lokaal: de `url` van het asset-document (begint
met `/migration-assets/`). Component `web/src/components/SanityImage/SanityImage.tsx`
(`{ image, alt, width?, height?, sizes?, className?, priority? }`) rendert een `<img>` met die
url. Route `web/src/app/migration-assets/[...file]/route.ts` serveert in development de
bestanden uit `studio/migration-output/assets/`.

Projecteer afbeeldingen altijd als
`foto{ hotspot, crop, asset->{ _id, url, metadata{ dimensions } } }`.

### Dry-run-uitvoer van de migratie (eigenaar: agent Studio)

- `studio/migration-output/documents.ndjson`: alle documenten.
- `studio/migration-output/assets.ndjson`: per afbeelding een `sanity.imageAsset`-document
  met `_id` `image-<sha1>-<breedte>x<hoogte>-<ext>`, `url: "/migration-assets/<bestand>"`,
  `originalFilename`, `metadata.dimensions{ width, height, aspectRatio }`.
- `studio/migration-output/assets/<bestand>`: de gekopieerde afbeeldingen.
- Afbeeldingsvelden in documenten: `{ _type: "image", asset: { _type: "reference", _ref: "<id>" } }`.
- Bij een echte run worden dezelfde `_id`'s gebruikt zodat verwijzingen gelijk blijven.

### Gedeelde componenten (eigenaar: agent Pagina's A)

| Pad | Props |
| --- | --- |
| `components/Section/Section.tsx` | `{ surface?: "default" \| "subtle" \| "loud" \| "loud-alt" \| "inverse"; id?: string; className?: string; children }` (Astro tone → surface: paper=default, sand=subtle, tint=loud-alt, brand=loud, forest=inverse; koppen op loud/inverse wit) |
| `components/Faq/Faq.tsx` | `{ items: { q: string; a: string \| PortableTextBlock[] }[]; title?: string }`, standaardtitel "Veelgestelde vragen", `details/summary`, FAQPage-JSON-LD, string-antwoorden met `[tekst](/pad/)`-links zoals Faq.astro |
| `components/Cta/Cta.tsx` | `{ title?, text?, primary?: { label, href }, secondary?: { label, href } }` met dezelfde standaardwaarden als Cta.astro |
| `components/TeamCard/TeamCard.tsx` | `{ member: TeamMember; compact?: boolean }` |
| `components/YouTube/YouTube.tsx` (client) | `{ id: string; title: string; poster: StaticImageData \| string; className?: string }` |
| `components/ContactForm/ContactForm.tsx` (client) | dezelfde props als ContactForm.astro; post naar `/api/contact` |

Types in `web/src/sanity/types.ts` (eigenaar Pagina's A): `TeamMember`, `Dienst`, `BlogPost`,
`Tarieven`, `HoudMeVast`, `RouwEnVerlies`, `SanityImage`, met de veldnamen uit het
contentmodel; `slug` is een string (`slug.current` al geprojecteerd).

Queries (eigenaar Pagina's A) in `web/src/sanity/queries/`: `team.ts` met `getTeamMembers()`,
`getTeamMember(slug)`, `getTeamMembersBySlugs(slugs: string[])` (in de gegeven volgorde);
`diensten.ts` met `getDiensten()`, `getDienst(slug)`; `blog.ts` met `getBlogPosts()`,
`getBlogPost(slug)`; `tarieven.ts` met `getTarieven()`.
Eigenaar Pagina's B: `queries/programmas.ts` met `getHoudMeVast()`, `getRouwEnVerlies()`.

### Verdeling van routes

- Pagina's A: `/`, `/over-ons/`, `/contact/`, `/contact/bedankt/`, `/diensten/`,
  `/diensten/[slug]/`, `/team/`, `/team/[slug]/`, `/blog/`, `/blog/[slug]/`, `/tarieven/`,
  `/programmas/`.
- Pagina's B: `/houd-me-vast/`, `/houd-me-vast/bedankt/`, `/rouw-en-verlies/`, `/greenwoods/`,
  de vier plaatspagina's, plus `components/Locatie/Locatie.tsx` en
  `components/InschrijfForm/InschrijfForm.tsx` (client).
- API: `web/src/lib/{mail,mollie,inschrijving}.ts` (exportnamen gelijk aan de Astro-versies),
  `app/api/contact/route.ts`, `app/api/inschrijven/route.ts`, `app/api/mollie/webhook/route.ts`,
  plus de datalaag hierboven.

Een agent die een bestand van een ander nodig heeft dat er nog niet is, bouwt tegen het
contract en wacht met `pnpm build` tot het bestand bestaat (controleer op het bestandssysteem,
maximaal 45 minuten); daarna `pnpm build` in `web/`.

## Open punten voor Kikker

(vul aan tijdens de bouw)

- **Header**: Kikker's `Header` kent alleen platte `primaryNav`/`secondaryNav`-lijsten, een
  logo uitsluitend als inline-SVG-string en geen knop-slot of mobiel menu. De Redwoods-header
  heeft dropdowns (Diensten, Programma's), een PNG-logo, een primaire Contact-knop en een
  menuknop met `aria-expanded`. Daarom `web/src/components/SiteHeader/` in projectcode.
- **Footer**: Kikker's `Footer` kent kolommen met tekst/links en een colofon, maar geen
  adresblok (`<address>` met tel/mail-links), geen zes-koloms raster met een dubbele
  eerste kolom en geen onderbalk met copyright, juridische links en socials op één rij.
  Daarom `web/src/components/SiteFooter/` in projectcode.
- **Sitemap**: `buildSitemap` haalt de slash aan het eind weg (deze site houdt hem) en kent
  alleen Kikker's parent-gebaseerde paden. Diensten en team zijn eigen documenttypen onder
  gecodeerde routes. Daarom een eigen `web/src/app/sitemap.ts` met `src/data/routes.ts`.
- **Robots**: `buildRobots` verbiedt alles buiten Vercel-productie (`isIndexingEnabled`) en
  kent geen `Disallow: /api/`. De praktijk had een expliciete `robots.txt`; eigen `robots.ts`.
- **Favicon/manifest**: `createFaviconIcoHandler` en `buildManifest` vereisen een Sanity
  project met site-instellingen. Tot het project bestaat serveert `favicon.ico/route.ts`
  `public/favicon.png` en geeft `manifest.ts` een vaste fallback.
- **Metadata**: `buildPageMetadata` heeft geen titelregel (volledige naam ≤ 60 tekens, anders
  korte naam, anders alleen titel), geen standaard OG-afbeelding en geen `nl_NL`-locale.
  Daarom `web/src/lib/metadata.ts` (`pageMetadata`).
- **Typen bij lokaal linken**: `createRevalidateHandler().POST` is getypeerd tegen de
  `next`-kopie in kikker-core; Next's route-validator wijst die af. `api/revalidate/route.ts`
  cast tot de pakketten gepubliceerd zijn (één `node_modules`).
- **Live zonder token**: `defineKikkerLive` eist `serverToken: string`; met een lege string
  (geen `SANITY_API_READ_TOKEN`, zoals lokaal) waarschuwt next-sanity bij elke request. Een
  `string | false`-type zou de waarschuwing laten uitzetten.
- **Placeholder-project**: Kikker heeft geen "geen Sanity"-stand. `src/sanity/client.ts`
  exporteert `hasSanityProject` (project-id ≠ `placeholder`) en elke Sanity-lezer slaat over
  zolang dat `false` is, zodat `next build` slaagt zonder project.

- **publicationWindowFilter** (`@eightmedia/kikker-groq`) vergelijkt het `datetime`-veld als
  string met `dateTime(now())`, waardoor `publicationDate <= dateTime(now())` niets matcht
  (met groq-js gecontroleerd: 0 in plaats van 6 artikelen). `queries/blog.ts` gebruikt een
  eigen filter met `dateTime(publicationDate)`. Bug om in Kikker te fixen.
- **BlockContent/RichText**: `BlockContent` is zelf een `.kr-container`-raster en past niet in
  een paginakolom (zijbalk op dienstpagina's, smalle blogkolom); `RichText` heeft geen
  `components`-prop (geen `image`-blokken, geen `rel`/extern-afhandeling van links). Daarom
  `components/Prose/` met `@portabletext/react`.
- **Section/Cta**: Kikker's `Section` heeft geen `id`-prop (ankers zoals `#aanmelden`);
  `Cta`/`CtaSection` kunnen de kaart-in-container-vorm van de Astro-CTA niet maken. Daarom
  eigen `Section` en `Cta`.
- **Link-annotaties**: `fieldBlockContent` weigert `mailto:`/`tel:` in links; `studio/schemaTypes/fields/richText.ts`
  versoepelt dat. `withSiteNames` zet `siteNames` in groep `settings` zonder te controleren of
  die bestaat (Studio crasht anders). News-template hardcodet `listPage_news_<site>`; hier
  `listPage.blog`. `linkQuery` geeft `target: "_blank"` voor `type: "url"`, ook voor paden.

- **fetchPage en `$siteName`**: `fetchPage` voert de body-projectie uit met alleen `$id`,
  terwijl `seoQuery` de settings-documenten op `$siteName` filtert; de Sanity-API weigert de
  query dan ("param $siteName referenced, but not provided"; groq-js was coulant). In
  `web/src/sanity/queries.ts` wordt de sitenaam letterlijk in de projectie gezet.
- **fetchSanity in generateStaticParams**: Kikker's `fetchSanity` roept `draftMode()` aan,
  wat buiten een request (generateStaticParams, build) een fout geeft. `web/src/sanity/fetch.ts`
  valt dan terug op `client.fetch` met perspective `published`.

## Nog te regelen buiten de code

- Sanity-project: aangemaakt op 6 november 2026 in organisatie Eight Media BV, project-id
  `6zrberf0`, dataset `production`, CORS voor localhost:3000, localhost:3333 en
  www.redwoodspeopleservices.nl. Read- en write-token staan in de lokale `.env.local`-bestanden
  (niet in git) en horen in Proton Pass en Vercel. De migratie is uitgevoerd: 29 documenten,
  20 afbeeldingen. Studio nog niet gedeployed, praktijk nog geen toegang.
- Kikker-pakketten publiceren op GitHub Packages voordat de branch op Vercel kan bouwen;
  `GITHUB_TOKEN` met `read:packages` als env-variabele in Vercel; root directory `web`.
- Vercel-env-variabelen overzetten (Mollie, Resend, MAIL_*), Mollie-webhook-URL ongewijzigd.

## Veldnamen zoals gebouwd (Studio)

Geen afwijkingen van de veldnamen in het contentmodel. Wel een paar vormen die de web-app
moet kennen:

- Vaste id's: `listPage.blog` (slug `blog`, ouder van elke `news`), `page.privacybeleid`,
  `page.algemene-voorwaarden`, `news.<slug>`, `teamMember.<slug>`, `dienst.<slug>`,
  `tarieven`, `houdMeVast`, `rouwEnVerlies`; Kikker-settings `<type>_default`
  (`siteHeader_default`, `siteFooter_default`, `siteSettings_default`, `seoSettings_default`,
  `redirects_default`, `analytics_default`). Zie `studio/schemaTypes/ids.ts`.
- `news.body` is Kikker-blockcontent plus `image`-blokken (`{ _type: "image", asset, alt }`)
  voor de foto's midden in blogartikelen; de renderer heeft daar een component voor nodig.
- Link-annotaties (`markDefs`) hebben `_type: "link"`, `href` en `target` (`_self`/`_blank`);
  `href` kan ook `mailto:`/`tel:` zijn (privacyverklaring). FAQ-antwoorden (`dienst.faq[].a`)
  zijn Portable Text met zulke links.
- `news.publicationDate` = `date` (ISO-datetime, 00:00 UTC); `news.listDisplay.text` =
  `description`, `news.listDisplay.image` = `cover`; `news.author` string.
- `page`: de PageHeader-intro uit Astro staat in `listDisplay.text`, de meta-beschrijving in
  `seo.description`. `listPage.blog`: `listDisplay.title` "Inspiratie en inzichten",
  `listDisplay.text` de intro, `seo.description` de meta-beschrijving.
- Menu-items (`siteHeader.primaryMenuItems[]`, Kikker `menuItem`/`menuItemChild`) hebben
  `label` en `link: { type: "url", href: "/pad/", newTab: false }` (Kikker's `linkQuery` geeft
  `target: "_blank"` voor `type: "url"`, ook voor paden; de eigen SiteHeader/SiteFooter kunnen
  beter op `href` kijken). Footer: `columns[]` = één `textColumn` (praktijkintro en
  bereikbaarheid, `text` als Portable Text), vier `menuColumn`s zoals Footer.astro en een
  `menuColumn` "Informatie" met interne `link`-referenties naar de twee `page`-documenten.
  Adres, telefoon, socials en KvK blijven in `web/src/data/site.ts`.
- `siteSettings.favicon` = `beeldmerk.png` (512×512), `fallbackImage` =
  `redwoods-illustratie.jpg`; `seoSettings.titleSuffix` = " | Redwoods People Services".
- `redirects_default.redirects` en `analytics_default.services` zijn leeg.
