import { useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { rise, stagger } from '@/lib/motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useTheme } from '@/theme/ThemeContext';
import { spring } from '@/theme/vivid/motion';
import './PhotoGallery.css';

/**
 * Fanned photo stack: up to `max` images (normalized {src, alt}) laid out in
 * an overlapping horizontal fan, each in a paper frame. Quick, then still —
 * the photos rise 16px into place once, and hover is a colour swap (paper →
 * yolk frame) that also brings the photo to the front. No springs, no drag,
 * no scale. Below 720px the fan becomes a horizontal scroll strip.
 *
 * Fan geometry lives in CSS custom properties (--x, --y, --z) so the layout
 * can switch at breakpoints without fighting Framer Motion's transforms.
 */

const Y_OFFSETS = [16, 36, 8, 24, 48];
// Vivid theme: resting tilt per photo, like prints dealt onto a table
const ROTATIONS = [-7, 4, -3, 6, -5];
const STEP = 205; // horizontal distance between photo centres, px

function PhotoGallery({ images, max = 5, animationDelay = 0.3, onPhotoTap }) {
  const reduce = useReducedMotion();
  const { isVivid } = useTheme();
  const isStrip = useMediaQuery('(max-width: 720px)');

  const photos = useMemo(() => {
    const picked = images.slice(0, max);
    const mid = (picked.length - 1) / 2;
    return picked.map((image, i) => ({
      ...image,
      order: i,
      x: (i - mid) * STEP,
      y: Y_OFFSETS[i % Y_OFFSETS.length],
      zIndex: 50 - i * 10, // left-most on top
    }));
  }, [images, max]);

  return (
    <div className="photo-fan">
      <ul className="photo-fan__track">
        {photos.map((photo) => {
          const style = {
            '--x': `${photo.x}px`,
            '--y': `${photo.y}px`,
            '--z': photo.zIndex,
          };
          const img = <img src={photo.src} alt={photo.alt} draggable={false} />;

          // Vivid: the photos start stacked as one deck in the middle, then
          // deal out to their places on scroll-in; hover lifts and straightens.
          const rest = isStrip ? 0 : ROTATIONS[photo.order % ROTATIONS.length];
          const enter = isVivid
            ? {
                initial: isStrip
                  ? { opacity: 0, y: 80, scale: 0.8, rotate: 0 }
                  : { opacity: 0, x: -photo.x, y: 80, scale: 0.7, rotate: 0 },
                whileInView: { opacity: 1, x: 0, y: 0, scale: 1, rotate: rest },
                viewport: { once: true, amount: 0.3 },
                whileHover: { y: -28, scale: 1.08, rotate: 0, transition: spring.snappy },
                whileTap: { scale: 0.96 },
                transition: {
                  ...spring.bouncy,
                  delay: 0.1 + photo.order * 0.09,
                },
                'data-cursor': onPhotoTap ? 'Zoom' : undefined,
              }
            : {
                initial: reduce ? false : { opacity: 0, y: 16 },
                animate: { opacity: 1, y: 0 },
                transition: {
                  ...rise,
                  delay: animationDelay + photo.order * stagger,
                },
              };

          return (
            <motion.li
              key={photo.src}
              className="photo-fan__item"
              style={style}
              {...enter}
            >
              {onPhotoTap ? (
                <button
                  type="button"
                  className="photo-fan__photo"
                  onClick={() => onPhotoTap(photo.order)}
                  aria-label={`Open photo: ${photo.alt}`}
                >
                  {img}
                </button>
              ) : (
                <div className="photo-fan__photo">{img}</div>
              )}
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

export default PhotoGallery;
