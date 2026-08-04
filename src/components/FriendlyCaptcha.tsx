'use client'

import Script from 'next/script'

/**
 * Friendly Captcha widget — EU-resident, GDPR-by-design, no cookies, no
 * cross-site tracking. Chosen for EU data residency.
 *
 * Renders only when NEXT_PUBLIC_FRIENDLY_CAPTCHA_SITEKEY is set, so the forms
 * work before the account exists. `data-solution-field-name` pins the injected
 * hidden input's name to what the Server Action reads (`frc-captcha-response`).
 *
 * When you provision keys: confirm the script URL and widget attributes against
 * Friendly Captcha's current docs, then set the sitekey (public) and
 * FRIENDLY_CAPTCHA_SECRET (server) env vars. See `.env.example`.
 */
const SITEKEY = process.env.NEXT_PUBLIC_FRIENDLY_CAPTCHA_SITEKEY

export function FriendlyCaptcha() {
  if (!SITEKEY) return null
  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/@friendlycaptcha/sdk@0.1/site.min.js"
        strategy="afterInteractive"
        type="module"
      />
      <div
        className="frc-captcha"
        data-sitekey={SITEKEY}
        data-solution-field-name="frc-captcha-response"
      />
    </>
  )
}
