import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import Button from '@/components/ui/Button';
import { rise, stagger } from '@/lib/motion';
import './NotFound.css';

// Cream ground: tomato headline with one pool block, ink text, one tomato
// pill home. Each line does the single 16px rise, staggered.
function NotFound() {
  const reduce = useReducedMotion();
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
