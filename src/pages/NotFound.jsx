import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import BrandShape from '@/components/ui/BrandShape';
import { useTheme } from '@/theme/ThemeContext';
import { spring } from '@/theme/vivid/motion';
import Magnetic from '@/theme/vivid/Magnetic';
import Button from '@/components/ui/Button';
import { rise, stagger } from '@/lib/motion';
import './NotFound.css';

// Vivid 404: a playroom. The digits drop in and every digit and toy shape
// can be picked up and flung around the page (they stay where you drop them).
const TOYS = [
  { shape: 'daisy', color: 'var(--yolk)', x: '8%', y: '14%', size: 120, r: -12 },
  { shape: 'heart', color: 'var(--tomato)', x: '82%', y: '10%', size: 84, r: 14 },
  { shape: 'star', color: 'var(--pool)', x: '14%', y: '68%', size: 70, r: 8 },
  { shape: 'clover', color: 'var(--pool)', x: '86%', y: '62%', size: 104, r: -18 },
  { shape: 'tulip', color: 'var(--yolk)', x: '70%', y: '82%', size: 64, r: 6 },
  { shape: 'flower2', color: 'var(--tomato)', x: '28%', y: '86%', size: 56, r: -6 },
];

function VividNotFound() {
  const boxRef = useRef(null);
  const drag = {
    drag: true,
    dragConstraints: boxRef,
    dragElastic: 0.4,
    dragTransition: { power: 0.35, timeConstant: 260 },
    whileHover: { scale: 1.08 },
    whileDrag: { scale: 1.2, rotate: 10, zIndex: 5 },
  };

  return (
    <section ref={boxRef} className="notfound notfound--vivid ground-cream">
      <div className="notfound__toys" aria-hidden="true">
        {TOYS.map((t, i) => (
          <motion.div
            key={t.shape}
            className="notfound__toy"
            style={{ left: t.x, top: t.y, width: t.size, color: t.color }}
            initial={{ scale: 0, rotate: t.r - 90 }}
            animate={{ scale: 1, rotate: t.r }}
            transition={{ ...spring.bouncy, delay: 0.6 + i * 0.08 }}
            {...drag}
          >
            <BrandShape shape={t.shape} />
          </motion.div>
        ))}
      </div>

      <div className="container notfound__inner">
        <h1 className="notfound__code" aria-label="404">
          {['4', '0', '4'].map((d, i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              className={`notfound__digit${d === '0' ? ' hl' : ''}`}
              initial={{ y: -500, rotate: (i - 1) * 40 }}
              animate={{ y: 0, rotate: 0 }}
              transition={{ ...spring.bouncy, delay: 0.1 + i * 0.12 }}
              {...drag}
            >
              {d}
            </motion.span>
          ))}
        </h1>
        <motion.p
          className="notfound__title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring.soft, delay: 0.6 }}
        >
          This page wandered off to play
        </motion.p>
        <motion.p
          className="notfound__text"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring.soft, delay: 0.7 }}
        >
          The page you&apos;re looking for doesn&apos;t exist — but there are
          plenty of other things to explore.
          <span className="notfound__hint"> Psst: everything here can be picked up.</span>
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...spring.bouncy, delay: 0.85 }}
        >
          <Magnetic strength={0.4}>
            <Button as={Link} to="/" variant="primary" size="md">
              Go back home
            </Button>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
}

// Cream ground: tomato headline with one pool block, ink text, one tomato
// pill home. Each line does the single 16px rise, staggered.
function NotFound() {
  const reduce = useReducedMotion();
  const { isVivid } = useTheme();
  if (isVivid) return <VividNotFound />;
  const riseIn = (i) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { ...rise, delay: i * stagger },
  });

  return (
    <section className="notfound ground-cream">
      <div className="container notfound__inner">
        <motion.h1 className="notfound__code" {...riseIn(0)}>
          4<span className="hl">0</span>4
        </motion.h1>
        <motion.p className="notfound__title" {...riseIn(1)}>
          This page wandered off to play
        </motion.p>
        <motion.p className="notfound__text" {...riseIn(2)}>
          The page you&apos;re looking for doesn&apos;t exist — but there are
          plenty of other things to explore.
        </motion.p>
        <motion.div {...riseIn(3)}>
          <Button as={Link} to="/" variant="primary" size="md">
            Go back home
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

export default NotFound;
