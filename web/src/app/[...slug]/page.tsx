import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound, permanentRedirect, redirect } from 'next/navigation';
import { BlockContent } from '@eightmedia/kikker-react';
import { fetchPage, fetchRedirect } from '@eightmedia/kikker-next';

import { PageHeader } from '@/components/PageHeader/PageHeader';
import { pageMetadata } from '@/lib/metadata';
import { withTrailingSlash } from '@/lib/siteUrl';
import { hasSanityProject, siteName } from '@/sanity/client';
import { sanityFetch } from '@/sanity/fetch';
import { client, isDraftMode, pageClient } from '@/sanity/live';
import { localPageQuery, queries, type PageData } from '@/sanity/queries';

/**
 * Sanity `page` documents (privacybeleid, algemene-voorwaarden) and CMS redirects. The home
 * page is coded (`src/app/page.tsx`), so this is a required catch-all: `/` never lands here.
 * Rendered per request: nothing is fetched at build time, so the build also passes
 * before the Sanity project exists.
 */
export const dynamic = 'force-dynamic';

type Params = Promise<{ slug: string[] }>;

type PageResult = { _id: string; _type: string; path: string; data: PageData };

const getPage = cache(async (slug: string[]) => {
  if (!hasSanityProject) {
    // Local stand without a Sanity project: the data layer evaluates GROQ over the
    // migration dry run. Only top-level pages exist there, so the last segment is the slug.
    if (slug.length !== 1) return null;
    return sanityFetch<PageResult | null>({ query: localPageQuery, params: { slug: slug[0], siteName } });
  }
  return fetchPage<PageData>(pageClient, {
    path: slug,
    siteName,
    queries,
    preview: await isDraftMode(),
  });
});

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) return {};

  const seo = page.data.seo;
  const title = (seo?.title ?? page.data.title).trim();
  return pageMetadata({
    title,
    description: seo?.description ?? '',
    path: withTrailingSlash(page.path),
    noindex: seo ? !seo.indexable : false,
    // A title that already carries a suffix from the Studio's SEO settings stays as is.
    bareTitle: title.includes('|'),
  });
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const page = await getPage(slug);

  if (!page) {
    if (hasSanityProject) {
      const target = await fetchRedirect(client, { path: slug, siteName });
      if (target) {
        if (target.permanent) permanentRedirect(target.href);
        redirect(target.href);
      }
    }
    notFound();
  }

  return (
    <article>
      <PageHeader title={page.data.title} />
      <section className="rw-page-body">
        <div className="rw-container">
          <div className="rw-prose">
            <BlockContent value={page.data.body} />
          </div>
        </div>
      </section>
    </article>
  );
}
