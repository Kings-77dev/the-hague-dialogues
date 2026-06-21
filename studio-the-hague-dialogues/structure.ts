import type {StructureResolver} from 'sanity/structure'

// Singletons: one editable document each, with a fixed id.
const SINGLETONS = [
  {id: 'siteSettings', type: 'siteSettings', title: 'Site settings'},
  {id: 'homeContent', type: 'homeContent', title: 'Home'},
  {id: 'aboutContent', type: 'aboutContent', title: 'About'},
] as const

export const singletonTypes = new Set<string>(SINGLETONS.map((s) => s.type))

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      ...SINGLETONS.map((singleton) =>
        S.listItem()
          .title(singleton.title)
          .id(singleton.id)
          .child(S.document().schemaType(singleton.type).documentId(singleton.id)),
      ),
      S.divider(),
      // Everything else uses the default document-type list.
      ...S.documentTypeListItems().filter(
        (item) => !singletonTypes.has(item.getId() as string),
      ),
    ])
