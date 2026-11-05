/**
 * Migrate the Astro site (branch `main`) into Sanity documents.
 *
 *   pnpm migrate -- <path-to-astro-checkout> [--dry-run]
 *
 * Reads `src/content/{blog,team,diensten}/*.md`, `src/data/*.json`, `src/data/site.ts`
 * (`nav`), `src/components/Footer.astro` and the two legal pages, converts markdown/HTML
 * bodies to Portable Text (markdown → HTML via marked → `@portabletext/block-tools` with
 * jsdom and the Studio schema) and writes every document with a fixed `_id` so the script
 * is repeatable (`createOrReplace`).
 *
 * `--dry-run` writes `migration-output/documents.ndjson`, `migration-output/assets.ndjson`
 * (one `sanity.imageAsset` per image, id `image-<sha1>-<w>x<h>-<ext>`), copies the images
 * into `migration-output/assets/` and lists them in `migration-output/images.json`.
 * Without the flag it uploads the images and writes the documents to the project in
 * `.env.local` (`SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`, `SANITY_API_WRITE_TOKEN`).
 */
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import { htmlToBlocks, type DeserializerRule } from '@portabletext/block-tools';
import { createClient } from '@sanity/client';
import matter from 'gray-matter';
import { JSDOM } from 'jsdom';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkSmartypants from 'remark-smartypants';
import { createSchema, type ObjectSchemaType } from 'sanity';
import { unified } from 'unified';

import { schemaTypes } from '../schemaTypes';
import {
  BLOG_LIST_PAGE_ID,
  dienstId,
  newsId,
  ownSingletonIds,
  pageId,
  settingsIds,
  teamMemberId,
} from '../schemaTypes/ids';
import { siteName } from '../schemaTypes/sites';

// ---------------------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------------------

const studioDir = resolve(dirname(new URL(import.meta.url).pathname), '..');
const args = process.argv.slice(2).filter((arg) => arg !== '--');
const dryRun = args.includes('--dry-run');
const astroDir = args.find((arg) => !arg.startsWith('--'));

if (!astroDir) {
  console.error('Usage: pnpm migrate -- <path-to-astro-checkout> [--dry-run]');
  process.exit(1);
}
const astroRoot = resolve(astroDir);
if (!existsSync(join(astroRoot, 'src', 'content.config.ts'))) {
  console.error(`Not an Astro checkout (src/content.config.ts missing): ${astroRoot}`);
  process.exit(1);
}

const outputDir = join(studioDir, 'migration-output');
const siteNames = [siteName];

// ---------------------------------------------------------------------------------------
// Source helpers
// ---------------------------------------------------------------------------------------

type Site = {
  name: string;
  shortName: string;
  url: string;
  description: string;
  phone: string;
  phoneHref: string;
  email: string;
  address: { street: string; postalCode: string; city: string };
  kvk: string;
  socials: Record<string, string>;
};
type NavItem = { label: string; href: string; children?: { label: string; href: string }[] };

const siteModule = (await import(pathToFileURL(join(astroRoot, 'src/data/site.ts')).href)) as {
  site: Site;
  nav: NavItem[];
};
const { site, nav } = siteModule;

const readJson = <T>(relativePath: string): T =>
  JSON.parse(readFileSync(join(astroRoot, relativePath), 'utf8')) as T;

type Entry<T> = { slug: string; data: T; content: string; file: string };

function readCollection<T>(relativeDir: string): Entry<T>[] {
  const dir = join(astroRoot, relativeDir);
  return readdirSync(dir)
    .filter((name) => name.endsWith('.md'))
    .sort()
    .map((name) => {
      const file = join(dir, name);
      const parsed = matter(readFileSync(file, 'utf8'));
      return { slug: name.replace(/\.md$/, ''), data: parsed.data as T, content: parsed.content, file };
    });
}

/** Resolve a markdown/front matter image path (`../../assets/x.jpg`) relative to its file. */
const resolveAssetPath = (fromFile: string, relativePath: string): string =>
  resolve(dirname(fromFile), relativePath);

