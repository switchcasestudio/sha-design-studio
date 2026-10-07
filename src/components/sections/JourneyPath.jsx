import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useTheme } from '@/theme/ThemeContext';
import WipeHeading from '@/theme/vivid/home/WipeHeading';
import { spring } from '@/theme/vivid/motion';
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

function StopBody({ stop }) {
  return (
    <>
      <span className={`journey__dot journey__dot--${stop.tint}`} aria-hidden="true">
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
}

const vividStop = {
  off: { opacity: 0, scale: 0.3, y: 40 },
  on: { opacity: 1, scale: 1, y: 0, transition: spring.bouncy },
};

/* Vivid, desktop: the section pins (CSS sticky inside a tall scroller) and
   scrolling draws the road. A tomato traveller rides the tip of the line and
   each stop springs up the moment the line reaches it. */
function VividJourneyDesktop() {
  const scrollerRef = useRef(null);
  const roadRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollerRef,
    offset: ['start start', 'end end'],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const draw = useTransform(smooth, [0.04, 0.88], [0, 1], { clamp: true });
  const tx = useMotionValue('5%');
  const ty = useMotionValue('70%');
  const [reached, setReached] = useState(0);

  useMotionValueEvent(draw, 'change', (v) => {
    const path = roadRef.current;
    if (path) {
      const pt = path.getPointAtLength(v * path.getTotalLength());
      tx.set(`${(pt.x / 1200) * 100}%`);
      ty.set(`${(pt.y / 300) * 100}%`);
    }
    // Anchors sit at roughly equal thirds of the road's length.
    const count = v <= 0.001 ? 0 : Math.min(4, Math.floor(v * 3 + 0.04) + 1);
    if (count !== reached) setReached(count);
  });

  return (
    <div ref={scrollerRef} className="journey-vivid">
      <div className="journey-vivid__stage">
        <div className="container">
          <div className="journey-vivid__head">
            <WipeHeading as="h2" className="journey__title">
              How I <span className="hl">got here</span>
            </WipeHeading>
            {/* Odometer: a strip of 00–04 that springs to the stop reached */}
            <span className="journey-vivid__count" aria-hidden="true">
              <span className="journey-vivid__digits">
                <motion.span
                  className="journey-vivid__strip"
                  animate={{ y: `${-reached * 1.1}em` }}
                  transition={spring.bouncy}
                >
                  {[0, 1, 2, 3, 4].map((n) => (
                    <span key={n}>{String(n).padStart(2, '0')}</span>
                  ))}
                </motion.span>
              </span>
              <span className="journey-vivid__total">/ 04</span>
            </span>
          </div>

          <ol className="journey__path journey__path--vivid">
            <svg
              className="journey__road"
              viewBox="0 0 1200 300"
              preserveAspectRatio="none"
              fill="none"
              aria-hidden="true"
            >
              <defs>
                <mask id="journey-vivid-mask" maskUnits="userSpaceOnUse">
                  <motion.path
                    ref={roadRef}
                    d={ROAD}
                    stroke="#fff"
                    strokeWidth="24"
                    strokeLinecap="round"
                    style={{ pathLength: draw }}
                  />
                </mask>
              </defs>
              <path className="journey__road-ghost" d={ROAD} />
              <path
                className="journey__road-dots"
                d={ROAD}
                mask="url(#journey-vivid-mask)"
              />
            </svg>

            <motion.span
              className="journey-vivid__traveller"
              aria-hidden="true"
              style={{ left: tx, top: ty }}
            />

            {STOPS.map((stop, i) => (
              <motion.li
                key={stop.label}
                className={`journey__stop${stop.high ? ' journey__stop--high' : ''}`}
                style={{ '--stop-x': stop.x, '--stop-y': stop.y }}
                data-active={i < reached ? 'true' : 'false'}
                variants={vividStop}
                initial="off"
                animate={i < reached ? 'on' : 'off'}
              >
                {stop.to ? (
                  <Link className="journey__stop-link" to={stop.to} data-cursor="Let's talk">
                    <StopBody stop={stop} />
                  </Link>
                ) : (
                  <StopBody stop={stop} />
                )}
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

/* Vivid, phones: the vertical spine stays, each stop bounces in on scroll. */
function VividJourneyMobile() {
  return (
    <div className="container">
      <WipeHeading as="h2" className="journey__title">
        How I <span className="hl">got here</span>
      </WipeHeading>
      <ol className="journey__path">
        {STOPS.map((stop, i) => (
          <motion.li
            key={stop.label}
            className={`journey__stop${stop.high ? ' journey__stop--high' : ''}`}
            data-active="true"
            initial={{ opacity: 0, x: -50, scale: 0.6 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ ...spring.bouncy, delay: i * 0.05 }}
          >
            {stop.to ? (
              <Link className="journey__stop-link" to={stop.to}>
                <StopBody stop={stop} />
              </Link>
            ) : (
              <StopBody stop={stop} />
            )}
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

/**
 * "How I got here" — the designer's journey as a dotted play-path winding
 * across the cream canvas itself (no panel). The road draws in as it scrolls
 * into view and the stops bloom along it; the last stop is a live link to
 * the inquiry page. Under 768px it folds into a vertical dashed spine.
 */
function JourneyPath() {
  const reduce = useReducedMotion();
  const { isVivid } = useTheme();
  const desktop = useMediaQuery('(min-width: 768px)');

  if (isVivid) return desktop ? <VividJourneyDesktop /> : <VividJourneyMobile />;

  return (
    <div className="container">
      <h2 className="journey__title">
        How I <span className="hl">got here</span>
      </h2>

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
