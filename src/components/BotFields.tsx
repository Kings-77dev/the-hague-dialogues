'use client'

import {useEffect, useRef} from 'react'

/**
 * Zero-dependency spam filtering that works alongside the captcha:
 *  - `company` honeypot: visually hidden, off tab order, hidden from AT. Real
 *    users never fill it; bots that autofill everything do.
 *  - `_ts` timing: stamped on mount by JS. The Server Action rejects submits
 *    that arrive implausibly fast. Absent on no-JS submits, so it never blocks
 *    real users under progressive enhancement.
 */
export function BotFields() {
  const tsRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (tsRef.current) tsRef.current.value = String(Date.now())
  }, [])
  return (
    <div aria-hidden className="hp-field">
      <label>
        Company (leave this blank)
        <input type="text" name="company" tabIndex={-1} autoComplete="off" />
      </label>
      <input ref={tsRef} type="hidden" name="_ts" />
    </div>
  )
}
