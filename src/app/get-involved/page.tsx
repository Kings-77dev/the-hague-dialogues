import type {Metadata} from 'next'
import Link from 'next/link'
import {client} from '@/sanity/client'
import {SETTINGS_QUERY} from '@/sanity/queries'
import {NewsletterForm} from '@/components/NewsletterForm'

export const metadata: Metadata = {
  title: 'Get Involved — The Hague Dialogues',
  description: 'Volunteer, speak, partner, or suggest a topic for an upcoming dialogue.',
}

const PATHWAYS = [
  {
    num: '01',
    title: 'Volunteer',
    body: 'Help us run events, manage social channels, support recordings, or design programmes. We onboard a small group each season.',
    cta: 'Apply now',
    href: '/contact',
  },
  {
    num: '02',
    title: 'Speak or propose a topic',
    body: 'Bring a question worth debating in public. We work with academics, journalists, students and practitioners to shape each session.',
    cta: 'Propose a topic',
    href: '/contact',
  },
  {
    num: '03',
    title: 'Partner with us',
    body: 'Universities, civic institutions and student organisations — get in touch about co-hosting, venues, or programme collaborations.',
    cta: 'Get in touch',
    href: '/contact',
  },
  {
    num: '04',
    title: 'Support the foundation',
    body: 'Every contribution helps us host more events, publish thoughtful recaps and bring more voices into the room.',
    cta: 'Support',
    href: '#',
  },
]

const ROLES = [
  {title: 'Events', body: 'Production, hosting, and on-night flow for the dialogue sessions.'},
  {title: 'Comms', body: 'Social, newsletter, and the editorial voice across our channels.'},
  {title: 'Research', body: 'Background briefs, fact checks, and recap writing for the dialogues.'},
  {title: 'Design', body: 'Visual identity for events, posters, and the digital programme.'},
]

const FAQ = [
  {
    q: 'Do I need to be a student to take part?',
    a: 'Most of our volunteers are students in The Hague, but our events are open to anyone willing to listen as seriously as they speak.',
  },
  {
    q: 'How often do you run dialogues?',
    a: 'Two to three public sessions every month during term, plus a small number of community-run open calls.',
  },
  {
    q: 'How do you choose speakers and topics?',
    a: 'Through a mix of programme proposals from volunteers and open submissions from the community. Send us a pitch via Contact.',
  },
  {
    q: 'Is The Hague Dialogues political?',
    a: 'We are non-partisan. The aim is to host the difficult conversation in good faith, not to advocate for one position.',
  },
]

export default async function GetInvolvedPage() {
  const settings = await client.fetch(SETTINGS_QUERY)
  const supportHref = settings?.supportUrl ?? '/get-involved'
  const pathways = PATHWAYS.map((p, i) =>
    i === PATHWAYS.length - 1 ? {...p, href: supportHref} : p,
  )

  return (
    <>
      {/* ---- Page head ---- */}
      <section className="page-head">
        <div className="container">
          <p className="eyebrow">Get involved</p>
          <h1 className="display">Be part of the dialogue.</h1>
          <p className="page-lede">
            Open dialogue takes a roomful of people. Here are the ways to step in — as a
            volunteer, speaker, partner, or supporter.
          </p>
        </div>
      </section>

      {/* ---- Pathways ---- */}
      <section className="section paper">
        <div className="container">
          <p className="eyebrow">How you can help</p>
          <h2 className="display about-h2">Four ways to step in.</h2>
          <div className="pathways">
            {pathways.map((p) => (
              <Link className="pathway" key={p.num} href={p.href}>
                {/* Numbering removed (backlog 6): these are parallel paths, not
                    sequential steps. */}
                <h3>{p.title}</h3>
                <p>{p.body}</p>
                <span className="pw-link">
                  {p.cta} <span aria-hidden>→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Volunteer roles ---- */}
      <section className="section dark">
        <div className="container">
          <p className="eyebrow">Volunteer roles</p>
          <h2 className="display about-h2">Where we need hands.</h2>
          <div className="roles">
            {ROLES.map((r) => (
              <div className="role" key={r.title}>
                <h4>{r.title}</h4>
                <p>{r.body}</p>
              </div>
            ))}
          </div>

          {/* In-page "Stay in the loop" — Footer suppresses its newsletter on
              this route (02-E: one newsletter per page). Nested in the same
              dark section to preserve the navy/cream band rhythm. */}
          <div className="gi-newsletter">
            <div className="gi-newsletter-copy">
              <p className="eyebrow">Stay in the loop</p>
              <h2 className="display about-h2">Get our newsletter.</h2>
              <p>
                One short note when a new dialogue is on the calendar or a recap is
                published. No spam.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* ---- FAQ ---- */}
      <section className="section paper">
        <div className="container">
          {/* eyebrow "Frequently asked" dropped: doc 02-A explicit example. */}
          <h2 className="display about-h2">Good to know.</h2>
          <div className="faq">
            {FAQ.map((f, i) => (
              <details key={f.q} open={i === 0}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
