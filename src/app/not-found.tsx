import Link from 'next/link'

export const metadata = {
  title: 'Not found — The Hague Dialogues',
}

/** Branded 404. Uses the page-head pattern so it sits cleanly under the header. */
export default function NotFound() {
  return (
    <>
      <section className="page-head" aria-labelledby="nf-title">
        <div className="container">
          <p className="eyebrow">404</p>
          <h1 id="nf-title" className="display">
            We couldn&rsquo;t find that page.
          </h1>
          <p className="page-lede">
            The link may be broken, or the page may have moved. Try one of the routes
            below.
          </p>
        </div>
      </section>
      <section className="section paper">
        <div className="container" style={{display: 'flex', gap: 12, flexWrap: 'wrap'}}>
          <Link className="btn light" href="/">
            Home <span className="arrow">→</span>
          </Link>
          <Link className="btn" href="/events">
            Events <span className="arrow">→</span>
          </Link>
          <Link className="btn" href="/news">
            News <span className="arrow">→</span>
          </Link>
          <Link className="btn" href="/contact">
            Contact <span className="arrow">→</span>
          </Link>
        </div>
      </section>
    </>
  )
}
