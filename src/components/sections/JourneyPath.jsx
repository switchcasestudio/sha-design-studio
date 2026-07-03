import { motion, useReducedMotion } from 'motion/react';
import { badgeBloom, gridContainer, reducedReveal } from '@/lib/motion';
import './JourneyPath.css';

// Shiran's road to the studio — straight from the portfolio's "Me" page.
const STOPS = [
  {
    emoji: '🎓',
    label: 'Shenkar College',
    detail: 'B.Des Industrial Design',
  },
  {
    emoji: '🇨🇳',
    label: 'HAPE, China',
    detail: 'Toy-design internship',
  },
  {
    emoji: '🧸',
    label: 'Tiny Love',
    detail: '5 years, 10+ products shipped',
  },
  {
    emoji: '🚀',
    label: 'SHA Studio',
    detail: 'Your product next?',
  },
];

/**
 * "How I got here" — the designer's journey as a dashed play-path across a
 * yellow panel, stops popping in one after another. Personality the old
 * homepage never had, borrowed from the personal portfolio.
 */
function JourneyPath() {
  const reduce = useReducedMotion();

  return (
    <div className="container">
      <div className="journey__panel">
        <h2 className="journey__title">How I got here</h2>

        <motion.ol
          className="journey__path"
          variants={reduce ? reducedReveal : gridContainer}
          initial={reduce ? 'show' : 'hidden'}
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          {STOPS.map((stop) => (
            <motion.li
              className="journey__stop"
              key={stop.label}
              variants={reduce ? reducedReveal : badgeBloom}
            >
              <span className="journey__dot" aria-hidden="true">
                {stop.emoji}
              </span>
              <strong className="journey__label">{stop.label}</strong>
              <span className="journey__detail">{stop.detail}</span>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </div>
  );
}

export default JourneyPath;
