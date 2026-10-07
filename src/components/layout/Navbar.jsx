import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { navigation } from '@/utils/siteConfig';
import Logo from '@/components/ui/Logo';
import BrandShape from '@/components/ui/BrandShape';
import { useTheme } from '@/theme/ThemeContext';
import Magnetic from '@/theme/vivid/Magnetic';
import { getLenis } from '@/theme/vivid/SmoothScroll';
import { spring, ease } from '@/theme/vivid/motion';
import './Navbar.css';

// The open-menu items = the primary nav + the Inquire route, as one list.
const MOBILE_MENU = [...navigation, { href: '/inquire', label: 'Inquire' }];

// Each route's ground colour; the mark swaps to the coat made for that ground.
const ROUTE_THEMES = {
  '/projects': { route: 'navbar--projects', logo: 'tomato' },
  '/services': { route: 'navbar--services', logo: 'yolk' },
  '/about':    { route: 'navbar--about',    logo: 'pool' },
  '/inquire':  { route: 'navbar--inquire',  logo: 'cream' },
};

// Vivid: brand shapes that pop into the open mobile menu, then bob gently.
const MENU_SHAPES = [
  { shape: 'star', className: 'mobile-overlay__pop--star', delay: 0.25 },
  { shape: 'heart', className: 'mobile-overlay__pop--heart', delay: 0.35 },
  { shape: 'clover', className: 'mobile-overlay__pop--clover', delay: 0.45 },
];

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState(null);
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  const { isVivid } = useTheme();
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

  // Vivid: the bar slides away while scrolling down and returns on the way up.
  useEffect(() => {
    if (!isVivid) {
      setHidden(false);
      return undefined;
    }
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 6) return;
      setHidden(y > last && y > 160);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isVivid]);

  // Show the bar again on every route change.
  useEffect(() => setHidden(false), [pathname]);

  // Prefix match so nested routes (e.g. /projects/:id) keep their theme
  const themeKey = Object.keys(ROUTE_THEMES).find((path) =>
    pathname.startsWith(path)
  );
  const theme = ROUTE_THEMES[themeKey] || { route: 'navbar--home', logo: 'cream' };
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
    const lenis = getLenis();
    lenis?.stop();

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
      lenis?.start();
      document.removeEventListener('keydown', onKeyDown);
      // Return focus to the trigger (standard dialog pattern)
      toggle?.focus();
    };
  }, [mobileOpen]);

  // Panels swap colour in one cut: the overlay appears instantly, then the
  // links make a single short rise. Reduced motion drops the rise.
  const overlayMotion = isVivid
    ? {
        // Vivid: the menu grows out of the toggle as a circle and shrinks back.
        initial: { clipPath: 'circle(0px at calc(100% - 44px) 44px)' },
        animate: {
          clipPath: 'circle(150vmax at calc(100% - 44px) 44px)',
          transition: { duration: 0.7, ease: ease.inOut },
        },
        exit: {
          clipPath: 'circle(0px at calc(100% - 44px) 44px)',
          transition: { duration: 0.5, ease: ease.inOut, delay: 0.1 },
        },
      }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0 } },
        exit: { opacity: 0, transition: { duration: 0 } },
      };

  const mobileItem = isVivid
    ? {
        hidden: { y: '110%', rotate: 8 },
        show: { y: '0%', rotate: 0, transition: spring.bouncy },
        exit: { y: '110%', transition: { duration: 0.25, ease: ease.inOut } },
      }
    : {
        hidden: { opacity: 0, y: 16 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        },
      };

  const isActiveHref = (href) => pathname.startsWith(href);
  const logo = <Logo size={58} ground={theme.logo} />;
  const cta = (
    <NavLink
      to="/inquire"
      className={({ isActive }) =>
        `navbar__cta${isActive ? ' navbar__cta--active' : ''}`
      }
    >
      {isVivid ? (
        <span className="navbar__roll" data-text="Inquire">
          <span>Inquire</span>
        </span>
      ) : (
        'Inquire'
      )}
    </NavLink>
  );

  return (
    <header
      className={`navbar ${theme.route}${scrolled ? ' navbar--scrolled' : ''}${
        hidden && !mobileOpen ? ' navbar--hidden' : ''
      }`}
    >
      <div className="navbar__inner container">
        <Link
          to="/"
          className="navbar__logo"
          onClick={closeMobile}
          aria-label="Sha Design Studio — Home"
        >
          {isVivid ? (
            <motion.span
              className="navbar__logo-wiggle"
              whileHover={{ rotate: [0, -10, 8, -4, 0], scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.6 }}
            >
              {logo}
            </motion.span>
          ) : (
            logo
          )}
        </Link>

        <nav className="navbar__nav" aria-label="Primary">
          <ul
            className="navbar__list"
            onMouseLeave={isVivid ? () => setHovered(null) : undefined}
          >
            {navigation.map((item) => (
              <li
                key={item.href}
                onMouseEnter={isVivid ? () => setHovered(item.href) : undefined}
              >
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `navbar__link${isActive ? ' navbar__link--active' : ''}`
                  }
                >
                  {/* Vivid: one hover blob and one active pill slide between
                      the links instead of each pill swapping colour. */}
                  {isVivid && hovered === item.href && (
                    <motion.span
                      layoutId="nav-hover"
                      className="navbar__blob navbar__blob--hover"
                      transition={spring.snappy}
                    />
                  )}
                  {isVivid && isActiveHref(item.href) && (
                    <motion.span
                      layoutId="nav-active"
                      className="navbar__blob navbar__blob--active"
                      transition={spring.bouncy}
                    />
                  )}
                  {isVivid ? (
                    <span className="navbar__link-label navbar__roll" data-text={item.label}>
                      <span>{item.label}</span>
                    </span>
                  ) : (
                    <span className="navbar__link-label">{item.label}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="navbar__actions">
          {/* Dedicated contact route; active when you're on it */}
          {isVivid ? <Magnetic strength={0.4}>{cta}</Magnetic> : cta}
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
                  exit={isVivid ? 'exit' : undefined}
                  variants={{
                    show: {
                      transition: isVivid
                        ? { staggerChildren: 0.07, delayChildren: 0.2 }
                        : { staggerChildren: 0.05, delayChildren: 0 },
                    },
                    exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
                  }}
                >
                  {MOBILE_MENU.map((item, i) => {
                    const link = (
                      <NavLink
                        to={item.href}
                        className="navbar__mobile-link"
                        onClick={closeMobile}
                      >
                        {isVivid && (
                          <span className="navbar__mobile-index" aria-hidden="true">
                            0{i + 1}
                          </span>
                        )}
                        {item.label}
                      </NavLink>
                    );
                    return isVivid ? (
                      <li key={item.href} className="navbar__mobile-mask">
                        <motion.div variants={mobileItem}>{link}</motion.div>
                      </li>
                    ) : (
                      <motion.li key={item.href} variants={mobileItem}>
                        {link}
                      </motion.li>
                    );
                  })}
                </motion.ul>
              </nav>

              {/* A big soft brand shape anchored bottom-right so the open menu
                  reads as part of the playroom, not a blank list. */}
              {isVivid ? (
                <motion.div
                  className="mobile-overlay__motif"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0, transition: { ...spring.wobbly, delay: 0.2 } }}
                  exit={{ scale: 0, rotate: 90, transition: { duration: 0.3 } }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                  >
                    <BrandShape shape="daisy" />
                  </motion.div>
                </motion.div>
              ) : (
                <BrandShape
                  shape="daisy"
                  className="mobile-overlay__motif"
                />
              )}
              {isVivid &&
                MENU_SHAPES.map(({ shape, className, delay }, i) => (
                  <motion.div
                    key={shape}
                    className={`mobile-overlay__pop ${className}`}
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0, transition: { ...spring.bouncy, delay } }}
                    exit={{ scale: 0, transition: { duration: 0.2 } }}
                  >
                    <motion.div
                      animate={{ y: [0, -12, 0], rotate: [0, i % 2 ? 10 : -10, 0] }}
                      transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <BrandShape shape={shape} />
                    </motion.div>
                  </motion.div>
                ))}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </header>
  );
}

export default Navbar;
