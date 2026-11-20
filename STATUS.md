# Sha Design Studio — Status (current-state handoff)

Updated 2026-11-20 (the three 2026-11-19/20 bullets below were verified in the browser that day). Everything else is from the 2026-10-27 consolidation. Facts last verified: as recorded in sources (WORKLOG.md newest entry 2026-08-18; git commit subjects 2026-10-06..14), not re-verified. "(unverified)" = not confirmed by a later WORKLOG entry.

## Current state

- Shiran Bar's portfolio — React 18 + Vite + vanilla CSS; routes `/`, `/projects`, `/projects/:id`, `/services`, `/about`, `/inquire`, 404. `npm run build` is the only gate; `npm run lint` has never worked (no ESLint config) (WORKLOG 2026-08-18).
- **Last logged pass (WORKLOG 2026-08-18):** homepage/footer rebuild from Shiran's annotated review + **app-wide de-tilt** (0 off-axis elements on every route by computed-transform scan). Its mobile breakpoints were checked by reading CSS only.
- **WORKLOG gap — git records later work (subjects only, unverified in docs):** 2026-10-06 calm hero restore + vibrant palette (9011c03); 2026-10-07 Sha brand kit v3 applied across the site (ec2ee0f) and its open items closed (67c2cb8); 2026-10-07..14 animated ("vivid") theme + switcher, toned down per Shiran, then made the live site (c80cc00) with a11y back to 100 on every page (d4ead70, HEAD); 2026-10-14 SEO — real robots.txt + sitemap, per-route canonical on sha-design.com, real noindex 404 (7c35481, 28782a1).
- Brand reference `BRAND_GUIDELINES.md`; register `PRODUCT.md`; gitignored `Sha-Brand-Kit/` at repo root.
- **2026-11-19 (shipped 11-20):** Ocean Gymini case study shows Shiran's real sketches + prototype models from her Figma file as three "From the sketchbook" stage cards (`stages` in `src/data/caseStudies.js`, `ProjectStages` in `ProjectDetail.jsx`, assets in `src/assets/images/case-studies/treasure-the-ocean-gymini/`). Build passes; checked in Chrome at 3 widths, both themes (WORKLOG 2026-11-19).
- **2026-11-20 (shipped):** Homepage has a new tomato panel, "From sketch to shelf" (`src/components/sections/SketchToShelf.jsx`, drawings in `src/data/sketchMotifs.js`), between the work collage and the journey: a Sketch · Prototype · Shelf switch over the Ocean Gymini, with self-drawing sketches and a one-time autoplay. It is a full-width inset `.panel`. Build passes; checked in Chrome at 5 widths (WORKLOG 2026-11-20).
- **2026-11-20 (shipped):** The theme switcher is gone — the animated ("vivid") look is the only theme; `ThemeContext` is `{ isVivid: !reduced, reduced }`. The calm code paths remain as the reduced-motion fallback (WORKLOG 2026-11-20).

## Next actions

1. Backfill WORKLOG for the 2026-10-06..14 commits (brand kit v3, animated theme, SEO).
2. Verify the 08-18 mobile breakpoints on a real device (collage → one column; footer 4 → 2 → 1).
3. Replace placeholders: Kind Words template quote + "Your name here" (`src/data/testimonials.js`); Inquire reply-time / next-steps / title copy needs Shiran's sign-off; Instagram/LinkedIn URLs in `siteConfig` are TODO (WORKLOG 06-30 … 08-18).
4. Per-project case-study content in `src/data/caseStudies.js` (goals, process, `case-studies/<id>/sketch-1.webp`) — on shared defaults for here-i-grow-activity-center, wooden-toy-design, garden-of-adventures-packaging, tiny-rockers-shape-sorter, mobile-character-design (WORKLOG 06-30) (unverified after Oct).
5. Five deck projects not on the site (images only in the PDF): Developmental Gymini, Take Along Musical Toy, Product Redesign, Baby Park Concept, Armchair Design — copy in `src/data/projectContent.js`, `onSite: false`.
6. Fix `npm run lint` (no config; wanders into `dist/`).

## Blocked / waiting / decisions needed

- Shiran: the `#02` Services card is a big ink card; her 07-02 feedback called big black moments off-brand — swap candidates `--color-orange-deep` / deep yellow (WORKLOG 07-03 S7). Open (unverified).
- Shiran: real testimonials and the Inquire copy (above).
- Shiran: sign off the homepage "From sketch to shelf" copy (headline, three step lines, button label are drafts) (WORKLOG 2026-11-20).
- Shiran: confirm the Ocean Gymini sketchbook section — are the sketch sheets her own drawings (some boards look AI-generated), and are the 4 added models + 2 added sketch rows OK (WORKLOG 2026-11-19).
- Accepted trade-off: equal footer columns force a 2x2 nav below ~1204px (08-18).

## Constraints (do-not-revert)

- **No tilt anywhere**; the only rotations are the submit spinner, mobile menu toggle (90°), About chevron, and the hero `h` → blob 180° flip (08-18).
- Ink is body-text-only on the homepage; display layer speaks orange; "What I Do" stays ink on yellow (07-02). Yellow-on-blue tags are a deliberate below-AA brand call (07-03).
- Social-proof logos recolour via `filter: brightness(0)` + opacity (source PNGs are orange) (08-18). Empty sketch slots are intentional placeholders (06-30). All motion gates on `prefers-reduced-motion`.

## Where history lives

- `WORKLOG.md` — canonical log, **newest first**, `## <date> — <title>` per pass; `grep -n "^## 2026-" WORKLOG.md`. Covers 2026-06-30 → 2026-08-18; `git log --date=short --format='%h %ad %s'` for 2026-10.
- `docs/2026-07-03-subpage-whimsy-audit.md` (the plan the 07-03 passes executed); `README.md` (setup/structure; its routes table predates `/inquire`); `BRAND_GUIDELINES.md`; `PRODUCT.md`.
