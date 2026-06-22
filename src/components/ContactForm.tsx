'use client'

import {useState, type FormEvent} from 'react'

const INQUIRY_TYPES = [
  'General enquiry',
  'Volunteering',
  'Partnership',
  'Speaking / proposing a topic',
  'Press',
] as const

type ContactFormProps = {
  /** Destination email address. */
  email: string
}

/**
 * Visual-only form that opens the user's mail client with subject + body
 * pre-filled. Real backend submission (Resend/Formspree/Sanity Functions)
 * lands as a follow-up — this stops the Send button from being a dead
 * affordance in the meantime.
 */
export function ContactForm({email}: ContactFormProps) {
  const [name, setName] = useState('')
  const [from, setFrom] = useState('')
  const [type, setType] = useState<string>(INQUIRY_TYPES[0])
  const [message, setMessage] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const subject = `[${type}] ${name ? `from ${name}` : 'website enquiry'}`
    const bodyLines = [
      message.trim(),
      '',
      '—',
      from ? `From: ${name || 'Anonymous'} <${from}>` : `From: ${name || 'Anonymous'}`,
    ]
    const body = bodyLines.join('\n')
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="row2">
        <div className="field">
          <label htmlFor="cf-name">Name</label>
          <input
            id="cf-name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </div>
        <div className="field">
          <label htmlFor="cf-email">Email</label>
          <input
            id="cf-email"
            type="email"
            required
            placeholder="you@email.com"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            autoComplete="email"
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor="cf-type">What&rsquo;s this about?</label>
        <select id="cf-type" value={type} onChange={(e) => setType(e.target.value)}>
          {INQUIRY_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="cf-msg">Message</label>
        <textarea
          id="cf-msg"
          required
          placeholder="Tell us a little about what you have in mind…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <button className="send" type="submit">
        Send message
      </button>
    </form>
  )
}
