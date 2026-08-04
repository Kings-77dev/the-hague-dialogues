import type {EmailProvider} from '../types'

/**
 * Development / pre-launch fallback provider.
 *
 * It logs submissions server-side so the whole form flow (validation, honeypot,
 * captcha, pending + success/error states) can be exercised end to end, but it
 * does NOT deliver anything. Never rely on it in production — set a real
 * `EMAIL_PROVIDER` and its credentials first (see `.env.example`).
 */
export const consoleProvider: EmailProvider = {
  name: 'console',
  async sendContactMessage(msg) {
    console.info('[email:console] contact message (NOT delivered):', msg)
  },
  async subscribeToNewsletter(signup) {
    console.info('[email:console] newsletter signup (NOT delivered):', signup)
  },
}
