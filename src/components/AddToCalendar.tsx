'use client'

import {useEffect, useRef, useState} from 'react'
import {buildIcs, googleCalendarUrl, calendarFileName, type CalendarEvent} from '@/lib/ics'

/**
 * "Add to calendar" control. Offers Google Calendar (prefilled template URL)
 * and a downloadable RFC 5545 `.ics` for Apple Calendar / Outlook — no backend,
 * no third-party script. Replaces the previous non-functional button.
 */
export function AddToCalendar(props: CalendarEvent) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  function downloadIcs() {
    const blob = new Blob([buildIcs(props)], {type: 'text/calendar;charset=utf-8'})
    const href = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = href
    a.download = calendarFileName(props.title)
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(href)
    setOpen(false)
  }

  return (
    <div className="atc" ref={rootRef}>
      <button
        type="button"
        className="rm-cal"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
        Add to calendar
      </button>
      {open && (
        <div className="atc-menu" role="menu">
          <a
            role="menuitem"
            className="atc-item"
            href={googleCalendarUrl(props)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
          >
            Google Calendar
          </a>
          <button role="menuitem" type="button" className="atc-item" onClick={downloadIcs}>
            Apple / Outlook (.ics)
          </button>
        </div>
      )}
    </div>
  )
}
