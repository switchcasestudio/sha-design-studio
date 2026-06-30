import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import './PhotoGallery.css';

/**
 * Interactive fanned photo stack, adapted from a Next.js/Tailwind
 * "PhotoGallery" component to this project's Vite + vanilla-CSS stack.
 *
 * Takes up to `max` images (normalized {src, alt} from the data module):
 * they start as a centered pile, then spring out into a horizontal fan.
 * Each photo has a random tilt, lifts on hover, and can be dragged —
 * snapping back when released.
 */

const Y_OFFSETS = [16, 36, 8, 24, 48];
const STEP = 205; // horizontal distance between photo centers, px

function randomRotation(direction) {
  return (Math.random() * 3 + 1) * (direction === 'left' ? -1 : 1);
}

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const photoVariants = {
  hidden: { x: 0, y: 0, rotate: 0, scale: 1 },
  visible: (custom) => ({
    x: custom.x,
    y: custom.y,
    rotate: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 70,
      damping: 12,
      mass: 1,
      delay: custom.order * 0.15,
    },
  }),
};

function Photo({ src, alt, direction, onTap }) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    setRotation(randomRotation(direction));
  }, [direction]);

  return (
    <motion.div
      className="photo-fan__photo"
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      whileTap={{ scale: 1.2, zIndex: 9999 }}
      whileHover={{
        scale: 1.1,
        rotateZ: 2 * (direction === 'left' ? -1 : 1),
        zIndex: 9999,
      }}
      whileDrag={{ scale: 1.1, zIndex: 9999 }}
      initial={{ rotate: 0 }}
      animate={{ rotate: rotation }}
      /* onTap only fires for clicks/taps, not after a real drag */
      onTap={onTap}
    >
      <img src={src} alt={alt} draggable={false} />
    </motion.div>
  );
}

function PhotoGallery({ images, max = 5, animationDelay = 0.3, onPhotoTap }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Spread the first `max` images into fan positions around the center
  const photos = useMemo(() => {
    const picked = images.slice(0, max);
    const mid = (picked.length - 1) / 2;
    return picked.map((image, i) => ({
      ...image,
      order: i,
      x: (i - mid) * STEP,
      y: Y_OFFSETS[i % Y_OFFSETS.length],
      zIndex: 50 - i * 10, // left-most on top, like the original
      direction: i % 2 === 0 ? 'left' : 'right',
    }));
  }, [images, max]);

  useEffect(() => {
    // Fade the stage in first, then fan the photos out
    const visibilityTimer = setTimeout(
      () => setIsVisible(true),
      animationDelay * 1000
    );
    const animationTimer = setTimeout(
      () => setIsLoaded(true),
      (animationDelay + 0.4) * 1000
    );

    return () => {
      clearTimeout(visibilityTimer);
      clearTimeout(animationTimer);
    };
  }, [animationDelay]);

  return (
    <div className="photo-fan">
      {/* Plain (non-motion) wrapper owns the responsive scale — Framer Motion
          manages `transform` on the stage, so the scale can't live there. */}
      <div className="photo-fan__scaler">
        <motion.div
          className="photo-fan__stage"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
        <motion.div
          className="photo-fan__stack"
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? 'visible' : 'hidden'}
        >
          <div className="photo-fan__anchor">
            {/* Reverse render order so higher z-index photos come later in the DOM */}
            {[...photos].reverse().map((photo) => (
              <motion.div
                key={photo.src}
                className="photo-fan__item"
                style={{ zIndex: photo.zIndex }}
                variants={photoVariants}
                custom={{ x: photo.x, y: photo.y, order: photo.order }}
              >
                <Photo
                  src={photo.src}
                  alt={photo.alt}
                  direction={photo.direction}
                  onTap={
                    onPhotoTap ? () => onPhotoTap(photo.order) : undefined
                  }
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default PhotoGallery;
