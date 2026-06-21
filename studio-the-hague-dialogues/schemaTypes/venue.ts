import {defineType, defineField} from 'sanity'

// venue.ts
export const venue = defineType({
  name: 'venue',
  title: 'Venue',
  type: 'document',
  fields: [
    defineField({name: 'name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'addressLine', type: 'string'}),
    defineField({name: 'city', type: 'string', initialValue: 'The Hague'}),
  ],
  preview: {select: {title: 'name', subtitle: 'city'}},
})
