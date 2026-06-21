import type {Metadata} from 'next'
import Link from 'next/link'
import {client} from '@/sanity/client'
import {MEDIA_QUERY} from '@/sanity/queries'
import {SanityImage} from '@/components/SanityImage'
import {formatMonthYear} from '@/lib/date'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Media — The Hague Dialogues',
  description: 'Recaps, highlights and photo series from our dialogues.',
}

const FORMAT_PILLS = ['All', 'Interviews', 'Debates', 'Panels', 'Photo series'] as const

export default async function MediaPage() {
  const data = await client.fetch(MEDIA_QUERY, {format: null, topic: null, sort: 'newest'})
  const {featured, items, topics} = data

  return (
    <main className="media-wrap">
      {/* ---- Intro ---- */}
      <section className="m-intro">
        <div className="container">
          <div className="m-intro-grid">
            <div>
              <p className="eyebrow">Media</p>
              <h1 className="display">Recaps, highlights &amp; photo series</h1>
              <p className="lede">
                Watch session recaps, view photo series from events, and explore our
                editorial content on politics, society, and the ideas that shape our world.
              </p>
            </div>
            <div className="m-intro-media">
              {featured?.thumbnail ? (
                <SanityImage
                  image={featured.thumbnail}
                  alt={featured.title}
                  sizes="(max-width: 980px) 100vw, 45vw"
                />
              ) : (
                <div className="absolute inset-0 bg-navy-2" aria-hidden />
              )}
              <div className="quote-overlay">
                <span className="qmark" aria-hidden>
                  “
                </span>
                <p className="qwordmark">The Hague Dialogues</p>
                <p>The best way to predict the future is to debate it.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Toolbar (visual-only filters for now) ---- */}
      <section className="m-toolbar">
        <div className="container">
          <div className="m-toolbar-inner">
            <div className="m-search">
              <svg viewBox="0 0 24 24" aria-hidden>
                <circle cx="11" cy="11" r="7" strokeWidth={2} />
                <path d="M21 21l-4.3-4.3" strokeWidth={2} />
              </svg>
              <input type="text" placeholder="Search media…" />
            </div>
            <div className="m-controls">
              <div className="m-pills">
                {FORMAT_PILLS.map((p, i) => (
                  <button key={p} className={`m-pill${i === 0 ? ' active' : ''}`} type="button">
                    {p}
                  </button>
                ))}
              </div>
              <div className="m-selects">
                <div className="m-select">
                  <label htmlFor="topic-select" className="sr-only">
                    Topic
                  </label>
                  <select id="topic-select" defaultValue="">
                    <option value="">All topics</option>
                    {topics.map((t) => (
                      <option key={t._id} value={t.slug ?? ''}>
                        {t.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="m-select">
                  <label htmlFor="sort-select" className="sr-only">
                    Sort by
                  </label>
                  <select id="sort-select" defaultValue="newest">
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Featured ---- */}
      {featured && (
        <section className="section dark" style={{padding: 0}}>
          <div className="container">
            <div className="m-feat-label">
              <p className="eyebrow">Featured</p>
            </div>
            <Link
              className="media-feature block"
              href={featured.url ?? '#'}
              {...(featured.url ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
            >
              <div className="fb-thumb">
                <SanityImage
                  image={featured.thumbnail}
                  alt={featured.title}
                  sizes="(max-width: 1000px) 100vw, 1200px"
                />
                <span className="m-play" aria-hidden>
                  <svg viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <div className="fb-grad" />
                <div className="fb-caption">
                  <h2 className="fb-title">{featured.title}</h2>
                  <p className="fb-meta">
                    {featured.format}
                    {featured.durationLabel && ` · ${featured.durationLabel}`}
                  </p>
                </div>
                <span className="fb-watch">
                  Watch <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ---- Grid ---- */}
      {items.length > 0 && (
        <section className="section dark" style={{paddingTop: 0}}>
          <div className="container">
            <div className="media-grid">
              {items.map((m) => (
                <Link
                  key={m._id}
                  className="m-tile"
                  href={m.url ?? '#'}
                  {...(m.url ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
                >
                  <div className="m-thumb">
                    <SanityImage
                      image={m.thumbnail}
                      alt={m.title}
                      sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 33vw"
                    />
                    {m.format && <span className="m-badge">{m.format}</span>}
                  </div>
                  <div className="m-body">
                    <p className="m-title">{m.title}</p>
                    <div className="m-cap">
                      <span>{m.publishedAt ? formatMonthYear(m.publishedAt) : ''}</span>
                      <span>{m.durationLabel}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---- Suggest a topic ---- */}
      <section className="topic-cta">
        <div className="container">
          <div className="topic-cta-inner">
            <div>
              <h2>Have a topic you’d like us to explore?</h2>
              <p>
                Suggest a question, theme, or guest — we read every idea and let it shape
                the season&rsquo;s programme.
              </p>
            </div>
            <Link className="topic-btn" href="/contact">
              Suggest a topic <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
