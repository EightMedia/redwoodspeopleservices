# Redwoods Studio

Sanity Studio 6 voor Redwoods People Services, gebouwd op `@eightmedia/kikker-sanity`
(`@eightmedia/redwoods-studio`). Zie `../docs/kikker-herbouw.md` voor het contentmodel en de
afspraken met de web-app.

## Vereisten

Node 24 (`.nvmrc` in de repo-root) en pnpm via corepack (`corepack enable`).

## Installeren

De Kikker-pakketten staan nog niet op GitHub Packages. Tot die tijd worden ze lokaal gelinkt
uit `~/Sites/kikker-core` (zie `kikker-core/docs/local-linking.md`):

```bash
# eenmalig, in kikker-core: bouw de pakketten (of laat `pnpm watch` draaien)
cd ~/Sites/kikker-core && pnpm install && pnpm build

cd ~/Sites/redwoods-kikker/studio
pnpm install                      # overige dependencies (sanity, react, tsx, …)
pnpm link ../../kikker-core/packages/sanity ../../kikker-core/packages/groq
```

`pnpm link` zet `link:`-paden in `pnpm-lock.yaml` en voegt `overrides` toe aan
`pnpm-workspace.yaml`. Die paden bestaan alleen op jouw machine: **commit ze niet**. Voor het
committen:

```bash
git checkout -- pnpm-workspace.yaml   # haalt de overrides weg
rm -f pnpm-lock.yaml                  # zolang er geen lockfile zonder link-paden bestaat
```

Er staat bewust nog geen `pnpm-lock.yaml` in git: zonder gepubliceerde Kikker-pakketten kan er
geen lockfile zonder link-paden worden gemaakt. `pnpm-workspace.yaml` zet
`verifyDepsBeforeRun: false`, anders probeert pnpm voor elk script een install tegen GitHub
Packages. `package.json` verwijst naar de gepubliceerde versies (`^1.0.0`). Zodra de pakketten
op GitHub Packages staan: kopieer `.npmrc.example` naar `.npmrc`, zet `GITHUB_TOKEN` (scope
`read:packages`), draai `pnpm install` zonder link en commit de lockfile die dan ontstaat.

## Omgevingsvariabelen

Kopieer `.env.example` naar `.env.local` (git-ignored).

| Variabele                   | Doel                                                                 |
| --------------------------- | -------------------------------------------------------------------- |
| `SANITY_STUDIO_PROJECT_ID`  | Sanity-project-id (organisatie Eight Media BV). `placeholder` zolang het project niet bestaat; typecheck en build werken daarmee. |
| `SANITY_STUDIO_DATASET`     | Dataset, `production`.                                               |
| `SANITY_API_WRITE_TOKEN`    | Schrijftoken (rol Editor) voor `pnpm migrate` zonder `--dry-run`.    |
| `SANITY_STUDIO_PREVIEW_URL` | Optioneel: site-origin voor de Presentation-tool (standaard `http://localhost:3000`). |

## Scripts

| Script           | Commando                            |
| ---------------- | ----------------------------------- |
| `pnpm dev`       | `sanity dev`, Studio op http://localhost:3333 |
| `pnpm build`     | `sanity build` naar `dist/`          |
| `pnpm deploy`    | `sanity deploy` (hosted Studio)      |
| `pnpm typecheck` | `tsc --noEmit`                       |
| `pnpm migrate`   | `tsx scripts/migrate-from-astro.ts` (zie hieronder) |

## Migratie vanuit de Astro-site

```bash
pnpm migrate -- "<pad-naar-astro-checkout>" --dry-run   # schrijft migration-output/
pnpm migrate -- "<pad-naar-astro-checkout>"             # uploadt en schrijft naar Sanity
```

Het script leest `src/content/{blog,team,diensten}/*.md`, `src/data/*.json`,
`src/data/site.ts` (`nav`), `src/components/Footer.astro` en de pagina's `privacybeleid` en
`algemene-voorwaarden`. Markdown en HTML worden Portable Text via remark (CommonMark + GFM + SmartyPants, zoals Astro) →
`@portabletext/block-tools` (jsdom) met het Studio-schema; markdown-links worden
link-annotaties, afbeeldingen in blogartikelen worden `image`-blokken.

