import {defineType, defineField} from 'sanity'

// homeContent.ts — singleton
export const homeContent = defineType({
  name: 'homeContent',
  title: 'Home',
  type: 'document',
  fields: [
    defineField({name: 'heroHeading', type: 'string'}),
    defineField({name: 'heroLede', type: 'text', rows: 3}),
    defineField({
      name: 'heroImages',
      title: 'Hero slideshow images',
      description:
        'Optional. When set, the homepage hero rotates through these images on the right-hand panel. Leave empty to use the featured event cover as a static image.',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {name: 'alt', title: 'Alt text', type: 'string'},
            {name: 'label', title: 'Internal label (optional)', type: 'string'},
          ],
        },
      ],
    }),
    defineField({name: 'featuredEvent', type: 'reference', to: [{type: 'event'}]}),
    defineField({
      name: 'quote',
      type: 'object',
      fields: [
        {name: 'text', type: 'text'},
        {name: 'attribution', type: 'reference', to: [{type: 'person'}]},
      ],
    }),
  ],
})
