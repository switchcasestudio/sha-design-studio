import { forwardRef } from 'react';
import { inlineSvg } from '@/utils/svg';
import blob1Raw from '@/assets/svg/blob-blue.svg?raw';
import blob2Raw from '@/assets/svg/blob-red.svg?raw';
import blob3Raw from '@/assets/svg/blob-yellow.svg?raw';
import cloverRaw from '@/assets/svg/clover-blue.svg?raw';
import coralRaw from '@/assets/svg/coral-red.svg?raw';
import daisyRaw from '@/assets/svg/daisy-yellow.svg?raw';
import flower1Raw from '@/assets/svg/flower-red.svg?raw';
import flower2Raw from '@/assets/svg/flower-yellow.svg?raw';
import heartRaw from '@/assets/svg/heart-red.svg?raw';
import ringRaw from '@/assets/svg/ring-blue.svg?raw';
import splat1Raw from '@/assets/svg/splat-blue.svg?raw';
import splat2Raw from '@/assets/svg/splat-red.svg?raw';
import starRaw from '@/assets/svg/star-blue.svg?raw';
import tulipRaw from '@/assets/svg/tulip-yellow.svg?raw';
import './BrandShape.css';

// Geometry registry — one shared source for every brand motif on the site.
// Keyed by shape, colour-agnostic: `inlineSvg` strips each file's baked fill so
// the path renders in `currentColor` and a wrapper's CSS `color` tints it.
// (blob1/2/3 are three distinct blob paths; splat1/2 and flower1/2 likewise.)
// eslint-disable-next-line react-refresh/only-export-components
export const GEO = {
  blob1: inlineSvg(blob1Raw),
  blob2: inlineSvg(blob2Raw),
  blob3: inlineSvg(blob3Raw),
  clover: inlineSvg(cloverRaw),
  coral: inlineSvg(coralRaw),
  daisy: inlineSvg(daisyRaw),
  flower1: inlineSvg(flower1Raw),
  flower2: inlineSvg(flower2Raw),
  heart: inlineSvg(heartRaw),
  ring: inlineSvg(ringRaw),
  splat1: inlineSvg(splat1Raw),
  splat2: inlineSvg(splat2Raw),
  star: inlineSvg(starRaw),
  tulip: inlineSvg(tulipRaw),
};

/**
 * A single brand motif, purely decorative. Geometry only — size, position,
 * colour (via `color`) and any animation are the caller's job. Always
 * `aria-hidden` (override via props if a shape ever needs a label). forwardRef +
 * prop spread so `motion.create(BrandShape)` can animate it.
 */
const BrandShape = forwardRef(function BrandShape(
  { shape, className = '', ...rest },
  ref
) {
  const html = GEO[shape];
  if (!html) return null;

  return (
    <span
      ref={ref}
      className={`brand-shape ${className}`.trim()}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: html }}
      {...rest}
    />
  );
});

export default BrandShape;
