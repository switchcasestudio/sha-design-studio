import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ease } from '../motion';

/* Project hero photo for the vivid theme: the frame wipes open from the
   bottom on load while the photo settles from a zoom, then as you scroll the
   hero away the frame swells, tips and lifts (parallax). */
function HeroMedia({ image, className }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -5]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <motion.figure
      ref={ref}
      className={className}
      style={{ y, rotate, scale }}
      initial={{ clipPath: 'inset(100% 0% 0% 0% round 18px)' }}
      animate={{ clipPath: 'inset(0% 0% 0% 0% round 18px)' }}
      transition={{ duration: 1.1, ease: ease.expoOut, delay: 0.15 }}
    >
      <motion.img
        src={image.src}
        alt={image.alt}
        fetchpriority="high"
        decoding="async"
        initial={{ scale: 1.35 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease: ease.expoOut, delay: 0.15 }}
      />
    </motion.figure>
  );
}

export default HeroMedia;
