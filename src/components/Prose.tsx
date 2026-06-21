import {PortableText, type PortableTextComponents} from '@portabletext/react'
import Link from 'next/link'
import {SanityImage} from './SanityImage'

// TypeGen produces a stricter block type than @portabletext/react expects;
// accept the generated shape as unknown-typed and pass through.
type AnyBlocks = readonly unknown[]

const components: PortableTextComponents = {
  marks: {
    link: ({value, children}) => {
      const href: string = value?.href ?? '#'
      const external = /^https?:\/\//.test(href)
      return external ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ) : (
        <Link href={href}>{children}</Link>
      )
    },
  },
  types: {
    pullquote: ({value}) => (
      <div className="pullquote">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        “{(value as any)?.text ?? ''}”
      </div>
    ),
    image: ({value}) => (
      <figure>
        <div className="relative" style={{aspectRatio: '16/9'}}>
          <SanityImage
            image={value}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            alt={(value as any)?.alt ?? ''}
            sizes="(max-width: 1000px) 100vw, 720px"
          />
        </div>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {(value as any)?.caption && <figcaption>{(value as any).caption}</figcaption>}
      </figure>
    ),
  },
}

/** Faithful prototype `.prose` Portable Text renderer (used by event + article). */
export function Prose({value}: {value: AnyBlocks | undefined | null}) {
  if (!value || value.length === 0) return null
  return (
    <div className="prose">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <PortableText value={value as any} components={components} />
    </div>
  )
}