// ---------------------------------------------------------------------------------------
// Images
// ---------------------------------------------------------------------------------------

type ImageAsset = {
  _id: string;
  sha1: string;
  width: number;
  height: number;
  extension: string;
  mimeType: string;
  size: number;
  originalFilename: string;
  sourcePath: string;
  /** File name inside migration-output/assets (also the public path under /migration-assets/). */
  fileName: string;
};

const imageAssets = new Map<string, ImageAsset>();

function readDimensions(buffer: Buffer, ext: string): { width: number; height: number } {
  if (ext === 'png') {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  if (ext === 'jpg') {
    let offset = 2;
    while (offset < buffer.length) {
      if (buffer[offset] !== 0xff) throw new Error('Invalid JPEG marker');
      const marker = buffer[offset + 1] ?? 0;
      if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
        offset += 2;
        continue;
      }
      const length = buffer.readUInt16BE(offset + 2);
      const isSof = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);
      if (isSof) {
        return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
      }
      offset += 2 + length;
    }
    throw new Error('No JPEG SOF marker found');
  }
  throw new Error(`Unsupported image type: ${ext}`);
}

const mimeTypes: Record<string, string> = { jpg: 'image/jpeg', png: 'image/png' };

/** Register an image and return the Sanity image value that references it. */
function image(sourcePath: string, extra: Record<string, unknown> = {}) {
  let asset = imageAssets.get(sourcePath);
  if (!asset) {
    if (!existsSync(sourcePath)) throw new Error(`Image not found: ${sourcePath}`);
    const buffer = readFileSync(sourcePath);
    const ext = extname(sourcePath).toLowerCase().replace('.', '').replace('jpeg', 'jpg');
    const { width, height } = readDimensions(buffer, ext);
    const sha1 = createHash('sha1').update(buffer).digest('hex');
    asset = {
      _id: `image-${sha1}-${width}x${height}-${ext}`,
      sha1,
      width,
      height,
      extension: ext,
      mimeType: mimeTypes[ext] ?? 'application/octet-stream',
      size: buffer.length,
      originalFilename: basename(sourcePath),
      sourcePath,
      fileName: `${sha1}-${width}x${height}.${ext}`,
    };
    imageAssets.set(sourcePath, asset);
  }
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id }, ...extra };
}

/** `sanity.imageAsset` document as the dry-run NDJSON (and groq-js on the web side) expects it. */
const assetDocument = (asset: ImageAsset) => ({
  _id: asset._id,
  _type: 'sanity.imageAsset',
  assetId: asset.sha1,
  extension: asset.extension,
  mimeType: asset.mimeType,
  originalFilename: asset.originalFilename,
  sha1hash: asset.sha1,
  size: asset.size,
  path: `images/migration/${asset.fileName}`,
  url: `/migration-assets/${asset.fileName}`,
  metadata: {
    dimensions: {
      width: asset.width,
      height: asset.height,
      aspectRatio: asset.width / asset.height,
    },
  },
});

// ---------------------------------------------------------------------------------------
// Portable Text
// ---------------------------------------------------------------------------------------

const schema = createSchema({ name: 'redwoods', types: schemaTypes });

/** block-tools ships its own `@sanity/types` major; the compiled type is structurally the same. */
type BlockContentType = Parameters<typeof htmlToBlocks>[1];

function blockContentType(documentType: string, fieldName: string): BlockContentType {
  const doc = schema.get(documentType) as ObjectSchemaType | undefined;
  const field = doc?.fields.find((item) => item.name === fieldName);
  if (!field) throw new Error(`Field ${documentType}.${fieldName} not found in schema`);
  return field.type as unknown as BlockContentType;
}

/** Kikker rich text (page/team/dienst bodies, FAQ answers, footer text). */
const richTextType = blockContentType('page', 'body');
/** Article body: rich text plus inline `image` blocks. */
const articleBodyType = blockContentType('news', 'body');

