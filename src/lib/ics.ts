/** Calendar helpers: RFC 5545 `.ics` generation + a Google Calendar link. */

export type CalendarEvent = {
  title: string
  description?: string
  location?: string
  /** ISO 8601 start. */
  start: string
  /** ISO 8601 end. Defaults to start + 2h when absent. */
  end?: string
  url?: string
}

/** ISO → UTC basic format `YYYYMMDDTHHMMSSZ`. */
function toIcsDate(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

function escapeText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

function defaultEnd(ev: CalendarEvent): string {
  return ev.end ?? new Date(new Date(ev.start).getTime() + 2 * 60 * 60 * 1000).toISOString()
}

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

/** A single-event RFC 5545 VCALENDAR document (CRLF line endings, per spec). */
export function buildIcs(ev: CalendarEvent): string {
  const uid = `${toIcsDate(ev.start)}-${hash(ev.title)}@thehaguedialogues.nl`
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//The Hague Dialogues//Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${toIcsDate(new Date().toISOString())}`,
    `DTSTART:${toIcsDate(ev.start)}`,
    `DTEND:${toIcsDate(defaultEnd(ev))}`,
    `SUMMARY:${escapeText(ev.title)}`,
    ev.description ? `DESCRIPTION:${escapeText(ev.description)}` : '',
    ev.location ? `LOCATION:${escapeText(ev.location)}` : '',
    ev.url ? `URL:${ev.url}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean)
  return lines.join('\r\n')
}

/** Google Calendar "template" URL that prefills a new event. */
export function googleCalendarUrl(ev: CalendarEvent): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: ev.title,
    dates: `${toIcsDate(ev.start)}/${toIcsDate(defaultEnd(ev))}`,
  })
  if (ev.description) params.set('details', ev.description)
  if (ev.location) params.set('location', ev.location)
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function calendarFileName(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `${slug || 'event'}.ics`
}
