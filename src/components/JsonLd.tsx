/** Renders JSON-LD as a server-rendered script tag. */
export function JsonLd({data}: {data: Record<string, unknown>}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{__html: JSON.stringify(data)}}
    />
  )
}
