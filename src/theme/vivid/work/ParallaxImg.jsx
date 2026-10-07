import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

/* An <img> that drifts inside its (overflow-hidden) frame as the page
   scrolls — vivid theme only. It is over-scaled so the drift never shows an
   edge. `distance` is the travel in % of the image height. */
function ParallaxImg({ distance = 10, scale = 1.2, style, ...props }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`-${distance}%`, `${distance}%`]);

  return <motion.img ref={ref} style={{ ...style, y, scale }} {...props} />;
}

export default ParallaxImg;
