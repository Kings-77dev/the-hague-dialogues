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

const FORMATS = ['All', 'Recap', 'Opinion', 'Announcement', 'Interview'] as const

export default async function NewsPage() {
  const data = await client.fetch(NEWS_QUERY, {format: null, limit: 24})
  const {featured, articles, total} = data

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

      {/* ---- Featured + grid ---- */}
      <section className="section paper">
        <div className="container">
          {featured && (
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

          <div className="articles-head">
            {/* Tabs are visual-only for this pass (Stage refinement: wire to ?format=) */}
            <div className="tabs">
              {FORMATS.map((f, i) => (
                <button key={f} className={i === 0 ? 'active' : ''} type="button">
                  {f}
                </button>
              ))}
            </div>
            <span className="view-all">{total} articles</span>
          </div>

          <div className="article-grid">
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>

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
