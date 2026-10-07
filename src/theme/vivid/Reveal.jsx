import { motion } from 'motion/react';
import { useTheme } from '../ThemeContext';
import { reveal } from './motion';

/* Scroll-in reveal that only exists in the vivid theme. In regular it renders
   the plain element with no motion, so the regular site is untouched.
     <Reveal as="section" preset="clip" delay={0.1}>…</Reveal>
   Presets: rise | pop | clip | zoom | slideLeft (see ./motion.js). */
function Reveal({
  as = 'div',
  preset = 'rise',
  delay = 0,
  amount = 0.25,
  once = true,
  children,
  ...props
}) {
  const { isVivid } = useTheme();
  const Tag = as;
  if (!isVivid) return <Tag {...props}>{children}</Tag>;

  const MotionTag = motion[as] ?? motion.div;
  const variants = reveal[preset] ?? reveal.rise;
  return (
    <MotionTag
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={{
        hidden: variants.hidden,
        show: {
          ...variants.show,
          transition: { ...variants.show.transition, delay },
        },
      }}
      {...props}
    >
      {children}
    </MotionTag>
  );
}

export default Reveal;
