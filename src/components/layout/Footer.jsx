import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { Instagram, Linkedin, Mail } from 'lucide-react';
import { siteConfig, footerNavigation } from '@/utils/siteConfig';
import Logo from '@/components/ui/Logo';
import './Footer.css';

// Reach-out channels, rendered as outlined circle icons in the footer's fourth
// column. Instagram + LinkedIn URLs are placeholders (see siteConfig).
const SOCIAL_LINKS = [
  { id: 'instagram', label: 'Instagram', href: siteConfig.social.instagram, Icon: Instagram },
  { id: 'linkedin', label: 'LinkedIn', href: siteConfig.social.linkedin, Icon: Linkedin },
  { id: 'email', label: `Email ${siteConfig.designer}`, href: `mailto:${siteConfig.email}`, Icon: Mail },
];

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      {/* Contact moved to its own /inquire route — footer is brand + nav + bio + social */}
      <div className="footer__bar">
        <div className="container">
          <motion.div
            className="footer__cols"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="footer__brand">
              <div className="footer__ident">
                <Logo size={104} variant="orange" className="footer__logo" />
                {/* The tagline replaces the old stacked "SHA DESIGN STUDIO"
                    wordmark — one word per line, sized so all four lines fit
                    inside the mark's own height (cap line to the base bar). */}
                <p className="footer__tagline">
                  {siteConfig.tagline.split(' ').map((word) => (
                    <span key={word}>{word}</span>
                  ))}
                </p>
              </div>

              <div className="footer__legal">
                <p>
                  © {year} • {siteConfig.name}
                  <br />
                  Developed by{' '}
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
              <h4 className="footer__eyebrow footer__eyebrow--who">Who I Am</h4>
              <p className="footer__who-name">Shiran Bar Hayon</p>
              <p className="footer__who">
                Industrial &amp; product designer.
                <br />
                Creating playful, thoughtful products.
                <br />
                Available for new projects.
              </p>
            </div>

            <ul className="footer__social">
              {SOCIAL_LINKS.map(({ id, label, href, Icon }) => (
                <li key={id}>
                  <a
                    className="footer__social-link"
                    href={href}
                    aria-label={label}
                    {...(href.startsWith('mailto:')
                      ? {}
                      : { target: '_blank', rel: 'noopener noreferrer' })}
                  >
                    <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
