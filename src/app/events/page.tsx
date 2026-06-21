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

export default async function EventsPage() {
  const now = new Date().toISOString()
  const data = await client.fetch(EVENTS_QUERY, {now})
  const {upcoming, past, community} = data
  const openCall = community[0]

  return (
    <>
      {/* ---- Hero ---- */}
      <section className="events-hero">
        <div className="container">
          <p className="eyebrow">Events</p>
          <h1 className="display">Upcoming &amp; past sessions</h1>
          {/* Filters are visual-only for now (Stage 5 refinement: wire to ?topic=). */}
          <div className="filters">
            <button className="filter active" type="button">
              All
            </button>
            <button className="filter" type="button">
              Geopolitics
            </button>
            <button className="filter" type="button">
              Policy
            </button>
            <button className="filter" type="button">
              Philosophy
            </button>
            <button className="filter" type="button">
              Society
            </button>
            <button className="filter" type="button">
              Identity
            </button>
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

      {/* ---- Community / open call ---- */}
      {openCall && (
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
    </>
  )
}
