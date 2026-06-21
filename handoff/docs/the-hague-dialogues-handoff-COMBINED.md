# The Hague Dialogues — Complete Handoff (combined)

*This is all handoff files concatenated for convenience. They are also available split (00–07). References to other files map to the matching `##`/section below.*

---

# The Hague Dialogues — Build Plan & Handoff

This is the entry point for rebuilding **The Hague Dialogues** website from the approved HTML prototypes into a production stack. Read this file first, then the companion files referenced below.

## Companion files (read in this order)
1. `00-build-plan.md` — this file: stack, staged process, standing rules.
2. `01-design-tokens.md` — colors, type, spacing, radius → Tailwind v4 theme.
3. `02-design-rules.md` — **cleanup rules** to apply during the build (eyebrows, CTA verb, donate placement, cut-out portraits). The prototypes were NOT edited; these rules supersede them.
4. `03-component-inventory.md` — every component, its props, states, and interactions.
5. `04-sanity-schema.md` — paste-ready `defineType` schemas.
6. `05-groq-queries.md` — paste-ready per-page GROQ queries.
7. `06-pages-and-routing.md` — route map, per-page composition, SEO.
8. `07-images.md` — Sanity image pipeline + `next/image` rules.

The approved visual reference is the set of prototype HTML files (`the-hague-dialogues-*.html`). Match their layout and feel, **as modified by `02-design-rules.md`**. The prototypes use inline base64 images and a hash router purely for prototyping — neither is part of the real build.

## Stack
- **Next.js 16** (App Router), **React + TypeScript**
- **Tailwind CSS v4** — CSS-first config via `@theme` in `globals.css` (no `tailwind.config.ts` theme block unless a plugin requires it)
- **Motion** (`motion`, import from `motion/react`, v12) for animation
- **Sanity** (hosted dataset + embedded Studio at `/studio`)
- **Vercel** for hosting
- Fonts: **Montserrat** (700/800/900, display) + **DM Sans** (400/500/700, body) via `next/font/google`

## Standing rules — apply at EVERY stage, no exceptions
These are acceptance criteria for every component and page you build. Do not defer them to a "polish" stage.

### Mobile responsive
- Mobile-first. Design works from 360px up. Verify at 360, 768, 1024, 1440.
- No horizontal scroll at any width. Tap targets ≥ 44×44px.
- Specific reflows are noted per component in `03-component-inventory.md` (e.g. the event register module moves above content on mobile).

### Accessibility (target WCAG 2.1 AA)
- Semantic landmarks: one `<header>`, `<main>`, `<footer>`; headings in order (one `<h1>` per page).
- All interactive elements keyboard-reachable with a **visible focus ring** (do not remove outlines without a replacement).
- Color contrast ≥ 4.5:1 for body text, 3:1 for large text. The navy/cream and navy/white pairings pass; verify any muted text on navy.
- Every image has meaningful `alt` (or `alt=""` if decorative). Icon-only buttons get `aria-label`.
- The FAQ uses native `<details>`/`<summary>` (already accessible). Any custom disclosure needs `aria-expanded`.
- Form fields have associated `<label>`s. The contact `<select>` and inputs are labeled.
- Respect `prefers-reduced-motion`: gate all non-essential motion behind it (see Animation).

### Animation (Motion) — apply where appropriate, never gratuitous
- **Button/link hovers:** subtle. CTA buttons darken/lift; text links shift their arrow (`→`) ~4px and/or underline. ~150–250ms, ease-out. These are CSS transitions, not Motion.
- **Page-load / on-scroll reveal:** section content fades+rises (~16–24px, ~400–500ms, ease-out, staggered for grids ~60–80ms). Use Motion's `whileInView` with `viewport={{ once: true }}`.
- **Page transitions:** a short cross-fade between routes is acceptable; keep it under ~300ms and never block content.
- **Card hover reveals** (event poster cards): the title/CTA reveal already specified in `03`. Keep transitions ~300–400ms.
- **Image hovers:** scene-photo tiles scale ~1.03–1.05 on hover, clipped by overflow.
- **Reduced motion:** when `prefers-reduced-motion: reduce`, disable transforms/reveals — content appears immediately at its final state. Motion components must keep at leaves so server components stay server components; wrap with a small client `<Reveal>` helper that reads the media query.

