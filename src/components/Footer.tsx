'use client'

import Link from 'next/link'
import Image from 'next/image'
import {usePathname} from 'next/navigation'
import {NewsletterForm} from './NewsletterForm'
import {FOOTER_NAV} from '@/lib/nav'
import {DEFAULTS} from '@/lib/defaults'
import type {SETTINGS_QUERY_RESULT} from '@/sanity.types'

type FooterProps = {
  settings: SETTINGS_QUERY_RESULT
  supportHref: string
}

// Routes that render their own in-page newsletter (per doc 02-E).
const ROUTES_WITH_OWN_NEWSLETTER = ['/get-involved']

// Body columns; Privacy (last FOOTER_NAV entry) lives in the legal bar instead.
const FOOTER_COLS = [FOOTER_NAV.slice(0, 3), FOOTER_NAV.slice(3, 6)]

/**
 * "Editorial Close" footer — three zones (social band / body / legal bar),
 * the variant approved in the 2026-08-04 design-shotgun session.
 */
export function Footer({settings, supportHref}: FooterProps) {
  const pathname = usePathname()
  const suppressNewsletter = ROUTES_WITH_OWN_NEWSLETTER.some((r) =>
    pathname?.startsWith(r),
  )
  const instagram = settings?.instagramUrl ?? DEFAULTS.instagramUrl
  const linkedin = settings?.linkedinUrl
  const handle = `@${instagram.replace(/\/+$/, '').split('/').pop()}`
  return (
    <footer className="footer" id="footer">
      <div className="footer-social">
        <div className="container">
          <div className="fs-left">
            <span className="eyebrow">Follow the dialogue</span>
            <a
              className="fs-handle"
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              {handle}
            </a>
          </div>
          <div className="fs-icons">
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <path d="M17.5 6.5h.01" strokeLinecap="round" />
              </svg>
            </a>
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.5 4.5a2 2 0 100 4 2 2 0 000-4zM3 9.5h3V21H3zM9 9.5h2.9v1.6h.1c.5-.9 1.7-1.9 3.5-1.9 3 0 4.5 2 4.5 5.4V21h-3v-5c0-1.4-.5-2.4-1.9-2.4-1 0-1.6.7-1.9 1.4-.1.3-.1.6-.1 1V21H9z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="footer-body">
        <div className="container">
          <div className="fb-brand">
            <Link href="/" aria-label="The Hague Dialogues home" className="logo">
              {/* alt="" because the link's aria-label already names the destination */}
              <Image src="/logo-mark.png" alt="" width={108} height={55} />
            </Link>
            <p className="fb-tagline">{settings?.tagline ?? DEFAULTS.siteTagline}</p>
          </div>
          {FOOTER_COLS.map((col, i) => (
            <nav
              key={i}
              className="fcol"
              aria-label={i === 0 ? 'Footer navigation' : 'Footer navigation continued'}
            >
              {col.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          ))}
          {!suppressNewsletter && (
            <div className="footer-news">
              <p className="fcol-label">Stay in the dialogue</p>
              <NewsletterForm />
            </div>
          )}
        </div>
      </div>
      <div className="footer-legal">
        <div className="container">
          <small>© {new Date().getFullYear()} Stichting The Hague Dialogues</small>
          <Link href="/privacy">Privacy</Link>
          <Link href={supportHref} className="fl-support">
            Support
          </Link>
        </div>
      </div>
    </footer>
  )
}
