import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

/* An inset panel that grows into place as it scrolls up the screen — starts
   slightly shrunk and rounder, reaches full size by the time its top is
   ~40% up the viewport. Vivid theme only. */
function ScaleInPanel({ as = 'section', children, style, ...props }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start 0.4'],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [80, 0]);
  const borderRadius = useTransform(scrollYProgress, [0, 1], [96, 24]);
  const Tag = motion[as] ?? motion.section;

  return (
    <Tag ref={ref} style={{ ...style, scale, y, borderRadius }} {...props}>
      {children}
    </Tag>
  );
}

export default ScaleInPanel;
