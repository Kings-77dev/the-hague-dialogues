import {defineType, defineField} from 'sanity'

// homeContent.ts — singleton
export const homeContent = defineType({
  name: 'homeContent',
  title: 'Home',
  type: 'document',
  fields: [
    defineField({name: 'heroHeading', type: 'string'}),
    defineField({name: 'heroLede', type: 'text', rows: 3}),
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
