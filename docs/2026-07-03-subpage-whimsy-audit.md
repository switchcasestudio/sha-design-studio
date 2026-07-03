# Audit & Plan — Whimsy pass on Services / About / Inquire

**Date:** 2026-07-03 · **Author:** audit session (Fable 5) · **Executor:** implementation session (Opus 4.8)

The homepage got its playroom treatment (hero toys, facts ticker, journey road,
sticker scrapbook work grid, orange finale band). The three sub-pages are
functionally solid but visually flat by comparison — they're where the brand
voice drops from "Way cool!" to "professional PDF." This plan brings them up to
the homepage's register without breaking its rules.

---

## Ground rules (bind every item below)

1. **Reuse the existing vocabulary — don't invent a new one.** The brand-shape
   SVG set (14 shapes in `src/assets/svg/`, prepped + colour-agnostic via the
   `GEO` registry inside `src/components/ui/HeadlineMorph.jsx`), `CloudBadge`,
   the `spring = { type: 'spring', stiffness: 200, damping: 22 }` convention,
   sticker tilts (±0.5–1.5deg), and the home finale-band pattern.
2. **One dominant accent per beat** (PRODUCT.md principle 2). Motifs are
   seasoning, not a fifth colour block.
3. **WCAG AA per `tokens.css` documented pairs.** New decorative shapes are
   `aria-hidden`, never carry meaning. Orange/blue on cream stays large-text-only.
4. **`prefers-reduced-motion` on every new animation** — use `useReducedMotion`
   from motion/react or the CSS media query, matching existing patterns.
5. **Framer Motion owns `transform`; CSS owns colour/shadow** (documented in
   Services.css + PhotoGallery notes). Don't put CSS transforms on motion nodes.
6. **The work/form is the hero.** On Inquire especially: decoration must never
   compete with the form for attention or sit under the pointer's path to it.
7. **Cream/orange is the signature combo** (client-stated). Never grey.

---

## Step 0 — Enabling refactor (do first)

**Extract the shape registry into a shared component.**
`HeadlineMorph.jsx` already imports all 14 SVGs `?raw`, strips baked fills, and
routes them through `currentColor`. Lift `prep()` + `GEO` into a new
`src/components/ui/BrandShape.jsx`:

```jsx
<BrandShape shape="daisy" className="…" />  // tint via CSS `color` on wrapper
```

- `HeadlineMorph` imports `GEO` from it (no behaviour change).
- All items below that say "motif" use `<BrandShape>` — no page re-imports raw SVGs.
- Keep it dumb: geometry only; size/position/colour/animation belong to callers.

---

## Services page (`src/pages/Services.jsx` / `.css`)

**Current state:** yellow canvas; hero (title + intro, two-column); four large
colour-blocked cards (orange → ink → blue → cream) with deliverable chips;
"Areas of Expertise" pills; page ends there. Everything is a perfect rectangle,
zero brand shapes, and the page dead-ends with no CTA.

### S1 · Connect the four cards with a dotted process road — P1, the signature move
The services are literally numbered 01→04: they ARE a process, but render as
four unrelated boxes. Draw a dotted orange connector down the page between
cards — same self-drawing SVG technique as `JourneyPath` (pathLength animation
inside a mask so dots survive), but vertical and much simpler: a short curved
dotted segment in each gap between cards, drawing in as it scrolls into view.
Ink dots read best on the yellow canvas (orange-on-yellow is weak); verify
against tokens. Mobile: a simple dashed vertical spine segment. This single
addition turns "div after div" into a journey — the exact fix the client loved
on the homepage.

### S2 · Sticker-tilt the cards + corner motif — P1
- Alternate card tilt ±0.6deg (even cards one way, odd the other), straightening
  to 0 on hover with the house spring + a slight lift (`y: -4`) — same language
  as the work-grid scrapbook cards.
- One `BrandShape` per card, tucked into the top-right padding zone, tinted to
  the card's existing `--card-accent` system: orange card → daisy (yellow), ink
  card → star (yellow), blue card → heart (coral/red tint reads well on blue —
  check contrast as decoration only), cream card → clover (blue). Small
  (~56–72px), `aria-hidden`, gentle idle wobble on hover only.

