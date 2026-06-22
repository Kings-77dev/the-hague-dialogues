'use client'

import {useEffect, useState} from 'react'
import type {SanityImageSource} from '@sanity/image-url'
import {SanityImage} from './SanityImage'

type HeroSlide = SanityImageSource & {alt?: string | null}

type HeroSlideshowProps = {
  slides: HeroSlide[]
  /** Single fallback shown when `slides` is empty. */
  fallback?: HeroSlide | null
  /** Fallback alt text when a slide has none. */
  fallbackAlt?: string
  /** Time between transitions, ms. */
  interval?: number
}

/**
 * Right-hand homepage hero slideshow (backlog 9). Renders all slides absolutely
 * positioned and cross-fades by toggling opacity on a setInterval. Respects
 * `prefers-reduced-motion` — under reduced motion it shows the first slide and
 * doesn't rotate.
 */
export function HeroSlideshow({
  slides,
  fallback = null,
  fallbackAlt = '',
  interval = 6000,
}: HeroSlideshowProps) {
  const effective = slides.length > 0 ? slides : fallback ? [fallback] : []
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (effective.length <= 1) return
    const reduce = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % effective.length)
    }, interval)
    return () => window.clearInterval(id)
  }, [effective.length, interval])

  if (effective.length === 0) return null

  return (
    <>
      {effective.map((slide, i) => (
        <div
          key={i}
          className={`hero-slide${i === index ? ' is-active' : ''}`}
          aria-hidden={i !== index}
        >
          <SanityImage
            image={slide}
            alt={(slide as {alt?: string | null}).alt ?? fallbackAlt}
            sizes="(max-width: 1000px) 100vw, 52vw"
            priority={i === 0}
          />
        </div>
      ))}
    </>
  )
}
