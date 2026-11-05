import { fieldBlockContent, type FieldBlockContentOptions } from '@eightmedia/kikker-sanity';
import type { FieldDefinition } from 'sanity';

type LooseField = FieldDefinition & { of?: LooseMember[] };
type LooseMember = {
  type?: string;
  marks?: { annotations?: LooseAnnotation[] };
  [key: string]: unknown;
};
type LooseAnnotation = { name?: string; fields?: LooseField[]; [key: string]: unknown };

const isAbsoluteHttpUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Kikker's link annotation only accepts http(s) URLs and site paths. The practice's texts
 * (privacyverklaring, FAQ) link to e-mail addresses and phone numbers, so this project
 * also allows `mailto:` and `tel:`. Everything else is Kikker's `fieldBlockContent`.
 */
const hrefValidation: FieldDefinition['validation'] = (rule) =>
  rule.required().custom((value) => {
    if (typeof value !== 'string' || value === '') return 'Vul een URL of pad in.';
    if (
      value.startsWith('/') ||
      value.startsWith('mailto:') ||
      value.startsWith('tel:') ||
      isAbsoluteHttpUrl(value)
    ) {
      return true;
    }
    return 'Gebruik een volledige http(s)-URL, een pad dat begint met /, mailto: of tel:.';
  });

/** Kikker block content (h2–h4, lists, strong/em/underline, links) with Dutch link labels. */
export function fieldRichText(options: FieldBlockContentOptions = {}): FieldDefinition {
  const field = fieldBlockContent(options) as LooseField;
  const of = (field.of ?? []).map((member) => {
    if (member.type !== 'block' || !member.marks?.annotations) return member;
    const annotations = member.marks.annotations.map((annotation) => {
      if (annotation.name !== 'link') return annotation;
      return {
        ...annotation,
        fields: (annotation.fields ?? []).map((inner) => {
          if (inner.name === 'href') {
            return {
              ...inner,
              title: 'URL of pad',
              description: 'Volledige http(s)-URL, een pad zoals /tarieven/, mailto:adres of tel:nummer.',
              validation: hrefValidation,
            } as LooseField;
          }
          if (inner.name === 'target') {
            return {
              ...inner,
              title: 'Openen in',
              options: {
                list: [
                  { title: 'Zelfde tabblad', value: '_self' },
                  { title: 'Nieuw tabblad', value: '_blank' },
                ],
                layout: 'radio',
              },
            } as LooseField;
          }
          return inner;
        }),
      };
    });
    return { ...member, marks: { ...member.marks, annotations } };
  });
  return { ...field, of } as FieldDefinition;
}
