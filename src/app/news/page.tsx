import type {Metadata} from 'next'
import Link from 'next/link'
import {client} from '@/sanity/client'
import {NEWS_QUERY} from '@/sanity/queries'
import {SanityImage} from '@/components/SanityImage'
import {ArticleCard} from '@/components/ArticleCard'
import {formatLongDate} from '@/lib/date'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'News — The Hague Dialogues',
  description: 'Recaps, opinions, and announcements from across the dialogue.',
}

const FORMATS = ['Recap', 'Opinion', 'Announcement', 'Interview'] as const
type Format = (typeof FORMATS)[number]

type SearchParams = Promise<{format?: string}>

export default async function NewsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const sp = await searchParams
  const rawFormat = sp.format
  const activeFormat: Format | null = (FORMATS as readonly string[]).includes(
    rawFormat ?? '',
  )
    ? (rawFormat as Format)
    : null

  const data = await client.fetch(NEWS_QUERY, {format: activeFormat, limit: 24})
  const {featured, articles, total} = data

  const filterHref = (f: Format | null) =>
    f ? `/news?format=${encodeURIComponent(f)}` : '/news'

  return (
    <>
      {/* ---- Page head ---- */}
      <section className="page-head">
        <div className="container">
          <p className="eyebrow">News</p>
          <h1 className="display">Latest updates &amp; insights</h1>
          <p className="page-lede">
            Recaps, opinions, and announcements from across the dialogue.
          </p>
        </div>
      </section>

      {/* ---- Sticky filter bar (backlog 4) ---- */}
      <section className="filter-bar paper">
        <div className="container">
          <div className="filters">
            <Link
              href={filterHref(null)}
              className={`filter${activeFormat === null ? ' active' : ''}`}
            >
              All
            </Link>
            {FORMATS.map((f) => (
              <Link
                key={f}
                href={filterHref(f)}
                className={`filter${activeFormat === f ? ' active' : ''}`}
              >
                {f}
              </Link>
            ))}
            <span className="filter-count">
              {total} article{total === 1 ? '' : 's'}
            </span>
          </div>
        </div>
      </section>

      {/* ---- Featured + grid ---- */}
      <section className="section paper">
        <div className="container">
          {/* Hide the "featured" card when a format filter is active — featured
              is curated and shouldn't override the filter's intent. */}
          {featured && !activeFormat && (
            <Link
              className="featured block"
              href={`/news/${featured.slug?.current ?? ''}`}
            >
              <div className="featured-media">
                <SanityImage
                  image={featured.coverImage}
                  alt={featured.title}
                  sizes="(max-width: 1000px) 100vw, 60vw"
                />
              </div>
              <div className="featured-body">
                {featured.topic && <span className="tag">{featured.topic}</span>}
                <h2 className="display feat-title">{featured.title}</h2>
                {featured.standfirst && <p className="feat-dek">{featured.standfirst}</p>}
                <div className="feat-meta">
                  {featured.author?.name && <>By {featured.author.name} · </>}
                  {formatLongDate(featured.publishedAt)}
                  {featured.readingMinutes && <> · {featured.readingMinutes} min read</>}
                </div>
                <span className="card-cta">Read article →</span>
              </div>
            </Link>
          )}

          {articles.length > 0 ? (
            <div className="article-grid">
              {articles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          ) : (
            <div style={{padding: '40px 0'}}>
              <p className="eyebrow">No matches</p>
              <h2 className="display about-h2" style={{marginTop: 18}}>
                No {activeFormat ? `${activeFormat.toLowerCase()} ` : ''}articles yet.
              </h2>
              <p style={{marginTop: 16, color: '#48555f'}}>
                <Link href="/news" className="card-cta" style={{color: 'var(--navy)'}}>
                  Clear filter <span aria-hidden>→</span>
                </Link>
              </p>
            </div>
          )}

          {articles.length < total && (
            <div className="load-more">
              <button type="button" className="btn-outline">
                Load more articles
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
