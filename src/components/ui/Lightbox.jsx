import { useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import './Lightbox.css';

/**
 * Full-screen image modal with keyboard navigation.
 *
 * `index` is the position in `images` to show, or null when closed.
 * Esc closes; arrow keys / on-screen chevrons cycle; backdrop click closes.
 */
function Lightbox({ images, index, onClose, onNavigate }) {
  const image = index != null ? images[index] : null;
  const count = images.length;

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
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={onClose}
        >
          <button
            type="button"
            className="lightbox__close"
            aria-label="Close image"
            onClick={onClose}
          >
            <X size={26} />
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
                <ChevronLeft size={30} />
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
                <ChevronRight size={30} />
              </button>
            </>
          )}

          <motion.figure
            key={image.src}
            className="lightbox__figure"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
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
