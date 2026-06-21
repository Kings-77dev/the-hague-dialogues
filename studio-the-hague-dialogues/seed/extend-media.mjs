// Adds 2 more mediaItem documents to bring the seeded media count to 5,
// so the home media-mosaic renders 1 feature + 4 stack as in the prototype.
// Reuses image assets already uploaded by upload-images.mjs (no new uploads).
// Run from studio dir:  npx sanity exec seed/extend-media.mjs --with-user-token
import {getCliClient} from 'sanity/cli'

const client = getCliClient()

const thumb = (assetId) => ({
  _type: 'image',
  asset: {_type: 'reference', _ref: assetId},
})

const DOCS = [
  {
    _id: 'media-march-highlights',
    _type: 'mediaItem',
    title: 'March Event Highlights',
    slug: {_type: 'slug', current: 'march-event-highlights'},
    format: 'Photo series',
    thumbnail: thumb('image-947ab39f01f8e86b24734fe33ee2d1bb027f0108-1600x1066-jpg'),
    topic: {_type: 'reference', _ref: 'topic-democracy'},
    publishedAt: '2026-03-25T09:00:00.000Z',
    durationLabel: '18 Photos',
    featured: false,
  },
  {
    _id: 'media-civic-revolution',
    _type: 'mediaItem',
    title: 'Join Our Civic Revolution',
    slug: {_type: 'slug', current: 'join-our-civic-revolution'},
    format: 'Video',
    thumbnail: thumb('image-55e691c00a27b5ce00d96e8698649d720a713401-1600x1066-jpg'),
    topic: {_type: 'reference', _ref: 'topic-democracy'},
    publishedAt: '2026-05-15T09:00:00.000Z',
    durationLabel: '03:42',
    url: 'https://example.com/watch/civic-revolution',
    featured: false,
  },
]

const run = async () => {
  for (const doc of DOCS) {
    await client.createOrReplace(doc)
    console.log('upserted', doc._id)
  }
  console.log('Done.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
