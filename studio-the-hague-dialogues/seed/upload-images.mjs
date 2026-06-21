// Uploads the clean event scene photos from the app's public/images folder as
// Sanity assets, then attaches them to the seeded events/media items.
// Run from the studio dir:  npx sanity exec seed/upload-images.mjs --with-user-token
import {createReadStream} from 'node:fs'
import {basename, join} from 'node:path'
import {getCliClient} from 'sanity/cli'

const client = getCliClient()

const IMG_DIR = join(process.cwd(), '..', 'public', 'images')

// Clean (text-free) scene photos → which doc field they fill.
// Reused across a few slots (placeholder seed; swap for real per-event photos later).
const PLAN = [
  {file: '3ce907e6-a0bf-4dfc-ab3f-23b4f29bbff1.jpeg', targets: [
    {id: 'event-ai-democracy', field: 'coverImage'},
    {id: 'media-photo-series', field: 'thumbnail'},
  ]},
  {file: 'c5275197-587c-4ad9-aac1-1d1fde28905a.jpeg', targets: [
    {id: 'event-future-europe', field: 'coverImage'},
  ]},
  {file: '2dd88902-e748-4b73-8d8c-30951a47c421.jpeg', targets: [
    {id: 'event-sovereignty-shift', field: 'coverImage'},
    {id: 'media-sovereignty-recap', field: 'thumbnail'},
  ]},
  {file: 'f3573e7f-7fec-4614-aa88-22f7ad06a700.jpeg', targets: [
    {id: 'media-amina-interview', field: 'thumbnail'},
  ]},
]

const run = async () => {
  for (const {file, targets} of PLAN) {
    const path = join(IMG_DIR, file)
    process.stdout.write(`Uploading ${file} … `)
    const asset = await client.assets.upload('image', createReadStream(path), {
      filename: basename(path),
    })
    console.log(`ok (${asset._id})`)
    for (const {id, field} of targets) {
      await client
        .patch(id)
        .set({[field]: {_type: 'image', asset: {_type: 'reference', _ref: asset._id}}})
        .commit()
      console.log(`  → set ${id}.${field}`)
    }
  }
  console.log('Done.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
