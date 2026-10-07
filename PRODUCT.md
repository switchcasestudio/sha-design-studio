# Product

## Register

brand

## Users

Toy & baby-product brands looking for freelance industrial design; studios and
agencies needing contract design support; direct-to-consumer parent brands
launching new product lines; creative collaborators in adjacent fields. They
arrive to judge one thing fast: is this designer's work real, shipped, and
right for babies?

## Product Purpose

Portfolio site for Sha Design Studio — Shiran Bar, industrial designer for
toys and baby products (Shenkar → HAPE → Tiny Love → own studio). The site's
job is to show shipped product work, tell the story behind it, and convert
visits into project inquiries. Success = a brand contact lands on a case
study and sends the inquiry form.

## Brand Personality

Warm, confident, calm. Brand kit v3 (October 2026, source in the local
`Sha-Brand-Kit/` folder; tokens in `src/styles/tokens.css`). Cream canvas with
three primaries: pool blue, yolk yellow, tomato orange. Ink navy for all
running text, never black. Inter Tight only: 500 for headlines and UI, 400 for
text, no bold. Headlines are in colour with exactly one phrase in a solid
highlight block (`.hl`). Flat everywhere: no shadows, no gradients, every
clickable thing is a pill. Never baby-talk.

## Anti-references

- Corporate agency minimalism (grey grids, thin sans, glassmorphism).
- Nursery-pastel cutesiness / baby-talk copy.
- Template SaaS scaffolding: identical stacked card panels, hero-metric rows,
  eyebrow labels above every heading.
- Anything that hides the actual product photography behind decoration.

## Design Principles

1. **The work is the hero.** Real shipped products, photographed, one click
   from their case study.
2. **One dominant accent per section.** Each beat is unmistakably cream,
   tomato, yolk, pool, or night — never piled up.
3. **Calm, not flamboyant.** No tilts, wobbles or decorative clutter; the
   client asked for a cleaner, quieter site.
4. **Playful means specific.** Curiosity, giggles, factory floors — concrete
   details over generic delight.
5. **Quick, then still.** Colour swaps over 220 ms, cards rise 16 px over
   600 ms, the home hero's shapes snap in on scroll. Nothing bounces, loops or
   overshoots. Reduced motion drops the rise and keeps the colour swaps.

## Accessibility & Inclusion

WCAG AA for all text pairs (documented per-token in `tokens.css`). Ink on
tomato and yolk, paper on pool; never tomato letters on yolk or yolk letters
on tomato. 44px touch targets, visible focus rings themed per route,
`prefers-reduced-motion` honored on every animation.
