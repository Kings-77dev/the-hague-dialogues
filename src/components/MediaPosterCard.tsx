import Link from 'next/link'
import type {SanityImageSource} from '@sanity/image-url'
import {SanityImage} from './SanityImage'
import {mediaCtaLabel} from '@/lib/media'

export type MediaCardData = {
  _id: string
  title: string
  format?: string | null
  thumbnail?: SanityImageSource | null
  durationLabel?: string | null
  url?: string | null
}

type MediaPosterCardProps = {
  item: MediaCardData
  /** Larger feature tile (adds the format label). */
  feature?: boolean
  sizes?: string
}

/** Faithful prototype `.poster-card` used in the media mosaic. */
export function MediaPosterCard({item, feature = false, sizes}: MediaPosterCardProps) {
  const href = item.url ?? '/media'
  const external = !!item.url
  const cta = mediaCtaLabel(item.format)
  const resolvedSizes =
    sizes ?? (feature ? '(max-width: 1000px) 100vw, 55vw' : '(max-width: 1000px) 50vw, 22vw')

  return (
    <Link
      href={href}
      {...(external ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
      aria-label={`${cta}: ${item.title}`}
      className={`poster-card${feature ? ' media-feature' : ''}`}
    >
      <SanityImage image={item.thumbnail} alt={item.title} sizes={resolvedSizes} />
      <div className="poster-content">
        {feature && item.format && <span className="poster-label">{item.format}</span>}
        <h3>{item.title}</h3>
        <div className="poster-footer">
          <span>{item.durationLabel ?? item.format}</span>
          <span className="poster-cta">
            {cta} <span aria-hidden>→</span>
          </span>
        </div>
      </div>
    </Link>
  )
}
