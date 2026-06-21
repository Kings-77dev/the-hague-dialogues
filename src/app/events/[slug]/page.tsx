import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {client} from '@/sanity/client'
import {EVENT_BY_SLUG_QUERY} from '@/sanity/queries'
import {SanityImage} from '@/components/SanityImage'
import {Prose} from '@/components/Prose'
import {JsonLd} from '@/components/JsonLd'
import {formatLongDate} from '@/lib/date'
import {urlFor} from '@/sanity/image'
import {SITE_URL} from '@/lib/site'

export const revalidate = 300

type Params = {slug: string}

export async function generateStaticParams(): Promise<Params[]> {
  const data = await client
    .withConfig({useCdn: false})
    .fetch<{slug: string}[]>(
      `*[_type == "event" && defined(slug.current)]{ "slug": slug.current }`,
    )
  return data.map((d) => ({slug: d.slug}))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const {slug} = await params
  const data = await client.fetch(EVENT_BY_SLUG_QUERY, {slug})
  if (!data) return {title: 'Event'}
  const ogImg = data.coverImage
    ? urlFor(data.coverImage).width(1200).height(630).fit('crop').auto('format').url()
    : undefined
  return {
    title: data.title,
    description: data.standfirst ?? undefined,
    alternates: {canonical: `/events/${slug}`},
    openGraph: {
      type: 'article',
      title: data.title,
      description: data.standfirst ?? undefined,
      url: `${SITE_URL}/events/${slug}`,
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

function fmtDayName(iso: string) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Amsterdam',
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))
}

function fmtTime(iso: string) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Amsterdam',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(iso))
}

export default async function EventDetailPage({params}: {params: Promise<Params>}) {
  const {slug} = await params
  const event = await client.fetch(EVENT_BY_SLUG_QUERY, {slug})
  if (!event) notFound()

  const venueLabel = event.venue
    ? [event.venue.name, event.venue.city].filter(Boolean).join(', ')
    : null
  const dateLabel = fmtDayName(event.startsAt)
  const timeLabel = event.endsAt
    ? `${fmtTime(event.startsAt)}–${fmtTime(event.endsAt)}`
    : fmtTime(event.startsAt)

  const coverUrl = event.coverImage
    ? urlFor(event.coverImage).width(1200).height(630).fit('crop').auto('format').url()
    : undefined
  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.standfirst ?? undefined,
    startDate: event.startsAt,
    endDate: event.endsAt ?? undefined,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: event.venue
      ? {
          '@type': 'Place',
          name: event.venue.name,
          address: [event.venue.addressLine, event.venue.city].filter(Boolean).join(', '),
        }
      : undefined,
    image: coverUrl ? [coverUrl] : undefined,
    url: `${SITE_URL}/events/${slug}`,
    organizer: {
      '@type': 'Organization',
      name: 'The Hague Dialogues',
      url: SITE_URL,
    },
  }

  return (
    <>
      <JsonLd data={eventJsonLd} />
      {/* ---- Hero ---- */}
      <section className="ev-hero">
        <div className="container">
          <div className="ev-hero-inner">
            <Link className="ev-back" href="/events">
              ← Events
            </Link>
            {event.format && <span className="tag">{event.format}</span>}
            <h1 className="display ev-title">{event.title}</h1>
            <div className="ev-meta">
              <span>{dateLabel}</span>
              <span className="dot" aria-hidden />
              <span>{timeLabel}</span>
              {venueLabel && (
                <>
                  <span className="dot" aria-hidden />
                  <span>{venueLabel}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---- Cover image ---- */}
      <figure className="ev-cover">
        <div className="relative w-full" style={{height: 'clamp(280px, 42vw, 520px)'}}>
          <SanityImage
            image={event.coverImage}
            alt={event.title}
            sizes="100vw"
            priority
          />
        </div>
      </figure>

      {/* ---- Layout: prose + speakers / register ---- */}
      <div className="container ev-layout">
        <div className="ev-main">
          {event.standfirst && (
            <div className="prose">
              <p>{event.standfirst}</p>
            </div>
          )}
          <Prose value={event.body} />

          {event.speakers && event.speakers.length > 0 && (
            <div className="speakers">
              <h2>Speakers</h2>
              <div className="speaker-grid">
                {event.speakers.map((p) => (
                  <article className="speaker" key={p._id}>
                    <div className="sp-media">
                      {p.photo && (
                        <SanityImage
                          image={p.photo}
                          alt={p.name}
                          sizes="(max-width: 600px) 50vw, (max-width: 980px) 33vw, 220px"
                        />
                      )}
                    </div>
                    <div className="sp-body">
                      <p className="sp-name">{p.name}</p>
                      {p.role && <p className="sp-role">{p.role}</p>}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside>
          <div className="reg-module">
            <p className="rm-eyebrow">Attend this dialogue</p>
            <div className="rm-rows">
              <div className="rm-row">
                <span className="k">Date</span>
                <span className="v">{dateLabel}</span>
              </div>
              <div className="rm-row">
                <span className="k">Time</span>
                <span className="v">{timeLabel}</span>
              </div>
              {venueLabel && (
                <div className="rm-row">
                  <span className="k">Venue</span>
                  <span className="v">{venueLabel}</span>
                </div>
              )}
              {event.entryNote && (
                <div className="rm-row">
                  <span className="k">Entry</span>
                  <span className="v">{event.entryNote}</span>
                </div>
              )}
            </div>
            {event.registrationUrl ? (
              <a
                className="rm-btn"
                href={event.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Register <span aria-hidden>→</span>
              </a>
            ) : (
              <span className="rm-btn">Registration TBC</span>
            )}
            <button className="rm-cal" type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              Add to calendar
            </button>
            <p className="rm-foot">Free for students · seats limited</p>
          </div>
        </aside>
      </div>

      {/* ---- Related dialogues ---- */}
      {event.related && event.related.length > 0 && (
        <section className="section dark related">
          <div className="container">
            <p className="eyebrow">Related dialogues</p>
            <div className="article-grid">
              {event.related.map((r) => (
                <Link
                  key={r._id}
                  href={`/events/${r.slug?.current ?? ''}`}
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
                  <div className="date">{formatLongDate(r.startsAt)}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
