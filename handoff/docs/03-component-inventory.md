# 03 — Component Inventory

Each entry: purpose · key props · states/interactions · responsive · a11y. Build as typed React components. Motion lives at leaves (client components) so pages can stay server components; wrap reveals in `<Reveal>`.

## Primitives

### `Container`
Centers content at `min(1280px, 100% - 4rem)`. Prop: `as` (default `div`).

### `Section`
Full-bleed band. Props: `tone: 'navy' | 'cream' | 'paper'`, `padded?` (default true). Applies vertical `clamp(56px,7vw,96px)`. Enforces band rhythm (caller is responsible for not stacking same tones — see `02-A`).

### `Eyebrow`
Uppercase kicker + underline rule. Props: `children`, `align?: 'start' | 'center'`, `onDark?`. **Use sparingly** per `02-A`.

### `Heading` / `Text`
Typographic components implementing the scale in `01`. Props: `level` (h1–h3), `variant` ('display-xl'|'display-l'|'heading-m'), `as`.

### `Button` / `CtaLink`
Props: `variant: 'primary-on-light' | 'primary-on-navy' | 'outline-on-navy'`, `href?`, `label`, `icon?` (default trailing `→`). **States:** hover (darken/lift; arrow nudges +4px), focus-visible ring, active. Renders `<a>` when `href`, else `<button>`. Labels come from the canonical set in `02-C`.

### `Tag` / `Badge`
Small uppercase label. Props: `children`, `tone` ('onImage' | 'solid' | 'muted'). Used for topic tags and media type badges (Video/Panel/Photo series/…).

### `Reveal` (client, Motion)
Wraps children; fades+rises into view. Props: `delay?`, `as?`. Uses `whileInView`, `viewport={{ once: true }}`, and **disables transform when `prefers-reduced-motion`**. Grids pass incremental `delay` for stagger (~60–80ms).

### `CutoutPortrait`
Renders the white-stroke knockout for a prepared cut-out image; **falls back to a plain framed photo** when no cut-out asset exists; never renders a faceless silhouette (see `02-D`). Props: `image` (Sanity image, possibly with `cutout: true` flag), `name`, `alt`.

## Chrome

### `Header` (fixed, 74px)
Logo line-mark (links home) · primary nav · single **Support** CTA button (per `02-B`). **States:** active nav link (underline), hover. **Mobile:** collapses to a hamburger → slide/fade panel with the nav + Support; trap focus when open, `aria-expanded`, Esc closes. Nav: Home, About, Events, Media, Get Involved, News, Contact.

### `Footer`
Wordmark + tagline · newsletter (Subscribe) · bottom nav · social (Instagram, LinkedIn) · **Support** link · legal line. **Rule:** only one newsletter per page — suppress this footer newsletter on Get Involved (which has its own) per `02-E`.

### `NewsletterForm`
Email input + Subscribe. Visual-only until a provider is wired; structure for real submission. Labeled input, inline validation later.

## Cards & content blocks

### `EventPosterCard`
Full-bleed event photo card with a **hover reveal**. Resting state shows a bottom titlebar (title). **On hover:** dark overlay fades in; the CTA button (top-right) slides in; the info block (title + location pill + date) rises. **Critical sizing:** all event cards must be the **same height (uniform `tall`, 560px desktop)** — non-uniform heights caused both a ragged grid and the title overlapping the button. Title in the reveal is capped so the longest titles never collide with the top-right button (the prototype's longest live title is 6 lines). Props: `event`, `status: 'upcoming' | 'past' | 'community'`. **Status styling:** upcoming = full color + "Register"; past = **desaturated image** + "Recap · date" chip + "Watch/Read recap"; community = handled as a CTA band, not a card (see Events page). Mobile: reveal content stacks; CTA remains tappable. a11y: the whole card is one link; reveal content must be readable without hover (it's present in DOM, not hover-injected).

### `ArticleCard`
Photo thumb + topic tag + title + date. Hover: image scale ~1.04, title underline. Used in News grid and "related" rails.

### `MediaTile`
Scene photo + **type badge on image** (top-left) + title and **caption row below** (date · duration / photo-count). Video/reel get a play affordance. Hover: image scale. a11y: badge text is real text; whole tile is a link with descriptive label.

### `MediaFeatureBanner`
Wide 16:6.x banner; play button center; title + meta overlaid bottom-left on a gradient; "Watch →" bottom-right. Mobile: meta stacks, drop the corner "Watch".

### `QuoteOverlayCard` (Media intro)
Dark translucent card over a recap photo: small wordmark + quote. (Distinct from a portrait pull-quote, which uses `CutoutPortrait`.)

### `PathwayCard` (Get Involved)
Cream card on navy: number + uppercase title + description + **filled button**. Props: `index`, `title`, `body`, `cta` (label+href). Hover: lift + shadow.

### `RoleItem` (Get Involved)
Top-rule + role name + description. 4-up grid.

### `StatBand` (About "by the numbers")
Large numerals + labels.

### `ValueItem` (About)
Openness · Respect · Rigour · Impact.

### `TeamCard` (About) / `SpeakerCard` (Event)
`CutoutPortrait` + name + role. Grid of 3–4.

### `RegisterModule` (Event detail) — sticky
Card with rows (Date / Time / Venue / Entry) + **Register** (primary) + **Add to calendar** (outline) + reassurance line. **Sticky** on desktop (`top: ~100px`). **Mobile: moves ABOVE the body content** (`order` change), not sticky. For past events, swap to a "Watch recap" state.

### `FaqAccordion`
Native `<details>`/`<summary>`, styled as a **clean open list** (no boxed chrome): bottom rules, `+` that rotates to `×` when open. First item may default open. Already accessible; keep semantics.

### `Toolbar` (Media)
Search field + format pills + "All topics" select + "Sort by" select. **These are real filters in production** (drive GROQ params per `05`), but render as the prototype shows. Pills are buttons with `aria-pressed`; selects are labeled.

### `CommunityCtaBand` (Events)
Cream band pulling the "open call" out of the event grid: eyebrow + title + "Join the call" button.

### `TopicCtaBand` (Media) / `ContactForm` (Contact)
TopicCta: cream band, heading + "Suggest a topic". ContactForm: name, email, inquiry-type `<select>` (General / Volunteering / Partnership / Speaking / Press), message, send. Labeled fields; real submission wired later.

## Prose / Portable Text renderer
Article and Event bodies are Portable Text. Implement serializers matching the prototype `.prose`: `h2`/`h3`, paragraph, `blockquote`, **pullquote** (custom block), unordered list, `figure` with caption, links (navy, underlined). Reading column max-width ~680px, body `1.13rem`/`1.7`. See `04` for the block types to support.
