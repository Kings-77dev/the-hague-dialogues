'use server'

import {z} from 'zod'
import {getEmailProvider} from '@/lib/email'
import {verifyCaptcha} from '@/lib/captcha'
import {INQUIRY_TYPES, type FormState} from './shared'

/**
 * Bot heuristics that need no third-party service and work even without JS:
 *  - Honeypot: a visually hidden field real users never see or fill.
 *  - Timing: JS stamps `_ts` at mount; an implausibly fast submit is a bot.
 *    Skipped when `_ts` is absent (progressive enhancement / no-JS submit).
 */
const MIN_FILL_MS = 2000

function looksLikeBot(formData: FormData): boolean {
  const honeypot = formData.get('company')
  if (typeof honeypot === 'string' && honeypot.trim() !== '') return true

  const ts = formData.get('_ts')
  if (typeof ts === 'string' && ts) {
    const started = Number(ts)
    if (Number.isFinite(started) && Date.now() - started < MIN_FILL_MS) return true
  }
  return false
}

const contactSchema = z.object({
  name: z.string().trim().max(120).optional(),
  email: z.email('Please enter a valid email address.').max(254),
  inquiryType: z.enum(INQUIRY_TYPES).catch('General enquiry'),
  message: z
    .string()
    .trim()
    .min(10, 'Please add a little more detail (at least 10 characters).')
    .max(5000),
})

export async function submitContact(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  // Caught bots get a fake success so they don't learn they were filtered.
  if (looksLikeBot(formData)) {
    return {
      status: 'success',
      message: "Thanks — your message is on its way. We'll reply within a few days.",
    }
  }

  const captchaOk = await verifyCaptcha(
    formData.get('frc-captcha-response') as string | null,
  )
  if (!captchaOk) {
    return {status: 'error', message: 'Could not verify you are human. Please try again.'}
  }

  const parsed = contactSchema.safeParse({
    name: formData.get('name') || undefined,
    email: formData.get('email'),
    inquiryType: formData.get('inquiryType'),
    message: formData.get('message'),
  })
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Please fix the highlighted fields.',
      errors: z.flattenError(parsed.error).fieldErrors,
    }
  }

  try {
    await getEmailProvider().sendContactMessage({
      name: parsed.data.name?.trim() || 'Anonymous',
      email: parsed.data.email,
      inquiryType: parsed.data.inquiryType,
      message: parsed.data.message,
    })
  } catch (err) {
    console.error('[contact] send failed:', err)
    return {
      status: 'error',
      message: 'Something went wrong sending your message. Please email us directly for now.',
    }
  }

  return {
    status: 'success',
    message: "Thanks — your message is on its way. We'll reply within a few days.",
  }
}

const newsletterSchema = z.object({
  email: z.email('Please enter a valid email address.').max(254),
})

export async function subscribeNewsletter(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (looksLikeBot(formData)) {
    return {
      status: 'success',
      message: 'Almost there — check your inbox to confirm your subscription.',
    }
  }

  // GDPR/ePrivacy: explicit, unbundled consent is required before we may email.
  if (formData.get('consent') !== 'on') {
    return {
      status: 'error',
      message: 'Please tick the consent box so we can send you the newsletter.',
      errors: {consent: ['Consent is required.']},
    }
  }

  const captchaOk = await verifyCaptcha(
    formData.get('frc-captcha-response') as string | null,
  )
  if (!captchaOk) {
    return {status: 'error', message: 'Could not verify you are human. Please try again.'}
  }

  const parsed = newsletterSchema.safeParse({email: formData.get('email')})
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Please enter a valid email address.',
      errors: z.flattenError(parsed.error).fieldErrors,
    }
  }

  try {
    await getEmailProvider().subscribeToNewsletter({
      email: parsed.data.email,
      source: (formData.get('source') as string) || 'website',
    })
  } catch (err) {
    console.error('[newsletter] subscribe failed:', err)
    return {status: 'error', message: 'Something went wrong. Please try again in a moment.'}
  }

  // Double opt-in: the ESP sends a confirmation email; the subscriber is not
  // active on the list until they click it. The message says so.
  return {
    status: 'success',
    message:
      'Almost there — check your inbox and click the confirmation link to complete your subscription.',
  }
}
