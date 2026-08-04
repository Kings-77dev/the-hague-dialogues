'use client'

import type {ComponentProps} from 'react'

/**
 * A GET-form <select> that applies itself on change. Progressive enhancement
 * over the form's native submit — without JS the form still submits via its
 * (visually hidden) submit button / Enter in the search field.
 */
export function AutoSubmitSelect(props: ComponentProps<'select'>) {
  return <select {...props} onChange={(e) => e.currentTarget.form?.requestSubmit()} />
}
