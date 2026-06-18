import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { navigation } from '@/utils/siteConfig';
import Logo from '@/components/ui/Logo';
import './Navbar.css';

const THEMES = {
  '/projects': { route: 'navbar--projects', logo: 'white' },
  '/services': { route: 'navbar--services', logo: 'orange' },
  '/about':    { route: 'navbar--about',    logo: 'yellow' },
  '/inquire':  { route: 'navbar--inquire',  logo: 'orange' },
};

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  const toggleRef = useRef(null);
  const overlayRef = useRef(null);
  const closeRef = useRef(null);

  // Elevation cue: shadow + condensed padding once the page scrolls under the bar
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Prefix match so nested routes (e.g. /projects/:id) keep their theme
  const themeKey = Object.keys(THEMES).find((path) =>
    pathname.startsWith(path)
  );
  const theme = THEMES[themeKey] || { route: 'navbar--home', logo: 'orange' };
  const closeMobile = () => setMobileOpen(false);

  // ---- Open-menu side effects: scroll lock + focus management ----
  // Runs ONLY while the menu is open and fully tears down on close. The lock
  // lives on document.body (never on an ancestor of the GSAP-pinned home
  // section) and we never call ScrollTrigger.refresh() here, so the home pin is
  // untouched — see HomeAssemble. Scroll is locked while open, so there is no
  // scroll-vs-pin conflict during the open state.
  useEffect(() => {
    if (!mobileOpen) return undefined;

    const { body } = document;
    const prevOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    // Move focus into the dialog (the close button)
    closeRef.current?.focus();

    const getFocusable = () =>
      overlayRef.current
        ? Array.from(
            overlayRef.current.querySelectorAll(
              'a[href], button:not([disabled])'
            )
          )
        : [];

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;
      // Trap focus within the overlay
      const items = getFocusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      body.style.overflow = prevOverflow; // restore exactly what was there
      document.removeEventListener('keydown', onKeyDown);
      // Return focus to the trigger (standard dialog pattern)
      toggleRef.current?.focus();
    };
  }, [mobileOpen]);

  // Cross-fade + subtle scale, growing from the hamburger (transform-origin set
  // on the element below). Enter ~200ms ease-out; exit faster (~140ms). Reduced
  // motion collapses to an instant opacity swap with no scale.
  const overlayMotion = reduce
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0 } },
        exit: { opacity: 0, transition: { duration: 0 } },
      }
    : {
        initial: { opacity: 0, scale: 0.97 },
        animate: {
          opacity: 1,
          scale: 1,
          transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
        },
        exit: {
          opacity: 0,
          scale: 0.97,
          transition: { duration: 0.14, ease: [0.65, 0, 0.35, 1] },
        },
      };

  return (
    <header
      className={`navbar ${theme.route}${scrolled ? ' navbar--scrolled' : ''}`}
    >
      <div className="navbar__inner container">
        <Link
          to="/"
          className="navbar__logo"
          onClick={closeMobile}
          aria-label="Sha Design Studio — Home"
        >
          <motion.div
            whileHover={{ scale: 1.08, rotate: -3 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <Logo size={48} variant={theme.logo} />
          </motion.div>
        </Link>

        <nav className="navbar__nav" aria-label="Primary">
          <ul className="navbar__list">
            {navigation.map((item) => (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `navbar__link${isActive ? ' navbar__link--active' : ''}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Shared-layout pill springs between links on route change */}
                      {isActive && (
                        <motion.span
                          layoutId="navbar-active-pill"
                          className="navbar__pill"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className="navbar__link-label">{item.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="navbar__actions">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            {/* Dedicated contact route; active when you're on it */}
            <NavLink
              to="/inquire"
              className={({ isActive }) =>
                `navbar__cta${isActive ? ' navbar__cta--active' : ''}`
              }
            >
              Inquire Now
            </NavLink>
          </motion.div>
        </div>

        <motion.button
          ref={toggleRef}
          type="button"
          className="navbar__toggle"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label="Open menu"
          whileTap={{ scale: 0.9, rotate: 90 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          <Menu size={24} />
        </motion.button>
      </div>

      {/* ---- Full-screen overlay menu ----
          Portaled to <body> so `position: fixed; inset: 0` is viewport-relative.
          (The navbar uses backdrop-filter, which would otherwise become the
          containing block for a fixed child and shrink the overlay to the bar.)
          It carries the same route theme class so --nav-bg / --nav-fg /
          --nav-accent / --focus-ring resolve identically to the bar. */}
      {createPortal(
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              id="mobile-menu"
              ref={overlayRef}
              className={`mobile-overlay ${theme.route}`}
              role="dialog"
              aria-modal="true"
              aria-label="Main menu"
              style={{ transformOrigin: 'top right' }}
              initial={overlayMotion.initial}
              animate={overlayMotion.animate}
              exit={overlayMotion.exit}
            >
              <div className="mobile-overlay__top container">
                <Link
                  to="/"
                  className="navbar__logo"
                  onClick={closeMobile}
                  aria-label="Sha Design Studio — Home"
                >
                  <Logo size={48} variant={theme.logo} />
                </Link>

                <button
                  ref={closeRef}
                  type="button"
                  className="navbar__toggle mobile-overlay__close"
                  onClick={closeMobile}
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="mobile-overlay__nav" aria-label="Primary">
                <ul className="navbar__mobile-list">
                  {navigation.map((item) => (
                    <li key={item.href}>
                      <NavLink
                        to={item.href}
                        className="navbar__mobile-link"
                        onClick={closeMobile}
                      >
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                  <li>
                    <NavLink
                      to="/inquire"
                      className="navbar__mobile-link"
                      onClick={closeMobile}
                    >
                      Inquire Now
                    </NavLink>
                  </li>
                </ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </header>
  );
}

export default Navbar;
