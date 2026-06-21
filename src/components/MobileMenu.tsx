'use client'

import {useCallback, useEffect, useState} from 'react'
import {createPortal} from 'react-dom'
import Link from 'next/link'
import Image from 'next/image'
import {usePathname} from 'next/navigation'
import {HEADER_NAV} from '@/lib/nav'

/**
 * menu-toggle (in header) + mobile-panel (portaled to body). Drives the
 * prototype's `body.menu-open` class, which the ported CSS uses for the panel
 * slide, hamburger animation and scroll lock. Portal escapes the header's
 * backdrop-filter containing block (see [[frontend-patterns]]).
 */
export function MobileMenu() {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => setMounted(true), [])

  const setMenu = useCallback((next: boolean) => {
    setOpen(next)
    document.body.classList.toggle('menu-open', next)
  }, [])

  // Close on route change.
  useEffect(() => {
    setMenu(false)
  }, [pathname, setMenu])

  // Esc closes.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenu(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, setMenu])

  return (
    <>
      <button
        type="button"
        className="menu-toggle"
        aria-expanded={open}
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setMenu(!open)}
      >
        <span />
        <span />
        <span />
      </button>

      {mounted &&
        createPortal(
          <div className="mobile-panel" aria-hidden={!open}>
            <div>
              <Link
                href="/"
                aria-label="The Hague Dialogues home"
                className="mobile-logo"
                onClick={() => setMenu(false)}
              >
                <Image
                  src="/logo-mark.png"
                  alt="The Hague Dialogues"
                  width={122}
                  height={63}
                />
              </Link>
              {HEADER_NAV.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMenu(false)}>
                  {item.label}
                </Link>
              ))}
            </div>
            <p className="mini">
              Student-led civic dialogue · The Hague · Open discussion
            </p>
          </div>,
          document.body,
        )}
    </>
  )
}
