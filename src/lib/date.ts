// Shared date formatting for events/articles/media.

const TZ = 'Europe/Amsterdam'

/** e.g. "11.03.2026" */
export function formatDate(iso: string): string {
  const d = new Date(iso)
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
    .format(d)
    .replace(/\//g, '.')
}

/** e.g. "18:00" */
export function formatTime(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(iso))
}

/** e.g. "20 May 2026" — for article/media meta rows */
export function formatLongDate(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))
}

/** e.g. "26.03" — event-date headline */
export function formatDayMonth(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    day: '2-digit',
    month: '2-digit',
  })
    .format(new Date(iso))
    .replace(/\//g, '.')
}

/** e.g. "Feb 2026" — article card date */
export function formatMonthYear(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}
