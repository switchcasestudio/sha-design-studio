/* ==========================================================================
   Motion tokens — the animation counterpart to the design tokens.
   One source of truth for easing + timing so motion reads consistent and
   on-brand (round, bouncy, warm) across the site. Expressed for Framer Motion.

   Easing names mirror the build-spec vocabulary:
     bloom   — playful overshoot for motif / badge pop-in (back.out)
     settle  — reveals & slide-ups (power3.out)  → matches the CSS --ease-out
     scatter — exits (power2.in)
     drift   — ambient parallax tied to scroll (linear)
   ========================================================================== */

export const ease = {
  bloom: [0.34, 1.56, 0.64, 1], // back.out(1.7) — gentle overshoot
  settle: [0.16, 1, 0.3, 1], // power3.out — same curve as the --ease-out token
  scatter: [0.55, 0.085, 0.68, 0.53], // power2.in
  drift: 'linear',
  // GSAP dialect of the same curves, for the one ScrollTrigger section.
  bloomGsap: 'back.out(1.7)',
  scatterGsap: 'power2.in',
};

export const duration = {
  entrance: 0.6, // load / on-enter reveals (range 0.5–0.7)
  micro: 0.2, // hover / tap (range 0.15–0.25)
};

export const stagger = 0.08; // sibling cascade (range 0.06–0.1)

/* ---- Reusable variant sets ----------------------------------------------- */

// Hero lines: staggered fade-up on load, playful bloom. Kept fast (<600ms
// total) so it doesn't hurt LCP.
export const heroContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren: 0.05 },
  },
};

export const heroLine = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: ease.bloom },
  },
};

// Project grid: a row reveals together (container staggers its children).
export const gridContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: stagger },
  },
};

export const gridCard = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: duration.entrance, ease: ease.settle },
  },
};

// Decorative badge motif blooms in as its parent card reveals.
export const badgeBloom = {
  hidden: { opacity: 0, scale: 0, rotate: -12 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: duration.entrance, ease: ease.bloom },
  },
};

// Color-world blocks slide up and settle on enter (position/opacity only).
export const slideUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.entrance, ease: ease.settle },
  },
};

// Final-state variants for prefers-reduced-motion: no transform, no offset.
export const reducedReveal = {
  hidden: { opacity: 1 },
  show: { opacity: 1 },
};
