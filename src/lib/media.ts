// Canonical media CTA label per format (02-C).
export function mediaCtaLabel(format: string | null | undefined): string {
  switch (format) {
    case 'Photo series':
      return 'View'
    case 'Interview':
      return 'Read'
    default:
      return 'Watch' // Video / Debate / Panel
  }
}

export function isPlayable(format: string | null | undefined): boolean {
  return format !== 'Photo series'
}
