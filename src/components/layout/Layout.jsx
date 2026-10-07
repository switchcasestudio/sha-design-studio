import { useLayoutEffect, useState } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import Navbar from './Navbar';
import Footer from './Footer';
import ThemeSwitcher from '@/theme/ThemeSwitcher';
import { useTheme } from '@/theme/ThemeContext';
import Cursor from '@/theme/vivid/Cursor';
import SmoothScroll, { getLenis } from '@/theme/vivid/SmoothScroll';
import { ease } from '@/theme/vivid/motion';
import markOnPool from '@/assets/logos/sha-mark-on-pool.svg';
import './Layout.css';

/* Jump to the top when the route changes. Explicitly instant so the
   global `scroll-behavior: smooth` (for in-page anchors) doesn't turn
   every navigation into a slow crawl up the old page.
   In vivid the jump waits until the curtain covers the old page instead
   (see onExitComplete below), so the old page doesn't snap up mid-wipe. */
function ScrollToTop({ skip }) {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    if (skip) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, skip]);

  return null;
}

function scrollTopNow() {
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}

/* Freeze the outlet element this route mounted with. During AnimatePresence
   exits the old wrapper stays mounted while the router already points at the
   new location — a live <Outlet /> would re-resolve to the WRONG page there
   (and an exiting ProjectDetail would lose its :projectId param and fire its
   not-found <Navigate> redirect mid-transition, hijacking navigation). */
function FrozenOutlet() {
  const outlet = useOutlet();
  const [frozen] = useState(outlet);
  return frozen;
}

// The window's ground per route. Panels (and the footer) are inset from the
// window, so the gaps around them must show the page's own colour.
const GROUNDS = [
  [/^\/projects/, 'tomato'],
  [/^\/services/, 'yolk'],
  [/^\/about/, 'pool'],
];

/* ---- Vivid page transition: a three-colour curtain ----
   Leaving a page, yolk, tomato then pool panels sweep up over it and the Sha
   mark pops in on the pool. The new page mounts under the closed curtain,
   which then lifts away in the same order. The curtain lives inside each
   page wrapper and is driven by the wrapper's variants, so it stays in step
   with AnimatePresence. */
const CURTAIN = ['yolk', 'tomato', 'pool'];

const pageVariants = {
  initial: {},
  enter: {},
  // Holds the exiting page until its curtain has fully closed.
  exit: { opacity: 1, transition: { duration: 0.75 } },
};

const panelVariants = {
  initial: { y: '0%' },
  enter: (i) => ({
    y: '-100%',
    transition: { duration: 0.75, ease: ease.inOut, delay: 0.15 + (2 - i) * 0.07 },
  }),
  exit: (i) => ({
    y: ['100%', '0%'],
    transition: { duration: 0.55, ease: ease.inOut, delay: i * 0.07 },
  }),
};

const markVariants = {
  initial: { scale: 1, rotate: 0, opacity: 1 },
  enter: { scale: 0.4, rotate: 20, opacity: 0, transition: { duration: 0.25 } },
  exit: {
    scale: [0.3, 1],
    rotate: [-30, 0],
    opacity: [0, 1],
    transition: { type: 'spring', stiffness: 380, damping: 14, delay: 0.32 },
  },
};

function Curtain() {
  return (
    <div className="page-curtain" aria-hidden="true">
      {CURTAIN.map((color, i) => (
        <motion.div
          key={color}
          custom={i}
          variants={panelVariants}
          className={`page-curtain__panel page-curtain__panel--${color}`}
        >
          {color === 'pool' && (
            <motion.img
              src={markOnPool}
              alt=""
              className="page-curtain__mark"
              variants={markVariants}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}

function Layout() {
  const { pathname } = useLocation();
  const { theme, isVivid } = useTheme();
  const ground =
    GROUNDS.find(([pattern]) => pattern.test(pathname))?.[1] ?? 'cream';

  return (
    <div className={`layout layout--${ground}`}>
      <ScrollToTop skip={isVivid} />
      <Navbar />
      <main className="layout__main">
        {isVivid ? (
          <AnimatePresence mode="wait" onExitComplete={scrollTopNow}>
            <motion.div
              /* Keyed on theme too, so switching replays the page's entrance */
              key={`${pathname}:${theme}`}
              variants={pageVariants}
              initial="initial"
              animate="enter"
              exit="exit"
            >
              <FrozenOutlet />
              <Curtain />
            </motion.div>
          </AnimatePresence>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              /* Keyed on theme too, so switching replays the page's entrance */
              key={`${pathname}:${theme}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              /* Quick tweens, not springs: with mode="wait" the main area
                 is empty between pages, so a slow settle reads as a flash. */
              exit={{
                opacity: 0,
                transition: { duration: 0.12, ease: 'easeIn' },
              }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <FrozenOutlet />
            </motion.div>
          </AnimatePresence>
        )}
      </main>
      <Footer />
      {isVivid && (
        <>
          <SmoothScroll />
          <ScrollProgress />
          <Cursor />
        </>
      )}
      <ThemeSwitcher />
    </div>
  );
}

export default Layout;
