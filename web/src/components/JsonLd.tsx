import type { JsonLdObject } from '@/lib/jsonld';

type JsonLdProps = {
  data: JsonLdObject | JsonLdObject[];
};

/** Renders one `<script type="application/ld+json">` per object. */
export function JsonLd({ data }: JsonLdProps) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          // `<` is escaped so a string value can never close the script element.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item).replace(/</g, '\\u003c') }}
        />
      ))}
    </>
  );
}
