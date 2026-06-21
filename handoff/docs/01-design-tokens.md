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
