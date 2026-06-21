import {defineType, defineField} from 'sanity'

// partner.ts
export const partner = defineType({
  name: 'partner',
  title: 'Partner',
  type: 'document',
  fields: [
    defineField({name: 'name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'logo', type: 'image'}),
    defineField({name: 'url', type: 'url'}),
  ],
  preview: {select: {title: 'name', media: 'logo'}},
})
