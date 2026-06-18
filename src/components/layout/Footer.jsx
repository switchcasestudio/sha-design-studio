import { Link, NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { siteConfig, footerNavigation } from '@/utils/siteConfig';
import Logo from '@/components/ui/Logo';
import './Footer.css';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      {/* Contact moved to its own /inquire route — footer is now brand + nav + bio */}
      <div className="footer__bar">
        <div className="container">
          <motion.div
            className="footer__cols"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="footer__ident">
              <Logo size={72} variant="orange" />
              <p className="footer__wordmark">
                Sha
                <br />
                Design
                <br />
                Studio
              </p>
            </div>

            <nav className="footer__col" aria-label="Footer">
              <h4 className="footer__eyebrow">Navigation</h4>
              <ul className="footer__list">
                {footerNavigation.menu.map((item) => (
                  <li key={item.href}>
                    {/* Hash links stay native so the browser handles the smooth in-page scroll */}
                    {item.href.startsWith('#') ? (
                      <a href={item.href} className="footer__link">
                        {item.label}
                      </a>
                    ) : (
                      // NavLink adds `active` on the current route for the
                      // highlighted footer state
                      <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                          `footer__link${isActive ? ' footer__link--active' : ''}`
                        }
                      >
                        {item.label}
                      </NavLink>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="footer__col">
              <h4 className="footer__eyebrow">Who I Am</h4>
              {/* TODO(shiran): replace with a real one-line bio (who / where /
                  availability) — this slot previously repeated the hero tagline
                  verbatim. Placeholder below; confirm wording + location. */}
              <p className="footer__who">
                {siteConfig.designer} — industrial designer for toys &amp; baby
                products. Available for new projects.
              </p>
            </div>
          </motion.div>

          <div className="footer__legal">
            <p>
              © {year} • {siteConfig.name} • Developed by{' '}
              <a
                href="https://www.switchcasestudio.com"
                className="footer__legal-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Switch Case Studio
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
