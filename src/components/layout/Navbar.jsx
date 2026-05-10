import { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
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

  const theme = THEMES[pathname] || { route: 'navbar--home', logo: 'colorful' };
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
          <Logo size={48} variant={theme.logo} />
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
          <Link to="/contact" className="navbar__cta">
            Inquire Now
          </Link>
        </div>

        <button
          type="button"
          className="navbar__toggle"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`navbar__mobile${mobileOpen ? ' navbar__mobile--open' : ''}`}
        aria-hidden={!mobileOpen}
      >
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
            <Link
              to="/contact"
              className="navbar__mobile-link"
              onClick={closeMobile}
            >
              Inquire Now
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Navbar;