import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { navigation } from '@/utils/siteConfig';
import { useHeroNav } from '@/context/HeroNavContext';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { inlineSvg } from '@/utils/svg';
import blobBlueRaw from '@/assets/svg/blob-blue.svg?raw';
import daisyRaw from '@/assets/svg/daisy-yellow.svg?raw';
import flowerRaw from '@/assets/svg/flower-red.svg?raw';
import './HeroNav.css';

// One solid brand motif per nav item, scattered around the hero. The label sits
// INSIDE the shape, so each shape is solid-centred and the tint/text-colour are
// paired for contrast (white on blue, ink on yellow). Geometry is colour-
// agnostic (inlineSvg → currentColor), tinted via the wrapper's `color`.
const ITEMS = [
  {
    html: inlineSvg(blobBlueRaw),
    tint: 'var(--color-blue)',
    ink: 'var(--text-on-blue)',
    dy: '0.18em', // blob's solid mass sits low — drop the label onto it
    pos: { x: '15%', y: '36%' },
  },
  {
    html: inlineSvg(daisyRaw),
    tint: 'var(--color-yellow)',
    ink: 'var(--color-white)', // match Work/About (light), not the dark on-yellow ink
    pos: { x: '85%', y: '30%' },
  },
  {
    html: inlineSvg(flowerRaw),
    tint: 'var(--color-orange)',
    ink: 'var(--text-on-orange)',
    pos: { x: '80%', y: '74%' },
  },
];

const BADGE_HOVER = { type: 'spring', stiffness: 380, damping: 14 };

/**
 * The hero's navigation: the nav links rendered as playful brand shapes spread
 * around the hero, each with its label nested inside the shape. Visible while in
 * the hero; on scroll it lifts + fades out as the header's text nav fades in
 * (both driven by `heroActive`).
 */
function HeroNav() {
  const { heroActive } = useHeroNav();
  const reduce = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 767px)');

  // The cross-fade to the header's text nav is a desktop affordance. On mobile
  // the header is a hamburger that's always available, so the playful shape-nav
  // never needs to hand off — keep it present and let it simply scroll away with
  // the hero (no fade-out, which is what created the "disappearing / empty
  // space" glitch). Below the breakpoint the nav is a static in-flow row, so it
  // scrolls naturally with the section.
  const visible = isMobile || heroActive;

  return (
    <motion.nav
      className="hero-nav"
      aria-label="Primary"
      aria-hidden={!visible}
      initial={false}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: -18 }}
      transition={reduce ? { duration: 0 } : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {navigation.map((item, i) => {
        const { html, tint, ink, dy, pos } = ITEMS[i];
        return (
          <Link
            key={item.href}
            to={item.href}
            className="hero-nav__link"
            tabIndex={visible ? 0 : -1}
            style={{ '--x': pos.x, '--y': pos.y, pointerEvents: visible ? 'auto' : 'none' }}
          >
            <motion.span
              className="hero-nav__badge"
              style={{ color: tint }}
              initial={false}
              whileHover={reduce ? undefined : { scale: 1.12 }}
              whileTap={reduce ? undefined : { scale: 0.96 }}
              transition={BADGE_HOVER}
            >
              <span
                className="hero-nav__shape"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: html }}
              />
              <span
                className="hero-nav__label"
                style={{ color: ink, '--label-dy': dy }}
              >
                {item.label}
              </span>
            </motion.span>
          </Link>
        );
      })}
    </motion.nav>
  );
}

export default HeroNav;
