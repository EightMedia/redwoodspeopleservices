import type { Metadata } from 'next';

import { PageHeader } from '@/components/PageHeader/PageHeader';
import { SanityImage } from '@/components/SanityImage/SanityImage';
import { Section } from '@/components/Section/Section';
import { pageMetadata } from '@/lib/metadata';
import { formatBlogDate, getBlogPosts } from '@/sanity/queries/blog';

import './page.css';

export const metadata: Metadata = pageMetadata({
  title: 'Blog',
  description:
    'Artikelen en verhalen over hechting, relaties, emoties, rouw en persoonlijke groei, geschreven door de therapeuten van Redwoods.',
  path: '/blog/',
});

/** Blog overview (Astro `blog/index.astro`). */
export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Inspiratie en inzichten"
        intro="Verhalen en artikelen van onze therapeuten over hechting, relaties, emoties, rouw en groei."
      />
      <Section>
        <div className="rw-blog-grid">
          {posts.map((post) => (
            <article key={post.slug} className="rw-blog-card">
              {post.cover ? (
                <a href={`/blog/${post.slug}/`} tabIndex={-1} aria-hidden="true" className="rw-blog-card__media">
                  <SanityImage
                    image={post.cover}
                    alt={post.title}
                    width={640}
                    height={400}
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="rw-blog-card__image"
                  />
                </a>
              ) : null}
              <p className="rw-blog-card__date">{formatBlogDate(post.date)}</p>
              <h2 className="rw-blog-card__title">
                <a href={`/blog/${post.slug}/`} className="rw-blog-card__link">
                  {post.title}
                </a>
              </h2>
              <p className="rw-blog-card__description">{post.description}</p>
              <a href={`/blog/${post.slug}/`} className="rw-blog-card__more">
                Lees verder <span aria-hidden="true">→</span>
              </a>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
