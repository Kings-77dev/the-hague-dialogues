/**
 * Fallback copy used when `siteSettings` (or a per-page query) returns a
 * missing string. In production these should never fire — the editor sets
 * everything in Studio. They keep dev/preview environments honest and
 * surface a sensible default if a field gets accidentally cleared.
 */
export const DEFAULTS = {
  siteTitle: 'The Hague Dialogues',
  siteTagline:
    'Building bridges through understanding and open discussion.',
  email: 'hello@thehaguedialogues.nl',
  instagramUrl: 'https://www.instagram.com/thehaguedialogues/',
  supportHref: '/get-involved',
  homeHeroHeading: 'Where opposing ideas meet with respect',
  homeHeroLede:
    'A student-led platform in The Hague creating spaces for open, challenging, and constructive conversations about society, politics, identity, and the future.',
  introStripBody:
    'A civic forum for students, professionals, and the wider community. We host dialogues that make difficult questions public, thoughtful, and human.',
  miniDonateBody: 'Ready to join the conversation?',
} as const
