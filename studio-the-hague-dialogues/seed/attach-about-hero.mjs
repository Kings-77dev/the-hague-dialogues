// Attaches an already-uploaded scene-photo asset to aboutContent.heroImage so
// the About hero renders via the CMS rather than a hardcoded /public path.
// Run from studio dir: npx sanity exec seed/attach-about-hero.mjs --with-user-token
import {getCliClient} from 'sanity/cli'

const client = getCliClient()

// Asset _id of the "Are we too self-aware" panel-discussion photo
// (uploaded by upload-images.mjs). Matches what about/page.tsx was hardcoding.
const HERO_ASSET = 'image-3c3856c8d3e65b42fc26826da06c4c38162c296b-1600x1066-jpg'

await client
  .patch('aboutContent')
  .set({
    heroImage: {
      _type: 'image',
      asset: {_type: 'reference', _ref: HERO_ASSET},
    },
  })
  .commit()
console.log('aboutContent.heroImage set →', HERO_ASSET)
