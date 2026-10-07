import { useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { duration, ease, rise } from '@/lib/motion';
import { useTheme } from '@/theme/ThemeContext';
import { spring } from '@/theme/vivid/motion';
import './Lightbox.css';

/**
 * Full-screen image modal with keyboard navigation.
 *
 * `index` is the position in `images` to show, or null when closed.
 * Esc closes; arrow keys / on-screen chevrons cycle; backdrop click closes.
 */
function Lightbox({ images, index, onClose, onNavigate }) {
  const reduce = useReducedMotion();
  const { isVivid } = useTheme();
  const image = index != null ? images[index] : null;
  const count = images.length;

  // Vivid: remember the last index so a new photo slides in from the side
  // you navigated toward.
  const lastIndex = useRef(index);
  const dir =
    lastIndex.current == null || index == null || index === lastIndex.current
      ? 0
      : (index > lastIndex.current && !(lastIndex.current === 0 && index === count - 1)) ||
          (lastIndex.current === count - 1 && index === 0)
        ? 1
        : -1;
  useEffect(() => {
    lastIndex.current = index;
  }, [index]);

  const prev = useCallback(
    () => onNavigate((index - 1 + count) % count),
    [index, count, onNavigate]
  );
  const next = useCallback(
    () => onNavigate((index + 1) % count),
    [index, count, onNavigate]
  );

  useEffect(() => {
    if (!image) return undefined;

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };

    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden'; // lock page scroll behind the modal

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [image, prev, next, onClose]);

  return (
    <AnimatePresence>
      {image && (
        <motion.div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={image.alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration.micro, ease: ease.settle }}
          onClick={onClose}
        >
          <button
            type="button"
            className="lightbox__close"
            aria-label="Close image"
            onClick={onClose}
          >
            <X size={24} strokeWidth={2} />
          </button>

          {count > 1 && (
            <>
              <button
                type="button"
                className="lightbox__nav lightbox__nav--prev"
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
              >
                <ChevronLeft size={24} strokeWidth={2} />
              </button>
              <button
                type="button"
                className="lightbox__nav lightbox__nav--next"
                aria-label="Next image"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
              >
                <ChevronRight size={24} strokeWidth={2} />
              </button>
            </>
          )}

          <motion.figure
            key={image.src}
            className="lightbox__figure"
            {...(isVivid
              ? {
                  initial:
                    dir === 0
                      ? { opacity: 0, scale: 0.7, rotate: -4, y: 60 }
                      : { opacity: 0, x: dir * 220, rotate: dir * 6, scale: 0.9 },
                  animate: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 },
                  transition: spring.snappy,
                }
              : {
                  initial: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
                  animate: { opacity: 1, y: 0 },
                  transition: rise,
                })}
            onClick={(e) => e.stopPropagation()}
          >
            <img src={image.src} alt={image.alt} />
            <figcaption className="lightbox__caption">
              {image.caption && <span>{image.caption}</span>}
              {count > 1 && (
                <span className="lightbox__count">
                  {index + 1} / {count}
                </span>
              )}
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Lightbox;
