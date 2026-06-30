import { motion } from 'motion/react';
import { cn } from '@/utils/cn';
import './ProgressiveBlur.css';

/**
 * Progressive (layered) blur — stacks several masked, increasingly-blurred
 * layers so content fades out softly toward one edge instead of cutting off.
 * Used for the soft edges of the social-proof marquee.
 *
 * Ported to vanilla CSS + our tokens from a Tailwind original.
 *
 * @param {'top'|'right'|'bottom'|'left'} direction  edge the blur ramps toward
 * @param {number} blurLayers     how many stacked layers (more = smoother)
 * @param {number} blurIntensity  px of blur added per layer
 */
export const GRADIENT_ANGLES = {
  top: 0,
  right: 90,
  bottom: 180,
  left: 270,
};

export function ProgressiveBlur({
  direction = 'left',
  blurLayers = 8,
  className,
  blurIntensity = 0.25,
  ...props
}) {
  const layers = Math.max(blurLayers, 2);
  const segmentSize = 1 / (blurLayers + 1);

  return (
    <div className={cn('progressive-blur', className)}>
      {Array.from({ length: layers }).map((_, index) => {
        const angle = GRADIENT_ANGLES[direction];
        const gradientStops = [
          index * segmentSize,
          (index + 1) * segmentSize,
          (index + 2) * segmentSize,
          (index + 3) * segmentSize,
        ].map(
          (pos, posIndex) =>
            `rgba(255, 255, 255, ${
              posIndex === 1 || posIndex === 2 ? 1 : 0
            }) ${pos * 100}%`
        );

        const gradient = `linear-gradient(${angle}deg, ${gradientStops.join(
          ', '
        )})`;

        return (
          <motion.div
            key={index}
            className="progressive-blur__layer"
            style={{
              maskImage: gradient,
              WebkitMaskImage: gradient,
              backdropFilter: `blur(${index * blurIntensity}px)`,
            }}
            {...props}
          />
        );
      })}
    </div>
  );
}

export default ProgressiveBlur;
