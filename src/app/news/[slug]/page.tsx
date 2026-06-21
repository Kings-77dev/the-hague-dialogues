import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {client} from '@/sanity/client'
import {ARTICLE_BY_SLUG_QUERY} from '@/sanity/queries'
import {SanityImage} from '@/components/SanityImage'
import {Prose} from '@/components/Prose'
import {JsonLd} from '@/components/JsonLd'
import {urlFor} from '@/sanity/image'
import {formatLongDate} from '@/lib/date'
import {SITE_URL} from '@/lib/site'

export const revalidate = 300

type Params = {slug: string}

export async function generateStaticParams(): Promise<Params[]> {
  const data = await client
    .withConfig({useCdn: false})
    .fetch<{slug: string}[]>(
      `*[_type == "article" && defined(slug.current)]{ "slug": slug.current }`,
    )
  return data.map((d) => ({slug: d.slug}))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const {slug} = await params
  const data = await client.fetch(ARTICLE_BY_SLUG_QUERY, {slug})
  if (!data) return {title: 'Article'}
  const ogImg = data.coverImage
    ? urlFor(data.coverImage).width(1200).height(630).fit('crop').auto('format').url()
    : undefined
  return {
    title: data.title,
    description: data.standfirst ?? undefined,
    alternates: {canonical: `/news/${slug}`},
    openGraph: {
      type: 'article',
      title: data.title,
      description: data.standfirst ?? undefined,
      url: `${SITE_URL}/news/${slug}`,
      publishedTime: data.publishedAt,
      authors: data.author?.name ? [data.author.name] : undefined,
      ...(ogImg ? {images: [{url: ogImg, width: 1200, height: 630}]} : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.standfirst ?? undefined,
      ...(ogImg ? {images: [ogImg]} : {}),
    },
  }
}

export default async function ArticlePage({params}: {params: Promise<Params>}) {
  const {slug} = await params
  const article = await client.fetch(ARTICLE_BY_SLUG_QUERY, {slug})
  if (!article) notFound()

  const coverUrl = article.coverImage
    ? urlFor(article.coverImage).width(1200).height(630).fit('crop').auto('format').url()
    : undefined
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.standfirst ?? undefined,
    datePublished: article.publishedAt,
    image: coverUrl ? [coverUrl] : undefined,
    author: article.author?.name
      ? {'@type': 'Person', name: article.author.name}
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'The Hague Dialogues',
      url: SITE_URL,
    },
    mainEntityOfPage: `${SITE_URL}/news/${slug}`,
  }

  return (
    <>
      <JsonLd data={articleJsonLd} />
      {/* ---- Hero ---- */}
      <section className="article-hero">
        <div className="container">
          <div className="article-hero-inner">
            <Link className="back-link" href="/news">
              ← News
            </Link>
            {article.topic && <span className="tag">{article.topic}</span>}
            <h1 className="display article-title">{article.title}</h1>
            {article.standfirst && <p className="standfirst">{article.standfirst}</p>}
            {article.author && (
              <div className="byline">
                <span className="by-avatar">
                  {article.author.photo && (
                    <SanityImage
                      image={article.author.photo}
                      alt={article.author.name}
                      sizes="46px"
                    />
                  )}
                </span>
                <div>
                  <span className="by-name">{article.author.name}</span>
                  <span className="by-meta">
                    {formatLongDate(article.publishedAt)}
                    {article.readingMinutes && <> · {article.readingMinutes} min read</>}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---- Cover ---- */}
      <figure className="cover">
        <div className="relative w-full" style={{height: 'clamp(280px, 44vw, 540px)'}}>
          <SanityImage
            image={article.coverImage}
            alt={article.title}
            sizes="100vw"
            priority
          />
        </div>
      </figure>

      {/* ---- Body: share rail + prose ---- */}
      <div className="article-body container">
        <aside className="share-rail">
          <span className="lab">Share</span>
          <button className="share-btn" type="button" title="Copy link" aria-label="Copy link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5" />
              <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5" />
            </svg>
          </button>
          <button className="share-btn" type="button" title="Share on X" aria-label="Share on X">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.5 3h3l-6.6 7.5L21.8 21h-5.9l-4.3-5.7L6.6 21H3.6l7-8L2.6 3h6l3.9 5.2L17.5 3zm-2 16h1.6L7.6 4.7H5.9L15.5 19z" />
            </svg>
          </button>
          <button
            className="share-btn"
            type="button"
            title="Share on LinkedIn"
            aria-label="Share on LinkedIn"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M4.5 4.5a2 2 0 100 4 2 2 0 000-4zM3 9.5h3V21H3zM9 9.5h2.9v1.6h.1c.5-.9 1.7-1.9 3.5-1.9 3 0 4.5 2 4.5 5.4V21h-3v-5c0-1.4-.5-2.4-1.9-2.4-1 0-1.6.7-1.9 1.4-.1.3-.1.6-.1 1V21H9z" />
            </svg>
          </button>
        </aside>

        <Prose value={article.body} />
      </div>

      {/* ---- Author block ---- */}
      {article.author && (
        <section className="section paper">
          <div className="container">
            <div className="author-inner">
              <div className="author-photo">
                {article.author.photo && (
                  <SanityImage
                    image={article.author.photo}
                    alt={article.author.name}
                    sizes="120px"
                  />
                )}
              </div>
              <div>
                <p className="eyebrow">Author</p>
                <h3 className="author-name">{article.author.name}</h3>
                {article.author.role && <p className="author-role">{article.author.role}</p>}
                <Prose value={article.author.bio} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ---- Related ---- */}
      {article.related && article.related.length > 0 && (
        <section className="section dark related">
          <div className="container">
            <p className="eyebrow">More from the dialogue</p>
            <div className="article-grid">
              {article.related.map((r) => (
                <Link
                  key={r._id}
                  href={`/news/${r.slug?.current ?? ''}`}
                  className="article-card block"
                >
                  <div className="thumb">
                    <SanityImage
                      image={r.coverImage}
                      alt={r.title}
                      sizes="(max-width: 1000px) 50vw, 33vw"
                    />
                  </div>
                  {r.topic && <span className="tag">{r.topic}</span>}
                  <h3>{r.title}</h3>
                  <div className="date">{formatLongDate(r.publishedAt)}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
