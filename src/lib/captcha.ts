/**
 * Server-side CAPTCHA verification.
 *
 * Provider: Friendly Captcha (EU-resident, GDPR-by-design, no cookies, no
 * cross-site tracking) — chosen because the site owner requires EU data
 * residency.
 *
 * Env:
 *   FRIENDLY_CAPTCHA_SECRET                    — server API key (this file)
 *   NEXT_PUBLIC_FRIENDLY_CAPTCHA_SITEKEY       — public site key (client widget)
 *
 * When the secret is unset, verification is SKIPPED with a warning so the forms
 * stay testable before the account exists. The honeypot + timing checks in the
 * Server Actions remain active regardless, so there is always a baseline of
 * spam protection. Set the secret before launch.
 *
 * The endpoint + payload below follow Friendly Captcha's v2 siteverify API.
 * Confirm against their current docs when provisioning keys, since the exact
 * host can differ by plan/region.
 */
const VERIFY_URL = 'https://global.frcapi.com/api/v2/captcha/siteverify'

export async function verifyCaptcha(token: string | null): Promise<boolean> {
  const secret = process.env.FRIENDLY_CAPTCHA_SECRET
  if (!secret) {
    console.warn(
      '[captcha] FRIENDLY_CAPTCHA_SECRET unset — skipping verification (dev only). ' +
        'Honeypot + timing checks still apply.',
    )
    return true
  }
  if (!token) return false

  try {
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'X-API-Key': secret},
      body: JSON.stringify({response: token}),
    })
    if (!res.ok) return false
    const data = (await res.json()) as {success?: boolean}
    return data.success === true
  } catch (err) {
    console.error('[captcha] verification error:', err)
    return false
  }
}
