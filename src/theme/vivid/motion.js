/* ==========================================================================
   Vivid motion tokens — the animated theme deliberately breaks the brand
   kit's "quick, then still" rule: springs, overshoot and play are allowed.
   Colours, font and logo stay on-kit. Only use these when useTheme().isVivid.
   ========================================================================== */

export const spring = {
  snappy: { type: 'spring', stiffness: 520, damping: 30 },
  bouncy: { type: 'spring', stiffness: 380, damping: 14, mass: 0.9 },
  soft: { type: 'spring', stiffness: 140, damping: 20 },
  wobbly: { type: 'spring', stiffness: 260, damping: 9 },
};

export const ease = {
  expoOut: [0.16, 1, 0.3, 1],
  backOut: [0.34, 1.56, 0.64, 1],
  inOut: [0.65, 0, 0.35, 1],
};

export const stagger = { chars: 0.025, words: 0.06, items: 0.09 };

// Shared reveal presets for <Reveal preset="…">.
export const reveal = {
  rise: {
    hidden: { opacity: 0, y: 60 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: ease.expoOut } },
  },
  pop: {
    hidden: { opacity: 0, scale: 0.6, rotate: -6 },
    show: { opacity: 1, scale: 1, rotate: 0, transition: spring.bouncy },
  },
  clip: {
    hidden: { clipPath: 'inset(100% 0% 0% 0%)', y: 40 },
    show: {
      clipPath: 'inset(0% 0% 0% 0%)',
      y: 0,
      transition: { duration: 1, ease: ease.expoOut },
    },
  },
  zoom: {
    hidden: { opacity: 0, scale: 1.15, filter: 'blur(12px)' },
    show: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: { duration: 1.1, ease: ease.expoOut },
    },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 80 },
    show: { opacity: 1, x: 0, transition: { duration: 0.9, ease: ease.expoOut } },
  },
};
