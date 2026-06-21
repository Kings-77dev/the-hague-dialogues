import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure, singletonTypes} from './structure'

export default defineConfig({
  name: 'default',
  title: 'The Hague Dialogues',

  projectId: 'b2khcj7v',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
    // Hide singletons from the global "create new document" menu.
    templates: (templates) =>
      templates.filter(({schemaType}) => !singletonTypes.has(schemaType)),
  },

  document: {
    // Remove "duplicate" / "delete" actions for singleton documents.
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({action}) =>
            ['publish', 'discardChanges', 'restore'].includes(action ?? ''),
          )
        : input,
  },
})
