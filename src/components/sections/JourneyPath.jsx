import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { badgeBloom, gridContainer, reducedReveal } from '@/lib/motion';
import { inlineSvg } from '@/utils/svg';
import daisyRaw from '@/assets/svg/daisy-yellow.svg?raw';
import cloverRaw from '@/assets/svg/clover-blue.svg?raw';
import heartRaw from '@/assets/svg/heart-red.svg?raw';
import starRaw from '@/assets/svg/star-blue.svg?raw';
import './JourneyPath.css';

// Stop markers come from the shared brand-shape set (same geometry the hero
// morphs through), tinted via the wrapper's `color` — flower badges, not
// plain circles.
const SHAPES = {
  daisy: inlineSvg(daisyRaw),
  clover: inlineSvg(cloverRaw),
  heart: inlineSvg(heartRaw),
  star: inlineSvg(starRaw),
};

// Shiran's road to the studio — straight from the portfolio's "Me" page.
// x/y pin each stop to the road's anchor points (percentages of the 1200×300
// viewBox below); `high` stops sit on the road's upper crests and hang their
// captions above the dot so nothing collides with the descending curve.
// Stops are tinted with the site's three dominant brand colours only —
// yellow, blue, orange — never the light/deep tints, so the path reads as the
// same palette as the rest of the page.
const STOPS = [
  {
    shape: 'daisy',
    tint: 'yellow',
    label: 'Shenkar College',
    detail: 'B.Des Industrial Design',
    x: '5%',
    y: '70%',
  },
  {
    shape: 'clover',
    tint: 'blue',
    label: 'HAPE, China',
    detail: 'Toy-design internship',
    x: '35%',
    y: '30%',
    high: true,
  },
  {
    shape: 'heart',
    tint: 'orange',
    label: 'Tiny Love',
    detail: '5 years, 10+ products shipped',
    x: '65%',
    y: '70%',
  },
  {
    shape: 'star',
    tint: 'yellow',
    label: 'SHA Studio',
    detail: 'Your product next?',
    x: '95%',
    y: '30%',
    high: true,
    to: '/inquire',
  },
];

// One smooth wave through the four anchors: (60,210) (420,90) (780,210) (1140,90).
const ROAD =
  'M 60 210 C 180 210 300 90 420 90 S 660 210 780 210 S 1020 90 1140 90';

/**
 * "How I got here" — the designer's journey as a dotted play-path winding
 * across the cream canvas itself (no panel). The road draws in as it scrolls
 * into view and the stops bloom along it; the last stop is a live link to
 * the inquiry page. Under 768px it folds into a vertical dashed spine.
 */
function JourneyPath() {
  const reduce = useReducedMotion();

  return (
    <div className="container">
      <h2 className="journey__title">How I got here</h2>

      <motion.ol
        className="journey__path"
        variants={reduce ? reducedReveal : gridContainer}
        initial={reduce ? 'show' : 'hidden'}
        whileInView="show"
        viewport={{ once: true, margin: '-120px' }}
      >
        {/* The dotted road. A solid stroke animating pathLength inside a mask
            reveals the dotted stroke tip-to-tail without breaking the dashes. */}
        <svg
          className="journey__road"
          viewBox="0 0 1200 300"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          {!reduce && (
            <defs>
              <mask id="journey-road-mask" maskUnits="userSpaceOnUse">
                <motion.path
                  d={ROAD}
                  stroke="#fff"
                  strokeWidth="24"
                  strokeLinecap="round"
                  variants={{
                    hidden: { pathLength: 0 },
                    show: {
                      pathLength: 1,
                      transition: { duration: 1.8, ease: 'easeOut' },
                    },
                  }}
                />
              </mask>
            </defs>
          )}
          <path
            className="journey__road-dots"
            d={ROAD}
            mask={reduce ? undefined : 'url(#journey-road-mask)'}
          />
        </svg>

        {STOPS.map((stop) => {
          const body = (
            <>
              <span
                className={`journey__dot journey__dot--${stop.tint}`}
                aria-hidden="true"
              >
                <span
                  className="journey__dot-shape"
                  dangerouslySetInnerHTML={{ __html: SHAPES[stop.shape] }}
                />
              </span>
              <span className="journey__meta">
                <strong className="journey__label">{stop.label}</strong>
                <span className="journey__detail">{stop.detail}</span>
              </span>
            </>
          );

          return (
            <motion.li
              className={`journey__stop${stop.high ? ' journey__stop--high' : ''}`}
              key={stop.label}
              style={{ '--stop-x': stop.x, '--stop-y': stop.y }}
              variants={reduce ? reducedReveal : badgeBloom}
            >
              {stop.to ? (
                <Link className="journey__stop-link" to={stop.to}>
                  {body}
                </Link>
              ) : (
                body
              )}
            </motion.li>
          );
        })}
      </motion.ol>
    </div>
  );
}

export default JourneyPath;
