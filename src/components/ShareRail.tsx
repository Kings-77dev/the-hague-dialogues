'use client'

import {useState} from 'react'

/**
 * Article share rail. X and LinkedIn are plain share-intent links (work
 * without JS); Copy link uses the Clipboard API with a brief "Copied"
 * confirmation, falling back to a prompt when the clipboard is unavailable.
 */
export function ShareRail({url, title}: {url: string; title: string}) {
  const [copied, setCopied] = useState(false)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copy this link:', url)
    }
  }

  const enc = encodeURIComponent
  return (
    <aside className="share-rail">
      <span className="lab" aria-live="polite">
        {copied ? 'Copied' : 'Share'}
      </span>
      <button
        className="share-btn"
        type="button"
        title="Copy link"
        aria-label="Copy link"
        onClick={copyLink}
      >
        {copied ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <path d="M4 12.5l5 5L20 6.5" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5" />
            <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5" />
          </svg>
        )}
      </button>
      <a
        className="share-btn"
        href={`https://x.com/intent/post?url=${enc(url)}&text=${enc(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on X"
        aria-label="Share on X"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.5 3h3l-6.6 7.5L21.8 21h-5.9l-4.3-5.7L6.6 21H3.6l7-8L2.6 3h6l3.9 5.2L17.5 3zm-2 16h1.6L7.6 4.7H5.9L15.5 19z" />
        </svg>
      </a>
      <a
        className="share-btn"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on LinkedIn"
        aria-label="Share on LinkedIn"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.5 4.5a2 2 0 100 4 2 2 0 000-4zM3 9.5h3V21H3zM9 9.5h2.9v1.6h.1c.5-.9 1.7-1.9 3.5-1.9 3 0 4.5 2 4.5 5.4V21h-3v-5c0-1.4-.5-2.4-1.9-2.4-1 0-1.6.7-1.9 1.4-.1.3-.1.6-.1 1V21H9z" />
        </svg>
      </a>
    </aside>
  )
}
