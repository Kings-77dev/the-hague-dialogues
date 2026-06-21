import Image from 'next/image'
import type {SanityImageSource} from '@sanity/image-url'
import {urlFor} from '@/sanity/image'

type SanityImageProps = {
  image?: SanityImageSource | null
  alt: string
  /** Required — match the layout so Next serves right-sized images (07-images). */
  sizes: string
  className?: string
  priority?: boolean
}

/**
 * Renders a Sanity image through next/image, filling a relative, sized parent
 * (object-cover). Falls back to a solid navy block when no asset exists —
 * never a silhouette (02-D). Callers must wrap in a `relative` sized container.
 */
export function SanityImage({image, alt, sizes, className, priority}: SanityImageProps) {
  if (!image) {
    return <div className="absolute inset-0 bg-navy-2" aria-hidden />
  }

  const src = urlFor(image).width(1920).fit('max').auto('format').url()

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className ?? ''}`}
    />
  )
}
