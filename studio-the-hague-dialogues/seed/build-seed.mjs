// Generates seed.ndjson — ~2-3 of each type + the 3 singletons, with fixed
// _ids so references resolve. Images are intentionally omitted (added later
// when the client supplies cut-ready/scene photos, per 07-images).
// Run: node seed/build-seed.mjs  →  writes seed/seed.ndjson
import {writeFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {dirname, join} from 'node:path'

let k = 0
const key = () => `k${(k++).toString(36)}`
const ref = (id) => ({_type: 'reference', _ref: id})
const slug = (s) => ({_type: 'slug', current: s})
const blocks = (...paras) =>
  paras.map((text) => ({
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [{_type: 'span', _key: key(), text, marks: []}],
  }))

const docs = [
  // --- taxonomy / reference ---
  {_id: 'topic.security', _type: 'topic', title: 'Security & Sovereignty', slug: slug('security-sovereignty')},
  {_id: 'topic.democracy', _type: 'topic', title: 'Democracy & Society', slug: slug('democracy-society')},

  {_id: 'venue.hhs', _type: 'venue', name: 'De Haagse Hogeschool', addressLine: 'Johanna Westerdijkplein 75', city: 'The Hague'},

  {_id: 'partner.hhs', _type: 'partner', name: 'The Hague University of Applied Sciences', url: 'https://www.thehagueuniversity.com'},

  {
    _id: 'person.amina-okonjo', _type: 'person', name: 'Amina Okonjo', slug: slug('amina-okonjo'),
    role: 'Professor of International Law, Leiden University', isCutout: false, isTeam: false,
    bio: blocks('Amina researches the shifting boundaries of state sovereignty in a multipolar Europe.'),
  },
  {
    _id: 'person.lars-mensah', _type: 'person', name: 'Lars Mensah', slug: slug('lars-mensah'),
    role: 'Political Editor, NRC', isCutout: false, isTeam: false,
    bio: blocks('Lars writes on European security and the politics of neutrality.'),
  },
  {
    _id: 'person.sophie-vance', _type: 'person', name: 'Sophie Vance', slug: slug('sophie-vance'),
    role: 'Director, The Hague Dialogues', isCutout: false, isTeam: true,
    bio: blocks('Sophie founded The Hague Dialogues to create space for difficult conversations.'),
  },

  // --- events (upcoming derived from startsAt >= now; today is 2026-06-21) ---
  {
    _id: 'event.ai-democracy', _type: 'event', title: 'Can Democracy Survive the Algorithm?', slug: slug('can-democracy-survive-the-algorithm'),
    topic: ref('topic.democracy'), format: 'Panel',
    startsAt: '2026-09-15T18:00:00.000Z', endsAt: '2026-09-15T20:00:00.000Z',
    venue: ref('venue.hhs'), speakers: [ref('person.amina-okonjo'), ref('person.lars-mensah')],
    standfirst: 'How do open societies hold a shared conversation when the feed decides what we see?',
    body: blocks('A panel on platforms, polarisation and the civic infrastructure of democracy.'),
    registrationUrl: 'https://example.com/register/ai-democracy', entryNote: 'Free · limited seats', isCommunity: false,
  },
  {
    _id: 'event.future-europe', _type: 'event', title: 'Borders, Migration & the Future of Europe', slug: slug('borders-migration-future-of-europe'),
    topic: ref('topic.security'), format: 'Dialogue',
    startsAt: '2026-11-03T18:30:00.000Z', endsAt: '2026-11-03T20:30:00.000Z',
    venue: ref('venue.hhs'), speakers: [ref('person.amina-okonjo')],
    standfirst: 'A frank dialogue on movement, belonging and the European project.',
    registrationUrl: 'https://example.com/register/future-europe', entryNote: 'Free · limited seats', isCommunity: false,
  },
  {
    _id: 'event.sovereignty-shift', _type: 'event', title: 'The Sovereignty Shift: NATO, Neutrality & the New European Border', slug: slug('the-sovereignty-shift'),
    topic: ref('topic.security'), format: 'Debate',
    startsAt: '2026-03-11T18:00:00.000Z', endsAt: '2026-03-11T20:00:00.000Z',
    venue: ref('venue.hhs'), speakers: [ref('person.lars-mensah'), ref('person.amina-okonjo')],
    standfirst: 'What does neutrality mean when the map of European security is being redrawn?',
    recapUrl: 'https://example.com/recap/sovereignty-shift', recapType: 'video', isCommunity: false,
  },
  {
    _id: 'event.open-call', _type: 'event', title: 'Open Call: Propose a Dialogue', slug: slug('open-call-propose-a-dialogue'),
    format: 'Dialogue', startsAt: '2026-07-01T09:00:00.000Z',
    standfirst: 'Have a question worth debating in public? Pitch it to us.', isCommunity: true,
  },

  // --- articles (News) ---
  {
    _id: 'article.after-sovereignty', _type: 'article', title: 'After the Sovereignty Shift: Five Takeaways', slug: slug('after-the-sovereignty-shift'),
    author: ref('person.lars-mensah'), topic: ref('topic.security'), format: 'Recap',
    publishedAt: '2026-03-15T09:00:00.000Z', readingMinutes: 6, featured: true,
    standfirst: 'Our debate on neutrality drew sharp lines. Here is what stayed with us.',
    body: blocks(
      'The room did not agree — and that was the point.',
      'Five themes recurred across an evening of disagreement, from deterrence to the cost of staying out.',
    ),
    relatedEvent: ref('event.sovereignty-shift'),
  },
  {
    _id: 'article.youth-democracy', _type: 'article', title: 'Why Young Europeans Are Rethinking Democracy', slug: slug('young-europeans-rethinking-democracy'),
    author: ref('person.amina-okonjo'), topic: ref('topic.democracy'), format: 'Opinion',
    publishedAt: '2026-05-20T09:00:00.000Z', readingMinutes: 4, featured: false,
    standfirst: 'A generation raised online is asking harder questions of its institutions.',
    body: blocks('Disillusionment is not apathy. It is often the opposite.'),
  },
  {
    _id: 'article.welcome', _type: 'article', title: 'Welcome to The Hague Dialogues', slug: slug('welcome-to-the-hague-dialogues'),
    topic: ref('topic.democracy'), format: 'Announcement',
    publishedAt: '2026-06-01T09:00:00.000Z', readingMinutes: 2, featured: false,
    standfirst: 'A new home for open, challenging, constructive conversation in The Hague.',
    body: blocks('We are a student-led platform creating space for opposing ideas to meet with respect.'),
  },

  // --- media items (thumbnails added later) ---
  {
    _id: 'media.sovereignty-recap', _type: 'mediaItem', title: 'The Sovereignty Shift — Full Recording', slug: slug('sovereignty-shift-recording'),
    format: 'Video', topic: ref('topic.security'), people: [ref('person.lars-mensah')],
    publishedAt: '2026-03-20T09:00:00.000Z', durationLabel: '24:26', featured: true,
    url: 'https://example.com/watch/sovereignty-shift', relatedEvent: ref('event.sovereignty-shift'),
  },
  {
    _id: 'media.amina-interview', _type: 'mediaItem', title: 'In Conversation with Amina Okonjo', slug: slug('in-conversation-amina-okonjo'),
    format: 'Interview', topic: ref('topic.democracy'), people: [ref('person.amina-okonjo')],
    publishedAt: '2026-05-01T09:00:00.000Z', durationLabel: '12:08', featured: false,
    url: 'https://example.com/watch/amina-okonjo',
  },
  {
    _id: 'media.photo-series', _type: 'mediaItem', title: 'Dialogues in Pictures', slug: slug('dialogues-in-pictures'),
    format: 'Photo series', topic: ref('topic.democracy'),
    publishedAt: '2026-04-10T09:00:00.000Z', durationLabel: '16 Photos', featured: false,
  },

  // --- singletons (fixed ids matched by structure.ts) ---
  {
    _id: 'siteSettings', _type: 'siteSettings', title: 'The Hague Dialogues',
    tagline: 'Conversations on justice, peace and the ideas shaping our shared future.',
    supportUrl: 'https://example.com/support', email: 'hello@thehaguedialogues.nl',
    instagramUrl: 'https://instagram.com/thehaguedialogues', linkedinUrl: 'https://linkedin.com/company/thehaguedialogues',
  },
  {
    _id: 'homeContent', _type: 'homeContent',
    heroHeading: 'Where opposing ideas meet with respect',
    heroLede: 'A student-led platform in The Hague creating spaces for open, challenging, and constructive conversations about society, politics, identity, and the future.',
    featuredEvent: ref('event.ai-democracy'),
    quote: {text: 'Disagreement, done well, is how a society thinks out loud.', attribution: ref('person.amina-okonjo')},
  },
  {
    _id: 'aboutContent', _type: 'aboutContent',
    founding: blocks('The Hague Dialogues began with a simple conviction: that a city of peace and justice deserves a public square for difficult conversation.'),
    stats: [
      {_key: key(), value: '40+', label: 'Dialogues hosted'},
      {_key: key(), value: '120', label: 'Speakers'},
      {_key: key(), value: '5k', label: 'Attendees'},
    ],
    values: [
      {_key: key(), title: 'Openness', description: 'Every voice that argues in good faith has a seat.'},
      {_key: key(), title: 'Respect', description: 'We attack ideas, never people.'},
      {_key: key(), title: 'Rigour', description: 'Strong claims need strong evidence.'},
      {_key: key(), title: 'Impact', description: 'Conversation should leave the room changed.'},
    ],
    team: [ref('person.sophie-vance'), ref('person.amina-okonjo')],
    partners: [ref('partner.hhs')],
  },
]

// Sanity treats any document whose _id contains a "." as PRIVATE (only
// readable with a token, not via the anonymous public API). Our published
// content must be publicly readable, so swap dots for hyphens in every
// _id / _ref before writing.
const dedot = (node) => {
  if (Array.isArray(node)) return node.map(dedot)
  if (node && typeof node === 'object') {
    const out = {}
    for (const [key, val] of Object.entries(node)) {
      out[key] =
        (key === '_id' || key === '_ref') && typeof val === 'string'
          ? val.replace(/\./g, '-')
          : dedot(val)
    }
    return out
  }
  return node
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const out = join(__dirname, 'seed.ndjson')
writeFileSync(out, docs.map((d) => JSON.stringify(dedot(d))).join('\n') + '\n')
console.log(`wrote ${docs.length} docs to ${out}`)