/** Deterministic `_key`s so repeated runs produce identical documents. */
function keyGenerator(prefix: string) {
  let counter = 0;
  return () => `${prefix}${(++counter).toString(36).padStart(4, '0')}`;
}

type Block = { _type: string; _key?: string; [key: string]: unknown };
type Span = { _type: 'span'; text: string; marks?: string[] };

const tagName = (node: Node): string => node.nodeName.toLowerCase();

/**
 * Custom deserializer rules: `<img>` becomes an `image` block (hoisted out of its `<p>`),
 * `<a>` keeps `target="_blank"` (Kikker's link annotation has `href` + `target`).
 */
function rules(fromFile: string | undefined, nextKey: () => string): DeserializerRule[] {
  return [
    {
      deserialize(el, _next, createBlock) {
        if (tagName(el) !== 'img' || !fromFile) return undefined;
        const element = el as Element;
        const src = element.getAttribute('src') ?? '';
        return createBlock(image(resolveAssetPath(fromFile, src), { alt: element.getAttribute('alt') ?? '' }));
      },
    },
    {
      deserialize(el, next) {
        if (tagName(el) !== 'a') return undefined;
        const element = el as Element;
        const href = element.getAttribute('href');
        if (!href) return next(el.childNodes);
        return {
          _type: '__annotation',
          markDef: {
            _key: nextKey(),
            _type: 'link',
            href,
            target: element.getAttribute('target') === '_blank' ? '_blank' : '_self',
          },
          children: next(el.childNodes),
        };
      },
    },
  ];
}

const isEmptyTextBlock = (block: Block): boolean =>
  block._type === 'block' &&
  Array.isArray(block.children) &&
  (block.children as Span[]).every((child) => child._type === 'span' && child.text.trim() === '');

function htmlToPortableText(
  html: string,
  type: BlockContentType,
  keyPrefix: string,
  fromFile?: string,
): Block[] {
  const nextKey = keyGenerator(keyPrefix);
  const blocks = htmlToBlocks(html, type, {
    parseHtml: (input) => new JSDOM(input).window.document,
    keyGenerator: nextKey,
    rules: rules(fromFile, nextKey),
    unstable_whitespaceOnPasteMode: 'normalize',
  }) as Block[];
  return blocks.filter((block) => !isEmptyTextBlock(block)).map(trimBlockEdges);
}

/**
 * Trim the whitespace that pretty-printed HTML leaves at the start of the first span and the
 * end of the last span. Whitespace between spans (`<strong>a</strong> <em>b</em>`) stays.
 */
function trimBlockEdges(block: Block): Block {
  if (block._type !== 'block') return block;
  const children = [...(block.children as (Span | Block)[])];
  const first = children[0];
  if (first && first._type === 'span') children[0] = { ...first, text: (first as Span).text.replace(/^\s+/, '') };
  const lastIndex = children.length - 1;
  const last = children[lastIndex];
  if (last && last._type === 'span') {
    children[lastIndex] = { ...last, text: (last as Span).text.replace(/\s+$/, '') };
  }
  return { ...block, children };
}

/**
 * Markdown the way the Astro site renders it: CommonMark + GFM with smart punctuation on text
 * nodes only (curly quotes, `--` en dash, `---` em dash, `...` ellipsis; never inside code or
 * URLs). Soft line breaks stay newlines (block-tools joins them with a space), hard breaks
 * (two trailing spaces) become `<br>` and stay inside the same block.
 */
const markdownProcessor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkSmartypants, { dashes: 'oldschool' })
  .use(remarkRehype)
  .use(rehypeStringify);

const markdownToPortableText = (
  markdown: string,
  type: BlockContentType,
  keyPrefix: string,
  fromFile?: string,
): Block[] =>
  htmlToPortableText(String(markdownProcessor.processSync(markdown)), type, keyPrefix, fromFile);

