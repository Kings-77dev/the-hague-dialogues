# 04 — Sanity Schema (paste-ready)

TypeScript schema using `defineType`/`defineField`. Model **entities**, let pages compose them; references are the single source of truth (a `person` exists once, referenced by events/articles/team). Generate types with Sanity TypeGen after adding these.

Structure: `schemaTypes/index.ts` exports an array of all types. Singletons (`siteSettings`, `homeContent`, `aboutContent`) are enforced single via Structure Builder (one editable doc each).

## Reference / taxonomy documents

```ts
// person.ts — LINCHPIN: speakers, authors, team all reference this
import {defineType, defineField} from 'sanity'

export const person = defineType({
  name: 'person', title: 'Person', type: 'document',
  fields: [
    defineField({name: 'name', type: 'string', validation: r => r.required()}),
    defineField({name: 'slug', type: 'slug', options: {source: 'name'}}),
    defineField({name: 'role', title: 'Role / affiliation', type: 'string'}),
    defineField({name: 'bio', type: 'array', of: [{type: 'block'}]}),
    defineField({name: 'photo', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'isCutout', title: 'Photo is a prepared cut-out', type: 'boolean',
      description: 'True only if photo is a clean white-stroke-ready cut-out (see design rules 02-D).',
      initialValue: false,
    }),
    defineField({name: 'isTeam', title: 'Show on About team', type: 'boolean', initialValue: false}),
  ],
  preview: {select: {title: 'name', subtitle: 'role', media: 'photo'}},
})
```

```ts
// topic.ts — taxonomy, single source of truth
export const topic = defineType({
  name: 'topic', title: 'Topic', type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: r => r.required()}),
    defineField({name: 'slug', type: 'slug', options: {source: 'title'}}),
  ],
  preview: {select: {title: 'title'}},
})
```

```ts
// venue.ts
export const venue = defineType({
  name: 'venue', title: 'Venue', type: 'document',
  fields: [
    defineField({name: 'name', type: 'string', validation: r => r.required()}),
    defineField({name: 'addressLine', type: 'string'}),
    defineField({name: 'city', type: 'string', initialValue: 'The Hague'}),
  ],
  preview: {select: {title: 'name', subtitle: 'city'}},
})
```

```ts
// partner.ts
export const partner = defineType({
  name: 'partner', title: 'Partner', type: 'document',
  fields: [
    defineField({name: 'name', type: 'string', validation: r => r.required()}),
    defineField({name: 'logo', type: 'image'}),
    defineField({name: 'url', type: 'url'}),
  ],
  preview: {select: {title: 'name', media: 'logo'}},
})
```

## Core content documents

```ts
// event.ts
export const event = defineType({
  name: 'event', title: 'Event', type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: r => r.required()}),
    defineField({name: 'slug', type: 'slug', options: {source: 'title'}, validation: r => r.required()}),
    defineField({name: 'topic', type: 'reference', to: [{type: 'topic'}]}),
    defineField({
      name: 'format', type: 'string',
      options: {list: ['Dialogue', 'Policy', 'Debate', 'Panel', 'Interview']},
    }),
    defineField({name: 'startsAt', title: 'Starts at', type: 'datetime', validation: r => r.required()}),
    defineField({name: 'endsAt', title: 'Ends at', type: 'datetime'}),
    defineField({name: 'venue', type: 'reference', to: [{type: 'venue'}]}),
    defineField({name: 'speakers', type: 'array', of: [{type: 'reference', to: [{type: 'person'}]}]}),
    defineField({name: 'coverImage', type: 'image', options: {hotspot: true}}),
    defineField({name: 'standfirst', title: 'Short intro', type: 'text', rows: 3}),
    defineField({name: 'body', title: 'About this dialogue', type: 'array', of: [{type: 'block'}]}),
    defineField({name: 'registrationUrl', type: 'url'}),
    defineField({name: 'entryNote', type: 'string', initialValue: 'Free · limited seats'}),
    defineField({name: 'recapUrl', title: 'Recap link (past)', type: 'url'}),
    defineField({name: 'recapType', type: 'string', options: {list: ['video', 'text']}}),
    defineField({name: 'isCommunity', title: 'Community / open call', type: 'boolean', initialValue: false}),
  ],
  preview: {select: {title: 'title', subtitle: 'startsAt', media: 'coverImage'}},
})
// Upcoming vs past is DERIVED from startsAt vs now (see GROQ), not a stored field.
```

