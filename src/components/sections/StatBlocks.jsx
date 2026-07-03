import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { gridContainer, gridCard, reducedReveal } from '@/lib/motion';
import './StatBlocks.css';

// The studio in four toy blocks. `value` counts up in view; `symbol` renders
// as-is (there's no counting to infinity, however hard the babies try).
const STATS = [
  { value: 10, suffix: '+', label: 'products shipped' },
  { value: 6, suffix: '+', label: 'years in baby products' },
  { value: 5, suffix: '', label: 'brands worldwide' },
  { symbol: '∞', label: 'giggles tested' },
];

const COUNT_MS = 900;

// Ease-out count-up that runs once when the panel scrolls into view.
function CountUp({ value, suffix, run }) {
  const [shown, setShown] = useState(run ? value : 0);

  useEffect(() => {
    if (!run) return undefined;
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / COUNT_MS, 1);
      const eased = 1 - (1 - t) ** 3;
      setShown(Math.round(eased * value));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [run, value]);

  return (
    <>
      {shown}
      {suffix}
    </>
  );
}

/**
 * "By the numbers" — blue panel, four tilted cream toy blocks with counting
 * numerals. The credibility beat, dressed as play.
 */
function StatBlocks() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });
  const count = reduce || inView;

  return (
    <div className="container">
      <div className="stats__panel" ref={ref}>
        <h2 className="sr-only">The studio by the numbers</h2>

        <motion.ul
          className="stats__row"
          variants={reduce ? reducedReveal : gridContainer}
          initial={reduce ? 'show' : 'hidden'}
          whileInView="show"
          viewport={{ once: true, margin: '-120px' }}
        >
          {STATS.map((stat) => (
            <motion.li
              className="stats__block"
              key={stat.label}
              variants={reduce ? reducedReveal : gridCard}
            >
              <span className="stats__number">
                {stat.symbol ?? (
                  <CountUp
                    value={stat.value}
                    suffix={stat.suffix}
                    run={reduce ? true : count}
                  />
                )}
              </span>
              <span className="stats__label">{stat.label}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
}

export default StatBlocks;
