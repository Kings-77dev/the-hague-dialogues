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
