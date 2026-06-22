import {PortableText, type PortableTextComponents} from '@portabletext/react'
import type {SanityImageSource} from '@sanity/image-url'
import Link from 'next/link'
import {SanityImage} from './SanityImage'

// TypeGen produces a stricter block-array type than @portabletext/react
// expects. Accept the generated shape as a loose array and let PortableText
// dispatch on `_type`.
type AnyBlocks = readonly unknown[]

type PullquoteValue = {text?: string}
// SanityImageSource covers the full block shape (asset ref + hotspot/crop).
type InlineImageValue = SanityImageSource & {alt?: string; caption?: string}
type LinkMarkValue = {href?: string}

const components: PortableTextComponents = {
  marks: {
    link: ({value, children}) => {
      const href: string = (value as LinkMarkValue)?.href ?? '#'
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
    pullquote: ({value}) => {
      const v = value as PullquoteValue
      return <div className="pullquote">“{v?.text ?? ''}”</div>
    },
    image: ({value}) => {
      const v = value as InlineImageValue
      return (
        <figure>
          <div className="prose-image-wrap">
            <SanityImage
              image={v}
              alt={v?.alt ?? ''}
              sizes="(max-width: 1000px) 100vw, 720px"
            />
          </div>
          {v?.caption && <figcaption>{v.caption}</figcaption>}
        </figure>
      )
    },
  },
}

/** Faithful prototype `.prose` Portable Text renderer (used by event + article). */
export function Prose({value}: {value: AnyBlocks | undefined | null}) {
  if (!value || value.length === 0) return null
  return (
    <div className="prose">
      {/* PortableText is strictly typed against its own Block type; the generated
          type from sanity.types.ts is structurally identical but not identical-by-name. */}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <PortableText value={value as any} components={components} />
    </div>
  )
}
