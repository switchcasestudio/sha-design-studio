import { useRef } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react';
import './ScrollMarquee.css';

const wrap = (min, max, v) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/* Endless band of giant text that drifts on its own and speeds up (and
   skews) with scroll velocity, reversing when you scroll up. Vivid theme
   only; decorative, so it's hidden from assistive tech. */
function ScrollMarquee({ text, speed = 3, className = '' }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [-1500, 0, 1500], [-5, 0, 5], { clamp: false });
  const skewX = useTransform(velocity, [-2000, 2000], [12, -12]);
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    const b = boost.get();
    if (b < 0) dir.current = -1;
    else if (b > 0) dir.current = 1;
    const move = dir.current * speed * (delta / 1000) * (1 + Math.abs(b));
    baseX.set(baseX.get() - move);
  });

  return (
    <div className={`scroll-marquee ${className}`.trim()} aria-hidden="true">
      <motion.div className="scroll-marquee__row" style={{ x, skewX }}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="scroll-marquee__item">
            {text}
            <span className="scroll-marquee__dot">✺</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default ScrollMarquee;
