'use client'

import {useState} from 'react'

/** Footer newsletter — faithful to the prototype `.newsletter` form (visual-only). */
export function NewsletterForm() {
  const [done, setDone] = useState(false)
  return (
    <form
      className="newsletter"
      onSubmit={(e) => {
        e.preventDefault()
        setDone(true)
      }}
    >
      <strong>Get updates on upcoming events and new articles.</strong>
      <label htmlFor="footer-email" className="sr-only">
        Your email address
      </label>
      <input id="footer-email" type="email" required placeholder="Your email address" />
      <button className="btn light" type="submit">
        {done ? 'Subscribed' : 'Subscribe'} <span className="arrow">→</span>
      </button>
    </form>
  )
}
