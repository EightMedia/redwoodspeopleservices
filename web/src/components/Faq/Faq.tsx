import type { ReactNode } from 'react';
import { PortableText, toPlainText, type PortableTextComponents } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';

import { JsonLd } from '@/components/JsonLd';

import './Faq.css';

export type FaqItemInput = {
  q: string;
  /** Plain text with `[tekst](/pad/)` links (as in Faq.astro), or Portable Text from Sanity. */
  a: string | PortableTextBlock[];
};

export type FaqProps = {
  items: FaqItemInput[];
  title?: string;
};

/** `[tekst](/pad/)`, `[tekst](https://…)` or `[adres](mailto:adres)`. */
const linkRe = /\[([^\]]+)\]\(((?:https?:\/\/|mailto:|\/)[^)\s]+)\)/g;

function FaqLink({ href, children }: { href: string; children: ReactNode }) {
  const external = href.startsWith('http');
  return (
    <a
      href={href}
      className="rw-faq__link"
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener' : undefined}
    >
      {children}
    </a>
  );
}

/** Turns the markdown-style links of a string answer into React links. */
function stringToNodes(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(linkRe)) {
    const [full, label, href] = match;
    const index = match.index ?? 0;
    if (index > last) nodes.push(text.slice(last, index));
    nodes.push(
      <FaqLink key={index} href={href ?? '#'}>
        {label}
      </FaqLink>,
    );
    last = index + full.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

const stringToText = (text: string) => text.replace(linkRe, '$1');

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="rw-measure rw-faq__answer">{children}</p>,
  },
  marks: {
    link: ({ value, children }) => (
      <FaqLink href={typeof value?.href === 'string' ? value.href : '#'}>{children}</FaqLink>
    ),
  },
};

function Answer({ answer }: { answer: FaqItemInput['a'] }) {
  if (typeof answer === 'string') {
    return <p className="rw-measure rw-faq__answer">{stringToNodes(answer)}</p>;
  }
  return <PortableText value={answer} components={portableTextComponents} />;
}

/** Accordion of questions (`details`/`summary`) with FAQPage JSON-LD (Astro `Faq.astro`). */
export function Faq({ items, title = 'Veelgestelde vragen' }: FaqProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: typeof item.a === 'string' ? stringToText(item.a) : toPlainText(item.a),
      },
    })),
  };

  return (
    <div className="rw-faq">
      <h2 className="rw-faq__title">{title}</h2>
      <div className="rw-faq__list">
        {items.map((item, index) => (
          <details key={index} className="rw-faq__item">
            <summary className="rw-faq__summary">
              <span>{item.q}</span>
              <svg className="rw-faq__icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
              </svg>
            </summary>
            <Answer answer={item.a} />
          </details>
        ))}
      </div>
      <JsonLd data={jsonLd} />
    </div>
  );
}
