import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Cta } from '@/components/Cta/Cta';
import { JsonLd } from '@/components/JsonLd';
import { Prose } from '@/components/Prose/Prose';
import { SanityImage } from '@/components/SanityImage/SanityImage';
import { site } from '@/data/site';
import { pageMetadata } from '@/lib/metadata';
import { absoluteUrl } from '@/lib/siteUrl';
import { hasSanityProject } from '@/sanity/client';
import { imageUrl } from '@/sanity/image';
import { formatBlogDate, getBlogPost, getBlogPosts } from '@/sanity/queries/blog';

import './page.css';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  if (!hasSanityProject) return [];
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};

  const meta = pageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}/`,
    type: 'article',
  });
  // Open Graph image: the cover (Astro `image={post.data.cover}`).
  const cover = imageUrl(post.cover, { width: 1200, height: 630, fit: 'crop' });
  if (cover) {
    meta.openGraph = { ...meta.openGraph, images: [{ url: cover, width: 1200, height: 630 }] };
  }
  return meta;
}

/** Blog article (Astro `blog/[id].astro`). */
export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: new Date(post.date).toISOString(),
    author: { '@type': 'Organization', name: post.author },
    publisher: { '@id': `${site.url}/#organization` },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}/`),
  };

  return (
    <>
      <article className="rw-post">
        <div className="rw-container">
          <div className="rw-post__head">
            <a href="/blog/" className="rw-post__back">
              <span aria-hidden="true">←</span> Alle artikelen
            </a>
            <p className="rw-post__meta">
              {formatBlogDate(post.date)} · {post.author}
            </p>
            <h1 className="rw-post__title">{post.title}</h1>
            <p className="rw-post__description">{post.description}</p>
          </div>
          {post.cover ? (
            <SanityImage
              image={post.cover}
              alt={post.title}
              width={1400}
              height={800}
              priority
              sizes="(min-width: 1024px) 64rem, 100vw"
              className="rw-post__cover"
            />
          ) : null}
          <Prose value={post.body} className="rw-post__body" />
        </div>
      </article>
      <Cta
        title="Herken je jezelf hierin?"
        text="Praat erover met een van onze therapeuten. Een eerste gesprek is vrijblijvend."
        secondary={{ label: 'Ons team', href: '/team/' }}
      />
      <JsonLd data={jsonLd} />
    </>
  );
}
