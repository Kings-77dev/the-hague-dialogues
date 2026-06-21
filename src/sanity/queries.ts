import {defineQuery} from 'next-sanity'

// $now = new Date().toISOString(); upcoming/past is always DERIVED from startsAt vs now.

export const HOME_QUERY = defineQuery(`{
  "home": *[_type == "homeContent"][0]{
    heroHeading, heroLede,
    quote{ text, attribution->{name, role} },
    featuredEvent->{ _id, title, slug, startsAt, "topic": topic->title, coverImage, "venue": venue->name }
  },
  "upcoming": *[_type == "event" && !isCommunity && startsAt >= $now] | order(startsAt asc)[0...3]{
    _id, title, slug, startsAt, "topic": topic->title, format, coverImage,
    "venue": venue->name
  },
  "latestNews": *[_type == "article"] | order(publishedAt desc)[0...3]{
    _id, title, slug, publishedAt, standfirst, "topic": topic->title, format, coverImage
  },
  "media": *[_type == "mediaItem"] | order(publishedAt desc)[0...5]{
    _id, title, slug, format, thumbnail, durationLabel, url
  }
}`)

export const EVENTS_QUERY = defineQuery(`{
  "upcoming": *[_type == "event" && !isCommunity && startsAt >= $now] | order(startsAt asc){
    _id, title, slug, startsAt, "topic": topic->title, format, coverImage, "venue": venue->name
  },
  "past": *[_type == "event" && !isCommunity && startsAt < $now] | order(startsAt desc){
    _id, title, slug, startsAt, "topic": topic->title, format, "venue": venue->name, coverImage, recapUrl, recapType
  },
  "community": *[_type == "event" && isCommunity] | order(startsAt desc)[0...1]{
    _id, title, slug
  }
}`)

export const EVENT_BY_SLUG_QUERY = defineQuery(`*[_type == "event" && slug.current == $slug][0]{
  _id, title, startsAt, endsAt, entryNote, registrationUrl, recapUrl, recapType, standfirst,
  "topic": topic->title, format, coverImage, body,
  "venue": venue->{ name, addressLine, city },
  "speakers": speakers[]->{ _id, name, role, photo, isCutout },
  "related": *[_type == "event" && _id != ^._id && topic._ref == ^.topic._ref] | order(startsAt desc)[0...3]{
    _id, title, slug, startsAt, "topic": topic->title, coverImage
  }
}`)

export const NEWS_QUERY = defineQuery(`{
  "featured": *[_type == "article" && featured == true] | order(publishedAt desc)[0]{
    _id, title, slug, standfirst, publishedAt, "topic": topic->title, format, coverImage, readingMinutes,
    "author": author->{ name }
  },
  "articles": *[_type == "article" && (!defined($format) || format == $format)] | order(publishedAt desc)[0...$limit]{
    _id, title, slug, publishedAt, standfirst, "topic": topic->title, format, coverImage
  },
  "total": count(*[_type == "article" && (!defined($format) || format == $format)])
}`)

export const ARTICLE_BY_SLUG_QUERY = defineQuery(`*[_type == "article" && slug.current == $slug][0]{
  _id, title, standfirst, publishedAt, readingMinutes, "topic": topic->title, format, coverImage,
  "author": author->{ name, role, photo, isCutout, bio },
  body[]{ ..., _type == "pullquote" => { text, "attribution": attribution->{name, role} },
          _type == "image" => { ..., asset } },
  "related": *[_type == "article" && _id != ^._id && topic._ref == ^.topic._ref] | order(publishedAt desc)[0...3]{
    _id, title, slug, publishedAt, "topic": topic->title, coverImage
  }
}`)

// $format: one of the format enums or null (All); $topic: topic slug or null; $sort: 'newest'|'oldest'
export const MEDIA_QUERY = defineQuery(`{
  "featured": *[_type == "mediaItem" && featured == true] | order(publishedAt desc)[0]{
    _id, title, slug, format, thumbnail, durationLabel, url
  },
  "items": *[_type == "mediaItem"
      && (!defined($format) || format == $format)
      && (!defined($topic) || topic->slug.current == $topic)
    ] | order(
        select($sort == "oldest" => publishedAt) asc,
        select($sort != "oldest" => publishedAt) desc
      ){
    _id, title, slug, format, thumbnail, durationLabel, url, publishedAt
  },
  "topics": *[_type == "topic"] | order(title asc){ _id, title, "slug": slug.current }
}`)

export const ABOUT_QUERY = defineQuery(`*[_type == "aboutContent"][0]{
  founding, stats, values,
  "team": team[]->{ _id, name, role, photo, isCutout },
  "partners": partners[]->{ _id, name, logo, url }
}`)

export const SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings"][0]{
  title, tagline, supportUrl, email, instagramUrl, linkedinUrl, defaultOgImage
}`)

/** Slugs for sitemap.ts and generateStaticParams. */
export const SITEMAP_SLUGS_QUERY = defineQuery(`{
  "events": *[_type == "event" && !isCommunity && defined(slug.current)]{
    "slug": slug.current, _updatedAt
  },
  "articles": *[_type == "article" && defined(slug.current)]{
    "slug": slug.current, _updatedAt
  }
}`)
