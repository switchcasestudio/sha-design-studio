import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { navigation } from '@/utils/siteConfig';
import Logo from '@/components/ui/Logo';
import BrandShape from '@/components/ui/BrandShape';
import './Navbar.css';

// The open-menu items = the primary nav + the Inquire route, as one list.
const MOBILE_MENU = [...navigation, { href: '/inquire', label: 'Inquire' }];

// Each route's ground colour; the mark swaps to the coat made for that ground.
const THEMES = {
  '/projects': { route: 'navbar--projects', logo: 'tomato' },
  '/services': { route: 'navbar--services', logo: 'yolk' },
  '/about':    { route: 'navbar--about',    logo: 'pool' },
  '/inquire':  { route: 'navbar--inquire',  logo: 'cream' },
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
  const theme = THEMES[themeKey] || { route: 'navbar--home', logo: 'cream' };
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
    const toggle = toggleRef.current;
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
      toggle?.focus();
    };
  }, [mobileOpen]);

  // Panels swap colour in one cut: the overlay appears instantly, then the
  // links make a single short rise. Reduced motion drops the rise.
  const overlayMotion = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0 } },
    exit: { opacity: 0, transition: { duration: 0 } },
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
          <Logo size={58} ground={theme.logo} />
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
                  <span className="navbar__link-label">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="navbar__actions">
          {/* Dedicated contact route; active when you're on it */}
          <NavLink
            to="/inquire"
            className={({ isActive }) =>
              `navbar__cta${isActive ? ' navbar__cta--active' : ''}`
            }
          >
            Inquire
          </NavLink>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="navbar__toggle"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label="Open menu"
        >
          <Menu size={22} strokeWidth={2} />
        </button>
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
                  <Logo size={58} ground={theme.logo} />
                </Link>

                <button
                  ref={closeRef}
                  type="button"
                  className="navbar__toggle mobile-overlay__close"
                  onClick={closeMobile}
                  aria-label="Close menu"
                >
                  <X size={22} strokeWidth={2} />
                </button>
              </div>

              <nav className="mobile-overlay__nav" aria-label="Primary">
                <motion.ul
                  className="navbar__mobile-list"
                  initial={reduce ? false : 'hidden'}
                  animate={reduce ? false : 'show'}
                  variants={{
                    show: {
                      transition: { staggerChildren: 0.05, delayChildren: 0 },
                    },
                  }}
                >
                  {MOBILE_MENU.map((item) => (
                    <motion.li
                      key={item.href}
                      variants={{
                        hidden: { opacity: 0, y: 16 },
                        show: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                        },
                      }}
                    >
                      <NavLink
                        to={item.href}
                        className="navbar__mobile-link"
                        onClick={closeMobile}
                      >
                        {item.label}
                      </NavLink>
                    </motion.li>
                  ))}
                </motion.ul>
              </nav>

              {/* A big soft brand shape anchored bottom-right so the open menu
                  reads as part of the playroom, not a blank list. */}
              <BrandShape
                shape="daisy"
                className="mobile-overlay__motif"
              />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </header>
  );
}

export default Navbar;
