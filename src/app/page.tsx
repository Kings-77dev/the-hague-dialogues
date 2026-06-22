import type {Metadata} from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {client} from '@/sanity/client'
import {HOME_QUERY, SETTINGS_QUERY} from '@/sanity/queries'
import {EventPosterCard} from '@/components/EventPosterCard'
import {ArticleCard} from '@/components/ArticleCard'
import {MediaPosterCard} from '@/components/MediaPosterCard'
import {HeroSlideshow} from '@/components/HeroSlideshow'
import {JsonLd} from '@/components/JsonLd'
import {formatDate, formatTime} from '@/lib/date'
import {SITE_URL} from '@/lib/site'
import {DEFAULTS} from '@/lib/defaults'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  const data = await client.fetch(HOME_QUERY, {now: new Date().toISOString()})
  return {
    title: 'The Hague Dialogues',
    description: data.home?.heroLede ?? DEFAULTS.homeHeroLede,
  }
}

export default async function Home() {
  const now = new Date().toISOString()
  const [data, settings] = await Promise.all([
    client.fetch(HOME_QUERY, {now}),
    client.fetch(SETTINGS_QUERY),
  ])
  const {home, upcoming, latestNews, media} = data
  // Homepage CTAs now point to /events (participation first). Donation remains
  // available via the chrome (header + footer Support buttons).
  const featured = home?.featuredEvent
  const [featuredMedia, ...restMedia] = media

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings?.title ?? 'The Hague Dialogues',
    url: SITE_URL,
    description: settings?.tagline ?? undefined,
    sameAs: [settings?.instagramUrl, settings?.linkedinUrl].filter(Boolean),
    email: settings?.email ?? undefined,
  }

  return (
    <>
      <JsonLd data={orgJsonLd} />
      {/* ---- Hero ---- */}
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-copy">
            <h1 className="display">{home?.heroHeading ?? DEFAULTS.homeHeroHeading}</h1>
            <div className="underline" />
            <p>{home?.heroLede ?? DEFAULTS.homeHeroLede}</p>
          </div>
          <article className="feature-event">
            {/* Hero slideshow (backlog 9). Falls back to the featured event
                cover when homeContent.heroImages is empty. */}
            <HeroSlideshow
              slides={home?.heroImages ?? []}
              fallback={featured?.coverImage ?? null}
              fallbackAlt={featured?.title ?? 'Next event'}
            />
            <div className="feature-event-content">
              <p className="eyebrow">Next event</p>
              <h2>{featured?.title ?? 'Next dialogue'}</h2>
              <div className="meta">
                {featured?.startsAt && <span>{formatDate(featured.startsAt)}</span>}
                {featured?.startsAt && (
                  <span>
                    {formatTime(featured.startsAt)}
                    {featured.venue ? ` · ${featured.venue}` : ''}
                  </span>
                )}
              </div>
              <Link className="btn light" href="/events">
                Upcoming Events <span className="arrow">→</span>
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* ---- Intro strip ---- */}
      <section className="intro-strip">
        <div className="container intro-grid">
          <h2>{settings?.title ?? DEFAULTS.siteTitle}</h2>
          <p>{DEFAULTS.introStripBody}</p>
          <aside className="mini-donate">
            <small>{DEFAULTS.miniDonateBody}</small>
            <Link className="btn light" href="/events">
              Join the next dialogue <span className="arrow">→</span>
            </Link>
          </aside>
        </div>
      </section>

      {/* ---- Upcoming events ---- */}
      {upcoming.length > 0 && (
        <section className="section dark" id="home-events">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Upcoming events</span>
              <Link className="view-all" href="/events">
                View all →
              </Link>
            </div>
            <div className="card-grid">
              {upcoming.slice(0, 3).map((event) => (
                <EventPosterCard key={event._id} event={event} status="upcoming" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---- Articles & insights ---- */}
      {latestNews.length > 0 && (
        <section className="section paper" id="home-articles">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Articles &amp; insights</span>
              <Link className="view-all" href="/news">
                View all →
              </Link>
            </div>
            <div className="article-grid">
              {latestNews.slice(0, 3).map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---- Media ---- */}
      {media.length > 0 && (
        <section className="section dark" id="home-media">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Media</span>
              <Link className="view-all" href="/media">
                View all →
              </Link>
            </div>
            <div className="media-mosaic">
              {featuredMedia && <MediaPosterCard item={featuredMedia} feature />}
              {restMedia.length > 0 && (
                <div className="media-stack">
                  {restMedia.map((item) => (
                    <MediaPosterCard key={item._id} item={item} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ---- Participation band ---- (was the Support CTA; doc 02-B-ish:
           homepage guides toward participation first, donation lives in chrome.) */}
      <section className="support" id="join">
        <div className="container support-inner">
          <div>
            <h2 className="display">Join the next dialogue in The Hague</h2>
            <p>
              Attend a dialogue, ask better questions, and meet people willing to discuss
              difficult topics with respect.
            </p>
          </div>
          <Link className="btn light" href="/events">
            Explore events <span className="arrow">→</span>
          </Link>
        </div>
      </section>

      {/* ---- Get involved ---- */}
      <section className="involve-strip" id="home-involved">
        <div className="container involve-grid">
          <div className="involve-title">Get involved</div>
          <Link className="involve-card" href="/get-involved">
            <h3>Volunteer</h3>
            <span className="small-btn">
              Join <span className="arrow" aria-hidden>→</span>
            </span>
          </Link>
          <Link className="involve-card" href="/get-involved">
            <h3>Speak</h3>
            <span className="small-btn">
              Propose <span className="arrow" aria-hidden>→</span>
            </span>
          </Link>
          <Link className="involve-card" href="/get-involved">
            <h3>Partner</h3>
            <span className="small-btn">
              Contact <span className="arrow" aria-hidden>→</span>
            </span>
          </Link>
          <Link className="involve-card dark" href="/get-involved">
            <h3>Idea Box</h3>
            <span className="small-btn">
              Suggest <span className="arrow" aria-hidden>→</span>
            </span>
          </Link>
        </div>
      </section>

      {/* ---- Quote band ---- */}
      {home?.quote?.text && (
        <section className="quote-band">
          <div className="container">
            <article className="quote-card">
              <div className="quote-text">
                <p className="eyebrow">From the dialogue</p>
                <h2>{home.quote.text}</h2>
                <p>
                  {home.quote.attribution
                    ? `${home.quote.attribution.name}${home.quote.attribution.role ? ` · ${home.quote.attribution.role}` : ''}`
                    : 'Use the website as a living archive of questions, recaps, speakers, and civic moments.'}
                </p>
              </div>
              <div className="quote-img relative">
                <Image
                  src="/images/c5275197-587c-4ad9-aac1-1d1fde28905a.jpeg"
                  alt="The Hague Dialogues event"
                  fill
                  sizes="(max-width: 1000px) 100vw, 360px"
                  className="object-cover"
                />
              </div>
            </article>
          </div>
        </section>
      )}
    </>
  )
}
