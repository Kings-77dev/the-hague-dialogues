# 07 — Images

The prototype's inline base64 images are **throwaway**. Production images come from Sanity's CDN and render through `next/image`.

## Pipeline
- Upload images to Sanity (assets). Enable `hotspot: true` on image fields (done in `04`).
- Build URLs with **`@sanity/image-url`**:
  ```ts
  import imageUrlBuilder from '@sanity/image-url'
  import {client} from '@/sanity/client'
  const builder = imageUrlBuilder(client)
  export const urlFor = (src) => builder.image(src)
  // usage: urlFor(coverImage).width(1600).height(1000).fit('crop').auto('format').url()
  ```
- Render through **`next/image`** with explicit `sizes`. Add a custom loader (or use the Sanity URL directly as `src` with `unoptimized={false}` via a remote pattern) so Next can serve responsive sizes. Configure `images.remotePatterns` for `cdn.sanity.io`.

## Rules
- **Always** set `sizes` to match layout (e.g. 3-col grid → `(max-width:1000px) 50vw, 33vw`). Prevents oversized downloads.
- Respect the **hotspot** for crops (use it when cropping to fixed aspect ratios like 16:10 tiles, 16:6.x banners).
- LCP images (home hero, page covers, media feature) get `priority`.
- `auto('format')` for AVIF/WebP; quality ~80.
- Provide meaningful `alt` from the CMS where possible (add `alt` fields to images if editors will set them); never leave empty alt on content images.
- **Aspect ratios** (match prototype): event poster cards uniform tall (~3:4-ish, fixed 560px desktop height); media tiles 16:10; media feature 16:6.x; article/event cover `clamp(280px,42vw,520px)` tall; about/team cut-outs square frames.
- **Cut-out portraits:** only apply the white-stroke filter when `person.isCutout` is true and a clean asset is provided. Otherwise render a normal framed photo. Never synthesize a silhouette (02-D).
- Lazy-load below-the-fold images (default in `next/image`); avoid layout shift by always providing width/height or `fill` + sized container.

## Placeholder strategy during build
While seeding, use a few real cut-ready photos the client provides, plus neutral scene photos for tiles. Do not ship gradient silhouettes. If a `person` has no usable photo yet, render initials or omit the portrait rather than a faceless shape.
