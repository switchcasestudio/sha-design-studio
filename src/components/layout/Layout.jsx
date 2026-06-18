import { useLayoutEffect, useState } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Navbar from './Navbar';
import Footer from './Footer';
import TrailingCursorText from '@/components/ui/TrailingCursorText';
import './Layout.css';

/* Jump to the top when the route changes. Explicitly instant so the
   global `scroll-behavior: smooth` (for in-page anchors) doesn't turn
   every navigation into a slow crawl up the old page. */
function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
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

function Layout() {
  const { pathname } = useLocation();

  return (
    <div className="layout">
      <ScrollToTop />
      <Navbar />
      <main className="layout__main">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
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
      </main>
      <Footer />
      {/* Cursor follower — restricted to the hero: only shows while the cursor
          is over the home hero section (which only exists on the home page).
          pointer-events:none, so it never blocks UI. */}
      <TrailingCursorText boundsSelector=".home-assemble" />
    </div>
  );
}

export default Layout;
