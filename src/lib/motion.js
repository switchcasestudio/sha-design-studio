/* ==========================================================================
   Motion tokens — the animation counterpart to the design tokens.
   Brand rule: quick, then still. Motion is a short colour swap (220ms) or a
   single 16px rise (600ms, power3.out). Nothing bounces, nothing loops, never
   back.out or any overshoot. Expressed for Framer Motion.

   Easing names:
     bloom   — kept as an alias of settle (the old overshoot is retired)
     settle  — reveals & slide-ups (power3.out)  → matches the CSS --ease-out
     scatter — exits (power2.in)
     drift   — ambient parallax tied to scroll (linear)
   ========================================================================== */

export const ease = {
  bloom: [0.22, 1, 0.36, 1], // retired overshoot → same as settle
  settle: [0.22, 1, 0.36, 1], // power3.out — same curve as the --ease-out token
  scatter: [0.55, 0.085, 0.68, 0.53], // power2.in
  drift: 'linear',
  // GSAP dialect of the same curves, for the one ScrollTrigger section.
  bloomGsap: 'power3.out',
  settleGsap: 'power3.out',
  scatterGsap: 'power2.in',
};

export const duration = {
  entrance: 0.6, // load / on-enter reveals (range 0.5–0.7)
  micro: 0.22, // hover colour swaps
};

// The one rise: 16px into place over 600ms, power3.out. Use for any reveal.
export const rise = { duration: duration.entrance, ease: ease.settle };

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
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: rise,
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
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.entrance, ease: ease.settle },
  },
};

// Decorative badge motif blooms in as its parent card reveals.
export const badgeBloom = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: duration.micro, ease: ease.settle },
  },
};

// Color-world blocks slide up and settle on enter (position/opacity only).
export const slideUp = {
  hidden: { opacity: 0, y: 16 },
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
