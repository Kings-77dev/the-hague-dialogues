/** Shared types for the provider-agnostic email adapter. */

export type ContactMessage = {
  name: string
  email: string
  inquiryType: string
  message: string
}

export type NewsletterSignup = {
  email: string
  /** Where the signup came from, e.g. "footer" or "get-involved". */
  source?: string
}

/**
 * An email/ESP provider. Both operations must be idempotent-friendly and must
 * throw on failure so the calling Server Action can surface an error state.
 *
 * `subscribeToNewsletter` MUST target a list configured for confirmed (double)
 * opt-in — the provider, not this app, owns consent proof and unsubscribe.
 */
export type EmailProvider = {
  readonly name: string
  sendContactMessage(msg: ContactMessage): Promise<void>
  subscribeToNewsletter(signup: NewsletterSignup): Promise<void>
}