### Verify in-browser at every stage (required)
After building each stage, **run the app and inspect it in Chrome** before moving on:
- Start the dev server, open the built pages in Chrome.
- Visually compare against the matching prototype (corrected per `02-design-rules.md`).
- Check the responsive breakpoints above; check keyboard tab order and focus rings; confirm no console errors.
- Run an accessibility check (axe or Lighthouse) and fix AA issues before continuing.
- Do not proceed to the next stage with a broken or unverified current stage.

## Staged build process — do NOT build everything at once
Complete and verify each stage before starting the next. Commit at the end of each stage.

**Stage 1 — Scaffold.** Next.js 16 + TS + Tailwind v4 app. Fonts wired via `next/font`. `globals.css` with the `@theme` tokens from `01`. Base layout: `<Header>`, `<Footer>`, container, section primitives. Get a "hello" page rendering with correct fonts/colors. Verify in Chrome.

**Stage 2 — Design system & primitives.** Implement tokens → Tailwind theme, and the base components from `03` that have NO data dependency: Header (with the single CTA), Footer, `Container`, `Section` (navy/cream variants), `Eyebrow`, `Button`/`CtaLink`, `Tag`, the `Reveal` motion helper, and the `CutoutPortrait` wrapper. Build a `/styleguide` page rendering all of them. Verify in Chrome (responsive, focus, contrast, reduced-motion).

**Stage 3 — Sanity schema & Studio.** Add schemas from `04`, mount Studio at `/studio`, wire the Sanity client + image-URL builder (`07`). Seed 2–3 of each core document (`person`, `topic`, `venue`, `event`, `article`, `mediaItem`) plus the singletons. Generate TypeScript types (Sanity TypeGen).

**Stage 4 — One vertical slice: Home, end to end.** Build the Home page against real Sanity data using the GROQ in `05`. This proves the whole chain (schema → query → typed data → components → animation → responsive → a11y). Verify thoroughly in Chrome. Treat this as the template for all other pages.

**Stage 5 — Remaining pages.** Build in this order, each fully (data + responsive + a11y + animation), verifying in Chrome after each: **Events** (Upcoming/Past/Community split) → **Event detail** → **News index** → **Article detail** → **Media index** → **About** → **Get Involved** → **Contact**. Routing/SEO per `06`.

**Stage 6 — Polish & ship.** Cross-page QA, Lighthouse (perf + a11y + SEO) ≥ 90, OG/metadata, sitemap/robots, 404, redirects, Vercel deploy + Sanity production dataset. Final Chrome pass at all breakpoints.

## Definition of done (per page)
Real data from Sanity · matches prototype (corrected per `02`) · responsive 360–1440 · keyboard-navigable with visible focus · AA contrast · meaningful alt text · appropriate motion that respects reduced-motion · no console errors · verified in Chrome.
# 01 — Design Tokens (Tailwind v4, CSS-first)

All tokens come from the approved prototype. Implement with Tailwind v4's **CSS-first** approach: declare them in `@theme` inside `globals.css`. No `tailwind.config.ts` theme block. Token names below become utilities automatically (e.g. `--color-navy` → `bg-navy`, `text-navy`).

## globals.css

```css
@import "tailwindcss";

@theme {
  /* ---- Color ---- */
  --color-navy:   #07111d;  /* primary surface, ink on light */
  --color-navy-2: #0e263a;  /* raised navy (cards on navy) */
  --color-navy-3: #17293d;  /* hover navy */
  --color-ink:    #0b1f33;  /* body text on light */
  --color-cream:  #f4f1eb;  /* primary light surface */
  --color-paper:  #ebe9e3;  /* secondary light surface */
  --color-white:  #fffaf2;  /* warm white (NOT pure #fff) */
  --color-muted:  #768393;  /* muted labels/meta */
  /* line: use as border color via arbitrary or a component class */
  --color-line:   rgb(11 31 51 / 0.16);

  /* ---- Type families ---- */
  --font-display: "Montserrat", system-ui, sans-serif; /* 700/800/900 only */
  --font-body:    "DM Sans", system-ui, sans-serif;     /* 400/500/700 */

  /* ---- Radius ---- */
  --radius-sm: 2px;   /* default for buttons, inputs, chips */
  --radius-md: 3px;

  /* ---- Container ---- */
  --container-page: 1280px;

  /* ---- Shadow ---- */
  --shadow-float: 0 24px 70px rgb(0 0 0 / 0.24);
}

/* Base */
:root { color-scheme: dark; }
body { background: var(--color-navy); color: var(--color-white); font-family: var(--font-body); }
```

