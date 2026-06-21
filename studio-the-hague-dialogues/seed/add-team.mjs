// Adds real-team person docs (Ádám, Vito, Martin, Viktoria) and attaches the
// branded team-card images from public/images. Then updates aboutContent.team
// to reference them so the About page renders a populated team grid.
// Run from studio dir:  npx sanity exec seed/add-team.mjs --with-user-token
import {createReadStream} from 'node:fs'
import {basename, join} from 'node:path'
import {getCliClient} from 'sanity/cli'

const client = getCliClient()
const IMG_DIR = join(process.cwd(), '..', 'public', 'images')

const TEAM = [
  {
    id: 'person-adam',
    name: 'Ádám',
    role: 'Founder & President',
    file: '545286064_17871402699423381_2971201626152240627_n.jpg',
  },
  {
    id: 'person-vito',
    name: 'Vito',
    role: 'Secretary & Vice-president',
    file: '543354115_17871512844423381_318704390703435508_n.jpg',
  },
  {
    id: 'person-martin',
    name: 'Martin',
    role: 'Treasurer & Controller',
    file: '543815859_17871614778423381_5626686732659943931_n.jpg',
  },
  {
    id: 'person-viktoria',
    name: 'Viktoria',
    role: 'Programme · The Hague Dialogues',
    file: '643548585_17892073506423381_2567573687943097696_n.jpg',
  },
]

const run = async () => {
  const teamRefs = []
  for (const m of TEAM) {
    const path = join(IMG_DIR, m.file)
    process.stdout.write(`Uploading ${m.file} … `)
    const asset = await client.assets.upload('image', createReadStream(path), {
      filename: basename(path),
    })
    console.log(`ok`)
    const doc = {
      _id: m.id,
      _type: 'person',
      name: m.name,
      slug: {_type: 'slug', current: m.id.replace('person-', '')},
      role: m.role,
      isTeam: true,
      isCutout: false,
      photo: {_type: 'image', asset: {_type: 'reference', _ref: asset._id}},
    }
    await client.createOrReplace(doc)
    console.log(`  upserted ${m.id}`)
    teamRefs.push({_type: 'reference', _ref: m.id, _key: m.id})
  }
  // Point aboutContent.team at the new team
  await client.patch('aboutContent').set({team: teamRefs}).commit()
  console.log('aboutContent.team updated.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
