import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useReducedMotion, useTransform } from 'motion/react';
import Button from '@/components/ui/Button';
import BrandShape from '@/components/ui/BrandShape';
import { reducedReveal, slideUp } from '@/lib/motion';
import { useTheme } from '@/theme/ThemeContext';
import Magnetic from '@/theme/vivid/Magnetic';
import WipeHeading from '@/theme/vivid/home/WipeHeading';
import { usePointerParallax } from '@/theme/vivid/home/usePointerParallax';
import { spring } from '@/theme/vivid/motion';
import './CtaBand.css';

// The site's closing beat — a sand closing panel inset from the window, a few
// still brand motifs, one big headline (with its one .hl block) and the
// section's single capsule. Home, Services and About all close on it.
// Copy is passed in so each page can speak for itself; the look is shared.

// Vivid: the panel springs up from small, its motifs swim against the
// pointer, and a click anywhere on the panel bursts a handful of brand shapes.
const vividPanel = {
  hidden: { opacity: 0, y: 120, scale: 0.88 },
  show: { opacity: 1, y: 0, scale: 1, transition: spring.soft },
};

const BURST_SHAPES = ['daisy', 'clover', 'flower2', 'heart', 'star', 'splat1', 'blob1', 'tulip'];
const BURST_TINTS = ['var(--yolk)', 'var(--pool)', 'var(--tomato)'];
let burstId = 0;

function ParallaxMotif({ shape, className, pointer, depth }) {
  const x = useTransform(pointer.x, (v) => v * depth);
  const y = useTransform(pointer.y, (v) => v * depth);
  return (
    <motion.span className={`cta-band__float ${className}`} style={{ x, y }}>
      <BrandShape shape={shape} className="cta-band__spin" />
    </motion.span>
  );
}

function CtaBand({ title, text, buttonLabel, to = '/inquire' }) {
  const ref = useRef(null);
  const panelRef = useRef(null);
  const reduce = useReducedMotion();
  const { isVivid } = useTheme();
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const pointer = usePointerParallax(panelRef, isVivid);
  const [bursts, setBursts] = useState([]);

  const button = (
    <Button as={Link} to={to} variant="capsule" size="lg">
      {buttonLabel}
    </Button>
  );

  const onPanelClick = (e) => {
    if (!isVivid || e.target.closest('a, button')) return;
    const r = panelRef.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const pieces = Array.from({ length: 7 }, (_, i) => {
      const angle = (i / 7) * Math.PI * 2 + Math.random() * 0.6;
      const dist = 90 + Math.random() * 120;
      return {
        id: ++burstId,
        x,
        y,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist - 40,
        rot: (Math.random() - 0.5) * 540,
        size: 26 + Math.random() * 34,
        shape: BURST_SHAPES[Math.floor(Math.random() * BURST_SHAPES.length)],
        tint: BURST_TINTS[i % BURST_TINTS.length],
      };
    });
    setBursts((prev) => [...prev.slice(-28), ...pieces]);
  };

  const removeBurst = (id) => setBursts((prev) => prev.filter((b) => b.id !== id));

  return (
    <motion.section
      ref={ref}
      className="cta-band"
      variants={reduce ? reducedReveal : isVivid ? vividPanel : slideUp}
      initial={reduce ? 'show' : 'hidden'}
      animate={inView ? 'show' : undefined}
    >
      <div
        ref={panelRef}
        className={`cta-band__panel panel ground-sand${isVivid ? ' cta-band__panel--vivid' : ''}`}
        onClick={isVivid ? onPanelClick : undefined}
        data-cursor={isVivid ? 'Click!' : undefined}
      >
        {isVivid ? (
          <>
            <ParallaxMotif shape="daisy" className="cta-band__motif cta-band__motif--daisy" pointer={pointer} depth={-80} />
            <ParallaxMotif shape="clover" className="cta-band__motif cta-band__motif--clover" pointer={pointer} depth={110} />
            <ParallaxMotif shape="flower2" className="cta-band__motif cta-band__motif--flower" pointer={pointer} depth={-150} />
            {bursts.map((b) => (
              <motion.span
                key={b.id}
                className="cta-band__burst"
                aria-hidden="true"
                style={{ left: b.x, top: b.y, width: b.size, color: b.tint }}
                initial={{ x: '-50%', y: '-50%', scale: 0, rotate: 0, opacity: 1 }}
                animate={{
                  x: `calc(-50% + ${b.dx}px)`,
                  y: [`-50%`, `calc(-50% + ${b.dy}px)`, `calc(-50% + ${b.dy + 160}px)`],
                  scale: [0, 1.2, 1],
                  rotate: b.rot,
                  opacity: [1, 1, 0],
                }}
                transition={{ duration: 1.3, ease: [0.2, 0.8, 0.4, 1] }}
                onAnimationComplete={() => removeBurst(b.id)}
              >
                <BrandShape shape={b.shape} />
              </motion.span>
            ))}
          </>
        ) : (
          <>
            <BrandShape shape="daisy" className="cta-band__motif cta-band__motif--daisy" />
            <BrandShape shape="clover" className="cta-band__motif cta-band__motif--clover" />
            <BrandShape shape="flower2" className="cta-band__motif cta-band__motif--flower" />
          </>
        )}

        <div className="container cta-band__inner">
          <WipeHeading as="h2" className="cta-band__title">
            {title}
          </WipeHeading>
          <p className="cta-band__text">{text}</p>
          {isVivid ? <Magnetic strength={0.45}>{button}</Magnetic> : button}
        </div>
      </div>
    </motion.section>
  );
}

export default CtaBand;
