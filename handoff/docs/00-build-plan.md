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
