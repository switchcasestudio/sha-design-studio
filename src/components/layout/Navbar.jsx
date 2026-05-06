import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { navigation } from '@/utils/siteConfig';
import Logo from '@/components/ui/Logo';
import Button from '@/components/ui/Button';
import './Navbar.css';

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="navbar">
      <div className="navbar__inner container">
        <Link to="/" className="navbar__logo" onClick={closeMobile} aria-label="Sha Design Studio — Home">
          <Logo size={48} />
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
          <Button as={Link} to="/contact" variant="outline" size="sm">
            Inquire Now
          </Button>
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

      {/* Mobile drawer */}
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
            <Link to="/contact" className="navbar__mobile-link" onClick={closeMobile}>
              Inquire Now
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Navbar;
