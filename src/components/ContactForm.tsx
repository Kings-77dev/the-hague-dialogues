'use client'

import {useActionState} from 'react'
import Link from 'next/link'
import {submitContact} from '@/lib/forms/actions'
import {INITIAL_FORM_STATE, INQUIRY_TYPES} from '@/lib/forms/shared'
import {BotFields} from './BotFields'
import {FriendlyCaptcha} from './FriendlyCaptcha'

/**
 * Progressive-enhancement contact form. Submits through a Server Action
 * (`submitContact`) with server-side zod validation, honeypot + timing checks,
 * and captcha. Works without client JS; JS adds inline errors + pending state.
 */
export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, INITIAL_FORM_STATE)
  const err = state.errors ?? {}

  if (state.status === 'success') {
    return (
      <div className="form-success" role="status">
        <p>{state.message}</p>
      </div>
    )
  }

  return (
    <form className="contact-form" action={action}>
      <BotFields />
      <div className="row2">
        <div className="field">
          <label htmlFor="cf-name">Name</label>
          <input id="cf-name" name="name" type="text" placeholder="Your name" autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="cf-email">Email</label>
          <input
            id="cf-email"
            name="email"
            type="email"
            required
            placeholder="you@email.com"
            autoComplete="email"
            aria-invalid={err.email ? true : undefined}
            aria-describedby={err.email ? 'cf-email-err' : undefined}
          />
          {err.email && (
            <p className="field-err" id="cf-email-err">
              {err.email[0]}
            </p>
          )}
        </div>
      </div>
      <div className="field">
        <label htmlFor="cf-type">What&rsquo;s this about?</label>
        <select id="cf-type" name="inquiryType" defaultValue={INQUIRY_TYPES[0]}>
          {INQUIRY_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="cf-msg">Message</label>
        <textarea
          id="cf-msg"
          name="message"
          required
          placeholder="Tell us a little about what you have in mind…"
          aria-invalid={err.message ? true : undefined}
          aria-describedby={err.message ? 'cf-msg-err' : undefined}
        />
        {err.message && (
          <p className="field-err" id="cf-msg-err">
            {err.message[0]}
          </p>
        )}
      </div>
      <FriendlyCaptcha />
      {state.status === 'error' && (
        <p className="form-err" role="alert">
          {state.message}
        </p>
      )}
      <p className="form-privacy">
        We use your details only to reply to you. See our{' '}
        <Link href="/privacy">privacy notice</Link>.
      </p>
      <button className="send" type="submit" disabled={pending}>
        {pending ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}
