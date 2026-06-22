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

const FORMATS = ['Interview', 'Debate', 'Panel', 'Photo series'] as const
type Format = (typeof FORMATS)[number]
type Sort = 'newest' | 'oldest'

type SearchParams = Promise<{
  format?: string
  topic?: string
  sort?: string
  q?: string
}>

function buildHref(
  base: Record<string, string | null | undefined>,
  override: Record<string, string | null>,
) {
  const merged = {...base, ...override}
  const params = new URLSearchParams()
  for (const [k, v] of Object.entries(merged)) {
    if (v) params.set(k, v)
  }
  const qs = params.toString()
  return qs ? `/media?${qs}` : '/media'
}

export default async function MediaPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const sp = await searchParams
  const activeFormat = (FORMATS as readonly string[]).includes(sp.format ?? '')
    ? (sp.format as Format)
    : null
  const activeTopic = sp.topic && sp.topic.trim() ? sp.topic : null
  const sort: Sort = sp.sort === 'oldest' ? 'oldest' : 'newest'
  const q = sp.q?.trim() ? sp.q.trim() : null

  const data = await client.fetch(MEDIA_QUERY, {
    format: activeFormat,
    topic: activeTopic,
    sort,
    q,
  })
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

      {/* ---- Sticky toolbar (backlog 5): real GET form ---- */}
      <section className="m-toolbar">
        <div className="container">
          <form
            className="m-toolbar-inner"
            action="/media"
            method="get"
            // Trigger a navigation on any select change (no JS state needed).
            // The submit button is a fallback for the text input.
          >
            <div className="m-search">
              <svg viewBox="0 0 24 24" aria-hidden>
                <circle cx="11" cy="11" r="7" strokeWidth={2} />
                <path d="M21 21l-4.3-4.3" strokeWidth={2} />
              </svg>
              <label htmlFor="m-q" className="sr-only">
                Search media
              </label>
              <input
                id="m-q"
                name="q"
                type="search"
                placeholder="Search media…"
                defaultValue={q ?? ''}
              />
            </div>
            <div className="m-controls">
              {/* Format pills as Links (no JS needed). Inactive pills clear `format`. */}
              <div className="m-pills">
                <Link
                  href={buildHref({topic: activeTopic, sort, q}, {format: null})}
                  className={`m-pill${activeFormat === null ? ' active' : ''}`}
                >
                  All
                </Link>
                {FORMATS.map((f) => (
                  <Link
                    key={f}
                    href={buildHref({topic: activeTopic, sort, q}, {format: f})}
                    className={`m-pill${activeFormat === f ? ' active' : ''}`}
                  >
                    {f === 'Photo series' ? 'Photo series' : `${f}s`}
                  </Link>
                ))}
              </div>
              <div className="m-selects">
                <div className="m-select">
                  <label htmlFor="topic-select" className="sr-only">
                    Topic
                  </label>
                  <select
                    id="topic-select"
                    name="topic"
                    defaultValue={activeTopic ?? ''}
                  >
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
                  <select id="sort-select" name="sort" defaultValue={sort}>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                  </select>
                </div>
              </div>
              {/* Hidden format input lets the submit button preserve the active
                  format pill when the user submits the search. */}
              {activeFormat && <input type="hidden" name="format" value={activeFormat} />}
              <button type="submit" className="sr-only" tabIndex={-1}>
                Apply
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ---- Featured (only when no filters active) ---- */}
      {featured && !activeFormat && !activeTopic && !q && (
        <section className="section dark flush">
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
      {items.length > 0 ? (
        <section className="section dark flush-top">
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
      ) : (
        <section className="section dark">
          <div className="container">
            <p className="eyebrow">No matches</p>
            <h2 className="display about-h2" style={{marginTop: 18}}>
              Nothing here yet.
            </h2>
            <p style={{marginTop: 16, color: 'rgba(255,255,255,0.65)'}}>
              <Link href="/media" className="card-cta">
                Clear filters <span aria-hidden>→</span>
              </Link>
            </p>
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
