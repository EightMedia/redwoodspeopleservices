# Redwoods People Services — web

Next.js 16 (App Router, `src/`, TypeScript, pnpm, plain CSS) on Eight's Kikker stack. The
Sanity Studio lives in `../studio`. Design and agreements: `../docs/kikker-herbouw.md`.

## Requirements

- Node 24 (`.nvmrc` in the repository root)
- pnpm via corepack (`corepack enable`)
- A checkout of `kikker-core` next to this repository: `~/Sites/kikker-core` beside
  `~/Sites/redwoods-kikker`

## Install

The `@eightmedia/kikker-*` packages are not on GitHub Packages yet, so a plain
`pnpm install` cannot resolve them. Until they are published, link them from `kikker-core`:

```bash
# 1. Build kikker-core once and keep the watcher running
cd ~/Sites/kikker-core
pnpm install
pnpm watch

# 2. Link the four packages this app uses (this also runs the install)
cd ~/Sites/redwoods-kikker/web
pnpm link ../../kikker-core/packages/tokens ../../kikker-core/packages/react ../../kikker-core/packages/groq ../../kikker-core/packages/next
```

`pnpm link` writes `link:` overrides to `pnpm-workspace.yaml` and `pnpm-lock.yaml`. Those
paths only exist on your machine: **never commit them** (see "Before committing").

Once the packages are published: copy `../.npmrc.example` to `web/.npmrc`, set
`GITHUB_TOKEN` (a token with `read:packages`) and run `pnpm install`. That generates the
real `pnpm-lock.yaml`; from then on linking is optional.

## Environment

Copy `.env.example` to `.env.local` and fill in:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project id. Use `placeholder` while the project does not exist: every Sanity read is then skipped and the build still passes |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset, normally `production` |
| `NEXT_PUBLIC_SITE_URL` | Public origin without trailing slash (canonical, Open Graph, sitemap, robots). `http://localhost:3000` locally |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | Studio origin for click-to-edit (Presentation tool), `http://localhost:3333` locally |
| `SANITY_API_READ_TOKEN` | Server-only read token for drafts and preview. Never `NEXT_PUBLIC_` |
| `SANITY_REVALIDATE_SECRET` | Secret of the Sanity webhook that calls `/api/revalidate` |
| `NEXT_PUBLIC_MOLLIE_ENABLED` | `true` when the Houd me Vast form should announce the payment step |
| `MOLLIE_API_KEY` | Mollie key (`test_…` / `live_…`); empty = registration by mail only |
| `RESEND_API_KEY` | Resend key for the contact and registration mails |
| `MAIL_FROM` | Sender, a verified domain in Resend |
| `MAIL_TO` | Recipient of form messages |
| `KIKKER_LINK_ROOT` | Local only: folder holding both repositories (`/Users/<you>/Sites`) so Turbopack may read the linked packages. Unset on Vercel |

## Develop

```bash
pnpm dev        # http://localhost:3000
pnpm build      # production build (passes with the placeholder project id)
pnpm start      # serve the production build
pnpm typecheck  # tsc --noEmit
pnpm lint
```

## Before committing

`package.json` already references the published versions. Restore the files that
`pnpm link` rewrote:

```bash
cd web
git checkout -- package.json   # in case a link rewrote it
rm -f pnpm-workspace.yaml      # only holds the link overrides
```

`pnpm-lock.yaml` cannot be generated with published versions until the packages are on
GitHub Packages; until then do not commit it (it only contains `link:` paths). After
committing, re-run the `pnpm link …` command above to keep working locally.

## Where things live

| Path | Role |
| --- | --- |
| `src/app/layout.tsx` | Root layout: skip link, `SiteHeader`, `<main id="main">`, `SiteFooter`, organisation JSON-LD, Speed Insights |
| `src/app/theme.css` | Redwoods colours, fonts and surfaces mapped onto the Kikker `--kr-*` variables |
| `src/app/globals.css` | Site-wide classes (`rw-container`, `rw-btn--*`, `rw-eyebrow`, `rw-prose`, …) |
| `src/app/[...slug]/page.tsx` | Sanity `page` documents (privacybeleid, algemene-voorwaarden) and CMS redirects |
| `src/app/not-found.tsx` | 404 |
| `src/app/sitemap.ts`, `robots.ts`, `manifest.ts`, `favicon.ico/route.ts` | Site infrastructure |
| `src/data/site.ts` | Practice details and navigation (verbatim from the Astro site) |
| `src/data/routes.ts` | Coded routes for the sitemap |
| `src/data/redirects.ts` | Old WordPress URLs, read by `next.config.ts` |
| `src/lib/metadata.ts` | `pageMetadata()`: title rule, canonical, Open Graph, Twitter card |
| `src/lib/jsonld.ts` + `src/components/JsonLd.tsx` | Structured data |
| `src/sanity/` | Client, live content, draft mode, GROQ projections |
| `src/components/` | Project components (`rw-` prefix, plain CSS next to the component) |
