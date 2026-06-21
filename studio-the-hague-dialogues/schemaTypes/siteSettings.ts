import {defineType, defineField} from 'sanity'

// siteSettings.ts — singleton
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', initialValue: 'The Hague Dialogues'}),
    defineField({name: 'tagline', type: 'string'}),
    defineField({name: 'supportUrl', title: 'Support/donate URL', type: 'url'}),
    defineField({name: 'email', type: 'string'}),
    defineField({name: 'instagramUrl', type: 'url'}),
    defineField({name: 'linkedinUrl', type: 'url'}),
    defineField({name: 'defaultOgImage', type: 'image'}),
  ],
})