> Note on `--color-line`: Tailwind v4 maps `--color-*` into color utilities, so `border-line` works. Keep the rgb/alpha form.

## Typography scale & treatment
Display type is **Montserrat, very tight tracking, near-1.0 line-height, often uppercase**. This is the signature — keep it dense and confident; do not soften.

| Role | Family | Weight | Size (fluid) | Tracking | Line-height | Transform |
|---|---|---|---|---|---|---|
| Display XL (page H1) | display | 900 | `clamp(2.6rem, 5.5vw, 5rem)` | `-0.055em` | `0.96` | UPPERCASE |
| Display L (section H2) | display | 800–900 | `clamp(2rem, 3.6vw, 3.4rem)` | `-0.03em` | `1.0` | UPPERCASE or sentence |
| Heading M (card H3) | display | 900 | `clamp(1.4rem, 2.2vw, 2rem)` | `-0.02em` | `1.05` | sentence |
| Eyebrow / kicker | display | 800 | `0.72rem` | `0.2em–0.46em` | `1` | UPPERCASE |
| Lede | body | 400 | `clamp(1.05rem, 1.4vw, 1.3rem)` | normal | `1.55` | none |
| Body | body | 400 | `1.0–1.13rem` | normal | `1.6–1.72` | none |
| Meta / caption | body | 600–700 | `0.78–0.86rem` | `0.04em` | `1` | often UPPERCASE |

Implement these as a small set of component classes or a `Text`/`Heading` component rather than scattering arbitrary values. Suggested utility classes in `globals.css` via `@layer components`: `.display-xl`, `.display-l`, `.heading-m`, `.eyebrow`, `.lede`, `.meta`.

### Eyebrow `::after` rule
The eyebrow has a short underline rule. Keep it; align it to the text start (`left`/inline-start), width ~74px or 2.4em. On centered eyebrows, center the rule too.

## Spacing & layout
- **Container:** `width: min(var(--container-page), 100% - 4rem)`; centered. (32px gutters; tighten to 20–24px under 640px.)
- **Section padding:** `clamp(56px, 7vw, 96px)` vertical. Hero/page-head top padding must clear the 74px fixed header — use `~148px` top on page-heads (this was a real bug when omitted).
- **Grid gaps:** cards 22–26px; media tiles 24–34px.
- **Section rhythm:** alternate navy / cream bands. **Never place two same-colored bands adjacent** (re-check after removing donate bands per `02`).

## Buttons & controls (token-level)
- Primary (on light): `bg-navy text-white`, padding `~16px 28px`, `rounded-sm`, uppercase Montserrat 800, tracking `0.14em`; hover → `bg-navy-3`.
- Primary (on navy): `bg-cream text-navy`; hover → `#fff`.
- Outline (on navy): `border border-white/40 text-white`; hover → `bg-white/8`.
- Inputs: `bg-white text-ink border-line`, `rounded-sm`, focus → `border-navy` + 3px soft ring `rgb(7 17 29 / .06)`.
# 02 — Design Rules (apply during build; these supersede the prototypes)

The prototype HTML was intentionally **not** edited. Implement the design **as corrected by the rules below**. Where a prototype contradicts a rule here, this file wins.

## A. Eyebrows — use sparingly
The prototypes over-use the `EYEBROW / Big Heading` pattern (7–9 per page); at that density it stops being emphasis and becomes texture.

Rules:
- An eyebrow earns its place only when it **categorizes or orients** a major section (e.g. `Featured`, `Past dialogues`, `Volunteer roles`, `Upcoming events`).
- **Drop the eyebrow when it merely restates the heading.** Examples to remove: `Frequently asked` above a "Frequently asked…" heading; `Stay in the loop` above a "Stay in the loop" heading; `Questions` above "Good to know." Keep the big heading, drop the kicker.
- Target **≤ 4 eyebrows per page**.
- Never two eyebrows visible without substantial content between them.

## B. The support/donate ask — one clear path, not five
Today a single page can show the ask 4–5 times (header "Donate Now", footer "Give", a donate band, plus contextual cards). That over-asks and makes a civic/ideas foundation read as fundraising-first.