/** Plain paragraphs (footer text column). */
const paragraphs = (texts: string[], keyPrefix: string): Block[] =>
  htmlToPortableText(texts.map((text) => `<p>${text}</p>`).join(''), richTextType, keyPrefix);

// ---------------------------------------------------------------------------------------
// Astro page bodies (privacybeleid, algemene-voorwaarden)
// ---------------------------------------------------------------------------------------

function lookupSiteValue(path: string): string {
  const value = path.split('.').reduce<unknown>((acc, key) => (acc as Record<string, unknown>)?.[key], site);
  if (typeof value !== 'string') throw new Error(`Unknown site value: ${path}`);
  return value;
}

/** Resolve `{site.x.y}` and `{`...${site.x}...`}` JSX expressions to their values. */
const resolveSiteExpressions = (html: string): string =>
  html
    .replace(/\{`([^`]*)`\}/g, (_match, template: string) =>
      template.replace(/\$\{site\.([\w.]+)\}/g, (_inner, path: string) => lookupSiteValue(path)),
    )
    .replace(/\{site\.([\w.]+)\}/g, (_match, path: string) => lookupSiteValue(path));

function readAstroPage(slug: string) {
  const source = readFileSync(join(astroRoot, 'src/pages', `${slug}.astro`), 'utf8');
  const attr = (tag: string, name: string): string | undefined =>
    source.match(new RegExp(`<${tag}[^>]*?\\s${name}="([^"]*)"`))?.[1];
  const body = source.match(/<div class="prose-site[^"]*">([\s\S]*?)<\/div>\s*<\/Section>/)?.[1];
  if (!body) throw new Error(`No prose body found in ${slug}.astro`);
  const title = attr('Base', 'title');
  if (!title) throw new Error(`No title found in ${slug}.astro`);
  return {
    title,
    description: attr('Base', 'description'),
    intro: attr('PageHeader', 'intro'),
    html: resolveSiteExpressions(body),
  };
}

// ---------------------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------------------

type SanityDocument = { _id: string; _type: string; [key: string]: unknown };
const documents: SanityDocument[] = [];

const slugValue = (current: string) => ({ _type: 'slug', current });
const reference = (ref: string) => ({ _type: 'reference', _ref: ref });
const urlLink = (href: string) => ({ type: 'url', href, newTab: false });
const internalLink = (ref: string) => ({ type: 'link', link: reference(ref), newTab: false });

/** Menu item arrays need `_key`s; derive them from the position for repeatability. */
const menuItems = (
  items: { label: string; href?: string; ref?: string; children?: { label: string; href: string }[] }[],
  keyPrefix: string,
  withChildren: boolean,
) =>
  items.map((item, index) => ({
    _type: 'menuItem',
    _key: `${keyPrefix}${index}`,
    label: item.label,
    link: item.ref ? internalLink(item.ref) : urlLink(item.href ?? '/'),
    ...(withChildren
      ? {
          children: (item.children ?? []).map((child, childIndex) => ({
            _type: 'menuItemChild',
            _key: `${keyPrefix}${index}c${childIndex}`,
            label: child.label,
            link: urlLink(child.href),
          })),
        }
      : {}),
  }));

// --- Blog -------------------------------------------------------------------------------

type BlogData = { title: string; description: string; date: string | Date; cover?: string; author?: string };

documents.push({
  _id: BLOG_LIST_PAGE_ID,
  _type: 'listPage',
  siteNames,
  title: 'Blog',
  slug: slugValue('blog'),
  contentType: 'news',
  sort: 'dateDesc',
  pageSize: 12,
  listDisplay: {
    title: 'Inspiratie en inzichten',
    text: 'Verhalen en artikelen van onze therapeuten over hechting, relaties, emoties, rouw en groei.',
  },
  seo: {
    description:
      'Artikelen en verhalen over hechting, relaties, emoties, rouw en persoonlijke groei, geschreven door de therapeuten van Redwoods.',
    searchable: true,
  },
});