```ts
// article.ts (News)
export const article = defineType({
  name: 'article', title: 'Article', type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: r => r.required()}),
    defineField({name: 'slug', type: 'slug', options: {source: 'title'}, validation: r => r.required()}),
    defineField({name: 'author', type: 'reference', to: [{type: 'person'}]}),
    defineField({name: 'topic', type: 'reference', to: [{type: 'topic'}]}),
    defineField({
      name: 'format', type: 'string',
      options: {list: ['Recap', 'Opinion', 'Announcement', 'Interview']},
    }),
    defineField({name: 'publishedAt', type: 'datetime', validation: r => r.required()}),
    defineField({name: 'standfirst', title: 'Standfirst', type: 'text', rows: 3}),
    defineField({name: 'coverImage', type: 'image', options: {hotspot: true}}),
    defineField({name: 'readingMinutes', type: 'number'}),
    defineField({name: 'featured', type: 'boolean', initialValue: false}),
    defineField({name: 'body', type: 'array', of: [
      {type: 'block', styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'Quote', value: 'blockquote'},
      ]},
      {type: 'image', options: {hotspot: true}, fields: [{name: 'caption', type: 'string'}]},
      {name: 'pullquote', type: 'object', title: 'Pull quote', fields: [
        {name: 'text', type: 'text'},
        {name: 'attribution', type: 'reference', to: [{type: 'person'}]},
      ]},
    ]}),
    defineField({name: 'relatedEvent', type: 'reference', to: [{type: 'event'}]}),
  ],
  preview: {select: {title: 'title', subtitle: 'format', media: 'coverImage'}},
})
```

```ts
// mediaItem.ts
export const mediaItem = defineType({
  name: 'mediaItem', title: 'Media item', type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: r => r.required()}),
    defineField({name: 'slug', type: 'slug', options: {source: 'title'}}),
    defineField({
      name: 'format', type: 'string', validation: r => r.required(),
      options: {list: ['Video', 'Interview', 'Debate', 'Panel', 'Photo series']},
    }),
    defineField({name: 'thumbnail', type: 'image', options: {hotspot: true}, validation: r => r.required()}),
    defineField({name: 'topic', type: 'reference', to: [{type: 'topic'}]}),
    defineField({name: 'people', type: 'array', of: [{type: 'reference', to: [{type: 'person'}]}]}),
    defineField({name: 'publishedAt', type: 'datetime', validation: r => r.required()}),
    defineField({name: 'durationLabel', title: 'Duration / count', type: 'string', description: 'e.g. "24:26" or "16 Photos"'}),
    defineField({name: 'url', title: 'External/watch URL', type: 'url'}),
    defineField({name: 'featured', type: 'boolean', initialValue: false}),
    defineField({name: 'relatedEvent', type: 'reference', to: [{type: 'event'}]}),
  ],
  preview: {select: {title: 'title', subtitle: 'format', media: 'thumbnail'}},
})
```

## Singletons (thin; REFERENCE, don't duplicate)

```ts
// siteSettings.ts
export const siteSettings = defineType({
  name: 'siteSettings', title: 'Site settings', type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', initialValue: 'The Hague Dialogues'}),
    defineField({name: 'tagline', type: 'string'}),
    defineField({name: 'supportUrl', title: 'Support/donate URL', type: 'url'}),
    defineField({name: 'email', type: 'string'}),
    defineField({name: 'instagramUrl', type: 'url'}),
    defineField({name: 'linkedinUrl', type: 'url'}),
    defineField({name: 'defaultOgImage', type: 'image'}),
  ],
})

// homeContent.ts
export const homeContent = defineType({
  name: 'homeContent', title: 'Home', type: 'document',
  fields: [
    defineField({name: 'heroHeading', type: 'string'}),
    defineField({name: 'heroLede', type: 'text', rows: 3}),
    defineField({name: 'featuredEvent', type: 'reference', to: [{type: 'event'}]}),
    defineField({name: 'quote', type: 'object', fields: [
      {name: 'text', type: 'text'},
      {name: 'attribution', type: 'reference', to: [{type: 'person'}]},
    ]}),
  ],
})

// aboutContent.ts
export const aboutContent = defineType({
  name: 'aboutContent', title: 'About', type: 'document',
  fields: [
    defineField({name: 'founding', title: 'Founding story', type: 'array', of: [{type: 'block'}]}),
    defineField({name: 'stats', type: 'array', of: [{type: 'object', fields: [
      {name: 'value', type: 'string'}, {name: 'label', type: 'string'},
    ]}]}),
    defineField({name: 'values', type: 'array', of: [{type: 'object', fields: [
      {name: 'title', type: 'string'}, {name: 'description', type: 'text'},
    ]}]}),
    defineField({name: 'team', type: 'array', of: [{type: 'reference', to: [{type: 'person'}]}]}),
    defineField({name: 'partners', type: 'array', of: [{type: 'reference', to: [{type: 'partner'}]}]}),
  ],
})
```

```ts
// index.ts
export const schemaTypes = [
  person, topic, venue, partner,         // reference/taxonomy
  event, article, mediaItem,             // core content
  siteSettings, homeContent, aboutContent, // singletons
]
```
