import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useTheme } from '../ThemeContext';
import { spring } from './motion';

/* Pulls its child toward the pointer while hovered (vivid theme, fine
   pointers only). Renders a plain inline-block wrapper in regular.
     <Magnetic strength={0.35}><Button …/></Magnetic> */
function Magnetic({ strength = 0.3, className, children }) {
  const { isVivid } = useTheme();
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, spring.wobbly);
  const sy = useSpring(y, spring.wobbly);

  if (!isVivid) return <span className={className} style={{ display: 'inline-block' }}>{children}</span>;

  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      className={className}
      style={{ display: 'inline-block', x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.span>
  );
}

export default Magnetic;