for (const post of readCollection<BlogData>('src/content/blog')) {
  const date = new Date(post.data.date);
  documents.push({
    _id: newsId(post.slug),
    _type: 'news',
    siteNames,
    title: post.data.title,
    slug: slugValue(post.slug),
    parent: reference(BLOG_LIST_PAGE_ID),
    author: post.data.author ?? 'Redwoods People Services',
    publicationDate: `${date.toISOString().slice(0, 10)}T00:00:00.000Z`,
    body: markdownToPortableText(post.content, articleBodyType, 'b', post.file),
    listDisplay: {
      text: post.data.description,
      ...(post.data.cover ? { image: image(resolveAssetPath(post.file, post.data.cover)) } : {}),
    },
    seo: { searchable: true },
  });
}

// --- Team -------------------------------------------------------------------------------

type TeamData = {
  name: string;
  role: string;
  intro: string;
  photo: string;
  order?: number;
  registrations?: string[];
  specialties?: string[];
  wachttijd?: string;
};

for (const member of readCollection<TeamData>('src/content/team')) {
  documents.push({
    _id: teamMemberId(member.slug),
    _type: 'teamMember',
    siteNames,
    name: member.data.name,
    slug: slugValue(member.slug),
    role: member.data.role,
    intro: member.data.intro,
    photo: image(resolveAssetPath(member.file, member.data.photo)),
    order: member.data.order ?? 99,
    registrations: member.data.registrations ?? [],
    specialties: member.data.specialties ?? [],
    ...(member.data.wachttijd ? { wachttijd: member.data.wachttijd } : {}),
    body: markdownToPortableText(member.content, richTextType, 'b', member.file),
  });
}

// --- Diensten ---------------------------------------------------------------------------

type DienstData = {
  title: string;
  description: string;
  intro: string;
  order?: number;
  faq?: { q: string; a: string }[];
};

for (const dienst of readCollection<DienstData>('src/content/diensten')) {
  documents.push({
    _id: dienstId(dienst.slug),
    _type: 'dienst',
    siteNames,
    title: dienst.data.title,
    slug: slugValue(dienst.slug),
    description: dienst.data.description,
    intro: dienst.data.intro,
    order: dienst.data.order ?? 99,
    faq: (dienst.data.faq ?? []).map((item, index) => ({
      _type: 'faqItem',
      _key: `faq${index}`,
      q: item.q,
      a: markdownToPortableText(item.a, richTextType, `f${index}`),
    })),
    body: markdownToPortableText(dienst.content, richTextType, 'b', dienst.file),
  });
}

// --- Pages ------------------------------------------------------------------------------

for (const slug of ['privacybeleid', 'algemene-voorwaarden']) {
  const page = readAstroPage(slug);
  documents.push({
    _id: pageId(slug),
    _type: 'page',
    siteNames,
    title: page.title,
    slug: slugValue(slug),
    body: htmlToPortableText(page.html, richTextType, 'b'),
    listDisplay: { ...(page.intro ? { text: page.intro } : {}) },
    seo: { ...(page.description ? { description: page.description } : {}), searchable: true },
  });
}

// --- Own singletons ---------------------------------------------------------------------

type TarievenJson = {
  geldigVanaf: string;
  tarieven: { naam: string; prijs: string; btw: string; info: string }[];
  noShow: { titel: string; tekst: string };
};
const tarievenJson = readJson<TarievenJson>('src/data/tarieven.json');
documents.push({
  _id: ownSingletonIds.tarieven,
  _type: 'tarieven',
  siteNames,
  geldigVanaf: tarievenJson.geldigVanaf,
  tarieven: tarievenJson.tarieven.map((item, index) => ({ _type: 'tarief', _key: `t${index}`, ...item })),
  noShow: tarievenJson.noShow,
});

