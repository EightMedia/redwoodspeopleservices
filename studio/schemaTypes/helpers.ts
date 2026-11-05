import type { DocumentDefinition, FieldDefinition, FieldGroupDefinition } from 'sanity';

/** Dutch titles for the Kikker editor groups (`defaultGroups` / `settingsGroups`). */
const groupTitles: Record<string, string> = {
  settings: 'Instellingen',
  main: 'Inhoud',
  seo: 'SEO',
  social: 'Social',
  listDisplay: 'Overzichtsweergave',
};

export type FieldLabel = {
  title?: string;
  description?: string;
  /** Labels for the fields of an object field (one level deep is enough for Kikker). */
  fields?: Record<string, FieldLabel>;
};

type WithFields = FieldDefinition & { fields?: FieldDefinition[] };

function relabelField(field: FieldDefinition, label: FieldLabel): FieldDefinition {
  const { fields: nested, ...own } = label;
  const next = { ...field, ...own } as WithFields;
  if (nested && Array.isArray(next.fields)) {
    next.fields = next.fields.map((child) => {
      const childLabel = nested[child.name];
      return childLabel ? relabelField(child, childLabel) : child;
    });
  }
  return next as FieldDefinition;
}

/**
 * Relabel fields and groups of a Kikker document factory result so editors see Dutch
 * labels. Field names (the data model) never change.
 */
export function relabel(
  schema: DocumentDefinition,
  labels: Record<string, FieldLabel>,
): DocumentDefinition {
  const fields = (schema.fields ?? []).map((field) => {
    const label = labels[field.name];
    return label ? relabelField(field, label) : field;
  });
  const groups = (schema.groups ?? []).map(
    (group): FieldGroupDefinition => ({ ...group, title: groupTitles[group.name] ?? group.title }),
  );
  return { ...schema, fields, groups } as DocumentDefinition;
}

/** Replace a top-level field (by name) with another definition. */
export function replaceField(
  schema: DocumentDefinition,
  name: string,
  replacement: FieldDefinition,
): DocumentDefinition {
  const fields = (schema.fields ?? []).map((field) => (field.name === name ? replacement : field));
  return { ...schema, fields } as DocumentDefinition;
}

/** Drop top-level fields by name. */
export function withoutFields(schema: DocumentDefinition, names: string[]): DocumentDefinition {
  const fields = (schema.fields ?? []).filter((field) => !names.includes(field.name));
  return { ...schema, fields } as DocumentDefinition;
}

/** Insert a field after the named field (or at the end when not found). */
export function insertFieldAfter(
  schema: DocumentDefinition,
  after: string,
  field: FieldDefinition,
): DocumentDefinition {
  const fields = [...(schema.fields ?? [])];
  const index = fields.findIndex((item) => item.name === after);
  fields.splice(index === -1 ? fields.length : index + 1, 0, field);
  return { ...schema, fields } as DocumentDefinition;
}

/** Shared Dutch labels for the Kikker fields that recur on page-like documents. */
export const kikkerFieldLabels: Record<string, FieldLabel> = {
  slug: { title: 'URL-naam' },
  parent: {
    title: 'Bovenliggende pagina',
    description:
      'De pagina boven deze pagina in het adres. Leeg laten voor een pagina direct onder de homepage.',
  },
  publicationDate: { title: 'Publicatiedatum' },
  sunsetDate: {
    title: 'Offline vanaf',
    description: 'Na deze datum en tijd is het document niet meer zichtbaar op de site.',
  },
  listDisplay: {
    title: 'Overzichtsweergave',
    description: 'Titel, samenvatting en afbeelding voor overzichten en kaarten.',
    fields: {
      title: { title: 'Titel', description: 'Vervangt de titel in overzichten en kaarten.' },
      text: { title: 'Korte samenvatting', description: 'Korte tekst voor overzichten en kaarten.' },
      image: { title: 'Afbeelding' },
    },
  },
  seo: {
    title: 'SEO',
    description:
      'Titel, omschrijving en deelafbeelding voor Google en social media. Leeg laten voor de standaardwaarden.',
    fields: {
      title: { title: 'Titel (overschrijven)' },
      description: { title: 'Omschrijving voor Google' },
      image: { title: 'Deelafbeelding' },
      searchable: { title: 'Mag in zoekmachines' },
    },
  },
};

/**
 * Groups for own documents and singletons. `withSiteNames` puts `siteNames` in `settings`,
 * so every document that uses it must define that group (Sanity throws otherwise).
 */
export const singletonGroups: FieldGroupDefinition[] = [
  { name: 'main', title: 'Inhoud', default: true },
  { name: 'settings', title: 'Instellingen' },
];
