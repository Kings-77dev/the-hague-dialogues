import {createClient} from 'next-sanity'
import {apiVersion, dataset, projectId} from './env'

// Plain published-content client. Live Content API / preview token come later.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})
