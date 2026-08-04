import type {Metadata} from 'next'
import Link from 'next/link'
import {client} from '@/sanity/client'
import {SETTINGS_QUERY} from '@/sanity/queries'
import {DEFAULTS} from '@/lib/defaults'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Privacy Notice — The Hague Dialogues',
  description:
    'How The Hague Dialogues collects, uses, and protects your personal data under the GDPR.',
}

/**
 * GDPR/ePrivacy privacy notice. This is a structured draft: the sections and
 * lawful bases are in place, but the bracketed [PLACEHOLDERS] (legal entity
 * name, address, KvK number, retention periods, chosen ESP + captcha
 * processor) MUST be completed and the whole notice reviewed by someone
 * qualified before launch. Required because the contact form and newsletter
 * collect personal data from EU residents.
 */
export default async function PrivacyPage() {
  const settings = await client.fetch(SETTINGS_QUERY)
  const email = settings?.email ?? DEFAULTS.email
  const lastUpdated = 'July 2026'

  return (
    <>
      <section className="page-head">
        <div className="container">
          <p className="eyebrow">Legal</p>
          <h1 className="display">Privacy notice</h1>
          <p className="page-lede">
            How we collect, use, and protect your personal data — and the rights you have
            over it under the GDPR.
          </p>
        </div>
      </section>

      <section className="section paper">
        <div className="container">
          <div className="prose">
            <p>
              <em>Last updated: {lastUpdated}.</em>
            </p>

            <h2>Who we are</h2>
            <p>
              The Hague Dialogues (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is the data controller
              for the personal data described here. We are a student-led foundation based in
              The Hague, Netherlands. For any privacy question, contact us at{' '}
              <a href={`mailto:${email}`}>{email}</a>.
            </p>
            <p>
              Registered entity: [LEGAL ENTITY NAME]. Registered address: [ADDRESS]. Chamber
              of Commerce (KvK): [KvK NUMBER].
            </p>

            <h2>What data we collect and why</h2>
            <p>We only collect what we need for the thing you asked us to do:</p>
            <ul>
              <li>
                <strong>Contact form</strong> — your name (optional), email address, the
                enquiry type, and your message. We use this solely to read and reply to your
                enquiry. Lawful basis: our legitimate interest in responding to you, and your
                consent in sending it.
              </li>
              <li>
                <strong>Newsletter</strong> — your email address, and the fact and time of
                your consent. We use it only to send you the newsletter you asked for. Lawful
                basis: your explicit consent, confirmed by a double opt-in (you must click a
                confirmation link before we send anything).
              </li>
              <li>
                <strong>Anti-spam</strong> — our forms use a privacy-friendly, cookieless
                captcha and hidden anti-bot fields. These process technical signals to tell
                humans from bots; they do not track you across sites.
              </li>
              <li>
                <strong>Server logs</strong> — like most websites, our hosting keeps basic,
                short-lived technical logs (e.g. IP address, timestamp) for security and
                reliability. Lawful basis: legitimate interest.
              </li>
            </ul>

            <h2>Who we share it with</h2>
            <p>
              We do not sell your data. We share it only with service providers
              (&ldquo;processors&rdquo;) who help us operate, under data-processing agreements:
            </p>
            <ul>
              <li>Our email / newsletter provider: [ESP NAME].</li>
              <li>Our captcha provider: Friendly Captcha (EU-based).</li>
              <li>Our hosting provider: [HOSTING PROVIDER].</li>
            </ul>

            <h2>Where your data is stored</h2>
            <p>
              We aim to keep personal data within the EU/EEA. Where a provider processes data
              outside the EEA, that transfer relies on an approved safeguard such as an
              adequacy decision or Standard Contractual Clauses. [Confirm and list per
              provider before launch.]
            </p>

            <h2>How long we keep it</h2>
            <ul>
              <li>Contact enquiries: [RETENTION PERIOD, e.g. 12 months] after we last spoke.</li>
              <li>Newsletter: until you unsubscribe or withdraw consent.</li>
              <li>Server logs: [RETENTION PERIOD].</li>
            </ul>

            <h2>Your rights</h2>
            <p>Under the GDPR you can, at any time:</p>
            <ul>
              <li>access the personal data we hold about you;</li>
              <li>have inaccurate data corrected;</li>
              <li>have your data erased;</li>
              <li>object to, or ask us to restrict, our processing;</li>
              <li>ask for your data in a portable format;</li>
              <li>
                withdraw consent — every newsletter has a one-click unsubscribe, and you can
                email us to withdraw at any time.
              </li>
            </ul>
            <p>
              To exercise any of these, email <a href={`mailto:${email}`}>{email}</a>. You
              also have the right to complain to the Dutch data protection authority, the{' '}
              <a
                href="https://autoriteitpersoonsgegevens.nl/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Autoriteit Persoonsgegevens
              </a>
              .
            </p>

            <h2>Cookies</h2>
            <p>
              We keep cookies to a minimum. Our captcha is cookieless and we do not use
              advertising or cross-site tracking cookies. [If you later add analytics, disclose
              it here and add a consent banner.]
            </p>

            <h2>Changes to this notice</h2>
            <p>
              We may update this notice as our practices change. We will revise the
              &ldquo;last updated&rdquo; date above when we do.
            </p>

            <p>
              Questions? <Link href="/contact">Get in touch</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