Alle documenten krijgen een vast `_id` (tabel hieronder) en worden met `createOrReplace`
geschreven; het script is dus herhaalbaar. Afbeeldingen krijgen Sanity's eigen asset-id
(`image-<sha1>-<breedte>x<hoogte>-<ext>`), zodat verwijzingen bij een echte run gelijk
blijven; wijkt een geüpload id toch af, dan worden de verwijzingen herschreven.

`--dry-run` schrijft in `migration-output/` (git-ignored):

- `documents.ndjson`: alle documenten, één per regel;
- `assets.ndjson`: per afbeelding een `sanity.imageAsset`-document met
  `url: /migration-assets/<bestand>` en `metadata.dimensions`;
- `assets/<bestand>`: de gekopieerde afbeeldingen (`<sha1>-<breedte>x<hoogte>.<ext>`);
- `images.json`: overzicht van bronpad, bestandsnaam en asset-id.

De web-app leest deze bestanden lokaal met groq-js zolang er geen Sanity-project is.

## Documenttypen en `_id`-conventies

| Type            | Herkomst                        | `_id`                                 | Desk                        |
| --------------- | ------------------------------- | ------------------------------------- | --------------------------- |
| `teamMember`    | `src/content/team/*.md`         | `teamMember.<slug>`                   | Team (op `order`)           |
| `dienst`        | `src/content/diensten/*.md`     | `dienst.<slug>`                       | Diensten (op `order`)       |
| `news`          | `src/content/blog/*.md`         | `news.<slug>`                         | Blog (Kikker-buckets)       |
| `listPage`      | —                               | `listPage.blog` (slug `blog`)         | Blog → Overzichtspagina     |
| `page`          | `privacybeleid.astro`, `algemene-voorwaarden.astro` | `page.<slug>`     | Pagina's                    |
| `tarieven`      | `src/data/tarieven.json`        | `tarieven`                            | Tarieven                    |
| `houdMeVast`    | `src/data/houd-me-vast.json`    | `houdMeVast`                          | Houd me Vast                |
| `rouwEnVerlies` | `src/data/rouw-en-verlies.json` | `rouwEnVerlies`                       | Rouw en Verlies             |
| `siteSettings`  | `site.ts`, `beeldmerk.png`, `redwoods-illustratie.jpg` | `siteSettings_default` | Site-instellingen |
| `siteHeader`    | `site.ts` (`nav`), `logo-redwoods.png` | `siteHeader_default`           | Menu                        |
| `siteFooter`    | `Footer.astro`                  | `siteFooter_default`                  | Footer                      |
| `seoSettings`   | `site.ts`                       | `seoSettings_default`                 | SEO                         |
| `redirects`     | — (leeg; oude URL's staan in `web/next.config.ts`) | `redirects_default` | Doorverwijzingen         |
| `analytics`     | — (leeg)                        | `analytics_default`                   | Statistieken                |

Kikker-settings gebruiken `singletonDocumentId(type, 'default')`; alle documenten hebben
`siteNames: ['default']`. De id's staan in `schemaTypes/ids.ts` en worden door desk,
templates en migratiescript gedeeld.

## Structuur

- `kikker.config.ts`: site `default`, omgevingen, `cms.linkableTypes` (`page`, `listPage`, `news`).
- `schemaTypes/`: `documents/` (page, listPage, news, teamMember, dienst), `singletons/`,
  `settings.ts`, `fields/richText.ts` (Kikker-blockcontent met `mailto:`/`tel:`-links),
  `helpers.ts` (Nederlandse labels op Kikker-factories), `ids.ts`, `sites.ts`.
- `structure.ts`: Team, Diensten, Blog, Pagina's, de drie programma-singletons en de instellingen.
- `scripts/migrate-from-astro.ts`: migratie (zie boven).
