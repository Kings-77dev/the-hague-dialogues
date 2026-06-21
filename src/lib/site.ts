/** Canonical site origin. Override via NEXT_PUBLIC_SITE_URL once a real domain exists. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ??
  'https://thehaguedialogues.nl'
