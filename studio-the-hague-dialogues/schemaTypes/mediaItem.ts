import {defineType, defineField} from 'sanity'

// mediaItem.ts
export const mediaItem = defineType({
  name: 'mediaItem',
  title: 'Media item',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'slug', type: 'slug', options: {source: 'title'}}),
    defineField({
      name: 'format',
      type: 'string',
      validation: (r) => r.required(),
      options: {list: ['Video', 'Interview', 'Debate', 'Panel', 'Photo series']},
    }),
    defineField({
      name: 'thumbnail',
      type: 'image',
      options: {hotspot: true},
      validation: (r) => r.required(),
    }),
    defineField({name: 'topic', type: 'reference', to: [{type: 'topic'}]}),
    defineField({name: 'people', type: 'array', of: [{type: 'reference', to: [{type: 'person'}]}]}),
    defineField({name: 'publishedAt', type: 'datetime', validation: (r) => r.required()}),
    defineField({
      name: 'durationLabel',
      title: 'Duration / count',
      type: 'string',
      description: 'e.g. "24:26" or "16 Photos"',
    }),
    defineField({name: 'url', title: 'External/watch URL', type: 'url'}),
    defineField({name: 'featured', type: 'boolean', initialValue: false}),
    defineField({name: 'relatedEvent', type: 'reference', to: [{type: 'event'}]}),
  ],
  preview: {select: {title: 'title', subtitle: 'format', media: 'thumbnail'}},
})
