import { useEffect } from 'react';
import { useMotionValue, useSpring } from 'motion/react';

/* Normalised pointer position (-0.5 … 0.5 on each axis) relative to `ref`,
   smoothed with a spring. Only tracks mouse/pen, and only while `enabled`. */
export function usePointerParallax(ref, enabled = true) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 90, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 90, damping: 18, mass: 0.6 });

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return undefined;
    const onMove = (e) => {
      if (e.pointerType === 'touch') return;
      const r = el.getBoundingClientRect();
      x.set((e.clientX - r.left) / r.width - 0.5);
      y.set((e.clientY - r.top) / r.height - 0.5);
    };
    const onLeave = () => {
      x.set(0);
      y.set(0);
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [ref, enabled, x, y]);

  return { x: sx, y: sy };
}
