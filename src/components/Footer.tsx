import Link from 'next/link'
import Image from 'next/image'
import {NewsletterForm} from './NewsletterForm'
import {FOOTER_NAV} from '@/lib/nav'
import type {SETTINGS_QUERY_RESULT} from '@/sanity.types'

type FooterProps = {
  settings: SETTINGS_QUERY_RESULT
  donateHref: string
  /** Suppress the footer newsletter (Get Involved has its own — deferred 02-E). */
  suppressNewsletter?: boolean
}

/** Faithful to the prototype `.footer`. */
export function Footer({settings, donateHref, suppressNewsletter = false}: FooterProps) {
  const instagram = settings?.instagramUrl ?? 'https://www.instagram.com/thehaguedialogues/'
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
              <Image src="/logo-mark.png" alt="" width={108} height={55} />
            </Link>
            <p>
              <small>
                {settings?.tagline ??
                  'Building bridges through understanding and open discussion.'}
              </small>
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
          <Link href={donateHref} className="btn">
            Give
          </Link>
        </div>
      </div>
    </footer>
  )
}
