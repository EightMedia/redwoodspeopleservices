import { PortableText, type PortableTextComponents } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';

import { SanityImage } from '@/components/SanityImage/SanityImage';
import type { SanityImage as SanityImageValue } from '@/sanity/types';

export type ProseProps = {
  value?: PortableTextBlock[] | null;
  className?: string;
};

const components: PortableTextComponents = {
  marks: {
    link: ({ value, children }) => {
      const href = typeof value?.href === 'string' ? value.href : '#';
      const external = value?.target === '_blank' || /^https?:\/\//.test(href);
      return (
        <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener' : undefined}>
          {children}
        </a>
      );
    },
  },
  types: {
    // Inline images in blog articles (`image` member of the news body, asset resolved by the query).
    image: ({ value }: { value: SanityImageValue }) => {
      if (!value?.asset) return null;
      return <SanityImage image={value} alt={value.alt ?? ''} width={1200} sizes="(min-width: 768px) 48rem, 100vw" />;
    },
  },
};

/**
 * Portable Text body (blog, team, dienst) rendered as readable rich text inside `.rw-prose`.
 * Rendered with `@portabletext/react` directly: Kikker's `BlockContent` puts the text on its
 * own container grid, which does not fit inside a page column.
 */
export function Prose({ value, className }: ProseProps) {
  if (!value || value.length === 0) return null;
  const classes = ['rw-prose', className].filter(Boolean).join(' ');
  return (
    <div className={classes}>
      <PortableText value={value} components={components} />
    </div>
  );
}
