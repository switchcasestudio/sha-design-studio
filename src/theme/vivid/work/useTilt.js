import { useMotionValue, useSpring, useTransform } from 'motion/react';
import { spring } from '../motion';

/* 3D pointer tilt for a card (vivid theme only — the regular site has no
   tilts). Returns a style object of motion values + pointer handlers; spread
   both onto a motion element. Also exposes --mx / --my (0–100%) so CSS can
   place a glare highlight under the pointer. Mouse pointers only. */
export function useTilt(max = 8) {
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, spring.soft);
  const sy = useSpring(py, spring.soft);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const mx = useTransform(sx, (v) => `${v * 100}%`);
  const my = useTransform(sy, (v) => `${v * 100}%`);

  const onPointerMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onPointerLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return {
    style: { rotateX, rotateY, transformPerspective: 1100, '--mx': mx, '--my': my },
    handlers: { onPointerMove, onPointerLeave },
  };
}
