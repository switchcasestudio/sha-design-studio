import { motion, useReducedMotion } from 'motion/react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import gyminiPhoto from '@/assets/images/projects/products/2-in-1-musical-mobile-gymini/02-GYMINIOCEAN7.webp';
import trikePhoto from '@/assets/images/projects/products/wooden-ride-on-trike/02-BOHOCHICwoodenrideonme5_2205e753-3fdd-45b2-a3d9-f87a1128de42.webp';
import pianoPhoto from '@/assets/images/projects/products/tiny-princess-tales-collection-5-in-1-here-i-grow-stationary-activity-center/06-TPSAC6.webp';
import './HeroToys.css';

// Product photos scattered in the hero's empty cream pockets like toys left on
// the floor. Positioned (in CSS) around the wordmark and the HeroNav blobs at
// 15/36, 85/30 and 80/74 — the cards claim the remaining corners.
const TOYS = [
  { src: gyminiPhoto, mod: 'gymini', bobDur: 5.2, bobDelay: 0 },
  { src: trikePhoto, mod: 'trike', bobDur: 6.4, bobDelay: 0.9 },
  { src: pianoPhoto, mod: 'piano', bobDur: 5.8, bobDelay: 1.6 },
];

const DRAG_SNAP = { type: 'spring', stiffness: 220, damping: 16 };

/**
 * Decorative, draggable photo cards inside the home hero. Purely playful:
 * they bob on slow independent clocks and can be picked up and tossed —
 * springing back home on release. Hidden from assistive tech; static (and
 * partly hidden) on phones; fully static under prefers-reduced-motion.
 */
function HeroToys() {
  const reduce = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const interactive = !reduce && !isMobile;

  return (
    <div className="hero-toys" aria-hidden="true">
      {TOYS.map(({ src, mod, bobDur, bobDelay }) =>
        interactive ? (
          <motion.div
            key={mod}
            className={`hero-toys__card hero-toys__card--${mod}`}
            drag
            dragSnapToOrigin
            dragTransition={{
              bounceStiffness: DRAG_SNAP.stiffness,
              bounceDamping: DRAG_SNAP.damping,
            }}
            whileDrag={{ scale: 1.08, zIndex: 3 }}
            whileHover={{ scale: 1.04 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <motion.img
              src={src}
              alt=""
              draggable="false"
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: bobDur,
                delay: bobDelay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        ) : (
          <div
            key={mod}
            className={`hero-toys__card hero-toys__card--${mod}`}
          >
            <img src={src} alt="" draggable="false" />
          </div>
        )
      )}

      {interactive && (
        <p className="hero-toys__hint">go on — grab one</p>
      )}
    </div>
  );
}

export default HeroToys;
