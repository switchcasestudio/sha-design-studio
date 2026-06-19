import heartRaw from '@/assets/svg/orange-1.svg?raw';
import flowerRaw from '@/assets/svg/blue-2.svg?raw';
import starRaw from '@/assets/svg/12_star.svg?raw';

/**
 * Letter-index → real brand motif, tuned for "Sha Design Studio":
 *   a (2)  → orange heart   (orange-1.svg)
 *   g (8)  → blue flower    (blue-2.svg)
 *   o (16) → yellow star    (12_star.svg)
 * Colours match each motif so the dots tint to the shape's brand colour.
 */
export const SHA_MORPHS = {
  2: { raw: heartRaw, color: [229, 75, 42] },
  8: { raw: flowerRaw, color: [74, 127, 191] },
  16: { raw: starRaw, color: [242, 201, 76] },
};
