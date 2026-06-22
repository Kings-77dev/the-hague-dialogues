import type {Metadata} from 'next'
import Link from 'next/link'
import {client} from '@/sanity/client'
import {ABOUT_QUERY} from '@/sanity/queries'
import {SanityImage} from '@/components/SanityImage'
import {Prose} from '@/components/Prose'

export const revalidate = 600

export const metadata: Metadata = {
  title: 'About — The Hague Dialogues',
  description:
    'A student-led foundation creating spaces for open, challenging, and constructive conversation in The Hague.',
}

export default async function AboutPage() {
  const about = await client.fetch(ABOUT_QUERY)
  const team = about?.team ?? []
  const partners = about?.partners ?? []
  const stats = about?.stats ?? []
  const values = about?.values ?? []

  return (
    <>
      {/* ---- Hero ---- */}
      <section className="about-hero">
        <div className="about-hero-media">
          <SanityImage
            image={about?.heroImage}
            alt=""
            sizes="(max-width: 1000px) 100vw, 50vw"
            priority
          />
        </div>
        <div className="container">
          <p className="eyebrow">About</p>
          <h1 className="display">Who we are &amp; why we dialogue</h1>
          <p className="lede">
            The Hague Dialogues is a student-led foundation creating spaces for open,
            challenging, and constructive conversation about society, politics, identity,
            and the future.
          </p>
        </div>
      </section>

      {/* ---- Founding story ---- */}
      <section className="section paper">
        <div className="container">
          <div className="story-head">
            <p className="eyebrow">Our founding</p>
            <h2 className="display about-h2">Born out of a simple frustration.</h2>
          </div>
          {about?.founding ? (
            <div className="story-grid">
              <Prose value={about.founding} />
            </div>
          ) : (
            <div className="story-grid">
              <p>
                The Hague Dialogues began with a frustration shared by a handful of
                international students in The Hague: the conversations that matter most
                were happening in echo chambers — or not happening at all. We wanted a
                room where opposing views could meet without hostility, where disagreement
                was the point rather than the problem.
              </p>
              <p>
                Since 2025 we have hosted dialogue sessions on questions ranging from
                geopolitics and climate policy to philosophy, faith, and identity. We are
                non-partisan, volunteer-run, and open to anyone willing to listen as
                seriously as they speak.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ---- By the numbers ---- */}
      {stats.length > 0 && (
        <section className="stats">
          <div className="container">
            <p className="eyebrow">By the numbers</p>
            <div className="stats-grid">
              {stats.map((s) => (
                <div className="stat" key={s._key}>
                  <div className="num">{s.value}</div>
                  <div className="lab">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---- Values ---- */}
      {values.length > 0 && (
        <section className="section paper">
          <div className="container">
            <p className="eyebrow">What we stand for</p>
            <h2 className="display about-h2">Four principles, every session.</h2>
            <div className="values-grid">
              {values.map((v) => (
                <div className="value" key={v._key}>
                  <h3>{v.title}</h3>
                  <p>{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---- Team ---- */}
      {team.length > 0 && (
        <section className="section dark">
          <div className="container">
            {/* eyebrow "The people" dropped: restates the heading (02-A). */}
            <h2 className="display about-h2">The people behind the dialogue.</h2>
            <div className="team-grid">
              {team.map((m) => (
                <article className="member" key={m._id}>
                  <div className="member-media">
                    {m.photo && (
                      <SanityImage
                        image={m.photo}
                        alt={m.name}
                        sizes="(max-width: 1000px) 50vw, 25vw"
                        className="member-photo"
                      />
                    )}
                  </div>
                  <div className="member-body">
                    <p className="member-name">{m.name}</p>
                    {m.role && <p className="member-role">{m.role}</p>}
                  </div>
                </article>
              ))}
            </div>
            {/* General team-contact CTA (backlog 8) — keeps the page free of
                personal contact details while giving visitors a clear path. */}
            <div className="team-contact">
              <p>Want to reach the team?</p>
              <Link className="card-cta" href="/contact">
                Contact us <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ---- Partners ---- */}
      {partners.length > 0 && (
        <section className="section paper">
          <div className="container">
            {/* eyebrow "Affiliated with" dropped to stay under 4 eyebrows/page (02-A). */}
            <h2 className="display about-h2">In good company.</h2>
            <div className="partner-grid">
              {partners.map((p) =>
                p.url ? (
                  <a key={p._id} className="partner" href={p.url} target="_blank" rel="noopener noreferrer">
                    {p.name}
                  </a>
                ) : (
                  <span key={p._id} className="partner">
                    {p.name}
                  </span>
                ),
              )}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
