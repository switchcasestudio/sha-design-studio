import { useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Navbar from './Navbar';
import Footer from './Footer';
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
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
