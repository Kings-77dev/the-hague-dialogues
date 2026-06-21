# 05 — GROQ Queries (per page, paste-ready)

Use `next-sanity`'s `defineQuery` so TypeGen types these. `$now` = `new Date().toISOString()`. Reusable projection fragments first.

## Fragments
```groq
// image ref (resolve URL client-side via @sanity/image-url; keep asset + hotspot)
"img": { "ref": coverImage.asset._ref, "alt": coverImage.alt, "hotspot": coverImage.hotspot }

// person projection
"personLite": { _id, name, role, "photo": photo, "isCutout": isCutout }
```

## Home
```ts
export const HOME_QUERY = defineQuery(`{
  "home": *[_type == "homeContent"][0]{
    heroHeading, heroLede,
    quote{ text, attribution->{name, role} },
    featuredEvent->{ _id, title, slug, startsAt, "topic": topic->title, coverImage }
  },
  "upcoming": *[_type == "event" && !isCommunity && startsAt >= $now] | order(startsAt asc)[0...3]{
    _id, title, slug, startsAt, "topic": topic->title, format, coverImage,
    "venue": venue->name
  },
  "latestNews": *[_type == "article"] | order(publishedAt desc)[0...3]{
    _id, title, slug, publishedAt, "topic": topic->title, format, coverImage
  },
  "media": *[_type == "mediaItem"] | order(publishedAt desc)[0...3]{
    _id, title, slug, format, thumbnail, durationLabel, url
  }
}`)
```

## Events (Upcoming / Past / Community split — derived from time)
```ts
export const EVENTS_QUERY = defineQuery(`{
  "upcoming": *[_type == "event" && !isCommunity && startsAt >= $now] | order(startsAt asc){
    _id, title, slug, startsAt, "topic": topic->title, format, coverImage, "venue": venue->name
  },
  "past": *[_type == "event" && !isCommunity && startsAt < $now] | order(startsAt desc){
    _id, title, slug, startsAt, "topic": topic->title, coverImage, recapUrl, recapType
  },
  "community": *[_type == "event" && isCommunity] | order(startsAt desc)[0...1]{
    _id, title, slug
  }
}`)
```

## Event detail
```ts
export const EVENT_BY_SLUG_QUERY = defineQuery(`*[_type == "event" && slug.current == $slug][0]{
  _id, title, startsAt, endsAt, entryNote, registrationUrl, recapUrl, recapType, standfirst,
  "topic": topic->title, format, coverImage, body,
  "venue": venue->{ name, addressLine, city },
  "speakers": speakers[]->{ _id, name, role, photo, isCutout },
  "related": *[_type == "event" && _id != ^._id && topic._ref == ^.topic._ref] | order(startsAt desc)[0...3]{
    _id, title, slug, startsAt, "topic": topic->title, coverImage
  }
}`)
// Page decides upcoming vs past by comparing startsAt to now → RegisterModule vs Watch-recap state.
```

## News index (with optional format filter)
```ts
export const NEWS_QUERY = defineQuery(`{
  "featured": *[_type == "article" && featured == true] | order(publishedAt desc)[0]{
    _id, title, slug, standfirst, publishedAt, "topic": topic->title, format, coverImage, readingMinutes
  },
  "articles": *[_type == "article" && (!defined($format) || format == $format)] | order(publishedAt desc)[0...$limit]{
    _id, title, slug, publishedAt, "topic": topic->title, format, coverImage
  },
  "total": count(*[_type == "article" && (!defined($format) || format == $format)])
}`)
```

## Article detail
```ts
export const ARTICLE_BY_SLUG_QUERY = defineQuery(`*[_type == "article" && slug.current == $slug][0]{
  _id, title, standfirst, publishedAt, readingMinutes, "topic": topic->title, format, coverImage,
  "author": author->{ name, role, photo, isCutout, bio },
  body[]{ ..., _type == "pullquote" => { text, "attribution": attribution->{name, role} },
          _type == "image" => { ..., asset } },
  "related": *[_type == "article" && _id != ^._id && topic._ref == ^.topic._ref] | order(publishedAt desc)[0...3]{
    _id, title, slug, publishedAt, "topic": topic->title, coverImage
  }
}`)
```

## Media index (real filters behind the toolbar)
```ts
// $format: one of the format enums or null (All); $topic: topic slug or null; $sort: 'newest'|'oldest'
export const MEDIA_QUERY = defineQuery(`{
  "featured": *[_type == "mediaItem" && featured == true] | order(publishedAt desc)[0]{
    _id, title, slug, format, thumbnail, durationLabel, url, startsAtNote
  },
  "items": *[_type == "mediaItem"
      && (!defined($format) || format == $format)
      && (!defined($topic) || topic->slug.current == $topic)
    ] | order(select($sort == "oldest" => publishedAt asc, publishedAt desc)){
    _id, title, slug, format, thumbnail, durationLabel, url, publishedAt
  },
  "topics": *[_type == "topic"] | order(title asc){ _id, title, "slug": slug.current }
}`)
```

## About
```ts
export const ABOUT_QUERY = defineQuery(`*[_type == "aboutContent"][0]{
  founding, stats, values,
  "team": team[]->{ _id, name, role, photo, isCutout },
  "partners": partners[]->{ _id, name, logo, url }
}`)
```

## Site settings (layout — header/footer)
```ts
export const SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings"][0]{
  title, tagline, supportUrl, email, instagramUrl, linkedinUrl, defaultOgImage
}`)
```

## Notes
- **Upcoming/past is always derived** from `startsAt` vs `$now`; never a stored status. Keep `$now` fresh per request (don't over-cache time-sensitive lists — use a short `revalidate` or `dynamic` for the events pages).
- Resolve images via `@sanity/image-url` from the returned asset refs (see `07`).
- Filters in the Media toolbar and News tabs pass `$format`/`$topic`/`$sort` — wire them to URL search params so they're shareable and SSR-friendly.
