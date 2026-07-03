# Work Log — Sha Design Studio

A running record of notable work and follow-ups. Newest entries on top.

---

## 2026-07-03 — Services: process road, sticker cards, closing CTA

The four numbered services rendered as four unrelated boxes on a dead-end page.

- **Dotted process road** (S1): a self-drawing dotted connector (same
  pathLength-in-a-mask technique as the home JourneyPath) now draws in each gap
  between cards as it scrolls into view — 01→04 reads as one journey. Ink dots
  on the yellow canvas (orange-on-yellow is too weak). List gap tightened since
  the connectors carry the rhythm now. Reduced-motion: dots render statically.
- **Sticker cards** (S2): alternating ±0.6deg resting tilt that straightens with
  a lift on hover; one brand motif tucked over each card's top-right corner
  (daisy / star / heart / clover), tinted per card, with a gentle pop on hover.
- **Chip cascade** (S4): deliverable chips now spring-pop in a stagger — toys
  spilling out of the box. Reduced-motion: fade only.
- **Closing CTA band** (S5): the page no longer dead-ends at the expertise pills
  — it closes on the shared orange `CtaBand` ("Got a product itching to exist?"
  → /inquire). Page bottom padding removed so the band sits flush to the footer.
- **Expertise pills** (S6): static sticker tilts (via the motion target, not
  CSS, so hover straightens them cleanly).
- **Skipped S3** (index-in-a-shape badge): a coloured badge behind the number
  would put the index text on a new background and break its AA contrast on the
  dark/bright cards — the corner motifs already bring shape-play to each card,
  so this was dropped rather than risk the contrast.

### ⚠️ Question for Shiran (S7)
The `#02` "Product Design" card is a big black (ink) card. Your 07-02 homepage
feedback was that big black moments feel off-brand. It may be fine here as
page-level contrast between the orange/blue cards — but flagging it. Candidate
swap if you'd rather: `--color-orange-deep` or a deep-yellow card.

---

## 2026-07-03 — Refactor: shared CtaBand closing section

Extracted the homepage's orange finale band into a reusable
`src/components/sections/CtaBand.jsx` (+ `.css`), copy passed in as props. Home
now renders `<CtaBand …>` with its existing copy (no visual change); Services
and About reuse the same closing beat. The old `home-cta*` markup + CSS and the
`MOTIFS` inline-SVG map are gone. Motifs are now `<BrandShape>`.

---

## 2026-07-03 — Inquire: the conversion page joins the playroom

