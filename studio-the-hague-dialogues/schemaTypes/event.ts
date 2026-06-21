import {defineType, defineField} from 'sanity'

// event.ts — Upcoming vs past is DERIVED from startsAt vs now (see GROQ), not a stored field.
export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (r) => r.required(),
    }),
    defineField({name: 'topic', type: 'reference', to: [{type: 'topic'}]}),
    defineField({
      name: 'format',
      type: 'string',
      options: {list: ['Dialogue', 'Policy', 'Debate', 'Panel', 'Interview']},
    }),
    defineField({
      name: 'startsAt',
      title: 'Starts at',
      type: 'datetime',
      validation: (r) => r.required(),
    }),
    defineField({name: 'endsAt', title: 'Ends at', type: 'datetime'}),
    defineField({name: 'venue', type: 'reference', to: [{type: 'venue'}]}),
    defineField({
      name: 'speakers',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'person'}]}],
    }),
    defineField({name: 'coverImage', type: 'image', options: {hotspot: true}}),
    defineField({name: 'standfirst', title: 'Short intro', type: 'text', rows: 3}),
    defineField({name: 'body', title: 'About this dialogue', type: 'array', of: [{type: 'block'}]}),
    defineField({name: 'registrationUrl', type: 'url'}),
    defineField({name: 'entryNote', type: 'string', initialValue: 'Free · limited seats'}),
    defineField({name: 'recapUrl', title: 'Recap link (past)', type: 'url'}),
    defineField({name: 'recapType', type: 'string', options: {list: ['video', 'text']}}),
    defineField({
      name: 'isCommunity',
      title: 'Community / open call',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {select: {title: 'title', subtitle: 'startsAt', media: 'coverImage'}},
})
