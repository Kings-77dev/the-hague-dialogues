import type {EmailProvider} from './types'
import {consoleProvider} from './providers/console'

export type {ContactMessage, NewsletterSignup, EmailProvider} from './types'

/**
 * Provider-agnostic email adapter.
 *
 * The team hasn't picked an ESP yet. To swap one in later:
 *   1. Add a module under `providers/` implementing `EmailProvider`.
 *   2. Register it in the switch below.
 *   3. Set `EMAIL_PROVIDER=<name>` and its credentials (see `.env.example`).
 *
 * GDPR/NL compliance note: the chosen ESP MUST be configured for confirmed
 * (double) opt-in and one-click unsubscribe. Do not build a bespoke list — let
 * the ESP own consent proof and unsubscribe. Context: /privacy.
 */
export function getEmailProvider(): EmailProvider {
  const name = process.env.EMAIL_PROVIDER?.toLowerCase() ?? 'console'
  switch (name) {
    case 'console':
      return consoleProvider
    // case 'brevo': return brevoProvider
    // case 'mailerlite': return mailerliteProvider
    default:
      throw new Error(
        `Unknown EMAIL_PROVIDER "${name}". Implement it under ` +
          `src/lib/email/providers/ and register it in src/lib/email/index.ts, ` +
          `or unset EMAIL_PROVIDER to use the console fallback.`,
      )
  }
}

/** True when a real (delivering) provider is configured. */
export function isEmailConfigured(): boolean {
  return (process.env.EMAIL_PROVIDER?.toLowerCase() ?? 'console') !== 'console'
}