### S3 · Index number becomes a shape badge — P2
`01`–`04` currently plain text. Sit each number inside a small brand shape
(same shape as that card's corner motif, or a blob) — number stays the same
size/weight for AA; the shape sits behind it like the home journey stops'
"emoji rides inside the shape" pattern. Skip if it fights the title lockup.

### S4 · Chips pop in as a cascade — P2
The chips appear with the card as one block. Give the chip list a staggered
scale-pop (`initial scale 0.6/opacity 0 → spring in`, ~0.03s stagger,
`whileInView once`). Cheap, and makes the deliverables feel like toys spilling
out of the box. Reduced-motion: fade only.

### S5 · CTA finale band — P1
Page currently ends at the expertise pills — a dead end on the highest-intent
page after Inquire itself. Add the home finale-band pattern (full-bleed orange,
rounded shoulders, wobbling motifs, big display line + button to `/inquire`).
Ideally extract the home finale into a shared `CtaBand` section component and
reuse; if extraction is messy, build a lean sibling with the same look. Copy
direction: "Got a product itching to exist?" / button "Start a Project".
Keeps the yellow-page → orange-band rhythm (distinct beats).

### S6 · Expertise pills get the sticker treatment — P3
Static tilts (±1deg via nth-child), keep the existing hover pop. Two-line change.

### S7 · Flag for client (do NOT change unilaterally) — P3
The `#02` ink card is a big black moment; the client's 07-02 homepage feedback
was "big black moments feel off-brand." It may be fine as page-level contrast
here — leave it, but note it in WORKLOG as a question for Shiran (candidate
swap: `--color-orange-deep` or a deep yellow card).

---

## About page (`src/pages/About.jsx` / `.css`)

**Current state:** blue canvas; bio text + sticky photo with the "Hello!"
yellow-flower badge (already charming); yellow "My Approach" panel with a
plus/minus accordion duplicating the Services data. Two boxes, one motif,
text-heavy left column, ends without a destination.

### A1 · Give the bio its display moment — P1
The sign-off "Simple, smart, and full of wonder." is the best line on the page
and renders as a bold body paragraph. Promote it to a display pull-quote:
Bagel face (`--font-display`), yellow on the blue canvas (large-text pair —
verify in tokens; yellow/blue is a documented brand pair), sized ~text-3xl/4xl,
with a tiny star `BrandShape` as the full stop. It becomes the section's
punchline instead of a whisper.

### A2 · Career milestones as inline sticker chips — P1
"Shenkar → HAPE → Tiny Love" is buried in paragraph 2, yet it's the page's
credibility spine. Inside that paragraph, render the three names as small
cream pill chips (CloudBadge-style, ink text, slight alternating tilt, gentle
pop on hover). No new section, no duplication of the home journey — just the
key nouns becoming tactile. Keep line-height comfortable so chips don't break
the reading rhythm.

### A3 · Photo gets the sticker-frame family — P1
- Slight resting tilt on the photo frame (~1deg), straightening on hover
  (house spring) — consistent with the scrapbook cards.
- Add ONE more small motif to keep "Hello!" company: a coral heart peeking from
  the bottom-right of the frame, smaller than the flower, same
  pop-on-hover behaviour. Two badges max — more becomes clutter.

### A4 · Accordion rows get shape bullets — P2
Each `about-offer__row` gets a small `BrandShape` before the title (daisy /
clover / heart / star — the same four-shape ramp the client loves from the
journey stops), tinted per the tint-token exploration (orange-soft / blue /
orange / yellow-deep on the yellow panel — ink-adjacent tints only where AA
allows; shapes are decorative so contrast is not binding, but avoid
yellow-on-yellow). Open state: the shape does a small celebratory spin
(`rotate: 360` spring, reduced-motion: none).

### A5 · End the page somewhere — P2
After the yellow panel the page just stops. Two options, pick one:
- **Preferred:** the same shared `CtaBand` from S5 ("Let's make something
  wonder-full" → `/inquire`) — blue page → orange band is a clean beat change.
- Lighter: a centered display line + Button pair on the blue canvas.

### A6 · Floating canvas motifs — P3
One or two tiny shapes drifting in the blue canvas margins (far from text
columns, hidden below ~1100px viewports so they never crowd mobile). Only if
the page still feels bare after A1–A3 — restraint beats confetti here.

---

## Inquire page (`src/pages/Inquire.jsx` / `.css` + `ContactForm.jsx` / `.css`)

**Current state:** cream canvas, orange display title, lead line, email link,
white form card. The plainest page on the site — and it's the conversion
moment the whole site funnels toward. Biggest whimsy opportunity of the three.
Cream + orange is already the client's signature combo, so this page should
feel the MOST like the brand, not the least.

### I1 · Celebratory success state — P1, highest-value item on this plan
On submit success, the current reward is one line of small green-ish text.
Replace with a real moment inside the form card:
- A burst of 5–7 `BrandShape` pieces (daisy, star, heart, clover in
  yellow/orange/blue tints) that spring-pop outward from the message and
  settle with slight tilts — springs with per-shape delay, NOT physics
  confetti; it should feel like stickers landing, not a slot machine.
- "Thanks — Shiran will be in touch soon!" promoted to the display face,
  orange, with the form fields swapped out (AnimatePresence) rather than the
  message appended below — completing the form should feel like finishing, not
  appending.
- `role="status"` kept; reduced-motion: shapes render statically around the
  message, no burst.
- Keep the error state exactly as-is (errors are not the place for whimsy).

### I2 · Dress the cream canvas — P1
2–3 `BrandShape` motifs on the page canvas: e.g. a large soft-tinted daisy
half-cropped off the left edge behind the intro column, a small star near the
title, a clover low-right. Behind the form card in z-order, `aria-hidden`,
positioned so they never sit under the card or the pointer path on desktop;
hide most below 768px. Slow idle float (±4px y, 6–8s ease) gated by
reduced-motion. This alone kills the "plain white form on empty cream" read.

### I3 · Title flourish + warmer microcopy — P1
- Title "Let's stay connected" reads like a newsletter footer. Recommend
  "Let's make something together" or keep — but give the title a small
  companion shape (yellow tulip or daisy) tucked at its end like punctuation,
  popping in after the title settles (delay ~0.5s, spring 400/12 — same recipe
  as the About "Hello!" badge).
- Lead line: "Reach out about a project, a collaboration — or just to say
  hello!" plus a second small line: "I usually reply within a day or two."
  (Response-time promises measurably lift form completion; confirm wording
  with Shiran, mark as placeholder if unconfirmed.)
- Input placeholders get one drop of personality, e.g. message textarea:
  "Tell me about your idea — big, tiny, or still a scribble…". Labels stay
  exactly as they are (a11y).

### I4 · Form card joins the sticker family — P2
- Resting tilt −0.5deg, straightening to 0 on `:focus-within` (CSS transition
  is fine here — the card is not a motion node). Subtle; the form must still
  read as stable and trustworthy.
- A small yellow flower badge tucked behind the card's top-right corner
  (peeking out ~40%), echoing the About "Hello!" flower — the two pages rhyme.

### I5 · "Send Away" button earns its name — P2
- Hover: existing Button hover + a tiny wobble (rotate ±2deg spring) on the
  label or a small paper-plane/star glyph.
- Submitting state: keep the "Sending…" text (a11y), add a small spinning
  daisy `BrandShape` beside it instead of nothing.

### I6 · What happens next — P3
The left column under the email link is empty on desktop. Optional 3-step
mini-list with shape bullets: "1 I read every note · 2 We hop on a call ·
3 Sketches begin." Fills dead space with reassurance. Copy needs Shiran's
voice check — mark placeholder.

### I7 · Custom checkbox — P3
Newsletter checkbox becomes a brand check: box corners rounded, checked state
fills yellow with an ink check that springs in. Native input visually-hidden
but focusable (standard accessible pattern); focus ring preserved.

---

## Cross-page notes for the executor

- **Order of work:** Step 0 → Inquire (I1–I3) → Services (S1, S2, S5) → About
  (A1–A3) → then P2s in any order → P3s only if time/appetite remains.
  Rationale: Inquire is the conversion page and currently the weakest; the
  shared `CtaBand` (S5) unlocks A5 for free.
- **Commit slicing:** Step 0 alone (`refactor(ui): extract BrandShape from
  HeadlineMorph`); then one commit per page-level beat, matching the existing
  `feat(page): …` style. Update `WORKLOG.md` per commit (newest on top).
- **Duplication flag (no action without client):** About's `offers` array
  duplicates Services' data verbatim. If touched anyway, extract to
  `src/data/services.js` and import in both. Optional.
- **Verify:** dev-run each page at desktop + 375px, tab through the Inquire
  form end-to-end (focus order, error focus jump, success announcement), and
  toggle `prefers-reduced-motion` (macOS: Settings → Accessibility → Display →
  Reduce motion) to confirm every new animation degrades to fade/static.
- **Known pre-existing:** `npm run lint` is broken repo-wide (no ESLint config
  resolution, wanders into `dist/`) — do not chase it in this pass.
- **Content placeholders introduced by this plan** (flag in WORKLOG): response
  -time line (I3), what-happens-next copy (I6), CTA band copy (S5/A5) — all
  need Shiran's sign-off before launch.
