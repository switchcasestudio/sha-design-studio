import { motion, useSpring } from 'motion/react';
import { spring } from '../motion';

/* 3D tilt toward the pointer (vivid only — callers render it only when
   useTheme().isVivid). Mouse only; touch leaves it flat. */
function Tilt({ max = 6, className, style, children, ...props }) {
  const rx = useSpring(0, spring.soft);
  const ry = useSpring(0, spring.soft);

  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rx.set(-py * max * 2);
    ry.set(px * max * 2);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      className={className}
      style={{ ...style, rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default Tilt;
