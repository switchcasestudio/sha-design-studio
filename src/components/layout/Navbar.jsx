import { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { navigation } from '@/utils/siteConfig';
import Logo from '@/components/ui/Logo';
import './Navbar.css';

const THEMES = {
  '/projects': { route: 'navbar--projects', logo: 'white' },
  '/services': { route: 'navbar--services', logo: 'orange' },
  '/about':    { route: 'navbar--about',    logo: 'yellow' },
};

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  const theme = THEMES[pathname] || { route: 'navbar--home', logo: 'orange' };
  const closeMobile = () => setMobileOpen(false);

  return (
    <header className={`navbar ${theme.route}`}>
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
                  {item.label}
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
            <Link to="/contact" className="navbar__cta">
              Inquire Now
            </Link>
          </motion.div>
        </div>

        <motion.button
          type="button"
          className="navbar__toggle"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          whileTap={{ scale: 0.9, rotate: 90 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          <AnimatePresence mode="wait">
            {mobileOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X size={24} />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Menu size={24} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            className="navbar__mobile navbar__mobile--open"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            <ul className="navbar__mobile-list">
              {navigation.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
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
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navigation.length * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Link
                  to="/contact"
                  className="navbar__mobile-link"
                  onClick={closeMobile}
                >
                  Inquire Now
                </Link>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
