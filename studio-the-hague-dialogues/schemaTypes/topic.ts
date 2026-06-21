import {defineType, defineField} from 'sanity'

// topic.ts — taxonomy, single source of truth
export const topic = defineType({
  name: 'topic',
  title: 'Topic',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'slug', type: 'slug', options: {source: 'title'}}),
  ],
  preview: {select: {title: 'title'}},
})
