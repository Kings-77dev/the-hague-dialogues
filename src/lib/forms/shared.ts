/**
 * Constants and types shared between the Server Actions and the client form
 * components. These must NOT live in `actions.ts`: a `'use server'` module may
 * only export async functions — any other export reaches client importers as a
 * server-reference proxy, not its real value.
 */

/** Shape returned to the client via `useActionState`. */
export type FormState = {
  status: 'idle' | 'success' | 'error'
  message: string
  /** Field-level errors keyed by input name, for inline display. */
  errors?: Record<string, string[]>
}

export const INITIAL_FORM_STATE: FormState = {status: 'idle', message: ''}

export const INQUIRY_TYPES = [
  'General enquiry',
  'Volunteering',
  'Partnership',
  'Speaking / proposing a topic',
  'Press',
] as const
