'use client'

import {useEffect, useRef, useState, type ReactNode} from 'react'

type RevealProps = {
  children: ReactNode
  /** Stagger delay in ms, for grids of cards. */
  delay?: number
  className?: string
}

/**
 * Fade + rise as the element scrolls into view.
 *
 * Uses IntersectionObserver — universally supported, ~0 bytes of dependency —
 * rather than a JS animation library (overkill) or CSS `animation-timeline`
 * (not Baseline in 2026; Firefox lacks it). Fully disabled under
 * `prefers-reduced-motion`: content renders at its final state immediately.
 */
export function Reveal({children, delay = 0, className}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // prefers-reduced-motion is handled in CSS (globals.css forces .reveal
    // visible), so we don't branch on it here — the observer is harmless.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true)
            io.disconnect()
          }
        }
      },
      {threshold: 0.12, rootMargin: '0px 0px -8% 0px'},
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal${shown ? ' is-shown' : ''}${className ? ` ${className}` : ''}`}
      style={delay ? {transitionDelay: `${delay}ms`} : undefined}
    >
      {children}
    </div>
  )
}