Rules:
- **Unify the verb to "Support"** everywhere — header button, footer link, and contextual CTAs all say **Support / Support us** (not a mix of "Donate Now" / "Give"). One word, one path. (The donation destination/label inside the flow can still say "Donate," but site navigation chrome uses "Support".)
- **Keep** the always-visible **header CTA** ("Support") and the **footer** link. Those are ambient and fine.
- **Remove the standalone donate/support band** from pages where it's just a default closer: **About, News index, Article detail, Event detail, Contact**.
- **Keep a contextual ask only where supporting is genuinely the point:** the **Home** page and the **Get Involved** "Donate" pathway card.
- Page-ending CTAs should be **contextually relevant**, not donate-by-default: Media ends on **"Suggest a topic"**, Event detail ends on **"Register"** (or "Watch recap" for past), Article ends on related reading, Contact ends on the form itself.
- After removing bands, re-check section color rhythm (no two same-colored bands adjacent).

## C. CTA verb/label consistency (becomes enum + button props)
Define one label per action; these map to Sanity enums and button variants:
- Support ask → **"Support"** (chrome) — see B.
- Upcoming event → **"Register"**
- Past event → **"Watch recap"** (video) / **"Read recap"** (text)
- Community/open call → **"Join the call"**
- Media item → **"Watch"** (video/reel) / **"View"** (photo series) / **"Read"** (interview/editorial)
- Topic suggestion → **"Suggest a topic"**
- Newsletter → **"Subscribe"**

Do not introduce synonyms ("Details", "Give", "Donate Now") in nav/cards; use the canonical labels above.

## D. Cut-out portraits — a portrait device, used sparingly
The white-stroke knockout portrait is the most distinctive asset. It must always depict an **identified real person**, never decoration.

Rules:
- **Where to use:** team cards (About), speaker cards (Event detail), author byline/avatar (Article), attributed pull-quotes. **One hero-scale cut-out per page maximum** beyond those card patterns (e.g. a single speaker in the Home hero or a featured speaker in an event hero) — only when a genuinely clean source photo exists.
- **Where NOT to use:** as background/texture; on scene-photography tiles (event/media grids stay full-bleed rectangles); as a faceless silhouette; repeated many times on one page.
- **Source requirement:** the effect only works with real, well-lit, separable photos. The prototype's gradient **silhouette placeholders are scaffolding only** — render a normal photo (or omit) rather than ship a silhouette. The client (Kingsford) will supply cut-out-ready images per use; build `CutoutPortrait` to accept a prepared image and apply the white-stroke treatment, with a graceful fallback to a plain framed photo when no cut-out asset is provided.

