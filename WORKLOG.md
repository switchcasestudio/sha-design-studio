# Work Log — Sha Design Studio

A running record of notable work and follow-ups. Newest entries on top.

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
