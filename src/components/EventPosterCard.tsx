import Link from 'next/link'
import type {SanityImageSource} from '@sanity/image-url'
import {SanityImage} from './SanityImage'
import {formatDayMonth, formatTime} from '@/lib/date'

type Status = 'upcoming' | 'past'

export type EventCardData = {
  _id: string
  title: string
  slug: {current?: string | null} | null
  startsAt: string
  format?: string | null
  venue?: string | null
  coverImage?: SanityImageSource | null
}

type EventPosterCardProps = {
  event: EventCardData
  status?: Status
  sizes?: string
}

/**
 * Faithful prototype `.poster-card.tall.event-poster` with hover reveal.
 * The whole card is one link; the "Register" CTA is a styled span (no nested
 * anchors), so it stays valid HTML and fully clickable.
 */
export function EventPosterCard({
  event,
  status = 'upcoming',
  sizes = '(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw',
}: EventPosterCardProps) {
  const href = `/events/${event.slug?.current ?? ''}`
  return (
    <Link
      href={href}
      className={`poster-card tall event-poster${status === 'past' ? ' is-past' : ''}`}
    >
      {status === 'past' && (
        <span className="status-chip">Recap · {formatDayMonth(event.startsAt)}</span>
      )}
      <SanityImage image={event.coverImage} alt={event.title} sizes={sizes} />
      <div className="poster-titlebar">
        <h3>{event.title}</h3>
      </div>
      <div className="event-reveal">
        <span className="event-register">
          {status === 'past' ? 'Watch recap' : 'Register'} <span aria-hidden>→</span>
        </span>
        <div className="event-info">
          <h3>{event.title}</h3>
          {event.venue && (
            <div className="event-location">
              <span className="pin" aria-hidden>
                ●
              </span>
              <span>{event.venue}</span>
            </div>
          )}
          <div className="event-date">
            <strong>{formatDayMonth(event.startsAt)}</strong>
            <span>{formatTime(event.startsAt)}</span>
          </div>
        </div>
        {event.format && <div className="event-category">{event.format}</div>}
      </div>
    </Link>
  )
}
