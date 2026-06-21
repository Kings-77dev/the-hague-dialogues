# 06 — Pages, Routing & SEO

App Router routes. Each page lists its query (`05`) and the components it composes (`03`), corrected per `02`.

## Route map
| Route | Type | Query | Notes |
|---|---|---|---|
| `/` | static-ish (revalidate) | `HOME_QUERY` | hero, featured event, upcoming(3), latest news(3), media(3), quote |
| `/about` | static | `ABOUT_QUERY` | founding, stats, values, team, partners. **No support band** (02-B) |
| `/events` | dynamic (time) | `EVENTS_QUERY` | Upcoming + Community CTA band + Past sections |
| `/events/[slug]` | dynamic params | `EVENT_BY_SLUG_QUERY` | RegisterModule (upcoming) / Watch-recap (past). **No support band** |
| `/news` | revalidate + `?format=` | `NEWS_QUERY` | featured + filterable grid + load more |
| `/news/[slug]` | dynamic params | `ARTICLE_BY_SLUG_QUERY` | reading column, Portable Text, share rail, related. **No support band** |
| `/media` | revalidate + `?format=&topic=&sort=` | `MEDIA_QUERY` | split intro, toolbar (real filters), featured banner, grid, "Suggest a topic" |
| `/get-involved` | static | — (+ optional FAQ from CMS later) | pathways, roles, **one** newsletter, FAQ. Suppress footer newsletter here (02-E) |
| `/contact` | static | `SETTINGS_QUERY` | form + info. **No support band** |
| `/studio/[[...tool]]` | Sanity Studio | — | embedded Studio |

`generateStaticParams` for `/events/[slug]`, `/news/[slug]` (and media if it gets detail pages). Use `notFound()` for missing slugs.

## Per-page composition (key sections)
- **Home:** Hero (type; optional single `CutoutPortrait` if a clean asset exists, 02-D) → Upcoming events (3 `EventPosterCard`) → Quote (portrait pull-quote or wordmark overlay) → Latest news (3 `ArticleCard`) → Media strip (feature + tiles) → contextual Support CTA (Home is allowed one, 02-B) → Footer.
- **Events:** page-head → **Upcoming** `Section(navy)` with `EventPosterCard[status=upcoming]` → **Community** `CommunityCtaBand(cream)` → **Past** `Section(navy)` with desaturated `EventPosterCard[status=past]` + "Earlier sessions" archive list. All cards uniform height (03).
- **Event detail:** hero (back link, tag, title, date·time·venue) → cover → 2-col: body (`prose` + `SpeakerCard`s) / sticky `RegisterModule` → related. Mobile: register module first.
- **News:** page-head → featured article → format tabs (`?format=`) → `ArticleCard` grid → load more.
- **Article:** full-bleed hero (back, tag, title, standfirst, byline w/ `CutoutPortrait` avatar + reading time) → cover → sticky share rail + `prose` Portable Text → author bio → related.
- **Media:** split intro + `QuoteOverlayCard` → `Toolbar` → `Featured` `MediaFeatureBanner` → `MediaTile` grid → `TopicCtaBand`.
- **About:** hero → founding story → `StatBand` → values → team (`CutoutPortrait` cards) → partners.
- **Get Involved:** hero "Be part of the dialogue" → "How you can help" `PathwayCard` grid → `RoleItem` band → `NewsletterForm` ("Stay in the loop") → `FaqAccordion`. Footer newsletter suppressed.
- **Contact:** page-head → `ContactForm` + contact info (email, location, response-time, socials).

## SEO / metadata
- `generateMetadata` per route: title pattern `"{Page} — The Hague Dialogues"`; description from `standfirst`/`heroLede`/page intro.
- **OpenGraph/Twitter** images: use the doc `coverImage`/`thumbnail` (Sanity image URL at 1200×630) or `siteSettings.defaultOgImage` fallback.
- **JSON-LD:** `Event` schema on event detail (name, startDate, location, organizer); `Article` schema on article detail; `Organization` on home.
- `sitemap.ts` (dynamic from slugs) + `robots.ts`. Canonical URLs. `lang="en"`.
- Semantic headings, descriptive link text, `next/image` for LCP (priority on hero/cover).
