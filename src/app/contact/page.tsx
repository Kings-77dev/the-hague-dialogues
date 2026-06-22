import type {Metadata} from 'next'
import {client} from '@/sanity/client'
import {SETTINGS_QUERY} from '@/sanity/queries'
import {ContactForm} from '@/components/ContactForm'
import {DEFAULTS} from '@/lib/defaults'

export const metadata: Metadata = {
  title: 'Contact — The Hague Dialogues',
  description: 'Questions, ideas, partnerships, or press — get in touch.',
}

export default async function ContactPage() {
  const settings = await client.fetch(SETTINGS_QUERY)
  const email = settings?.email ?? DEFAULTS.email
  const instagram = settings?.instagramUrl ?? DEFAULTS.instagramUrl
  const linkedin = settings?.linkedinUrl

  return (
    <>
      {/* ---- Page head ---- */}
      <section className="page-head">
        <div className="container">
          <p className="eyebrow">Contact</p>
          <h1 className="display">Get in touch</h1>
          <p className="page-lede">
            Questions, ideas, partnerships, or press — we&rsquo;d love to hear from you.
          </p>
        </div>
      </section>

      {/* ---- Form + info ---- */}
      <section className="section paper">
        <div className="container">
          <div className="contact-grid">
            <ContactForm email={email} />

            <aside className="contact-info">
              <div className="ci-block">
                <p className="ci-label">Email</p>
                <p className="ci-val">
                  <a href={`mailto:${email}`}>{email}</a>
                </p>
              </div>
              <div className="ci-block">
                <p className="ci-label">Based in</p>
                <p className="ci-val">The Hague, Netherlands</p>
              </div>
              <div className="ci-block">
                <p className="ci-label">Response time</p>
                <p className="ci-val note">
                  We&rsquo;re a volunteer team — we aim to reply within a few days.
                </p>
              </div>
              <div className="ci-block">
                <p className="ci-label">Follow</p>
                <div className="ci-socials">
                  <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                    </svg>
                  </a>
                  {linkedin && (
                    <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4.5 4.5a2 2 0 100 4 2 2 0 000-4zM3 9.5h3V21H3zM9 9.5h2.9v1.6h.1c.5-.9 1.7-1.9 3.5-1.9 3 0 4.5 2 4.5 5.4V21h-3v-5c0-1.4-.5-2.4-1.9-2.4-1 0-1.6.7-1.9 1.4-.1.3-.1.6-.1 1V21H9z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
