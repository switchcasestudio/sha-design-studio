# Home "Playroom Hybrid" — Design Spec

**Date:** 2026-07-02 · **Branch:** `home-playroom-hybrid` · **Status:** approved direction (client picked "The Playroom" board, then asked for a hybrid: keep the existing site's base, elevate it)

## Problem

The homepage is the face of the site but reads pale and empty: a full-viewport wordmark hero with large blank cream areas, a logo strip, one yellow panel, one (placeholder) testimonial, a wave marquee. **No product work, no story, no numbers appear anywhere on the page.**

## Direction

"The Playroom" — playful editorial. Keep the existing hero/wordmark, SocialProof, What I Do, Kind Words, marquee and footer as the base; elevate the hero and add three new sections. Brand system unchanged (cream canvas, orange heartbeat, yellow/blue accents, Climate Crisis + Inter, 32px panel radius, soft intentional motion). Cream/orange is the client's stated go-to pairing.

## Page flow (new items marked ●)

1. **Hero — elevated.** Keep HomeAssemble (morphing wordmark + HeroNav) and ● add 3 floating product-photo cards in the empty cream space around the wordmark (gymini baby / trike boy / princess piano — all client-approved images). Cards bob gently on a slow loop and are **draggable with spring return** (motion/react `drag`); a small "go on, grab one" hint appears near the cards on desktop. Cards are decorative (`aria-hidden`, `draggable=false` on the img). Mobile: two smaller static tilted cards, no drag. Reduced motion: static, no bob.
2. **SocialProof** — unchanged.
3. ● **Fresh from the studio (cream).** Asymmetric grid: 1 tall feature card + 4 tiles (desktop 3-col / 2-row; tablet 2-col; mobile 1-col). Sourced from the normalized `projects` data: the first 5 projects by `order`; the feature (tall) card is the first, tiles are the next 4; each card shows `heroImage ?? images[0]`. Each card: photo, cloud badge (category), scrim title on hover (match Projects-page pattern), links to `/projects/:id`. "All projects" outline button in the header row.
4. ● **Facts ticker (ink band).** Climate Crisis marquee reusing the existing `Marquee` component: "10+ products on shelves ✿ 6+ years designing for babies ✿ sketch → prototype → production" with colored flower separators. `aria-hidden` duplicate track, single accessible sentence for screen readers.
5. ● **How I got here (yellow panel, rounded).** Journey play-path: horizontal dashed line with 4 stops that pop in sequentially on scroll (🎓 Shenkar B.Des → 🇨🇳 HAPE China internship → 🧸 Tiny Love, 5 years → 🚀 SHA Studio "your product next?"). Vertical layout under 768px. Facts from the portfolio PDF.
6. ● **By the numbers (blue panel, rounded).** 4 tilted cream "toy blocks": `10+ products shipped · 6+ years in baby products · 5 brands worldwide · ∞ giggles tested`. Numbers count up in view (skip when reduced motion). 2×2 grid on mobile.
7. **What I Do (yellow)** — unchanged.
8. **Kind Words (blue)** — unchanged (quote is a known placeholder; client to supply a real one).
9. **Wave marquee + footer** — unchanged.

Color rhythm down the page: cream → cream → cream → ink → yellow → blue → yellow → blue → cream. One dominant accent per section, per guidelines.

## Components

| Unit | File | Purpose |
|---|---|---|
| `HeroToys` | `src/components/sections/HeroToys.jsx/.css` | The 3 draggable floating photo cards; rendered inside HomeAssemble. Props: none (self-contained image list). |
| `FactsTicker` | `src/components/sections/FactsTicker.jsx/.css` | Ink marquee band of studio facts. |
| `HomeWorkGrid` | `src/components/sections/HomeWorkGrid.jsx/.css` | Asymmetric featured-work grid fed by `projects` data. |
| `JourneyPath` | `src/components/sections/JourneyPath.jsx/.css` | Yellow journey panel with 4 pop-in stops. |
| `StatBlocks` | `src/components/sections/StatBlocks.jsx/.css` | Blue panel with 4 count-up toy blocks. |

`Home.jsx` composes them; existing `ColorWorld` in-view reveal wraps the new sections. No changes to data files, routing, or other pages. Hero images imported directly from the curated product asset folders (they're already in the Vite glob).

## Accessibility & motion

- All new text/background pairs meet WCAG AA (ink on cream/yellow, cream on ink/blue/orange).
- Every animation gated behind `useReducedMotion` (site convention) — bob/drag/count-up/pop-in all degrade to static.
- Draggable cards: decorative only, keyboard focus not required; grid cards are real links with focus states.

## Testing

- `npm run build` green; manual pass at 375 / 768 / 1280 widths via browser; verify drag returns with spring, ticker loops seamlessly, journey pops once, count-up runs once, all 5 grid links route correctly.

## Out of scope

Other pages, nav/footer changes, testimonial content, the 5 uncurated image folders, new brand assets.