The plainest page — and the one the whole site funnels toward — now feels the
most like the brand (cream + orange is Shiran's signature combo).

- **Celebratory success state** (I1): a successful send now *replaces* the form
  (AnimatePresence) with a display-face orange "Thanks — Shiran will be in touch
  soon!" and a burst of 7 brand stickers that spring out from centre and settle
  with tilts. Reduced-motion: stickers render in their resting spots, no travel.
  `role="status"` preserved. Error state untouched.
- **Canvas motifs** (I2): daisy / star / clover drifting behind the content,
  `aria-hidden`, clear of the form and the pointer path; star + clover hidden
  under 768px; float gated by reduced-motion.
- **Title + copy** (I3): "Let's stay connected" → "Let's make something
  together", with a tulip popping in at the end like punctuation. Added a
  response-time reassurance line and a personality placeholder on the message
  textarea. Labels unchanged (a11y). *Placeholder copy — confirm with Shiran.*
- **Form card** (I4): resting −0.5deg tilt that straightens on `:focus-within`;
  a yellow flower hangs off the top-right corner, echoing the About "Hello!"
  flower so the two pages rhyme.
- **"Send Away" button** (I5): a daisy spins beside "Sending…" while submitting.
- **"What happens next"** (I6): three shape-bulleted reassurance steps fill the
  previously-empty left column. *Placeholder copy — confirm with Shiran.*
- **Custom checkbox** (I7): brand box that fills yellow with an ink check that
  springs in; native input kept in the DOM, focusable, focus ring preserved.

Follow-up: three copy strings above (reply-time, next-steps, title) need
Shiran's voice sign-off before launch.

---

## 2026-07-03 — Sub-page whimsy pass: shared BrandShape (Fable 5 audit)

Executing `docs/2026-07-03-subpage-whimsy-audit.md` — bringing Services / About /
Inquire up to the homepage's playroom register. Branch `feat/subpage-whimsy`.

- **`BrandShape` component** (`src/components/ui/BrandShape.jsx` + `.css`): the
  14-shape geometry registry (`GEO`), lifted out of `HeadlineMorph` into one
  shared, colour-agnostic source. Reuses the existing `inlineSvg` util (which is
  what `HeadlineMorph`'s local `prep()` duplicated) — that duplication is now
  gone. `HeadlineMorph` imports `GEO` from it; no behaviour change. Dumb by
  design: geometry only, `aria-hidden`, forwardRef so `motion.create()` can
  animate it. Every "motif" in the rest of this pass uses it.

---

## 2026-07-02 — Home: work-grid beat goes blue (client feedback)

- "Fresh from the studio" section's dominant accent switched orange → blue:
  heading + facts-ticker band now brand blue. Ticker flower separators
  re-tinted warm (yellow / orange-soft / cream) so none sit blue-on-blue.
- Page color rhythm now: cream hero → BLUE work+ticker → cream journey
  (orange road) → yellow What I Do → blue bubbles → orange finale.

---

## 2026-07-02 — Home: pure shapes + tint-ramp exploration (client feedback)

- Journey stops: emojis removed — the brand shapes stand alone. Client loves
  the hue variation, so the four markers now walk a deliberate tint ramp:
  yellow daisy → soft-blue clover → soft-orange heart → deep-yellow star.
- Same idea echoed in Kind Words: the mirrored reply bubble is blue-deep
  against the first bubble's brand blue — two different blues on purpose.
- Client direction to explore more hue/saturation play with blue/yellow/
  orange across the site — tint tokens (-soft/-deep) are the palette for it.

---

## 2026-07-02 — Home: bubble conversation + flower journey stops (client feedback)

- **Kind Words**: heading back to ink (client keeps black here), and a second
  **mirrored** speech bubble (right-aligned, flipped tail/tilt/quote-mark,
  right-aligned attribution) stacked under the first — reads as a
  conversation. Content is an explicit placeholder in `testimonials.js`
  (`placeholder-second`, "Your name here") until a real quote arrives; both
  quotes still need real content before launch.
- **Journey stops**: emoji-in-circle dots replaced with the brand shapes the
  client loves (same SVG set the hero morphs through): yellow daisy →
  blue clover → coral heart (Tiny Love) → yellow star (SHA, the /inquire
  link — lifts + spins on hover). Emoji rides inside each shape like the
  brand's flower badges. Dots grew to 84px (72px mobile), spine offsets
  adjusted.

---

## 2026-07-02 — Home: de-blacken the display layer (client feedback)

Client: the big black moments (ink ticker band, ink display headings, ink
journey rings) feel off-brand. Ink now stays body-text-only on the homepage;
the display layer speaks orange, per the guidelines ("orange = headings").

- FactsTicker band: ink → **orange**, cream display text (3.4:1 — legal for
  its ≥20px display type only), flower separators yellow/blue-soft/cream.
- Section headings on cream (Fresh from the studio / How I got here / Kind
  Words) → **orange**. "What I Do" stays ink on yellow — orange-on-yellow
  fails contrast and ink-on-yellow is the documented brand pair.
- Journey: dot rings + labels → orange-deep (labels bumped to 20px display
  so the 4.4:1 pair clears the large-text bar); details stay ink-soft.
- Button hovers that flipped to black pills now flip to orange (What I Do)
  and yellow/ink (CTA band).

---

## 2026-07-02 — Home: break the box-stack, cut redundancy

Client feedback: bottom half of the homepage read as "div after div" — six
identical full-width rounded panels with identical 96px gaps — plus a third
marquee and a stats panel repeating the ticker's facts.

- **Removed the wave TextPath marquee** (third marquee on one page) and
  **deleted StatBlocks** — its numbers folded into the FactsTicker
  (now: products / years / brands / giggles / process).
- **Journey redesigned off the yellow box onto the cream canvas**: a dotted
  orange play-road (SVG wave) that draws itself on scroll (pathLength inside a
  mask so the dots survive), stops pinned along it — captions below the dips,
  above the crests. Last stop (SHA Studio) is now a live link to `/inquire`.
  Mobile keeps the vertical dashed spine.
- **Kind Words is a blue speech bubble** (sticker tilt, tail, yellow display
  quote mark) on the canvas instead of another full panel. Attribution sits
  under the tail. Quote is still the known placeholder — client to supply.
- **Orange CTA moved to the end as a full-bleed finale band** (rounded
  shoulders, wobbling brand motifs from the shared SVG set) — the page's last
  word before the footer, instead of a mid-page box.
- **Section order now:** hero → logos → work grid → ink ticker → journey →
  What I Do → Kind Words → orange CTA. Color rhythm: cream / ink / cream /
  yellow / blue / orange — one dominant accent per beat, varied geometry
  (band / canvas / panel / bubble / full-bleed) instead of repeated boxes.
- Also wrote `PRODUCT.md` (register, principles) for design tooling.
- Follow-up: `npm run lint` fails repo-wide (ESLint can't find a config and
  wanders into `dist/`) — pre-existing, worth fixing separately.

---

## 2026-07-01 — Project detail: gallery gap + header balance

- **Reduced the gallery → Process gap.** The fan box over-reserved height (380px
  for ~328px of photos) and Process used a large top margin — ~134px of dead band.
  Trimmed the fan/scaler height to 340px and Process margin to `space-12`; gap is
  now ~60px.
- **Balanced the header.** A readable overview next to a flush-right meta left a
  dead middle + an empty right column. Moved the **collection switcher into the
  aside** (under Client/Role/Goals) as a compact 2-up grid, so the right column
  fills beside the overview. Works for both colorway swatches and the family/mixed
  "cards" variant; on mobile the aside stacks full-width and the swatches flow in a
  row. Projects without collections keep a meta-only sidebar.

---

## 2026-06-30 — Project detail: interactive Process + Sketches

Made the two static case-study sections feel alive (all projects):

- **Process** steps now stagger in as the section scrolls into view, and each
  step responds to hover — it lifts (motion), its number scales up, and the
  timeline rail above it brightens to full cream. Gated by `prefers-reduced-motion`.
- **Sketches** frame clips its image so it zooms on hover, lifts with a deeper
  shadow, shows a zoom icon, and opens the image full-screen in the lightbox on
  click (same Lightbox as the gallery; a second lightbox instance wired for the
  sketch set). Activates once a real image exists at the documented path; until
  then the placeholder shows a subtle hover shadow.

---

## 2026-06-30 — Project detail: layout polish + responsive

Refinements to the project-detail template (`ProjectDetail.jsx` / `.css`) and the
shared `PhotoGallery` — all apply across every project.

- **Bigger gallery previews.** Fanned photos 220 → 280px, step 175 → 205px, so the
  stack fills the container (~1100px) instead of leaving side gaps. The responsive
  scale now lives on a non-motion wrapper (`.photo-fan__scaler`) — Framer Motion
  owns the stage's `transform`, so a CSS scale there was being overridden. Scale is
  set at breakpoints (unitless values; a `calc(100vw/…)` ratio is invalid CSS and
  was silently dropped). Verified no horizontal overflow at any width.
- **Meta column flush-right.** `CLIENT / ROLE / GOALS` aligns to the container's
  right edge — same right edge as the gallery, process, and sketches.
- **Process responsive.** 6 columns → 3 (tablet) → 2 (phone); subgrid dropped below
  desktop so wrapped rows lay out cleanly.
- **Sketches responsive.** Banner aspect 21:9 → 16:9 → 4:3 as the screen narrows.

Earlier same-day work (committed in `cd1a252`): Overview moved between title and
tags, Brief panel removed (Goals moved into the aside; Constraints/Users dropped),
Process now before Sketches, header meta rebalanced, footer active-link dot removed.

---

## 2026-06-30 — Project detail: authored Overview + case-study sections

**What shipped**

- Extracted Shiran's own project descriptions from `Portfolio_Shiran-Bar.pdf`
  (the 2026 portfolio deck) into a hand-maintained data file,
  `src/data/projectContent.js`. Covers all 11 deck projects, mapped to live
  site projects via `siteProjectId`.
- Project detail page (`src/pages/ProjectDetail.jsx`) now shows, for **every**
  project:
  - An **Overview** between the title and the tags — authored copy where it
    exists, the project's own summary as a fallback. Replaced the old header
    summary.
  - **Brief** (Goals / Constraints / Users), **Sketches**, and **Process**
    sections below the gallery.
- Case-study content lives in `src/data/caseStudies.js`. Shared `DEFAULT_*`
  content fills any project that hasn't been customized, so the layout applies
  app-wide. Treasure the Ocean Gymini has real, specific content.

**Update:** the standalone "Brief" panel was later removed. **Goals** now live in
the header aside (under Client / Role); Constraints / Users are no longer shown.
Section order below the gallery is now **Process → Sketches**.

### ⚠️ Follow-up — replace placeholder case-study content (per project)

The aside **Goals** and the **Process** steps currently fall back to **shared
default content that is identical across every project except Treasure the
Ocean**. This was intentional — it makes the layout appear on all projects now —
but it reads as templated and **must be replaced with real per-project content
before launch.**

For each project, supply and drop into its entry in `src/data/caseStudies.js`:

- **Goals** — real `brief.goals` (Constraints / Users in the data are unused now)
- **Process** — real steps (or confirm the generic process is fine to keep)
- **Sketches** — the actual sketch image(s), at
  `src/assets/images/case-studies/<project-id>/sketch-1.webp`

Projects still on defaults: `here-i-grow-activity-center`, `wooden-toy-design`,
`garden-of-adventures-packaging`, `tiny-rockers-shape-sorter`,
`mobile-character-design`.

### Also noted

- 5 deck projects are not yet built on the site (no image assets in the repo —
  images live only inside the PDF): Developmental Gymini, Take Along Musical Toy,
  Product Redesign, Baby Park Concept (concept), Armchair Design (client: winfun).
  Their copy is already captured in `src/data/projectContent.js` (`onSite: false`).
