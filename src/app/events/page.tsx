import type {Metadata} from 'next'
import Link from 'next/link'
import {client} from '@/sanity/client'
import {EVENTS_QUERY} from '@/sanity/queries'
import {EventPosterCard} from '@/components/EventPosterCard'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Events — The Hague Dialogues',
  description: 'Upcoming and past dialogues in The Hague.',
}

type SearchParams = Promise<{topic?: string}>

export default async function EventsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const sp = await searchParams
  const activeTopic = sp.topic ?? null
  const now = new Date().toISOString()
  const data = await client.fetch(EVENTS_QUERY, {now, topic: activeTopic})
  const {upcoming, past, community, topics} = data
  const openCall = community[0]

  // Build filter URL preserving everything but `topic`.
  const filterHref = (slug: string | null) =>
    slug ? `/events?topic=${encodeURIComponent(slug)}` : '/events'

  return (
    <>
      {/* ---- Hero ---- */}
      <section className="events-hero">
        <div className="container">
          <p className="eyebrow">Events</p>
          <h1 className="display">Upcoming &amp; past sessions</h1>
        </div>
      </section>

      {/* ---- Sticky filter bar (backlog 3) ---- */}
      <section className="filter-bar dark">
        <div className="container">
          <div className="filters">
            <Link
              href={filterHref(null)}
              className={`filter${activeTopic === null ? ' active' : ''}`}
            >
              All
            </Link>
            {topics.map((t) => (
              <Link
                key={t._id}
                href={filterHref(t.slug)}
                className={`filter${activeTopic === t.slug ? ' active' : ''}`}
              >
                {t.title}
              </Link>
            ))}
            <span className="filter-count">
              {upcoming.length + past.length} session
              {upcoming.length + past.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>
      </section>

      {/* ---- Upcoming ---- */}
      {upcoming.length > 0 && (
        <section className="events-section ev-dark">
          <div className="container">
            <div className="sec-head">
              <p className="eyebrow">Upcoming events</p>
              <span className="sec-count">
                {upcoming.length} session{upcoming.length === 1 ? '' : 's'}
              </span>
            </div>
            <div className="card-grid">
              {upcoming.map((event) => (
                <EventPosterCard key={event._id} event={event} status="upcoming" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---- Community / open call (only when no topic filter applied) ---- */}
      {openCall && !activeTopic && (
        <section className="community-cta">
          <div className="container">
            <div className="cc-inner">
              <div>
                <p className="eyebrow">Open call</p>
                <h2 className="display cc-title">{openCall.title}</h2>
                <p className="cc-dek">
                  Bring your ideas and help shape the season&rsquo;s programme. Open to every
                  student in The Hague.
                </p>
              </div>
              <Link className="cc-btn" href="/get-involved">
                Join the call <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ---- Past ---- */}
      {past.length > 0 && (
        <section className="events-section ev-dark">
          <div className="container">
            <div className="sec-head">
              <p className="eyebrow">Past dialogues</p>
              <span className="sec-count">Archive</span>
            </div>
            <div className="card-grid">
              {past.map((event) => (
                <EventPosterCard key={event._id} event={event} status="past" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty state when the filter returns nothing */}
      {upcoming.length === 0 && past.length === 0 && (
        <section className="events-section ev-dark">
          <div className="container">
            <p className="eyebrow">No matches</p>
            <h2 className="display about-h2" style={{marginTop: 18}}>
              No sessions for this topic yet.
            </h2>
            <p style={{marginTop: 16, color: 'rgba(255,255,255,0.65)'}}>
              <Link href="/events" className="card-cta">
                Clear filter <span aria-hidden>→</span>
              </Link>
            </p>
          </div>
        </section>
      )}
    </>
  )
}