type HoudMeVastJson = {
  prijs: string;
  aanbetaling: string;
  aanbetalingBedrag: string;
  data: { datum: string; vol: boolean }[];
};
const houdMeVastJson = readJson<HoudMeVastJson>('src/data/houd-me-vast.json');
const aanbetalingBedrag = Number(houdMeVastJson.aanbetalingBedrag);
if (!Number.isFinite(aanbetalingBedrag)) throw new Error('houd-me-vast.json: aanbetalingBedrag is not a number');
documents.push({
  _id: ownSingletonIds.houdMeVast,
  _type: 'houdMeVast',
  siteNames,
  prijs: houdMeVastJson.prijs,
  aanbetaling: houdMeVastJson.aanbetaling,
  aanbetalingBedrag,
  data: houdMeVastJson.data.map((item, index) => ({ _type: 'weekend', _key: `w${index}`, ...item })),
});

type RouwEnVerliesJson = { wanneer: string; omvang: string; prijs: string; inclusief: string };
documents.push({
  _id: ownSingletonIds.rouwEnVerlies,
  _type: 'rouwEnVerlies',
  siteNames,
  ...readJson<RouwEnVerliesJson>('src/data/rouw-en-verlies.json'),
});

// --- Kikker settings --------------------------------------------------------------------

documents.push({
  _id: settingsIds.siteSettings,
  _type: 'siteSettings',
  siteNames,
  title: site.name,
  favicon: image(join(astroRoot, 'src/assets/beeldmerk.png')),
  fallbackImage: image(join(astroRoot, 'src/assets/redwoods-illustratie.jpg')),
});

documents.push({
  _id: settingsIds.siteHeader,
  _type: 'siteHeader',
  siteNames,
  logo: image(join(astroRoot, 'src/assets/logo-redwoods.png')),
  primaryMenuItems: menuItems(nav, 'm', true),
  secondaryMenuItems: [],
});

/** Footer columns as in `src/components/Footer.astro` (verbatim labels and links). */
const footerColumns = [
  {
    title: 'Diensten',
    links: [
      { label: 'Psychotherapie', href: '/diensten/psychotherapie/' },
      { label: 'Relatietherapie (EFT)', href: '/diensten/relatietherapie/' },
      { label: 'Coaching', href: '/diensten/coaching/' },
      { label: 'Supervisie', href: '/diensten/supervisie/' },
      { label: 'Tarieven', href: '/tarieven/' },
    ],
  },
  {
    title: "Programma's",
    links: [
      { label: 'Houd me Vast relatieweekend', href: '/houd-me-vast/' },
      { label: 'Rouw en Verlies', href: '/rouw-en-verlies/' },
      { label: 'Greenwoods', href: '/greenwoods/' },
    ],
  },
  {
    title: 'Werkgebied',
    links: [
      { label: 'Relatietherapie Arnhem', href: '/relatietherapie-arnhem/' },
      { label: 'Relatietherapie Velp', href: '/relatietherapie-velp/' },
      { label: 'Psychotherapie Arnhem', href: '/psychotherapie-arnhem/' },
      { label: 'Therapie Rheden en Rozendaal', href: '/therapie-rheden-rozendaal/' },
    ],
  },
  {
    title: 'Over Redwoods',
    links: [
      { label: 'Ons team', href: '/team/' },
      { label: 'Over ons', href: '/over-ons/' },
      { label: 'Blog', href: '/blog/' },
      { label: 'Contact en route', href: '/contact/' },
    ],
  },
];

documents.push({
  _id: settingsIds.siteFooter,
  _type: 'siteFooter',
  siteNames,
  columns: [
    {
      _type: 'textColumn',
      _key: 'intro',
      title: site.name,
      text: paragraphs(
        [
          'Praktijk voor psychotherapie, EFT-relatietherapie, coaching en supervisie in Rozendaal. Voor Arnhem, Velp, Rheden, Oosterbeek en de rest van Gelderland.',
          'Telefonisch bereikbaar op maandag, woensdag en donderdag van 09:00 tot 13:00 uur.',
        ],
        'ft',
      ),
    },
    ...footerColumns.map((column, index) => ({
      _type: 'menuColumn',
      _key: `col${index}`,
      title: column.title,
      items: menuItems(column.links, `col${index}i`, false),
    })),
    {
      _type: 'menuColumn',
      _key: 'legal',
      title: 'Informatie',
      items: menuItems(
        [
          { label: 'Privacyverklaring', ref: pageId('privacybeleid') },
          { label: 'Algemene voorwaarden', ref: pageId('algemene-voorwaarden') },
        ],
        'legal',
        false,
      ),
    },
  ],
});

