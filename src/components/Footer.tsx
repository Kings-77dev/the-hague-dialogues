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

/** Faithful to the prototype `.footer`. */
export function Footer({settings, supportHref}: FooterProps) {
  const pathname = usePathname()
  const suppressNewsletter = ROUTES_WITH_OWN_NEWSLETTER.some((r) =>
    pathname?.startsWith(r),
  )
  const instagram = settings?.instagramUrl ?? DEFAULTS.instagramUrl
  return (
    <footer className="footer" id="footer">
      <div className="container">
        {!suppressNewsletter && (
          <div className="footer-top">
            <div>
              <p className="eyebrow">Stay in the dialogue</p>
              <h2>Join the conversation shaping civic life in The Hague.</h2>
            </div>
            <NewsletterForm />
          </div>
        )}
        <div className="footer-bottom">
          <div>
            <Link href="/" aria-label="The Hague Dialogues home" className="logo">
              {/* alt="" because the link's aria-label already names the destination */}
              <Image src="/logo-mark.png" alt="" width={108} height={55} />
            </Link>
            <p>
              <small>{settings?.tagline ?? DEFAULTS.siteTagline}</small>
            </p>
          </div>
          <nav className="footer-links">
            {FOOTER_NAV.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            <a href={instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </nav>
          <Link href={supportHref} className="btn">
            Support
          </Link>
        </div>
      </div>
    </footer>
  )
}
