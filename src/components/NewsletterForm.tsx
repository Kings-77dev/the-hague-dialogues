'use client'

import {useActionState, useId} from 'react'
import Link from 'next/link'
import {subscribeNewsletter} from '@/lib/forms/actions'
import {INITIAL_FORM_STATE} from '@/lib/forms/shared'
import {BotFields} from './BotFields'
import {FriendlyCaptcha} from './FriendlyCaptcha'

/**
 * Newsletter signup. Submits through the `subscribeNewsletter` Server Action,
 * which requires explicit GDPR consent and hands off to an ESP configured for
 * confirmed (double) opt-in — the subscriber isn't active until they click the
 * confirmation email. Progressive enhancement: works without JS.
 */
export function NewsletterForm({source = 'footer'}: {source?: string}) {
  const [state, action, pending] = useActionState(subscribeNewsletter, INITIAL_FORM_STATE)
  const id = useId()
  const err = state.errors ?? {}

  return (
    <form className="newsletter" action={action}>
      <strong>Get updates on upcoming events and new articles.</strong>
      <BotFields />
      <input type="hidden" name="source" value={source} />
      <label htmlFor={`${id}-email`} className="sr-only">
        Your email address
      </label>
      <input
        id={`${id}-email`}
        name="email"
        type="email"
        required
        placeholder="Your email address"
        autoComplete="email"
        aria-invalid={err.email ? true : undefined}
      />
      <div className="nl-consent">
        <input id={`${id}-consent`} name="consent" type="checkbox" required />
        <label htmlFor={`${id}-consent`}>
          I agree to receive the newsletter and accept the{' '}
          <Link href="/privacy">privacy notice</Link>. Unsubscribe anytime.
        </label>
      </div>
      <FriendlyCaptcha />
      <button className="btn light" type="submit" disabled={pending}>
        {pending ? 'Subscribing…' : 'Subscribe'} <span className="arrow">→</span>
      </button>
      {state.status !== 'idle' && (
        <p
          className={state.status === 'success' ? 'form-success' : 'form-err'}
          role={state.status === 'success' ? 'status' : 'alert'}
        >
          {state.message}
        </p>
      )}
    </form>
  )
}
