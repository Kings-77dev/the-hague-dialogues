import {defineType, defineField} from 'sanity'

// article.ts (News)
export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (r) => r.required(),
    }),
    defineField({name: 'author', type: 'reference', to: [{type: 'person'}]}),
    defineField({name: 'topic', type: 'reference', to: [{type: 'topic'}]}),
    defineField({
      name: 'format',
      type: 'string',
      options: {list: ['Recap', 'Opinion', 'Announcement', 'Interview']},
    }),
    defineField({name: 'publishedAt', type: 'datetime', validation: (r) => r.required()}),
    defineField({name: 'standfirst', title: 'Standfirst', type: 'text', rows: 3}),
    defineField({name: 'coverImage', type: 'image', options: {hotspot: true}}),
    defineField({name: 'readingMinutes', type: 'number'}),
    defineField({name: 'featured', type: 'boolean', initialValue: false}),
    defineField({
      name: 'body',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'Quote', value: 'blockquote'},
          ],
        },
        {type: 'image', options: {hotspot: true}, fields: [{name: 'caption', type: 'string'}]},
        {
          name: 'pullquote',
          type: 'object',
          title: 'Pull quote',
          fields: [
            {name: 'text', type: 'text'},
            {name: 'attribution', type: 'reference', to: [{type: 'person'}]},
          ],
        },
      ],
    }),
    defineField({name: 'relatedEvent', type: 'reference', to: [{type: 'event'}]}),
  ],
  preview: {select: {title: 'title', subtitle: 'format', media: 'coverImage'}},
})