## E. Get Involved & Media — build the merged/mock-aligned versions
- **Media:** split intro (heading left, recap photo with overlaid quote card right), toolbar (search + format pills + All-topics + Sort-by — visual controls that become real GROQ filters, see `05`), `Featured` banner with "Watch", caption-row tiles (badge on image; title + date·duration below), and the cream **"Have a topic…"** CTA. Format pills: All / Interviews / Debates / Panels / Photo series (no Podcast). Use **distinct** items (the mock's duplicated tiles were placeholder).
- **Get Involved:** hero "Be part of the dialogue" → "How you can help" cream cards on navy with filled buttons (Volunteer/Apply now · Donate/Support · Speak/Propose · Partner/Get in touch) → Volunteer roles band (Events/Comms/Research/Design) → "Stay in the loop" newsletter → "Frequently asked" interactive FAQ styled as a clean open list. **Only one newsletter form per page** — since the footer already has one, drop the in-page "Stay in the loop" form OR drop the footer newsletter on this page (keep one). Recommended: keep the in-page "Stay in the loop", suppress the footer newsletter block on Get Involved.

## F. Keep (do not "fix")
- The dense, tight, confident display type and uppercase treatment — this is the brand through-line.
- The alternating navy/cream band system.
- The warm white (`#fffaf2`), not pure white.
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
# 04 — Sanity Schema (paste-ready)

TypeScript schema using `defineType`/`defineField`. Model **entities**, let pages compose them; references are the single source of truth (a `person` exists once, referenced by events/articles/team). Generate types with Sanity TypeGen after adding these.

Structure: `schemaTypes/index.ts` exports an array of all types. Singletons (`siteSettings`, `homeContent`, `aboutContent`) are enforced single via Structure Builder (one editable doc each).

## Reference / taxonomy documents

```ts
// person.ts — LINCHPIN: speakers, authors, team all reference this
import {defineType, defineField} from 'sanity'

export const person = defineType({
  name: 'person', title: 'Person', type: 'document',
  fields: [
    defineField({name: 'name', type: 'string', validation: r => r.required()}),
    defineField({name: 'slug', type: 'slug', options: {source: 'name'}}),
    defineField({name: 'role', title: 'Role / affiliation', type: 'string'}),
    defineField({name: 'bio', type: 'array', of: [{type: 'block'}]}),
    defineField({name: 'photo', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'isCutout', title: 'Photo is a prepared cut-out', type: 'boolean',
      description: 'True only if photo is a clean white-stroke-ready cut-out (see design rules 02-D).',
      initialValue: false,
    }),
    defineField({name: 'isTeam', title: 'Show on About team', type: 'boolean', initialValue: false}),
  ],
  preview: {select: {title: 'name', subtitle: 'role', media: 'photo'}},
})
```

```ts
// topic.ts — taxonomy, single source of truth
export const topic = defineType({
  name: 'topic', title: 'Topic', type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: r => r.required()}),
    defineField({name: 'slug', type: 'slug', options: {source: 'title'}}),
  ],
  preview: {select: {title: 'title'}},
})
```

```ts
// venue.ts
export const venue = defineType({
  name: 'venue', title: 'Venue', type: 'document',
  fields: [
    defineField({name: 'name', type: 'string', validation: r => r.required()}),
    defineField({name: 'addressLine', type: 'string'}),
    defineField({name: 'city', type: 'string', initialValue: 'The Hague'}),
  ],
  preview: {select: {title: 'name', subtitle: 'city'}},
})
```

```ts
// partner.ts
export const partner = defineType({
  name: 'partner', title: 'Partner', type: 'document',
  fields: [
    defineField({name: 'name', type: 'string', validation: r => r.required()}),
    defineField({name: 'logo', type: 'image'}),
    defineField({name: 'url', type: 'url'}),
  ],
  preview: {select: {title: 'name', media: 'logo'}},
})
```

## Core content documents

```ts
// event.ts
export const event = defineType({
  name: 'event', title: 'Event', type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: r => r.required()}),
    defineField({name: 'slug', type: 'slug', options: {source: 'title'}, validation: r => r.required()}),
    defineField({name: 'topic', type: 'reference', to: [{type: 'topic'}]}),
    defineField({
      name: 'format', type: 'string',
      options: {list: ['Dialogue', 'Policy', 'Debate', 'Panel', 'Interview']},
    }),
    defineField({name: 'startsAt', title: 'Starts at', type: 'datetime', validation: r => r.required()}),
    defineField({name: 'endsAt', title: 'Ends at', type: 'datetime'}),
    defineField({name: 'venue', type: 'reference', to: [{type: 'venue'}]}),
    defineField({name: 'speakers', type: 'array', of: [{type: 'reference', to: [{type: 'person'}]}]}),
    defineField({name: 'coverImage', type: 'image', options: {hotspot: true}}),
    defineField({name: 'standfirst', title: 'Short intro', type: 'text', rows: 3}),
    defineField({name: 'body', title: 'About this dialogue', type: 'array', of: [{type: 'block'}]}),
    defineField({name: 'registrationUrl', type: 'url'}),
    defineField({name: 'entryNote', type: 'string', initialValue: 'Free · limited seats'}),
    defineField({name: 'recapUrl', title: 'Recap link (past)', type: 'url'}),
    defineField({name: 'recapType', type: 'string', options: {list: ['video', 'text']}}),
    defineField({name: 'isCommunity', title: 'Community / open call', type: 'boolean', initialValue: false}),
  ],
  preview: {select: {title: 'title', subtitle: 'startsAt', media: 'coverImage'}},
})
// Upcoming vs past is DERIVED from startsAt vs now (see GROQ), not a stored field.
```

```ts
// article.ts (News)
export const article = defineType({
  name: 'article', title: 'Article', type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: r => r.required()}),
    defineField({name: 'slug', type: 'slug', options: {source: 'title'}, validation: r => r.required()}),
    defineField({name: 'author', type: 'reference', to: [{type: 'person'}]}),
    defineField({name: 'topic', type: 'reference', to: [{type: 'topic'}]}),
    defineField({
      name: 'format', type: 'string',
      options: {list: ['Recap', 'Opinion', 'Announcement', 'Interview']},
    }),
    defineField({name: 'publishedAt', type: 'datetime', validation: r => r.required()}),
    defineField({name: 'standfirst', title: 'Standfirst', type: 'text', rows: 3}),
    defineField({name: 'coverImage', type: 'image', options: {hotspot: true}}),
    defineField({name: 'readingMinutes', type: 'number'}),
    defineField({name: 'featured', type: 'boolean', initialValue: false}),
    defineField({name: 'body', type: 'array', of: [
      {type: 'block', styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'Quote', value: 'blockquote'},
      ]},
      {type: 'image', options: {hotspot: true}, fields: [{name: 'caption', type: 'string'}]},
      {name: 'pullquote', type: 'object', title: 'Pull quote', fields: [
        {name: 'text', type: 'text'},
        {name: 'attribution', type: 'reference', to: [{type: 'person'}]},
      ]},
    ]}),
    defineField({name: 'relatedEvent', type: 'reference', to: [{type: 'event'}]}),
  ],
  preview: {select: {title: 'title', subtitle: 'format', media: 'coverImage'}},
})
```

```ts
// mediaItem.ts
export const mediaItem = defineType({
  name: 'mediaItem', title: 'Media item', type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: r => r.required()}),
    defineField({name: 'slug', type: 'slug', options: {source: 'title'}}),
    defineField({
      name: 'format', type: 'string', validation: r => r.required(),
      options: {list: ['Video', 'Interview', 'Debate', 'Panel', 'Photo series']},
    }),
    defineField({name: 'thumbnail', type: 'image', options: {hotspot: true}, validation: r => r.required()}),
    defineField({name: 'topic', type: 'reference', to: [{type: 'topic'}]}),
    defineField({name: 'people', type: 'array', of: [{type: 'reference', to: [{type: 'person'}]}]}),
    defineField({name: 'publishedAt', type: 'datetime', validation: r => r.required()}),
    defineField({name: 'durationLabel', title: 'Duration / count', type: 'string', description: 'e.g. "24:26" or "16 Photos"'}),
    defineField({name: 'url', title: 'External/watch URL', type: 'url'}),
    defineField({name: 'featured', type: 'boolean', initialValue: false}),
    defineField({name: 'relatedEvent', type: 'reference', to: [{type: 'event'}]}),
  ],
  preview: {select: {title: 'title', subtitle: 'format', media: 'thumbnail'}},
})
```

## Singletons (thin; REFERENCE, don't duplicate)

```ts
// siteSettings.ts
export const siteSettings = defineType({
  name: 'siteSettings', title: 'Site settings', type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', initialValue: 'The Hague Dialogues'}),
    defineField({name: 'tagline', type: 'string'}),
    defineField({name: 'supportUrl', title: 'Support/donate URL', type: 'url'}),
    defineField({name: 'email', type: 'string'}),
    defineField({name: 'instagramUrl', type: 'url'}),
    defineField({name: 'linkedinUrl', type: 'url'}),
    defineField({name: 'defaultOgImage', type: 'image'}),
  ],
})

// homeContent.ts
export const homeContent = defineType({
  name: 'homeContent', title: 'Home', type: 'document',
  fields: [
    defineField({name: 'heroHeading', type: 'string'}),
    defineField({name: 'heroLede', type: 'text', rows: 3}),
    defineField({name: 'featuredEvent', type: 'reference', to: [{type: 'event'}]}),
    defineField({name: 'quote', type: 'object', fields: [
      {name: 'text', type: 'text'},
      {name: 'attribution', type: 'reference', to: [{type: 'person'}]},
    ]}),
  ],
})

// aboutContent.ts
export const aboutContent = defineType({
  name: 'aboutContent', title: 'About', type: 'document',
  fields: [
    defineField({name: 'founding', title: 'Founding story', type: 'array', of: [{type: 'block'}]}),
    defineField({name: 'stats', type: 'array', of: [{type: 'object', fields: [
      {name: 'value', type: 'string'}, {name: 'label', type: 'string'},
    ]}]}),
    defineField({name: 'values', type: 'array', of: [{type: 'object', fields: [
      {name: 'title', type: 'string'}, {name: 'description', type: 'text'},
    ]}]}),
    defineField({name: 'team', type: 'array', of: [{type: 'reference', to: [{type: 'person'}]}]}),
    defineField({name: 'partners', type: 'array', of: [{type: 'reference', to: [{type: 'partner'}]}]}),
  ],
})
```

```ts
// index.ts
export const schemaTypes = [
  person, topic, venue, partner,         // reference/taxonomy
  event, article, mediaItem,             // core content
  siteSettings, homeContent, aboutContent, // singletons
]
```
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