documents.push({
  _id: settingsIds.seoSettings,
  _type: 'seoSettings',
  siteNames,
  title: site.name,
  titleSuffix: ` | ${site.name}`,
  description: site.description,
});

documents.push({ _id: settingsIds.redirects, _type: 'redirects', siteNames, redirects: [] });
documents.push({ _id: settingsIds.analytics, _type: 'analytics', siteNames, services: [] });

// ---------------------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------------------

const assets = [...imageAssets.values()];
const counts = documents.reduce<Record<string, number>>((acc, doc) => {
  acc[doc._type] = (acc[doc._type] ?? 0) + 1;
  return acc;
}, {});

function summary() {
  console.log(`Documents: ${documents.length}`);
  for (const [type, count] of Object.entries(counts).sort()) console.log(`  ${type}: ${count}`);
  console.log(`Images: ${assets.length}`);
}

if (dryRun) {
  mkdirSync(join(outputDir, 'assets'), { recursive: true });
  writeFileSync(
    join(outputDir, 'documents.ndjson'),
    documents.map((doc) => JSON.stringify(doc)).join('\n') + '\n',
  );
  writeFileSync(
    join(outputDir, 'assets.ndjson'),
    assets.map((asset) => JSON.stringify(assetDocument(asset))).join('\n') + '\n',
  );
  for (const asset of assets) {
    copyFileSync(asset.sourcePath, join(outputDir, 'assets', asset.fileName));
  }
  writeFileSync(
    join(outputDir, 'images.json'),
    JSON.stringify(
      assets.map(({ _id, sourcePath, fileName, originalFilename, width, height }) => ({
        _id,
        sourcePath,
        fileName,
        originalFilename,
        width,
        height,
      })),
      null,
      2,
    ) + '\n',
  );
  summary();
  console.log(`Dry run: written to ${outputDir}`);
} else {
  const envFile = join(studioDir, '.env.local');
  if (existsSync(envFile)) process.loadEnvFile(envFile);
  const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
  const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production';
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!projectId || projectId === 'placeholder' || !token) {
    console.error(
      'Set SANITY_STUDIO_PROJECT_ID (a real project id) and SANITY_API_WRITE_TOKEN in studio/.env.local, or use --dry-run.',
    );
    process.exit(1);
  }
  const client = createClient({ projectId, dataset, token, apiVersion: '2026-01-01', useCdn: false });

  // Sanity derives asset ids from content hash and dimensions, so uploads normally return the
  // precomputed ids. Any difference is mapped onto the documents before writing them.
  const idMap = new Map<string, string>();
  for (const asset of assets) {
    const uploaded = await client.assets.upload('image', readFileSync(asset.sourcePath), {
      filename: asset.originalFilename,
      contentType: asset.mimeType,
    });
    console.log(`Uploaded ${asset.originalFilename} → ${uploaded._id}`);
    if (uploaded._id !== asset._id) idMap.set(asset._id, uploaded._id);
  }
  let serialized = JSON.stringify(documents);
  for (const [from, to] of idMap) serialized = serialized.split(`"${from}"`).join(`"${to}"`);
  const finalDocuments = JSON.parse(serialized) as SanityDocument[];

  const transaction = finalDocuments.reduce(
    (tx, doc) => tx.createOrReplace(doc),
    client.transaction(),
  );
  await transaction.commit();
  summary();
  console.log(`Written to project ${projectId}, dataset ${dataset}`);
}
