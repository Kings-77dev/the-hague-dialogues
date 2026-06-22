import {defineType, defineField} from 'sanity'

// aboutContent.ts — singleton
export const aboutContent = defineType({
  name: 'aboutContent',
  title: 'About',
  type: 'document',
  fields: [
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      options: {hotspot: true},
      description: 'Scene photo on the right side of the About hero. Wide aspect works best.',
    }),
    defineField({name: 'founding', title: 'Founding story', type: 'array', of: [{type: 'block'}]}),
    defineField({
      name: 'stats',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'value', type: 'string'},
            {name: 'label', type: 'string'},
          ],
        },
      ],
    }),
    defineField({
      name: 'values',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'title', type: 'string'},
            {name: 'description', type: 'text'},
          ],
        },
      ],
    }),
    defineField({name: 'team', type: 'array', of: [{type: 'reference', to: [{type: 'person'}]}]}),
    defineField({
      name: 'partners',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'partner'}]}],
    }),
  ],
})
