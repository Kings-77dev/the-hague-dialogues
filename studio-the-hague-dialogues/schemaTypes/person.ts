import {defineType, defineField} from 'sanity'

// person.ts — LINCHPIN: speakers, authors, team all reference this
export const person = defineType({
  name: 'person',
  title: 'Person',
  type: 'document',
  fields: [
    defineField({name: 'name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'slug', type: 'slug', options: {source: 'name'}}),
    defineField({name: 'role', title: 'Role / affiliation', type: 'string'}),
    defineField({name: 'bio', type: 'array', of: [{type: 'block'}]}),
    defineField({name: 'photo', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'isCutout',
      title: 'Photo is a prepared cut-out',
      type: 'boolean',
      description:
        'True only if photo is a clean white-stroke-ready cut-out (see design rules 02-D).',
      initialValue: false,
    }),
    defineField({name: 'isTeam', title: 'Show on About team', type: 'boolean', initialValue: false}),
  ],
  preview: {select: {title: 'name', subtitle: 'role', media: 'photo'}},
})
