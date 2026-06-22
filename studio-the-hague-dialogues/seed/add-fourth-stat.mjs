// Adds a 4th "By the numbers" stat to balance the row (backlog #7).
// Run from studio dir: npx sanity exec seed/add-fourth-stat.mjs --with-user-token
import {getCliClient} from 'sanity/cli'

const client = getCliClient()
const NEW_STAT = {
  _key: 'stat-nationalities',
  _type: 'object',
  value: '25+',
  label: 'Nationalities represented',
}

// Idempotent: only append if not already present.
const doc = await client.getDocument('aboutContent')
const stats = doc?.stats ?? []
if (stats.some((s) => s._key === NEW_STAT._key)) {
  console.log('Already present — skipping.')
} else {
  await client
    .patch('aboutContent')
    .setIfMissing({stats: []})
    .insert('after', 'stats[-1]', [NEW_STAT])
    .commit()
  console.log('4th stat appended:', NEW_STAT.value, '—', NEW_STAT.label)
}
