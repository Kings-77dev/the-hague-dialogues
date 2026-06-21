// Attaches existing uploaded scene-photo assets to the seeded articles as
// coverImage (reuses assets from upload-images.mjs — no new uploads).
// Run: npx sanity exec seed/attach-article-images.mjs --with-user-token
import {getCliClient} from 'sanity/cli'

const client = getCliClient()
const ref = (id) => ({_type: 'image', asset: {_type: 'reference', _ref: id}})

const MAP = {
  'article-welcome': 'image-947ab39f01f8e86b24734fe33ee2d1bb027f0108-1600x1066-jpg',
  'article-youth-democracy': 'image-3c3856c8d3e65b42fc26826da06c4c38162c296b-1600x1066-jpg',
  'article-after-sovereignty': 'image-55e691c00a27b5ce00d96e8698649d720a713401-1600x1066-jpg',
}

const run = async () => {
  for (const [id, asset] of Object.entries(MAP)) {
    await client.patch(id).set({coverImage: ref(asset)}).commit()
    console.log('set', id)
  }
  console.log('Done.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
